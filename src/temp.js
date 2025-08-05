// import { ExtensionContext, window, Disposable } from "vscode";
// import * as vscode from "vscode";
// import * as dotenv from "dotenv";
// import * as path from "path";
// import {
//   initializeGitWatching,
//   waitForRepositories,
//   setupRepositoryWatching,
//   handleGitAction,
//   showCommitAnalysisUI,
//   getCommitAnalysisData,
//   isCompleteStatement,
//   getCompleteBlock,
//   mapGitStatus,
//   getFileContent,
//   getPatchData,
//   generateAlternativeDiff,
//   generateEnhancedDiff,
//   sendToAnalysisPipeline,
//   type AnalysisPayload
// } from "./vscode-extensionapi";

// // Load the .env file
// dotenv.config({ path: path.join(__dirname, "../.env") });
// import { registerWebViewProvider } from "./panels/SidePanel";
// import { getAppInsightsInstance } from "./logging/AppInsights";


// const appInsights = getAppInsightsInstance();

// let logoutCommand: Disposable | undefined;

// const markdownContentStore = new Map<string, string>();

// export async function activate(context: ExtensionContext) {
//   vscode.window.showInformationMessage(" Activated..... ");
//   const op = window.createOutputChannel("CodeSherlockAI");
//   op.appendLine("Extension is Activated ..... ");

//   registerWebViewProvider(context, op);
//   registerMarkdownContentProvider(context);
//   registerPreviewCommand(context);

//   //added
//   const machineId = vscode.env.machineId;

//   // Check if the device ID has already been logged
//   const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

//   if (!hasLoggedDevice) {
//     await context.globalState.update("hasLoggedDevice", true);
//     // Log successful API call
//     appInsights?.trackTrace({
//       message: "User installed an CodeSherlock.ai extension",
//       properties: { machineId, vs_code: true },
//       severityLevel: 0,
//     });
//   }

//   op.appendLine("Vs-Code API is Activating... ");

//   // Initialize Git functionality and get Analysis Payload
//   const analysisPayload: AnalysisPayload = await initializeGitWatching(
//     context, 
//     op);
    
//     // (payload: AnalysisPayload) => {
//     //   op.appendLine("=".repeat(80));
//     //   op.appendLine("🎯ANALYSIS PAYLOAD RECEIVED:");
//     //   op.appendLine("=".repeat(80));
//     //   op.appendLine("Analysis Payload: " + JSON.stringify(payload, null, 2));
//     //   op.appendLine("=".repeat(80));
      
//     //   // This callback will only be called when a commit is analyzed
//     //   if (payload.commit_hash) {
//     //     op.appendLine(`✅ Commit analysis completed for: ${payload.commit_hash.substring(0, 8)}`);
//     //     op.appendLine(`📁 Files changed: ${payload.total_files}`);
//     //     op.appendLine(`🕒 Timestamp: ${payload.timestamp}`);
//     //   }
//     // }
//   // );
  
//   // // Log the initial analysis payload (this is just setup info, not commit analysis)
//   // op.appendLine("=".repeat(80));
//   // op.appendLine(" GIT WATCHING SETUP COMPLETED:");
//   // op.appendLine("=".repeat(80));
//   // op.appendLine("Analysis Payload: " + JSON.stringify(analysisPayload, null, 2));
//   // op.appendLine("=".repeat(80));
  
//   // if (analysisPayload.workspace_info) {
//   //   op.appendLine(`Workspace folders: ${analysisPayload.workspace_info.folders.length}`);
//   //   op.appendLine(`Total workspace files: ${analysisPayload.workspace_info.total_files}`);
//   // }
  
//   // op.appendLine("Extension activation completed.");
// }


// function registerMarkdownContentProvider(context: vscode.ExtensionContext) {
//   const provider: vscode.TextDocumentContentProvider = {
//     provideTextDocumentContent(uri: vscode.Uri): string {
//       const key = uri.path.slice(1);
//       return markdownContentStore.get(key) || "Content not found.";
//     },
//   };

//   context.subscriptions.push(
//     vscode.workspace.registerTextDocumentContentProvider(
//       "markdown-preview",
//       provider
//     )
//   );
// }

// // // export function registerPreviewCommand(context: vscode.ExtensionContext) {
// // //   context.subscriptions.push(
// // //     vscode.commands.registerCommand(
// // //       "extension.openMarkdownPreview",
// // //       async (title: string, markdownContent: string) => {
// // //         if (!title || !markdownContent) {
// // //           vscode.window.showErrorMessage("Missing title or markdown content.");
// // //           return;
// // //         }

// // //         const key = `${Date.now()}-${title.replace(/\s+/g, "-")}`;
// // //         const previewUri = vscode.Uri.parse(
// // //           `markdown-preview://preview/${key}`
// // //         );

// // //         // ✅ Store the content for the provider to access
// // //         markdownContentStore.set(key, markdownContent);

// // //         // Open the preview
// // //         const existingColumnTwo = vscode.window.visibleTextEditors.find(
// // //           (editor) => editor.viewColumn === vscode.ViewColumn.Two
// // //         );

// // //         if (!existingColumnTwo) {
// // //           await vscode.commands.executeCommand(
// // //             "markdown.showPreviewToSide",
// // //             previewUri
// // //           );
// // //         } else {
// // //           await vscode.commands.executeCommand(
// // //             "markdown.showPreview",
// // //             previewUri
// // //           );
// // //         }
// // //       }
// // //     )
// // //   );
// // // }

// export function deactivate() {
//   if (logoutCommand) {
//     logoutCommand.dispose();
//   }
// }