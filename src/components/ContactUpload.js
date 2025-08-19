// // // import React from "react";
// // // import ReactDOM from "react-dom/client";
// // // import App from "./App";
// // // import { Provider } from "react-redux";
// // // import { store } from "./store";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // 🔍 ISSUE: EXC-100 - Critical Severity
// // // Lines 49-54
// // // The code lacks robust exception handling mechanisms for potential errors that can occur during asynchronous operations and API calls, which could lead to unhandled exceptions and inconsistent application states.
// // async function activate(context: ExtensionContext) {
// 🔍 ISSUE: EXC-100 - Critical Severity
// Lines 53-123
// Lack of Robust Exception Handling for Asynchronous Operations
// //   try {
// //     const op = window.createOutputChannel("CodeSherlockAI");
// //     op.appendLine("Extension is Activated ..... ");
    
// //     registerWebViewProvider(context, op);
// //     registerMarkdownContentProvider(context);
// //     registerPreviewCommand(context);

// //     const machineId = vscode.env.machineId;
// //     const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //     if (!hasLoggedDevice) {
// //       await context.globalState.update("hasLoggedDevice", true);
// //       appInsights?.trackTrace({
// //         message: "User installed an CodeSherlock.ai extension",
// //         properties: { machineId, vs_code: true },
// //         severityLevel: 0,
// //       });
// //     }

// //     try {
// //       const res = await analyzeUncommittedChanges1(op);
// //       op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //     } catch (err: any) {
// //       logError(op, "Error during Uncommitted Analysis", err);
// //     }

// //     const latestCommit = await getLatestCommit();
// //     try {
// //       const res = await analyzeCommittedChanges1(latestCommit, op);
// 🔍 ISSUE: INP-100 - High Severity
// Lines 53-123
// The code does not appropriately validate the response from the `analyzeUncommittedChanges1` function, which could lead to runtime errors if the structure of the response is unexpected.
// //       op.appendLine(
// //         `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //       );
// //     } catch (err: any) {
// //       logError(op, "Skipping initial commit analysis", err);
// //     }
// //   } catch (err: any) {
// //     op.appendLine(`❌ Critical error in activation: ${err?.message || JSON.stringify(err)}`);
// //   }
// // }

// // // Helper function to log errors
// // function logError(op, message, error) {
// //   op.appendLine(`⚠️ ${message}: ${error?.message || JSON.stringify(error)}`);
// // }

// // async function getLatestCommit() {
// //   const { execSync } = require("child_process");
// //   try {
// //     const latestCommit = execSync("git rev-parse HEAD", {
// //       cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //     })
// //       .toString()
// //       .trim();
// //     return latestCommit;
// //   } catch (err) {
// //     throw new Error(`Could not retrieve latest commit: ${err.message}`);
// //   }
// // }
// // // The code does not handle potential issues with the results returned from the analyzeUncommittedChanges1 function. If the function returns an unexpected type or structure, it may lead to runtime errors.
// // try {
// //   const res = await analyzeUncommittedChanges1(op);
  
// //   // Validate the response structure
// //   if (typeof res === 'object' && res !== null && 'expectedProperty' in res) {
// //     op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //   } else {
// //     op.appendLine("⚠️ Unexpected response format:\n" + JSON.stringify(res, null, 2));
// //   }
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// ✅ SOLUTION: EXC-100
// Introduce Detailed Exception Handling
async function activate(context: ExtensionContext) {
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

  try {
    const res = await analyzeUncommittedChanges1(op);
    if (!res || typeof res !== 'object' || !('expectedProperty' in res)) {
      throw new Error("Unexpected response format from analyzeUncommittedChanges1.");
    }
    op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
  } catch (err: any) {
    op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
    logError(op, "Error in analyzeUncommittedChanges1", err);  // Log the error for additional context
  }

  try {
    const latestCommit = await getLatestCommit();
    const res = await analyzeCommittedChanges1(latestCommit, op);
    op.appendLine(`Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`);
  } catch (err: any) {
    op.appendLine("⚠️ Skipping initial commit analysis: " + err.message);
    logError(op, "Error in analyzeCommittedChanges1", err); // Log the error for additional context
  }
}

