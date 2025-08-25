import React, { useEffect, useState, useCallback, useRef } from "react";
import { postMessage } from "../../shared/vscode/vscode-api";
import { useCommitReviewMutation } from "../../api/commitReviewApi";
import { setWebSocket } from "../../api/Socket";
import { commitReviewWithLogging } from "../../shared/services/commitReviewService";
import { useSelector } from "react-redux";
import { selectUser } from "../../shared/slices/userSlice";
import Pulse from "../loader/Pulse";
import CommitAnalysis from "../analysis/CommitAnalysis";


interface GitInfo {
    organization: string;
    repository: string;
    latestCommitHash: string;
}

interface FileItem {
    filename: string;
    status: string;
    new_content: string;
    patch: string;
}

interface CommitProps {
    gitInfo: GitInfo | null;
    commitExtraInfo?: any; // Optional prop for extra commit info
    commitAnalysis: CommitAnalysisState;
    setCommitAnalysis: React.Dispatch<React.SetStateAction<CommitAnalysisState>>;
}

interface CommitAnalysisState {
    running: boolean;
    data: any[];
    error: string | null;
}

const Commit: React.FC<CommitProps> = ({ 
    gitInfo, 
    commitExtraInfo, 
    commitAnalysis, 
    setCommitAnalysis 
}) => {
    const { userId, name } = useSelector(selectUser);
    const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
    const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
    const [load, setLoad] = useState(false);
    const [, setSubmitError] = useState<string | null>(null);

    // Remove the local commitAnalysis state since it's now passed as props
    // const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
    //     running: false,
    //     data: [],
    //     error: null,
    // });

    const [commitReview] = useCommitReviewMutation();
    const gitInfoRef = useRef(gitInfo);

    const lastAutoTriggerKey = useRef<string | null>(null);
    // ✅ NEW: Add flag to track if analysis has been completed
    const analysisCompletedRef = useRef<boolean>(false);

    console.log("Git Info:", gitInfo);

    useEffect(() => {
        if (commitExtraInfo?.analysis) {
            const { analysis, commit } = commitExtraInfo;
            const filesFromAnalysis: FileItem[] = (analysis?.files || []).map(
                (f: any) => ({
                    filename: f.filename,
                    status: f.status,
                    new_content: f.new_content,
                    patch: f.patch
                })
            );

            if (commit) {
                setCommitFiles(filesFromAnalysis);
                postMessage({ command: "requestUncommittedAnalysis" });
            } else {
                setUncommitFiles(filesFromAnalysis);
            }
        }

    }, [commitExtraInfo?.timestamp]);

    // Update gitInfoRef when gitInfo changes
    useEffect(() => {
        gitInfoRef.current = gitInfo;
    }, [gitInfo]);

    const setupWebSocketForCommit = async () => {
        try {
            const ws = await setWebSocket(
                userId,
                () => { }, // setAnalysis - not needed for commit
                setLoad,
                () => { }, // refetchHistory - not needed for commit
                setCommitAnalysis // Now using the prop function
            );
            return ws;
        } catch (error) {
            throw error;
        }
    };

    // New version of handleSubmit that accepts files directly
    const handleSubmitWithFiles = async (filesToSubmit: FileItem[]) => {
        setSubmitError("");

        if (!gitInfoRef.current || !userId) {
            setSubmitError("Missing repository or user information");
            return;
        }

        if (filesToSubmit.length === 0) {
            setSubmitError("No files available for analysis");
            return;
        }

        try {
            setLoad(true);
            setCommitAnalysis(prev => ({
                ...prev,
                running: true,
                error: null
            }));

            // ✅ NEW: Reset completion flag when manually starting analysis
            analysisCompletedRef.current = false;

            const commitId = mode === "uncommitted"
                ? crypto.randomUUID().replace(/-/g, "").slice(0, 16)
                : gitInfoRef.current.latestCommitHash;

            await setupWebSocketForCommit();

            await commitReviewWithLogging({
                commitReview,
                factor: "power_analysis",
                user_id: userId,
                repo_name: gitInfoRef.current.repository,
                commit_id: commitId,
                username: name,
                files_json: JSON.stringify(filesToSubmit),
                organization_name: gitInfoRef.current.organization,
            });

        } catch (error: any) {
            const errorMessage = error?.data?.detail ||
                "There has been an unknown error in our system. We apologize. We are working on it. For further assistance reach out to support@codesherlock.ai.";

            setCommitAnalysis(prev => ({
                ...prev,
                running: false,
                error: errorMessage
            }));

            setSubmitError(errorMessage);
        } finally {
            setLoad(false);
        }
    };

    const handleMessage = useCallback((event: MessageEvent) => {
        const message = event.data;

        if (message.command === "commitContentResponse") {
            const { analysis } = message;
            const filesFromAnalysis: FileItem[] = (analysis?.files || []).map(
                (f: any) => ({
                    filename: f.filename,
                    status: f.status,
                    new_content: f.new_content,
                    patch: f.patch
                })
            );

            setCommitFiles(filesFromAnalysis);
        } else if (message.command === "uncommitContentResponse") {
            const { analysis } = message;
            const filesFromAnalysis: FileItem[] = (analysis?.files || []).map(
                (f: any) => ({
                    filename: f.filename,
                    status: f.status,
                    new_content: f.new_content,
                    patch: f.patch
                })
            );
            setUncommitFiles(filesFromAnalysis);
        }
    }, []);

    // ✅ FIXED: Handle commitExtraInfo trigger with completion check
    useEffect(() => {
        if (!commitExtraInfo?.trigger) return;

        // ✅ NEW: Skip if analysis has already been completed
        if (analysisCompletedRef.current) {
            console.log(" Skipping auto-trigger - analysis already completed");
            return;
        }

        // Build a unique key for this auto-trigger (timestamp + mode)
        const key =
            String(commitExtraInfo.timestamp ?? "") +
            "|" +
            (commitExtraInfo.commit ? "commit" : "uncommitted");

        // Skip if we've already auto-triggered for this key
        if (lastAutoTriggerKey.current === key) return;
        lastAutoTriggerKey.current = key;

        const analysis = commitExtraInfo.analysis;
        const filesFromAnalysis: FileItem[] = (analysis?.files || []).map((f: any) => ({
            filename: f.filename,
            status: f.status,
            new_content: f.new_content,
            patch: f.patch,
        }));

        if (commitExtraInfo.commit) {
            setMode("lastCommit");
            setCommitFiles(filesFromAnalysis);
            handleSubmitWithFiles(filesFromAnalysis); // pass files directly
        } else {
            setMode("uncommitted");
            setUncommitFiles(filesFromAnalysis);
            handleSubmitWithFiles(filesFromAnalysis); // pass files directly
        }
    }, [commitExtraInfo?.timestamp]); // IMPORTANT: depend on timestamp only

    // ✅ NEW: Track when analysis is completed
    useEffect(() => {
        if (commitAnalysis.running && commitAnalysis.data.length > 0 && !commitAnalysis.error) {
            analysisCompletedRef.current = true;
            console.log("✅ Analysis completed - preventing future auto-triggers");
        }
    }, [commitAnalysis.running, commitAnalysis.data, commitAnalysis.error]);

    // ✅ NEW: Reset completion flag when new analysis starts
    useEffect(() => {
        if (commitAnalysis.running) {
            analysisCompletedRef.current = false;
            console.log(" Analysis started - resetting completion flag");
        }
    }, [commitAnalysis.running]);

    useEffect(() => {
        if (gitInfoRef.current?.latestCommitHash) {
            postMessage({
                command: "requestCommitAnalysis",
                commit_hash: gitInfoRef.current?.latestCommitHash,
            });
        }
        postMessage({ command: "requestUncommittedAnalysis" });

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [gitInfoRef, handleMessage]);

    // Request fresh data when mode changes
    useEffect(() => {
        if (mode === "lastCommit" && gitInfo?.latestCommitHash) {
            postMessage({
                command: "requestCommitAnalysis",
                commit_hash: gitInfo.latestCommitHash,
            });
        } else if (mode === "uncommitted") {
            postMessage({ command: "requestUncommittedAnalysis" });
        }
    }, [mode, gitInfo]);

    // Keep files updated when mode changes or data changes
    useEffect(() => {
        if (mode === "uncommitted") {
            setFiles(uncommitFiles);
        } else {
            setFiles(commitFiles);
        }
        
    }, [mode, uncommitFiles, commitFiles]);

    return (
        <div className="flex flex-col h-full p-3 text-sm mt-14">
            {/* Toggle */}
            <div className="flex gap-2 mb-3">
                <button
                    className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors
                        ${mode === "uncommitted"
                            ? "bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)]"
                            : "bg-[var(--vscode-dropdown-background)] text-[var(--vscode-foreground)] hover:bg-[var(--vscode-list-hoverBackground)]"
                        }`}
                    onClick={() => setMode("uncommitted")}
                >
                    Unstaged
                </button>
                <button
                    className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors
                        ${mode === "lastCommit"
                            ? "bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)]"
                            : "bg-[var(--vscode-dropdown-background)] text-[var(--vscode-foreground)] hover:bg-[var(--vscode-list-hoverBackground)]"
                        }`}
                    onClick={() => setMode("lastCommit")}
                >
                    Last Commit
                </button>
            </div>

            {/* File list */}
            <div className="flex-1 mb-3">
                <div className="max-h-48 h-fit overflow-y-auto">
                    {files.length > 0 ? (
                        <ul>
                            {files.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center px-2 py-1 rounded gap-2"
                                    style={{ cursor: 'default' }}
                                >
                                    <span
                                        className="truncate text-left text-[var(--vscode-foreground)]"
                                        style={{ 
                                            cursor: 'default',
                                            pointerEvents: 'none',
                                            userSelect: 'none'
                                        }}
                                        title={file.filename}
                                    >
                                        {file.filename}
                                    </span>
                                    <span
                                        className={`text-[10px] font-medium uppercase
                                            ${file.status === "added"
                                                ? "text-green-500"
                                                : file.status === "modified"
                                                    ? "text-yellow-500"
                                                    : "text-gray-400"
                                            }`}
                                    >
                                        {file.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-gray-500 py-3">No files found</div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-5">
                <button
                    className="w-full py-2 rounded transition-colors bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] hover:bg-[var(--vscode-button-hoverBackground)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleSubmitWithFiles(files)}
                    disabled={files.length === 0 || load || commitAnalysis.running}
                >
                    {load || commitAnalysis.running ? (
                        <div className="flex items-center justify-center gap-2">
                            <Pulse />
                        </div>
                    ) : (
                        "Submit for Analysis"
                    )}
                </button>
            </div>

            <div className="mt-3">
                <CommitAnalysis commitAnalysis={commitAnalysis} />
            </div>
        </div>
    );
};

export default Commit;
