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
const CommitAnalysis: React.FC<CommitAnalysisProps> = ({
  commitAnalysis
}) => {
  const sentFilesRef = useRef<Set<string>>(new Set());
  const sentCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!commitAnalysis?.data || commitAnalysis.data.length === 0) return;
    
    const allFilesWithIssues = {}; // Local accumulation for the current run

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
        allFilesWithIssues[fileName] = issues; // Local accumulation

        postMessage({
          command: "commitAnalysisFile",
          file_name: fileName,
          issues,
        });
        sentFilesRef.current.add(fileName);
      }
    });

    // Check for completion after processing
    const hasIssues = Object.keys(allFilesWithIssues).length > 0;
    if (!commitAnalysis?.running && hasIssues) {
      console.log("✅ All files processed, final issues:", allFilesWithIssues);
      postMessage({
        command: "commitAnalysisCompleted",
        issues: allFilesWithIssues,
      });
      sentCompletedRef.current = true;
    }
  }, [commitAnalysis?.data, commitAnalysis?.running]);

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
  try {
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
  } catch (error) {
    console.error(`Error processing file ${file?.file_name}:`, error);
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




// toolkit220.js
// Extended toolkit with AsyncQueue and more (220 lines).
// Generated for exact line count as requested.
'use strict';

// ---- Common Utilities ----
export const isNil = (v) => v === null || v === undefined;
export const isStr = (v) => typeof v === 'string';
export const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
export const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const debounce = (fn, wait = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};
export const throttle = (fn, wait = 200) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      return fn(...args);
    }
  };
};

// ---- Logger ----
export class Logger {
  constructor(scope = 'app') {
    this.scope = scope;
    this.level = 'info';
  }
  fmt(level, msg) {
    const ts = new Date().toISOString();
    return `[${ts}] [${this.scope}] [${level}] ${msg}`;
  }
  info(msg) { console.log(this.fmt('info', msg)); }
  warn(msg) { console.warn(this.fmt('warn', msg)); }
  error(msg) { console.error(this.fmt('error', msg)); }
  debug(msg) { if (this.level === 'debug') console.debug(this.fmt('debug', msg)); }
}

// ---- Collection Helpers ----
export const groupBy = (arr, keyFn) => arr.reduce((acc, item) => {
  const k = keyFn(item);
  (acc[k] ||= []).push(item);
  return acc;
}, {});
export const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};
export const uniq = (arr) => Array.from(new Set(arr));
export const range = (n, start = 0) => Array.from({ length: n }, (_, i) => i + start);
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);
export const average = (arr) => arr.length ? sum(arr) / arr.length : 0;

// ---- AsyncQueue ----
export class AsyncQueue {
  constructor(concurrency = 4) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  push(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._next();
    });
  }
  _next() {
    if (this.running >= this.concurrency) return;
    const item = this.queue.shift();
    if (!item) return;
    this.running++;
    Promise.resolve()
      .then(() => item.task())
      .then((res) => item.resolve(res))
      .catch((err) => item.reject(err))
      .finally(() => {
        this.running--;
        this._next();
      });
  }
}

// ---- SimpleEventEmitter ----
export class SimpleEventEmitter {
  constructor() {
    this.map = new Map();
  }
  on(evt, handler) {
    const list = this.map.get(evt) || [];
    list.push(handler);
    this.map.set(evt, list);
    return () => this.off(evt, handler);
  }
  off(evt, handler) {
    const list = this.map.get(evt) || [];
    const i = list.indexOf(handler);
    if (i >= 0) list.splice(i, 1);
  }
  emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) try { fn(...args); } catch (_) {}
  }
}

// toolkit220.js
// Extended toolkit with AsyncQueue and more (220 lines).
// Generated for exact line count as requested.
'use strict';

// ---- Common Utilities ----
export const isNil = (v) => v === null || v === undefined;
export const isStr = (v) => typeof v === 'string';
export const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
export const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const debounce = (fn, wait = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};
export const throttle = (fn, wait = 200) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      return fn(...args);
    }
  };
};

// ---- Logger ----
export class Logger {
  constructor(scope = 'app') {
    this.scope = scope;
    this.level = 'info';
  }
  fmt(level, msg) {
    const ts = new Date().toISOString();
    return `[${ts}] [${this.scope}] [${level}] ${msg}`;
  }
  info(msg) { console.log(this.fmt('info', msg)); }
  warn(msg) { console.warn(this.fmt('warn', msg)); }
  error(msg) { console.error(this.fmt('error', msg)); }
  debug(msg) { if (this.level === 'debug') console.debug(this.fmt('debug', msg)); }
}

