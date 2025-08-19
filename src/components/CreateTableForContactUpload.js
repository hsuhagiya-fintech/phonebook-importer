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

// 🔍 ISSUE: DEP-200 - High Severity
// Lines 20-42
// The activate function has tightly coupled implementations of the dependencies it needs, specifically the `appInsights`, `vscode` methods, and output channel creation.
import { AppInsights } from "./logging/AppInsights"; // Assume AppInsights is an interface.
import { createOutputChannel } from "./utils"; // Utility function to create output channels.

// Inject dependencies via parameters
export async function activate(context: ExtensionContext, appInsights: AppInsights, createOutputChannel: () => OutputChannel) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

  registerWebViewProvider(context, op);
  registerMarkdownContentProvider(context);
  registerPreviewCommand(context);

  const machineId = vscode.env.machineId;
  const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

  if (!hasLoggedDevice) {
    await context.globalState.update("hasLoggedDevice", true);
    appInsights?.trackTrace({
      message: "User installed an CodeSherlock.ai extension",
      properties: { machineId, vs_code: true },
      severityLevel: 0,
    }); 
  }
}

// In the main file where activate is called:
activate(context, appInsightsInstance, () => window.createOutputChannel("CodeSherlockAI"));

// In the main file, where activate is called:
activate(context, appInsightsInstance, () => window.createOutputChannel("CodeSherlockAI"));
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
// 🔍 ISSUE: EXC-100 - Critical Severity
// Lines 53-123
// Lack of Comprehensive Exception Handling in Asynchronous Code
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
try {
    const res = await analyzeUncommittedChanges1(op);

    // Validate the response structure comprehensively
    if (!res || typeof res !== 'object') {
        throw new Error("Response is null or not an object.");
    }
    if (!res.hasOwnProperty('expectedProperty')) {
        throw new Error("Response is missing the expected property.");
    }
    
    op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
    op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
      appInsights?.trackTrace({
        message: "User installed an CodeSherlock.ai extension",
        properties: { machineId, vs_code: true },
        severityLevel: 0,
      });
    }
    
    await performUncommittedAnalysis(op);
    
    const latestCommit = await getLatestCommit();
    await analyzeCommittedChanges(latestCommit, op);
  
  } catch (err: any) {
    logCriticalError(op, err);
  }
}

async function performUncommittedAnalysis(op) {
  try {
    const res = await analyzeUncommittedChanges1(op);
    op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
  } catch (err: any) {
    op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
    throw err; // Rethrow to allow higher-level handling if necessary
  }
}

async function analyzeCommittedChanges(commit: string, op) {
  try {
    const res = await analyzeCommittedChanges1(commit, op);
    op.appendLine(`Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`);
  } catch (err: any) {
    op.appendLine(`⚠️ Skipping initial commit analysis. Reason: ${err.message}`);
  }
}

function logCriticalError(op, error) {
  op.appendLine(`❌ Critical error occurred: ${error?.message || JSON.stringify(error)}`);
}

async function getLatestCommit() {
  const { execSync } = require("child_process");
  try {
    const latestCommit = execSync("git rev-parse HEAD", {
      cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
    }).toString().trim();
    return latestCommit;
  } catch (err) {
    throw new Error(`Could not retrieve latest commit: ${err.message}`);
  }
}
// ✅ SOLUTION: INP-100
// Implement structure validation for the response returned by `analyzeUncommittedChanges1` to ensure that it conforms to the expected format before processing it. This will reduce the likelihood of runtime errors caused by invalid responses.
try {
  const res = await analyzeUncommittedChanges1(op);

  // Validate the response structure
  if (res && typeof res === 'object' && 'expectedProperty' in res) {
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
    const maxBatches = 5; // Limit to a maximum number of batches to process at a time
    for (let i = 0; i < Math.min(changes.length, batchSize * maxBatches); i += batchSize) {
        const batch = changes.slice(i, i + batchSize);
        try {
// 🔍 ISSUE: RES-100 - Critical Severity
// Lines 130-136
// Unbounded Loop and Large Data Allocation
            await processBatch(batch, op); // Process the current batch
        } catch (error) {
            op.appendLine(`❌ Error processing batch: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Throttle processing, if necessary
    }
}
// ✅ SOLUTION: RES-100
// To mitigate the risk of excessive memory usage and potential blocking, the code should limit the number of batches that can be processed at one time, as well as implement proper error handling to ensure that the application can gracefully handle errors during processing. The following revised implementation adds batching with a controlled limit:
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