function logError(op: any, message: string, error: any) {
  op.appendLine(`⚠️ ${message}: ${error?.message || JSON.stringify(error)}`);
}
// ✅ SOLUTION: INP-100
// Implement a response validation check to ensure that the response structure contains the expected properties before processing it. This will prevent potential errors and improve the stability of the application by avoiding assumptions about the response format.
try {
  const res = await analyzeUncommittedChanges1(op);

  // Validate the response structure
  if (typeof res === 'object' && res !== null && 'expectedProperty' in res) {
    op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
  } else {
    op.appendLine("⚠️ Unexpected response format:\n" + JSON.stringify(res, null, 2));
  }
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}
// // }
// // // Lines 50-50
// // // Unbounded Iteration in Git Command Execution
// // 🔍 ISSUE: RES-100 - Critical Severity
// // Lines 127-133
// // Unbounded Iteration in Git Command Execution
// 🔍 ISSUE: RES-100 - Critical Severity
// Lines 130-136
// Unbounded Iteration in Git Command Execution.
// // async function analyzeUncommittedChanges1(op) {
// //   const changes = await getUncommittedChanges(); // Assuming this fetches changes
// //   const batchSize = 100; // Number of changes to process at one time
// //   for (let i = 0; i < changes.length; i += batchSize) {
// //     const batch = changes.slice(i, i + batchSize);
// //     await processBatch(batch, op); // processBatch would handle the analysis of each subset
// //     await new Promise(resolve => setTimeout(resolve, 100)); // Throttle processing, if necessary
// ✅ SOLUTION: RES-100
// Limit the Number of Batches Processed
async function analyzeUncommittedChanges1(op) {
    const changes = await getUncommittedChanges(); // Fetch uncommitted changes
    const batchSize = 100; // Max number of changes to process in one batch
    const maxBatches = 5; // Limit to a maximum number of batches to process at a time
    for (let i = 0; i < Math.min(changes.length, batchSize * maxBatches); i += batchSize) {
        const batch = changes.slice(i, i + batchSize);
        try {
            await processBatch(batch, op); // Process the current batch
        } catch (error) {
            op.appendLine(`❌ Error processing batch: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Throttle processing, if necessary
    }
}
// // ✅ SOLUTION: RES-100
// // The current implementation of `analyzeUncommittedChanges1` processes all uncommitted changes at once, which can lead to high memory consumption and potential blocking if the number of changes is very large. This could exhaust the available resources, causing the application to become unresponsive or crash.
// async function analyzeUncommittedChanges1(op) {
//     const changes = await getUncommittedChanges(); // Fetch uncommitted changes
//     const batchSize = 100; // Max number of changes to process in one batch
//     const maxBatches = 5; // Limit to a maximum number of batches to process at a time
//     for (let i = 0; i < Math.min(changes.length, batchSize * maxBatches); i += batchSize) {
//         const batch = changes.slice(i, i + batchSize);
//         try {
//             await processBatch(batch, op); // Process the current batch
//         } catch (error) {
//             op.appendLine(`❌ Error processing batch: ${error.message}`);
//         }
//         await new Promise(resolve => setTimeout(resolve, 100)); // Throttle processing, if necessary
//     }
// }
// //   }
// // }
// // }
// // }
// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// //   import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // }
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }

// //   ///aknjwbshf
// //   //testing commit


// //   //sdfjkhdsjfherhfiu


// //   //testing....
// // //
// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }


// //   import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
// // import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }
// // // import React from "react";
// // // import ReactDOM from "react-dom/client";
// // // import App from "./App";
// // // import { Provider } from "react-redux";
// // // import { store } from "./store";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
// // // //
// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
// // import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   const { execSync } = require("child_process");

// //   try {
// //     const latestCommit = execSync("git rev-parse HEAD", {
// //       cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //     })
// //       .toString()
// //       .trim();

// //     const res = await analyzeCommittedChanges1(latestCommit, op);
// //     op.appendLine(
// //       `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //     );
// //   } catch (err: any) {
// //     op.appendLine(
// //       `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //     );
// //   }


// // import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }

// //   ///aknjwbshf
// //   //testing commit


// //   //sdfjkhdsjfherhfiu





// //   import "./ContactUpload.css";
// //   import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //   import { useNavigate,useLocation } from "react-router-dom";
// //   export default function ContactUpload() {
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     // const file = location.state?.file;
  
  
// //     return (
// //       <>
// //         <div className="header-container">
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             ← Back to Upload
// //           </button>
  
// //           <div className="header-title-group">
// //             <h1 className="header-title">Phonebook Data</h1>
// //             <p className="header-subtitle">Manage your imported contacts</p>
// //           </div>
  
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             New Upload
// //           </button>
// //         </div>
  
// //         <div>
// //           <CreateTableForContactUpload/>
// //         </div>
// //       </>
// //     );
// //   }
// //   import { ExtensionContext, window, Disposable } from "vscode";
// //   import * as vscode from "vscode";
// //   import * as dotenv from "dotenv";
// //   import * as path from "path";
// //   import {
// //     initializeGitWatching,
// //     waitForRepositories,
// //     setupRepositoryWatching,
// //     handleGitAction,
// //     showCommitAnalysisUI,
// //     getCommitAnalysisData,
// //     mapGitStatus,
// //     getFileContent,
// //     getPatchData,
// //     generateAlternativeDiff,
// //     generateEnhancedDiff,
// //     // sendToAnalysisPipeline,
// //     type AnalysisPayload,
// //     analyzeCommittedChanges,
// //     analyzeCommittedChanges1,
// //   } from "./vscode-extensionapi";
  
// //   // Load the .env file
// //   dotenv.config({ path: path.join(__dirname, "../.env") });
// //   import { registerWebViewProvider } from "./panels/SidePanel";
// //   import { getAppInsightsInstance } from "./logging/AppInsights";
// //   import { getRepositories } from "./vscode-extensionapi";
// //   import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
  
// //   const appInsights = getAppInsightsInstance();
  
// //   let logoutCommand: Disposable | undefined;
  
// //   const markdownContentStore = new Map<string, string>();
  
// //   export async function activate(context: ExtensionContext) {
// //     vscode.window.showInformationMessage(" Activated..... ");
// //     const op = window.createOutputChannel("CodeSherlockAI");
// //     op.appendLine("Extension is Activated ..... ");
  
// //     registerWebViewProvider(context, op);
// //     registerMarkdownContentProvider(context);
// //     registerPreviewCommand(context);
  
// //     //added
// //     const machineId = vscode.env.machineId;
  
// //     // Check if the device ID has already been logged
// //     const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
  
// //     if (!hasLoggedDevice) {
// //       await context.globalState.update("hasLoggedDevice", true);
// //       // Log successful API call
// //       appInsights?.trackTrace({
// //         message: "User installed an CodeSherlock.ai extension",
// //         properties: { machineId, vs_code: true },
// //         severityLevel: 0,
// //       });
// //     }
  
// //   //   const repos = await getRepositories();
  
// //   //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
  
// //   try {
// //     const res = await analyzeUncommittedChanges1(op);
// //     op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //   } catch (err: any) {
// //     op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //   }
  
// //     // const { execSync } = require("child_process");
  
// //     // try {
// //     //   const latestCommit = execSync("git rev-parse HEAD", {
// //     //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //     //   })
// //     //     .toString()
// //     //     .trim();
  
// //     //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //     //   op.appendLine(
// //     //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //     //   );
// //     // } catch (err: any) {
// //     //   op.appendLine(
// //     //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //     //   );
// //     // }


// //     import "./ContactUpload.css";
// //     import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //     import { useNavigate,useLocation } from "react-router-dom";
// //     export default function ContactUpload() {
// //       const navigate = useNavigate();
// //       const location = useLocation();
// //       // const file = location.state?.file;
    
    
// //       return (
// //         <>
// //           <div className="header-container">
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               ← Back to Upload
// //             </button>
    
// //             <div className="header-title-group">
// //               <h1 className="header-title">Phonebook Data</h1>
// //               <p className="header-subtitle">Manage your imported contacts</p>
// //             </div>
    
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               New Upload
// //             </button>
// //           </div>
    
// //           <div>
// //             <CreateTableForContactUpload/>
// //           </div>
// //         </>
// //       );
// //     }
// //     import { ExtensionContext, window, Disposable } from "vscode";
// //     import * as vscode from "vscode";
// //     import * as dotenv from "dotenv";
// //     import * as path from "path";
// //     import {
// //       initializeGitWatching,
// //       waitForRepositories,
// //       setupRepositoryWatching,
// //       handleGitAction,
// //       showCommitAnalysisUI,
// //       getCommitAnalysisData,
// //       mapGitStatus,
// //       getFileContent,
// //       getPatchData,
// //       generateAlternativeDiff,
// //       generateEnhancedDiff,
// //       // sendToAnalysisPipeline,
// //       type AnalysisPayload,
// //       analyzeCommittedChanges,
// //       analyzeCommittedChanges1,
// //     } from "./vscode-extensionapi";
    
// //     // Load the .env file
// //     dotenv.config({ path: path.join(__dirname, "../.env") });
// //     import { registerWebViewProvider } from "./panels/SidePanel";
// //     import { getAppInsightsInstance } from "./logging/AppInsights";
// //     import { getRepositories } from "./vscode-extensionapi";
// //     import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
    
// //     const appInsights = getAppInsightsInstance();
    
// //     let logoutCommand: Disposable | undefined;
    
// //     const markdownContentStore = new Map<string, string>();
    
// //     export async function activate(context: ExtensionContext) {
// //       vscode.window.showInformationMessage(" Activated..... ");
// //       const op = window.createOutputChannel("CodeSherlockAI");
// //       op.appendLine("Extension is Activated ..... ");
    
// //       registerWebViewProvider(context, op);
// //       registerMarkdownContentProvider(context);
// //       registerPreviewCommand(context);
    
// //       //added
// //       const machineId = vscode.env.machineId;
    
// //       // Check if the device ID has already been logged
// //       const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
    
// //       if (!hasLoggedDevice) {
// //         await context.globalState.update("hasLoggedDevice", true);
// //         // Log successful API call
// //         appInsights?.trackTrace({
// //           message: "User installed an CodeSherlock.ai extension",
// //           properties: { machineId, vs_code: true },
// //           severityLevel: 0,
// //         });
// //       }
    
// //     //   const repos = await getRepositories();
    
// //     //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
    
// //     try {
// //       const res = await analyzeUncommittedChanges1(op);
// //       op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //     } catch (err: any) {
// //       op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //     }
    
// //       // const { execSync } = require("child_process");
    
// //       // try {
// //       //   const latestCommit = execSync("git rev-parse HEAD", {
// //       //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //       //   })
// //       //     .toString()
// //       //     .trim();
    
// //       //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //       //   op.appendLine(
// //       //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //       //   );
// //       // } catch (err: any) {
// //       //   op.appendLine(
// //       //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //       //   );
// //       // }




// //       // import React from "react";
// // // import ReactDOM from "react-dom/client";
// // // import App from "./App";
// // // import { Provider } from "react-redux";
// // // import { store } from "./store";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
// // // //
// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....


// // import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }


// //   import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }

// //   ///aknjwbshf
// //   //testing commit


// //   //sdfjkhdsjfherhfiu





// //   import "./ContactUpload.css";
// //   import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //   import { useNavigate,useLocation } from "react-router-dom";
// //   export default function ContactUpload() {
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     // const file = location.state?.file;
  
  
// //     return (
// //       <>
// //         <div className="header-container">
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             ← Back to Upload
// //           </button>
  
// //           <div className="header-title-group">
// //             <h1 className="header-title">Phonebook Data</h1>
// //             <p className="header-subtitle">Manage your imported contacts</p>
// //           </div>
  
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             New Upload
// //           </button>
// //         </div>
  
// //         <div>
// //           <CreateTableForContactUpload/>
// //         </div>
// //       </>
// //     );
// //   }
// //   import { ExtensionContext, window, Disposable } from "vscode";
// //   import * as vscode from "vscode";
// //   import * as dotenv from "dotenv";
// //   import * as path from "path";
// //   import {
// //     initializeGitWatching,
// //     waitForRepositories,
// //     setupRepositoryWatching,
// //     handleGitAction,
// //     showCommitAnalysisUI,
// //     getCommitAnalysisData,
// //     mapGitStatus,
// //     getFileContent,
// //     getPatchData,
// //     generateAlternativeDiff,
// //     generateEnhancedDiff,
// //     // sendToAnalysisPipeline,
// //     type AnalysisPayload,
// //     analyzeCommittedChanges,
// //     analyzeCommittedChanges1,
// //   } from "./vscode-extensionapi";
  
// //   // Load the .env file
// //   dotenv.config({ path: path.join(__dirname, "../.env") });
// //   import { registerWebViewProvider } from "./panels/SidePanel";
// //   import { getAppInsightsInstance } from "./logging/AppInsights";
// //   import { getRepositories } from "./vscode-extensionapi";
// //   import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
  
// //   const appInsights = getAppInsightsInstance();
  
// //   let logoutCommand: Disposable | undefined;
  
// //   const markdownContentStore = new Map<string, string>();
  
// //   export async function activate(context: ExtensionContext) {
// //     vscode.window.showInformationMessage(" Activated..... ");
// //     const op = window.createOutputChannel("CodeSherlockAI");
// //     op.appendLine("Extension is Activated ..... ");
  
// //     registerWebViewProvider(context, op);
// //     registerMarkdownContentProvider(context);
// //     registerPreviewCommand(context);
  
// //     //added
// //     const machineId = vscode.env.machineId;
  
// //     // Check if the device ID has already been logged
// //     const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
  
// //     if (!hasLoggedDevice) {
// //       await context.globalState.update("hasLoggedDevice", true);
// //       // Log successful API call
// //       appInsights?.trackTrace({
// //         message: "User installed an CodeSherlock.ai extension",
// //         properties: { machineId, vs_code: true },
// //         severityLevel: 0,
// //       });
// //     }
  
// //   //   const repos = await getRepositories();
  
// //   //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
  
// //   try {
// //     const res = await analyzeUncommittedChanges1(op);
// //     op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //   } catch (err: any) {
// //     op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //   }
  
// //     // const { execSync } = require("child_process");
  
// //     // try {
// //     //   const latestCommit = execSync("git rev-parse HEAD", {
// //     //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //     //   })
// //     //     .toString()
// //     //     .trim();
  
// //     //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //     //   op.appendLine(
// //     //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //     //   );
// //     // } catch (err: any) {
// //     //   op.appendLine(
// //     //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //     //   );
// //     // }


// //     import "./ContactUpload.css";
// //     import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //     import { useNavigate,useLocation } from "react-router-dom";
// //     export default function ContactUpload() {
// //       const navigate = useNavigate();
// //       const location = useLocation();
// //       // const file = location.state?.file;
    
    
// //       return (
// //         <>
// //           <div className="header-container">
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               ← Back to Upload
// //             </button>
    
// //             <div className="header-title-group">
// //               <h1 className="header-title">Phonebook Data</h1>
// //               <p className="header-subtitle">Manage your imported contacts</p>
// //             </div>
    
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               New Upload
// //             </button>
// //           </div>
    
// //           <div>
// //             <CreateTableForContactUpload/>
// //           </div>
// //         </>
// //       );
// //     }
// //     import { ExtensionContext, window, Disposable } from "vscode";
// //     import * as vscode from "vscode";
// //     import * as dotenv from "dotenv";
// //     import * as path from "path";
// //     import {
// //       initializeGitWatching,
// //       waitForRepositories,
// //       setupRepositoryWatching,
// //       handleGitAction,
// //       showCommitAnalysisUI,
// //       getCommitAnalysisData,
// //       mapGitStatus,
// //       getFileContent,
// //       getPatchData,
// //       generateAlternativeDiff,
// //       generateEnhancedDiff,
// //       // sendToAnalysisPipeline,
// //       type AnalysisPayload,
// //       analyzeCommittedChanges,
// //       analyzeCommittedChanges1,
// //     } from "./vscode-extensionapi";
    
// //     // Load the .env file
// //     dotenv.config({ path: path.join(__dirname, "../.env") });
// //     import { registerWebViewProvider } from "./panels/SidePanel";
// //     import { getAppInsightsInstance } from "./logging/AppInsights";
// //     import { getRepositories } from "./vscode-extensionapi";
// //     import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
    
// //     const appInsights = getAppInsightsInstance();
    
// //     let logoutCommand: Disposable | undefined;
    
// //     const markdownContentStore = new Map<string, string>();
    
// //     export async function activate(context: ExtensionContext) {
// //       vscode.window.showInformationMessage(" Activated..... ");
// //       const op = window.createOutputChannel("CodeSherlockAI");
// //       op.appendLine("Extension is Activated ..... ");
    
// //       registerWebViewProvider(context, op);
// //       registerMarkdownContentProvider(context);
// //       registerPreviewCommand(context);
    
// //       //added
// //       const machineId = vscode.env.machineId;
    
// //       // Check if the device ID has already been logged
// //       const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
    
// //       if (!hasLoggedDevice) {
// //         await context.globalState.update("hasLoggedDevice", true);
// //         // Log successful API call
// //         appInsights?.trackTrace({
// //           message: "User installed an CodeSherlock.ai extension",
// //           properties: { machineId, vs_code: true },
// //           severityLevel: 0,
// //         });
// //       }
    
// //     //   const repos = await getRepositories();
    
// //     //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
    
// //     try {
// //       const res = await analyzeUncommittedChanges1(op);
// //       op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //     } catch (err: any) {
// //       op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //     }
    
// //       // const { execSync } = require("child_process");
    
// //       // try {
// //       //   const latestCommit = execSync("git rev-parse HEAD", {
// //       //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //       //   })
// //       //     .toString()
// //       //     .trim();
    
// //       //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //       //   op.appendLine(
// //       //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //       //   );
// //       // } catch (err: any) {
// //       //   op.appendLine(
// //       //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //       //   );
// //       // }




// //       // import React from "react";
// // // import ReactDOM from "react-dom/client";
// // // import App from "./App";
// // // import { Provider } from "react-redux";
// // // import { store } from "./store";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
// // // //
// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   const { execSync } = require("child_process");

// //   try {
// //     const latestCommit = execSync("git rev-parse HEAD", {
// //       cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //     })
// //       .toString()
// //       .trim();

// //     const res = await analyzeCommittedChanges1(latestCommit, op);
// //     op.appendLine(
// //       `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //     );
// //   } catch (err: any) {
// //     op.appendLine(
// //       `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //     );
// //   }


// //   import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }

// //   ///aknjwbshf
// //   //testing commit


// //   //sdfjkhdsjfherhfiu





// //   import "./ContactUpload.css";
// //   import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //   import { useNavigate,useLocation } from "react-router-dom";
// //   export default function ContactUpload() {
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     // const file = location.state?.file;
  
  
// //     return (
// //       <>
// //         <div className="header-container">
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             ← Back to Upload
// //           </button>
  
// //           <div className="header-title-group">
// //             <h1 className="header-title">Phonebook Data</h1>
// //             <p className="header-subtitle">Manage your imported contacts</p>
// //           </div>
  
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             New Upload
// //           </button>
// //         </div>
  
// //         <div>
// //           <CreateTableForContactUpload/>
// //         </div>
// //       </>
// //     );
// //   }
// //   import { ExtensionContext, window, Disposable } from "vscode";
// //   import * as vscode from "vscode";
// //   import * as dotenv from "dotenv";
// //   import * as path from "path";
// //   import {
// //     initializeGitWatching,
// //     waitForRepositories,
// //     setupRepositoryWatching,
// //     handleGitAction,
// //     showCommitAnalysisUI,
// //     getCommitAnalysisData,
// //     mapGitStatus,
// //     getFileContent,
// //     getPatchData,
// //     generateAlternativeDiff,
// //     generateEnhancedDiff,
// //     // sendToAnalysisPipeline,
// //     type AnalysisPayload,
// //     analyzeCommittedChanges,
// //     analyzeCommittedChanges1,
// //   } from "./vscode-extensionapi";
  
// //   // Load the .env file
// //   dotenv.config({ path: path.join(__dirname, "../.env") });
// //   import { registerWebViewProvider } from "./panels/SidePanel";
// //   import { getAppInsightsInstance } from "./logging/AppInsights";
// //   import { getRepositories } from "./vscode-extensionapi";
// //   import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
  
// //   const appInsights = getAppInsightsInstance();
  
// //   let logoutCommand: Disposable | undefined;
  
// //   const markdownContentStore = new Map<string, string>();
  
// //   export async function activate(context: ExtensionContext) {
// //     vscode.window.showInformationMessage(" Activated..... ");
// //     const op = window.createOutputChannel("CodeSherlockAI");
// //     op.appendLine("Extension is Activated ..... ");
  
// //     registerWebViewProvider(context, op);
// //     registerMarkdownContentProvider(context);
// //     registerPreviewCommand(context);
  
// //     //added
// //     const machineId = vscode.env.machineId;
  
// //     // Check if the device ID has already been logged
// //     const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
  
// //     if (!hasLoggedDevice) {
// //       await context.globalState.update("hasLoggedDevice", true);
// //       // Log successful API call
// //       appInsights?.trackTrace({
// //         message: "User installed an CodeSherlock.ai extension",
// //         properties: { machineId, vs_code: true },
// //         severityLevel: 0,
// //       });
// //     }
  
// //   //   const repos = await getRepositories();
  
// //   //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
  
// //   try {
// //     const res = await analyzeUncommittedChanges1(op);
// //     op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //   } catch (err: any) {
// //     op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //   }
  
// //     // const { execSync } = require("child_process");
  
// //     // try {
// //     //   const latestCommit = execSync("git rev-parse HEAD", {
// //     //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //     //   })
// //     //     .toString()
// //     //     .trim();
  
// //     //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //     //   op.appendLine(
// //     //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //     //   );
// //     // } catch (err: any) {
// //     //   op.appendLine(
// //     //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //     //   );
// //     // }


// //     import "./ContactUpload.css";
// //     import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //     import { useNavigate,useLocation } from "react-router-dom";
// //     export default function ContactUpload() {
// //       const navigate = useNavigate();
// //       const location = useLocation();
// //       // const file = location.state?.file;
    
    
// //       return (
// //         <>
// //           <div className="header-container">
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               ← Back to Upload
// //             </button>
    
// //             <div className="header-title-group">
// //               <h1 className="header-title">Phonebook Data</h1>
// //               <p className="header-subtitle">Manage your imported contacts</p>
// //             </div>
    
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               New Upload
// //             </button>
// //           </div>
    
// //           <div>
// //             <CreateTableForContactUpload/>
// //           </div>
// //         </>
// //       );
// //     }
// //     import { ExtensionContext, window, Disposable } from "vscode";
// //     import * as vscode from "vscode";
// //     import * as dotenv from "dotenv";
// //     import * as path from "path";
// //     import {
// //       initializeGitWatching,
// //       waitForRepositories,
// //       setupRepositoryWatching,
// //       handleGitAction,
// //       showCommitAnalysisUI,
// //       getCommitAnalysisData,
// //       mapGitStatus,
// //       getFileContent,
// //       getPatchData,
// //       generateAlternativeDiff,
// //       generateEnhancedDiff,
// //       // sendToAnalysisPipeline,
// //       type AnalysisPayload,
// //       analyzeCommittedChanges,
// //       analyzeCommittedChanges1,
// //     } from "./vscode-extensionapi";
    
// //     // Load the .env file
// //     dotenv.config({ path: path.join(__dirname, "../.env") });
// //     import { registerWebViewProvider } from "./panels/SidePanel";
// //     import { getAppInsightsInstance } from "./logging/AppInsights";
// //     import { getRepositories } from "./vscode-extensionapi";
// //     import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
    
// //     const appInsights = getAppInsightsInstance();
    
// //     let logoutCommand: Disposable | undefined;
    
// //     const markdownContentStore = new Map<string, string>();
    
// //     export async function activate(context: ExtensionContext) {
// //       vscode.window.showInformationMessage(" Activated..... ");
// //       const op = window.createOutputChannel("CodeSherlockAI");
// //       op.appendLine("Extension is Activated ..... ");
    
// //       registerWebViewProvider(context, op);
// //       registerMarkdownContentProvider(context);
// //       registerPreviewCommand(context);
    
// //       //added
// //       const machineId = vscode.env.machineId;
    
// //       // Check if the device ID has already been logged
// //       const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
    
// //       if (!hasLoggedDevice) {
// //         await context.globalState.update("hasLoggedDevice", true);
// //         // Log successful API call
// //         appInsights?.trackTrace({
// //           message: "User installed an CodeSherlock.ai extension",
// //           properties: { machineId, vs_code: true },
// //           severityLevel: 0,
// //         });
// //       }
    
// //     //   const repos = await getRepositories();
    
// //     //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
    
// //     try {
// //       const res = await analyzeUncommittedChanges1(op);
// //       op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //     } catch (err: any) {
// //       op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //     }
    
// //       const { execSync } = require("child_process");
    
// //       try {
// //         const latestCommit = execSync("git rev-parse HEAD", {
// //           cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //         })
// //           .toString()
// //           .trim();
    
// //         const res = await analyzeCommittedChanges1(latestCommit, op);
// //         op.appendLine(
// //           `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //         );
// //       } catch (err: any) {
// //         op.appendLine(
// //           `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //         );
// //       }




// //       import React from "react";
// // import ReactDOM from "react-dom/client";
// // import App from "./App";
// // import { Provider } from "react-redux";
// // import { store } from "./store";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }


// //   import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
// // // //
// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....


// // import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }


// //   import "./ContactUpload.css";
// // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // import { useNavigate,useLocation } from "react-router-dom";
// // export default function ContactUpload() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   // const file = location.state?.file;


// //   return (
// //     <>
// //       <div className="header-container">
// //         <button className="header-button" onClick={() => navigate("/")}>
// //           ← Back to Upload
// //         </button>

// //         <div className="header-title-group">
// //           <h1 className="header-title">Phonebook Data</h1>
// //           <p className="header-subtitle">Manage your imported contacts</p>
// //         </div>

// //         <button className="header-button" onClick={() => navigate("/")}>
// //           New Upload
// //         </button>
// //       </div>

// //       <div>
// //         <CreateTableForContactUpload/>
// //       </div>
// //     </>
// //   );
// // }
// // import { ExtensionContext, window, Disposable } from "vscode";
// // import * as vscode from "vscode";
// // import * as dotenv from "dotenv";
// // import * as path from "path";
// // import {
// //   initializeGitWatching,
// //   waitForRepositories,
// //   setupRepositoryWatching,
// //   handleGitAction,
// //   showCommitAnalysisUI,
// //   getCommitAnalysisData,
// //   mapGitStatus,
// //   getFileContent,
// //   getPatchData,
// //   generateAlternativeDiff,
// //   generateEnhancedDiff,
// //   // sendToAnalysisPipeline,
// //   type AnalysisPayload,
// //   analyzeCommittedChanges,
// //   analyzeCommittedChanges1,
// // } from "./vscode-extensionapi";

// // // Load the .env file
// // dotenv.config({ path: path.join(__dirname, "../.env") });
// // import { registerWebViewProvider } from "./panels/SidePanel";
// // import { getAppInsightsInstance } from "./logging/AppInsights";
// // import { getRepositories } from "./vscode-extensionapi";
// // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // const appInsights = getAppInsightsInstance();

// // let logoutCommand: Disposable | undefined;

// // const markdownContentStore = new Map<string, string>();

// // export async function activate(context: ExtensionContext) {
// //   vscode.window.showInformationMessage(" Activated..... ");
// //   const op = window.createOutputChannel("CodeSherlockAI");
// //   op.appendLine("Extension is Activated ..... ");

// //   registerWebViewProvider(context, op);
// //   registerMarkdownContentProvider(context);
// //   registerPreviewCommand(context);

// //   //added
// //   const machineId = vscode.env.machineId;

// //   // Check if the device ID has already been logged
// //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// //   if (!hasLoggedDevice) {
// //     await context.globalState.update("hasLoggedDevice", true);
// //     // Log successful API call
// //     appInsights?.trackTrace({
// //       message: "User installed an CodeSherlock.ai extension",
// //       properties: { machineId, vs_code: true },
// //       severityLevel: 0,
// //     });
// //   }

// // //   const repos = await getRepositories();

// // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // try {
// //   const res = await analyzeUncommittedChanges1(op);
// //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // } catch (err: any) {
// //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // }

// //   // const { execSync } = require("child_process");

// //   // try {
// //   //   const latestCommit = execSync("git rev-parse HEAD", {
// //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //   //   })
// //   //     .toString()
// //   //     .trim();

// //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //   //   op.appendLine(
// //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //   //   );
// //   // } catch (err: any) {
// //   //   op.appendLine(
// //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //   //   );
// //   // }

// //   ///aknjwbshf
// //   //testing commit


// //   //sdfjkhdsjfherhfiu





// //   import "./ContactUpload.css";
// //   import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //   import { useNavigate,useLocation } from "react-router-dom";
// //   export default function ContactUpload() {
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     // const file = location.state?.file;
  
  
// //     return (
// //       <>
// //         <div className="header-container">
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             ← Back to Upload
// //           </button>
  
// //           <div className="header-title-group">
// //             <h1 className="header-title">Phonebook Data</h1>
// //             <p className="header-subtitle">Manage your imported contacts</p>
// //           </div>
  
// //           <button className="header-button" onClick={() => navigate("/")}>
// //             New Upload
// //           </button>
// //         </div>
  
// //         <div>
// //           <CreateTableForContactUpload/>
// //         </div>
// //       </>
// //     );
// //   }
// //   import { ExtensionContext, window, Disposable } from "vscode";
// //   import * as vscode from "vscode";
// //   import * as dotenv from "dotenv";
// //   import * as path from "path";
// //   import {
// //     initializeGitWatching,
// //     waitForRepositories,
// //     setupRepositoryWatching,
// //     handleGitAction,
// //     showCommitAnalysisUI,
// //     getCommitAnalysisData,
// //     mapGitStatus,
// //     getFileContent,
// //     getPatchData,
// //     generateAlternativeDiff,
// //     generateEnhancedDiff,
// //     // sendToAnalysisPipeline,
// //     type AnalysisPayload,
// //     analyzeCommittedChanges,
// //     analyzeCommittedChanges1,
// //   } from "./vscode-extensionapi";
  
// //   // Load the .env file
// //   dotenv.config({ path: path.join(__dirname, "../.env") });
// //   import { registerWebViewProvider } from "./panels/SidePanel";
// //   import { getAppInsightsInstance } from "./logging/AppInsights";
// //   import { getRepositories } from "./vscode-extensionapi";
// //   import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
  
// //   const appInsights = getAppInsightsInstance();
  
// //   let logoutCommand: Disposable | undefined;
  
// //   const markdownContentStore = new Map<string, string>();
  
// //   export async function activate(context: ExtensionContext) {
// //     vscode.window.showInformationMessage(" Activated..... ");
// //     const op = window.createOutputChannel("CodeSherlockAI");
// //     op.appendLine("Extension is Activated ..... ");
  
// //     registerWebViewProvider(context, op);
// //     registerMarkdownContentProvider(context);
// //     registerPreviewCommand(context);
  
// //     //added
// //     const machineId = vscode.env.machineId;
  
// //     // Check if the device ID has already been logged
// //     const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
  
// //     if (!hasLoggedDevice) {
// //       await context.globalState.update("hasLoggedDevice", true);
// //       // Log successful API call
// //       appInsights?.trackTrace({
// //         message: "User installed an CodeSherlock.ai extension",
// //         properties: { machineId, vs_code: true },
// //         severityLevel: 0,
// //       });
// //     }
  
// //   //   const repos = await getRepositories();
  
// //   //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
  
// //   try {
// //     const res = await analyzeUncommittedChanges1(op);
// //     op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //   } catch (err: any) {
// //     op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //   }
  
// //     // const { execSync } = require("child_process");
  
// //     // try {
// //     //   const latestCommit = execSync("git rev-parse HEAD", {
// //     //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //     //   })
// //     //     .toString()
// //     //     .trim();
  
// //     //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //     //   op.appendLine(
// //     //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //     //   );
// //     // } catch (err: any) {
// //     //   op.appendLine(
// //     //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //     //   );
// //     // }


// //     import "./ContactUpload.css";
// //     import CreateTableForContactUpload from "./CreateTableForContactUpload";
// //     import { useNavigate,useLocation } from "react-router-dom";
// //     export default function ContactUpload() {
// //       const navigate = useNavigate();
// //       const location = useLocation();
// //       // const file = location.state?.file;
    
    
// //       return (
// //         <>
// //           <div className="header-container">
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               ← Back to Upload
// //             </button>
    
// //             <div className="header-title-group">
// //               <h1 className="header-title">Phonebook Data</h1>
// //               <p className="header-subtitle">Manage your imported contacts</p>
// //             </div>
    
// //             <button className="header-button" onClick={() => navigate("/")}>
// //               New Upload
// //             </button>
// //           </div>
    
// //           <div>
// //             <CreateTableForContactUpload/>
// //           </div>
// //         </>
// //       );
// //     }
// //     import { ExtensionContext, window, Disposable } from "vscode";
// //     import * as vscode from "vscode";
// //     import * as dotenv from "dotenv";
// //     import * as path from "path";
// //     import {
// //       initializeGitWatching,
// //       waitForRepositories,
// //       setupRepositoryWatching,
// //       handleGitAction,
// //       showCommitAnalysisUI,
// //       getCommitAnalysisData,
// //       mapGitStatus,
// //       getFileContent,
// //       getPatchData,
// //       generateAlternativeDiff,
// //       generateEnhancedDiff,
// //       // sendToAnalysisPipeline,
// //       type AnalysisPayload,
// //       analyzeCommittedChanges,
// //       analyzeCommittedChanges1,
// //     } from "./vscode-extensionapi";
    
// //     // Load the .env file
// //     dotenv.config({ path: path.join(__dirname, "../.env") });
// //     import { registerWebViewProvider } from "./panels/SidePanel";
// //     import { getAppInsightsInstance } from "./logging/AppInsights";
// //     import { getRepositories } from "./vscode-extensionapi";
// //     import {analyzeUncommittedChanges1} from "./vscode-extensionapi"
    
// //     const appInsights = getAppInsightsInstance();
    
// //     let logoutCommand: Disposable | undefined;
    
// //     const markdownContentStore = new Map<string, string>();
    
// //     export async function activate(context: ExtensionContext) {
// //       vscode.window.showInformationMessage(" Activated..... ");
// //       const op = window.createOutputChannel("CodeSherlockAI");
// //       op.appendLine("Extension is Activated ..... ");
    
// //       registerWebViewProvider(context, op);
// //       registerMarkdownContentProvider(context);
// //       registerPreviewCommand(context);
    
// //       //added
// //       const machineId = vscode.env.machineId;
    
// //       // Check if the device ID has already been logged
// //       const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");
    
// //       if (!hasLoggedDevice) {
// //         await context.globalState.update("hasLoggedDevice", true);
// //         // Log successful API call
// //         appInsights?.trackTrace({
// //           message: "User installed an CodeSherlock.ai extension",
// //           properties: { machineId, vs_code: true },
// //           severityLevel: 0,
// //         });
// //       }
    
// //     //   const repos = await getRepositories();
    
// //     //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);
    
// //     try {
// //       const res = await analyzeUncommittedChanges1(op);
// //       op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// //     } catch (err: any) {
// //       op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// //     }
    
// //       // const { execSync } = require("child_process");
    
// //       // try {
// //       //   const latestCommit = execSync("git rev-parse HEAD", {
// //       //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// //       //   })
// //       //     .toString()
// //       //     .trim();
    
// //       //   const res = await analyzeCommittedChanges1(latestCommit, op);
// //       //   op.appendLine(
// //       //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// //       //   );
// //       // } catch (err: any) {
// //       //   op.appendLine(
// //       //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// //       //   );
// //       // }




// //       // import React from "react";
// // // import ReactDOM from "react-dom/client";
// // // import App from "./App";
// // // import { Provider } from "react-redux";
// // // import { store } from "./store";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
// // // //
// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }


// // //   import "./ContactUpload.css";
// // // import CreateTableForContactUpload from "./CreateTableForContactUpload";
// // // import { useNavigate,useLocation } from "react-router-dom";
// // // export default function ContactUpload() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // const file = location.state?.file;


// // //   return (
// // //     <>
// // //       <div className="header-container">
// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           ← Back to Upload
// // //         </button>

// // //         <div className="header-title-group">
// // //           <h1 className="header-title">Phonebook Data</h1>
// // //           <p className="header-subtitle">Manage your imported contacts</p>
// // //         </div>

// // //         <button className="header-button" onClick={() => navigate("/")}>
// // //           New Upload
// // //         </button>
// // //       </div>

// // //       <div>
// // //         <CreateTableForContactUpload/>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // // import { ExtensionContext, window, Disposable } from "vscode";
// // // import * as vscode from "vscode";
// // // import * as dotenv from "dotenv";
// // // import * as path from "path";
// // // import {
// // //   initializeGitWatching,
// // //   waitForRepositories,
// // //   setupRepositoryWatching,
// // //   handleGitAction,
// // //   showCommitAnalysisUI,
// // //   getCommitAnalysisData,
// // //   mapGitStatus,
// // //   getFileContent,
// // //   getPatchData,
// // //   generateAlternativeDiff,
// // //   generateEnhancedDiff,
// // //   // sendToAnalysisPipeline,
// // //   type AnalysisPayload,
// // //   analyzeCommittedChanges,
// // //   analyzeCommittedChanges1,
// // // } from "./vscode-extensionapi";

// // // // Load the .env file
// // // dotenv.config({ path: path.join(__dirname, "../.env") });
// // // import { registerWebViewProvider } from "./panels/SidePanel";
// // // import { getAppInsightsInstance } from "./logging/AppInsights";
// // // import { getRepositories } from "./vscode-extensionapi";
// // // import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

// // // const appInsights = getAppInsightsInstance();

// // // let logoutCommand: Disposable | undefined;

// // // const markdownContentStore = new Map<string, string>();

// // // export async function activate(context: ExtensionContext) {
// // //   vscode.window.showInformationMessage(" Activated..... ");
// // //   const op = window.createOutputChannel("CodeSherlockAI");
// // //   op.appendLine("Extension is Activated ..... ");

// // //   registerWebViewProvider(context, op);
// // //   registerMarkdownContentProvider(context);
// // //   registerPreviewCommand(context);

// // //   //added
// // //   const machineId = vscode.env.machineId;

// // //   // Check if the device ID has already been logged
// // //   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

// // //   if (!hasLoggedDevice) {
// // //     await context.globalState.update("hasLoggedDevice", true);
// // //     // Log successful API call
// // //     appInsights?.trackTrace({
// // //       message: "User installed an CodeSherlock.ai extension",
// // //       properties: { machineId, vs_code: true },
// // //       severityLevel: 0,
// // //     });
// // //   }

// // // //   const repos = await getRepositories();

// // // //   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

// // // try {
// // //   const res = await analyzeUncommittedChanges1(op);
// // //   op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
// // // } catch (err: any) {
// // //   op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
// // // }

// // //   // const { execSync } = require("child_process");

// // //   // try {
// // //   //   const latestCommit = execSync("git rev-parse HEAD", {
// // //   //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
// // //   //   })
// // //   //     .toString()
// // //   //     .trim();

// // //   //   const res = await analyzeCommittedChanges1(latestCommit, op);
// // //   //   op.appendLine(
// // //   //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
// // //   //   );
// // //   // } catch (err: any) {
// // //   //   op.appendLine(
// // //   //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
// // //   //   );
// // //   // }

// // //   ///aknjwbshf
// // //   //testing commit


// // //   //sdfjkhdsjfherhfiu


// // //   //testing....