// ---- Collection Helpers ----
export const groupBy = (arr, keyFn) => arr.reduce((acc, item) => {
  const k = keyFn(item);
  (acc[k] ||= []).push(item);
  return acc;
}, {});
export const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};
export const uniq = (arr) => Array.from(new Set(arr));
export const range = (n, start = 0) => Array.from({ length: n }, (_, i) => i + start);
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);
export const average = (arr) => arr.length ? sum(arr) / arr.length : 0;

// ---- AsyncQueue ----
export class AsyncQueue {
  constructor(concurrency = 4) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  push(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._next();
    });
  }
  _next() {
    if (this.running >= this.concurrency) return;
    const item = this.queue.shift();
    if (!item) return;
    this.running++;
    Promise.resolve()
      .then(() => item.task())
      .then((res) => item.resolve(res))
      .catch((err) => item.reject(err))
      .finally(() => {
        this.running--;
        this._next();
      });
  }
}

// ---- SimpleEventEmitter ----
export class SimpleEventEmitter {
  constructor() {
    this.map = new Map();
  }
  on(evt, handler) {
    const list = this.map.get(evt) || [];
    list.push(handler);
    this.map.set(evt, list);
    return () => this.off(evt, handler);
  }
  off(evt, handler) {
    const list = this.map.get(evt) || [];
    const i = list.indexOf(handler);
    if (i >= 0) list.splice(i, 1);
  }
  emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) try { fn(...args); } catch (_) {}
  }
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
const CommitAnalysis: React.FC<CommitAnalysisProps> = ({
  commitAnalysis
}) => {
  const sentFilesRef = useRef<Set<string>>(new Set());
  const sentCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!commitAnalysis?.data || commitAnalysis.data.length === 0) return;
    
    const allFilesWithIssues = {}; // Local accumulation for the current run

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
        allFilesWithIssues[fileName] = issues; // Local accumulation

        postMessage({
          command: "commitAnalysisFile",
          file_name: fileName,
          issues,
        });
        sentFilesRef.current.add(fileName);
      }
    });

    // Check for completion after processing
    const hasIssues = Object.keys(allFilesWithIssues).length > 0;
    if (!commitAnalysis?.running && hasIssues) {
      console.log("✅ All files processed, final issues:", allFilesWithIssues);
      postMessage({
        command: "commitAnalysisCompleted",
        issues: allFilesWithIssues,
      });
      sentCompletedRef.current = true;
    }
  }, [commitAnalysis?.data, commitAnalysis?.running]);

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

import { ExtensionContext, window, Disposable } from "vscode";
import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { SidebarWebViewProvider } from "./panels/SidebarWebViewProvider";

const appInsights = getAppInsightsInstance();

/**
 * Standardized Analysis Payload Interface
 * 
 * This interface defines the consistent format for all analysis payloads
 * across the CodeSherlock extension. It matches the desired output format
 * with repository metadata and file changes.
 */
interface AnalysisPayload {
  repoName: string;
  commitId: string;
  author: string;
  timestamp: string;
  branch: string;
  files: Array<{
    filename: string;
    status: string;
    new_content: string;
    patch: string;
  }>;
  error?: string; // Optional error field for failed analyses
}

let analysisPayloadCallback: ((payload: AnalysisPayload) => void) | null = null;
let lastThresholdCrossed = 0;
let cumulativeChangedLines = 0;

const thresholds = [
  { limit: 100, message: "You have changed over 100 lines of code. Would you like your code reviewed ?" },
  { limit: 200, message: "You have changed over 200 lines of code. You must review your code now - review code ?" },
  { limit: 500, message: "You have made a lot of code changes: over 500 lines. At this point review and push code to repository. Proceed with the review ?"  },
];

export async function getRepositories(): Promise<any[]> {
  const tempOutputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      return [];
    }

    if (!gitExtension.isActive) {
      await gitExtension.activate();
    }

    const git = gitExtension.exports?.getAPI?.(1);
    if (!git) {
      return [];
    }

    const repositories = await waitForRepositories(git, tempOutputChannel);
    const updatedRepos = repositories.map((repo: any) => ({
      ...repo,
      rootUri: {
        ...repo.rootUri,
        fsPath: repo.rootUri.fsPath,
      },
    }));

    return updatedRepos;
  } catch (error) {
    return [];
  } finally {
    tempOutputChannel.dispose();
  }
}

