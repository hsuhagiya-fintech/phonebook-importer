import React, { useEffect, useRef, useState } from "react";
import { postMessage } from "../../shared/vscode/vscode-api";
import Linkify from "linkify-react";

const linkifyOptions = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: "text-blue-500 underline",
};

declare global {
  interface Window {
    acquireVsCodeApi?: () => {
      postMessage: (message: any) => void;
      getState: () => any;
      setState: (state: any) => void;
    };
  }
}

interface FileAnalysis {
  file_name: string;
}

interface CommitAnalysisProps {
  commitAnalysis: {
    running: boolean;
    error: string | null;
    data: FileAnalysis[];
  };
}

// This will store all issues across files (accumulator across renders)
const allFilesWithIssues: Record<string, any[]> = {};

const CommitAnalysis: React.FC<CommitAnalysisProps> = ({ commitAnalysis }) => {
  // Track which files we've already sent to avoid duplicates due to re-renders
  const sentFilesRef = useRef<Set<string>>(new Set());
  const sentCompletedRef = useRef<boolean>(false);

  // Track if analysis has been attempted
  const [hasAttempted, setHasAttempted] = useState(false);

  // Reset local accumulators when a new run starts
  useEffect(() => {
    if (commitAnalysis.running) {
      Object.keys(allFilesWithIssues).forEach((k) => delete allFilesWithIssues[k]);
      sentFilesRef.current.clear();
      sentCompletedRef.current = false;
      setHasAttempted(true);
    }
  }, [commitAnalysis.running]);

  // Stream per-file once when data for that file arrives
  useEffect(() => {
    if (!commitAnalysis?.data || commitAnalysis.data.length === 0) return;

    setHasAttempted(true);
    console.log("CommitAnalysis.data:", commitAnalysis.data);

    commitAnalysis.data.forEach((file: any) => {
      const fileName = file?.file_name || "Unknown";
      if (sentFilesRef.current.has(fileName)) return;

      const issues: any[] = [];
      file?.analysis?.forEach((analysisItem: any) => {
        analysisItem?.issue_items?.forEach((issue: any) => {
          issues.push(issue);
        });
      });


      if (issues.length > 0) {
        allFilesWithIssues[fileName] = [
          ...(allFilesWithIssues[fileName] || []),
          ...issues,
        ];

        postMessage({
          command: "commitAnalysisFile",
          file_name: fileName,
          issues,
        });
        sentFilesRef.current.add(fileName);
      }
    });
  }, [commitAnalysis?.data]);

  // Track when analysis starts
  useEffect(() => {
    if (commitAnalysis.running) {
      setHasAttempted(true);
    }
  }, [commitAnalysis.running]);

  // Detect completion
  useEffect(() => {
    if (sentCompletedRef.current) return;
    const hasIssues = Object.keys(allFilesWithIssues).length > 0;
    if (!commitAnalysis?.running && hasIssues) {
      console.log("✅ All files processed, final issues:", allFilesWithIssues);
      postMessage({
        command: "commitAnalysisCompleted",
        issues: allFilesWithIssues,
      });
      sentCompletedRef.current = true;
    }
  }, [commitAnalysis?.running]);

  return (
    <div className="p-1 rounded max-h-[300px] overflow-y-auto h-fit">
      {commitAnalysis.error && (
        <div className="rounded  mb-4">
          <Linkify options={linkifyOptions}>{commitAnalysis.error}</Linkify>
        </div>
      )}

      {commitAnalysis.running && (
        <div
          className="mb-4  rounded"
        >
          CodeSherlock.AI is currently analyzing the changes. Smaller changes typically take 30–60 seconds, medium ones 1–2 minutes, and larger changes may take up to 3–4 minutes.
        </div>
      )}

      {hasAttempted &&
        !commitAnalysis.running &&
        !commitAnalysis.error &&
        commitAnalysis.data &&
        commitAnalysis.data.length === 0 && (
          <p className="mb-2">The analysis completed successfully with no issues detected.</p>
        )}

      {hasAttempted &&
        !commitAnalysis.running &&
        !commitAnalysis.error &&
        commitAnalysis.data &&
        commitAnalysis.data.length > 0 && (
          <div
            className="mb-2 p-3 rounded border"
            style={{
              backgroundColor: "var(--vscode-editor-background)",
              borderColor: "var(--vscode-editorWidget-border)",
            }}
          >
            <p
              style={{
                color: "var(--vscode-editor-foreground)",
                fontWeight: 500,
              }}
            >
              Analysis finished. Issues were found in the following files. Click each file to go through the analysis.
            </p>
          </div>
        )}

      {/* Commit analysis data */}
      {commitAnalysis.data.map((fileAnalysis, fileIdx) => {
        const relPath = fileAnalysis.file_name || "Unknown";
        const label = relPath.split(/[/\\]/).pop() || relPath;

        return (
          <div key={fileIdx} className="mb-2">
            <p className="text-md">
              <a
                role="link"
                tabIndex={0}
                onClick={(e) => { e.preventDefault(); postMessage({ command: "openFile", filename: (relPath || "").trim() }); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); postMessage({ command: "openFile", filename: (relPath || "").trim() }); } }}
                title={`Open ${relPath}`}
                className="underline"
                style={{ color: "var(--vscode-textLink-foreground, #4e94ce)", cursor: "pointer" }}
              >
                {label}
              </a>{" "}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CommitAnalysis;
