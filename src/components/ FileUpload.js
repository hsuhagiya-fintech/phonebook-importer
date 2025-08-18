import { useNavigate } from "react-router-dom";
import "./ FileUpload.css";

export default function FileUpload() {
  const navigate=useNavigate()
  const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert("Please select a file to upload.");
    return;
  } else {
    console.log("File selected:", file.name);
    navigate("/upload", { state: { file } });
  }
};

  return (
    <div clasName="container">
      <h2 className="phonebook-title">PhoneBook Manager</h2>
      <h2 className="phonebook-subtitle">
        Import and manage your contacts with Excel import and real-time
        validation
      </h2>

      <div className="upload-card">
        <h3 className="upload-title">
          <span role="img">📄</span> Phonebook Excel Import
        </h3>

        <p className="upload-desc">Import your contacts from an Excel file.</p>

        <label className="file-upload-label">
          <span children="upload-icon">⬆️</span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="upload-input"
            onChange={handleFileUpload}
          />
          <h3> Drop Your Excel File here or Click to browse</h3>
          {/* <button> Choose File </button> */}
        </label>
      </div>
    </div>
  );
}


import React, { useEffect, useRef } from "react";

import { postMessage } from "../../shared/vscode/vscode-api";


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

const CommitAnalysis: React.FC<CommitAnalysisProps> = ({
  commitAnalysis
}) => {
  //key->data->analysis.

  //issue item only send to extenstion

  //object send to extenstion.

  //print to check.

  //issuee only send

  //key->value pair

  // alag se store

  //file name , issue , and all i have..

  //then postmessage to webview

  //receive object in webview via cases.

  //parse them into proper object & get it properly

  //then do line comment on that issue..

  //for each file object  ->   analysis ->  characterstic array -> issue array in characterstic array -> for issue

  //we have key value pair issue..and all

  //for each file -> get the all issue in object... -> this mulitple file..
// 

  // Track which files we've already sent to avoid duplicates due to re-renders
  const sentFilesRef = useRef<Set<string>>(new Set());
  const sentCompletedRef = useRef<boolean>(false);

  // Stream per-file once when data for that file arrives
  useEffect(() => {
    if (!commitAnalysis?.data || commitAnalysis.data.length === 0) return;

    commitAnalysis.data.forEach((file: any) => {
      const fileName = file?.file_name || "Unknown";
      if (sentFilesRef.current.has(fileName)) return;

      const issues: any[] = [];
      file?.analysis?.forEach((analysisItem: any) => {
        analysisItem?.issue_items?.forEach((issue: any) => {
          issues.push(issue);
        });
      });

      // Accumulate
      if (issues.length > 0) {
        allFilesWithIssues[fileName] = [
          ...(allFilesWithIssues[fileName] || []),
          ...issues,
        ];

        // Send once per file
        postMessage({
          command: "commitAnalysisFile",
          file_name: fileName,
          issues,
        });
        sentFilesRef.current.add(fileName);
      }
    });
  }, [commitAnalysis?.data]);

  // Detect completion

  // Final completion message once
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
    <div className="p-4 rounded">
      {commitAnalysis.error && (
        <div className="rounded p-3 mb-4">
          <p className="text-sm">{commitAnalysis.error}</p>
        </div>
      )}

      {!commitAnalysis.running &&
        !commitAnalysis.error &&
        commitAnalysis.data &&
        commitAnalysis.data.length === 0 && (
          <p className="mb-2">No commit data available.</p>
        )}

      {/* Commit analysis data */}
      {commitAnalysis.data.map((fileAnalysis, fileIdx) => (
        <div key={fileIdx} className="mb-6 pt-4">
          <p className="text-md mb-2">
            {fileAnalysis.file_name || "Unknown"} analysis completed
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommitAnalysis;