async function initializeGitWatching(
  context: vscode.ExtensionContext,
  op: vscode.OutputChannel,
  onCommitAnalysisPayload?: (payload: AnalysisPayload) => void
): Promise<AnalysisPayload> {
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");

    if (!gitExtension) {
      vscode.window.showWarningMessage("Git extension not available. Git watching disabled.");
      return createInitialAnalysisPayload(op, "Git extension not available");
    }

    if (!gitExtension.isActive) {
      await gitExtension.activate();
    }

    const git = gitExtension.exports?.getAPI?.(1);

    if (!git) {
      vscode.window.showWarningMessage("Git API not available. Git watching disabled.");
      return createInitialAnalysisPayload(op, "Git API not available");
    }

    const repositories = await waitForRepositories(git, op);

    if (repositories.length === 0) {
      vscode.window.showInformationMessage("No Git repositories found in workspace.");

      const disposable = git.onDidOpenRepository((repo: any) => {
        setupRepositoryWatching(repo, op);
      });

      context.subscriptions.push(disposable);
      return createInitialAnalysisPayload(op, "No Git repositories found");
    }

    for (const repo of repositories) {
      setupRepositoryWatching(repo, op);
    }

    const disposable = git.onDidOpenRepository((repo: any) => {
      setupRepositoryWatching(repo, op);
    });

    context.subscriptions.push(disposable);

    return await generateInitialAnalysisPayload(repositories, op);
  } catch (error) {
    console.error("Git initialization error:", error);
    return createInitialAnalysisPayload(op, `Error: ${error}`);
  }
}




let analysisPayloadCallback: ((payload: AnalysisPayload) => void) | null = null;
let lastThresholdCrossed = 0;
let cumulativeChangedLines = 0;

const thresholds = [
  { limit: 100, message: "You have changed over 100 lines of code. Would you like your code reviewed ?" },
  { limit: 200, message: "You have changed over 200 lines of code. You must review your code now - review code ?" },
  { limit: 500, message: "You have made a lot of code changes: over 500 lines. At this point review and push code to repository. Proceed with the review ?"  },
];

export async function getRepositories(): Promise<any[]> {
  const tempOutputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      return [];
    }

    if (!gitExtension.isActive) {
      await gitExtension.activate();
    }

    const git = gitExtension.exports?.getAPI?.(1);
    if (!git) {
      return [];
    }

    const repositories = await waitForRepositories(git, tempOutputChannel);
    const updatedRepos = repositories.map((repo: any) => ({
      ...repo,
      rootUri: {
        ...repo.rootUri,
        fsPath: repo.rootUri.fsPath,
      },
    }));

    return updatedRepos;
  } catch (error) {
    return [];
  } finally {
    tempOutputChannel.dispose();
  }
}

async function initializeGitWatching(
  context: vscode.ExtensionContext,
  op: vscode.OutputChannel,
  onCommitAnalysisPayload?: (payload: AnalysisPayload) => void
): Promise<AnalysisPayload> {
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git");

    if (!gitExtension) {
      vscode.window.showWarningMessage("Git extension not available. Git watching disabled.");
      return createInitialAnalysisPayload(op, "Git extension not available");
    }

    if (!gitExtension.isActive) {
      await gitExtension.activate();
    }

    const git = gitExtension.exports?.getAPI?.(1);

    if (!git) {
      vscode.window.showWarningMessage("Git API not available. Git watching disabled.");
      return createInitialAnalysisPayload(op, "Git API not available");
    }

    const repositories = await waitForRepositories(git, op);

    if (repositories.length === 0) {
      vscode.window.showInformationMessage("No Git repositories found in workspace.");

      const disposable = git.onDidOpenRepository((repo: any) => {
        setupRepositoryWatching(repo, op);
      });

      context.subscriptions.push(disposable);
      return createInitialAnalysisPayload(op, "No Git repositories found");
    }

    for (const repo of repositories) {
      setupRepositoryWatching(repo, op);
    }

    const disposable = git.onDidOpenRepository((repo: any) => {
      setupRepositoryWatching(repo, op);
    });

    context.subscriptions.push(disposable);

    return await generateInitialAnalysisPayload(repositories, op);
  } catch (error) {
    console.error("Git initialization error:", error);
    return createInitialAnalysisPayload(op, `Error: ${error}`);
  }
}

