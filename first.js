import {
  CancellationToken,
  commands,
  ExtensionContext,
  Uri,
  Webview,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
  window,
} from "vscode";
import * as vscode from "vscode";
import { getNonce, getUri } from "../utility/utilities";
import {
  analyzeCommittedChanges,
  analyzeCommittedChanges1,
  analyzeUncommittedChanges,
  analyzeUncommittedChanges1,
  getRepositories,
  setupRepositoryWatching,
  waitForRepositories,
} from "../vscode-extensionapi";

const API_BASE_URL = "https://api.dev.codesherlock.ai";
const WS_BASE_URL = "wss://api.dev.codesherlock.ai";

// import * as vscode from "vscode";

// export function showInlineDiff(

//   editor: vscode.TextEditor,

//   addedRanges: vscode.Range[],

//   removedRanges: vscode.Range[]

// ) {

//   const addedDecoration = vscode.window.createTextEditorDecorationType({

//     isWholeLine: true,

//     backgroundColor: "rgba(0, 255, 0, 0.2)", // light green

//     gutterIconPath: vscode.Uri.file(

//       vscode.extensions.getExtension("your.extension.id")!.extensionPath + "/media/plus.svg"

//     ),

//     gutterIconSize: "contain"

//   });

//   const removedDecoration = vscode.window.createTextEditorDecorationType({

//     isWholeLine: true,

//     backgroundColor: "rgba(255, 0, 0, 0.2)", // light red

//     gutterIconPath: vscode.Uri.file(

//       vscode.extensions.getExtension("your.extension.id")!.extensionPath + "/media/minus.svg"

//     ),

//     gutterIconSize: "contain"

//   });

//   editor.setDecorations(addedDecoration, addedRanges);

//   editor.setDecorations(removedDecoration, removedRanges);

// }


interface Issue {
  id: string | null;
  uid: string;
  issue: string;
  issue_code_snippet: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  severity_level: number;
  solution: string;
  solution_code_snippet: string;
  start_line: number;
  end_line: number;
}

const severityPriority = ["Critical", "High", "Medium", "Low"];

function filterNonOverlappingIssues(issues: Issue[]): Issue[] {
  if (!issues || issues.length === 0) return [];

  // Step 1: sort by severity priority, then by span length (shorter first), then start_line
  const sorted = [...issues].sort((a, b) => {
    const prioA = severityPriority.indexOf(a.severity);
    const prioB = severityPriority.indexOf(b.severity);
    if (prioA !== prioB) return prioA - prioB;

    const spanA = a.end_line - a.start_line;
    const spanB = b.end_line - b.start_line;
    if (spanA !== spanB) return spanA - spanB;

    return a.start_line - b.start_line;
  });

  // Step 2: select non-overlapping issues
  const result: Issue[] = [];
  for (const issue of sorted) {
    const overlaps = result.some(
      (chosen) =>
        !(
          issue.end_line < chosen.start_line ||
          issue.start_line > chosen.end_line
        )
    );
    if (!overlaps) {
      result.push(issue);
    }
  }

  // Step 3: return sorted by start_line for readability
  return result.sort((a, b) => a.start_line - b.start_line);
}


export class SidebarWebViewProvider implements WebviewViewProvider {
  public static instances: SidebarWebViewProvider[] = [];
  private readonly _extensionUri: Uri;
  private webview?: WebviewView;
  private lastKnownUserData: string | undefined;
  private pollingInterval: NodeJS.Timeout | null = null;
  private _outputChannel: vscode.OutputChannel;
  private _themeChangeDisposable: vscode.Disposable | null = null;
  private pendingMessage: any | null = null;
  private sendOnReady: boolean = false; // flag to control behavior

  // Centralized logging helpers
  private logInfo(message: string, showPopup: boolean = false) {
    this._outputChannel.appendLine(`ℹ️ ${message}`);
    // if (showPopup) {
    //   vscode.window.showInformationMessage(message);
    // }
  }

  private logError(message: string, error?: any, showPopup: boolean = false) {
    const details = error ? `\n   → ${error?.message || String(error)}` : "";
    this._outputChannel.appendLine(`❌ ${message}${details}`);
    if (showPopup) {
      vscode.window.showErrorMessage(
        `${message}${error ? ": " + (error?.message || String(error)) : ""}`
      );
    }
  }

  constructor(extensionUri: Uri, public extensionContext: ExtensionContext) {
    this._extensionUri = extensionUri;
    SidebarWebViewProvider.instances.push(this);
    this._outputChannel = window.createOutputChannel("CodeSherlockAI");
    this._outputChannel.appendLine("🧩 SidebarWebViewProvider constructed");

    // Listen for changes to the active editor
    window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        this.logInfo(
          `Active editor changed: ${editor.document?.uri.fsPath || "unknown"}`
        );
        this.sendFileContentToWebview(editor);
      }
    });

    // Listen for file save events
    vscode.workspace.onDidSaveTextDocument((document) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        this.logInfo(`File saved: ${document.uri.fsPath}`);
        this.sendFileContentToWebview(editor);
      }
    });
  }

  resolveWebviewView(
    webviewView: WebviewView,
    webViewContext: WebviewViewResolveContext,
    token: CancellationToken
  ) {
    this.webview = webviewView;
    this._outputChannel.appendLine("🔌 Webview resolved and ready");

    webviewView.onDidDispose(() => {
      SidebarWebViewProvider.instances =
        SidebarWebViewProvider.instances.filter(
          (instance) => instance !== this
        );
      this._outputChannel.appendLine(
        "🧹 Webview disposed and instance removed"
      );
      if (this._themeChangeDisposable) {
        try {
          this._themeChangeDisposable.dispose();
        } catch { }
        this._themeChangeDisposable = null;
      }
    });

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        // This is crucial! Point to your build folder (or the exact subfolder)
        vscode.Uri.joinPath(
          this._extensionUri,
          "codesherlock-react-view",
          "build"
        ),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(
      webviewView.webview,
      this._extensionUri
    );

    webviewView.webview.onDidReceiveMessage(async (data) => {
      const text = data.command;
      this._outputChannel.appendLine(
        `📨 Message received from webview: ${text}`
      );
      // const commithash=data.commit_hash;
      // const repo=
      // const op=
      switch (text) {
        // Add this case to the switch statement
        case "openFile": {
          const filename = data.filename;
          if (filename) {
            try {
              this._outputChannel.appendLine(`📂 Opening file: ${filename}`);

              // Get workspace folder
              const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
              if (!workspaceFolder) {
                this.logError("No workspace folder found", undefined, true);
                break;
              }

              // Construct full file path
              const filePath = vscode.Uri.joinPath(
                workspaceFolder.uri,
                filename
              );

              // Open the file
              const document = await vscode.workspace.openTextDocument(
                filePath
              );
              await vscode.window.showTextDocument(document, {
                preview: false, // Open in a new tab
                preserveFocus: false, // Focus the new tab
              });

              this._outputChannel.appendLine(
                `✅ Successfully opened file: ${filename}`
              );
            } catch (error: any) {
              this.logError(`Failed to open file: ${filename}`, error, true);
              vscode.window.showErrorMessage(
                `Failed to open file: ${filename}. ${error.message}`
              );
            }
          } else {
            this.logError(
              "Missing filename in openFile command",
              undefined,
              true
            );
          }
          break;
        }
        // New: per-file incremental send from webview
        case "commitAnalysisFile": {
          const fileName = data?.file_name || "Unknown";
          let issues = Array.isArray(data?.issues) ? data.issues : [];
          this._outputChannel.appendLine(
            `📦 Incremental file received: ${fileName} (issues=${issues.length})`
          );
          if (issues.length === 0) {
            break;
          }

          issues = filterNonOverlappingIssues(issues);
          try {
            const issuesObject: Record<string, any[]> = { [fileName]: issues };
            await vscode.commands.executeCommand(
              "codesherlock.processIssuesBackgroundSilent",
              issuesObject
            );
            this._outputChannel.appendLine(
              `✅ Incremental background processing completed for ${fileName}`
            );
          } catch (error: any) {
            this.logError(
              `Failed incremental processing for ${fileName}`,
              error
            );
          }
          break;
        }

        case "requestCommitAnalysis": {
          const commitHash = data.commit_hash;
          // Use class output channel instead of data.op
          if (commitHash) {
            // Call the function to analyze committed changes
            try {
              // Call the function to analyze committed changes
              const repo = await getRepositories();
              this._outputChannel.appendLine(
                `🔎 Starting committed analysis for commit: ${commitHash}`
              );
              const analysisPayload = await analyzeCommittedChanges1(
                commitHash,
                this._outputChannel
              );

              this.sendCommitResultToWebview(
                webviewView,
                analysisPayload,
                this._outputChannel
              );
              this._outputChannel.appendLine(
                "✅ Committed analysis completed and sent to webview"
              );
            } catch (error: any) {
              this.logError("Error during commit analysis", error, true);
            }
          } else {
            this.logError(
              "Missing commit hash or repository information.",
              undefined,
              true
            );
          }
          break;
        }

        case "requestUncommittedAnalysis": {
          // Call the function to analyze uncommitted changes
          try {
            this._outputChannel.appendLine(
              "🔎 Starting uncommitted changes analysis"
            );
            const analysisPayload = await analyzeUncommittedChanges1(
              this._outputChannel
            );
            this.sendUncommitedchangesToWebview(
              webviewView,
              analysisPayload,
              this._outputChannel
            );
            this._outputChannel.appendLine(
              "✅ Uncommitted analysis completed and sent to webview"
            );
          } catch (error: any) {
            this.logError("Uncommitted analysis failed", error, true);
          }

          // Call the function to analyze uncommitted changes
          try {
            const analysisPayload = await analyzeUncommittedChanges1(
              this._outputChannel
            );
            this.sendUncommitedchangesToWebview(
              webviewView,
              analysisPayload,
              this._outputChannel
            );
          } catch (error: any) {
            window.showErrorMessage(
              `Commit analysis failed: ${error?.message || error}`
            );
          }

          break;
        }
        case "requestUserData": {
          const userDataJson =
            this.extensionContext.globalState.get<string>("userData");

          const themeKind = vscode.window.activeColorTheme.kind;

          const response = {
            command: "userDataResponse",
            user: null,
          };

          if (userDataJson) {
            try {
              response.user = JSON.parse(userDataJson);
            } catch (error) { }
          }

          this._outputChannel.appendLine(
            `👤 User data requested. Present: ${!!response.user}`
          );
          // Reply only to the requesting webview to avoid duplicate broadcasts
          webviewView.webview.postMessage(response);
          break;
        }

        case "requestTheme": {
          const themeKind = vscode.window.activeColorTheme.kind;

          // Determine the theme mode
          let themeMode = "light";
          if (themeKind === vscode.ColorThemeKind.Dark) {
            themeMode = "dark";
          }
          // Send theme mode to webview
          this.webview?.webview.postMessage({
            command: "themeResponse",
            theme: themeMode,
          });
          this._outputChannel.appendLine(
            `🎨 Theme requested. Current: ${themeMode}`
          );

          // Listen for theme changes (register once per webview instance)
          if (!this._themeChangeDisposable) {
            this._themeChangeDisposable =
              vscode.window.onDidChangeActiveColorTheme((e) => {
                let newThemeMode = "light";
                if (e.kind === vscode.ColorThemeKind.Dark) {
                  newThemeMode = "dark";
                }

                this.webview?.webview.postMessage({
                  command: "themeResponse",
                  theme: newThemeMode,
                });
                this._outputChannel.appendLine(
                  `🎨 Theme changed. New: ${newThemeMode}`
                );
              });
            this.extensionContext.subscriptions.push(
              this._themeChangeDisposable
            );
          }

          break;
        }

        case "showNotification": {
          const { text, error } = data;
          
          if (error) {
            vscode.window.showErrorMessage(text);
          } else {
            vscode.window.showInformationMessage(text);
          }
          
          this._outputChannel.appendLine(
            `📢 Notification: ${text}`
          );
          break;
        }
        case "storeUser": {
          const user = data.user;
          // Store the entire user object as a JSON string in globalState
          this.extensionContext.globalState.update(
            "userData",
            JSON.stringify(user)
          );
          this._outputChannel.appendLine(
            `💾 Stored user data with keys: ${user ? Object.keys(user).join(", ") : "<none>"
            }`
          );
          break;
        }
        case "updateLogoutState": {
          // Store the entire user object as a JSON string in globalState
          commands.executeCommand("setContext", "userIsLoggedIn", true);
          const existingCommands = await commands.getCommands(true);
          if (
            !existingCommands.includes("codesherlock-vs-integration-ui.logout")
          ) {
            const logoutCommand = commands.registerCommand(
              "codesherlock-vs-integration-ui.logout",
              async () => {
                try {
                  const result = await window.showInformationMessage(
                    "Are you sure you want to logout?",
                    { modal: true },
                    "Logout"
                  );

                  if (result === "Logout") {
                    // Retrieve user data from globalState
                    const userDataJson =
                      this.extensionContext.globalState.get<string>("userData");

                    // Clear user-related data from globalState
                    if (this.webview) {
                      this.webview.webview.postMessage({
                        command: "logout",
                        user: userDataJson ? JSON.parse(userDataJson) : null, // Send user data to React
                      });
                    }
                    this._outputChannel.appendLine(
                      "🚪 Logout initiated by user"
                    );
                  }
                } catch (error: any) {
                  this.logError("Failed to logout", error, true);
                }
              }
            );

            this.extensionContext.subscriptions.push(logoutCommand);
            this._outputChannel.appendLine("🔓 Logout command registered");
          }

          break;
        }

        case "logout": {
          if (data.text === "logoutSuccess") {
            this.extensionContext.globalState.update("userData", undefined);
            commands.executeCommand("setContext", "userIsLoggedIn", false);
            window.showInformationMessage("Logged out successfully!");
            this._outputChannel.appendLine("✅ Logout successful");
          } else {
            window.showInformationMessage("Failed to logout.Please try again.");
            this._outputChannel.appendLine(
              "⚠️ Logout response indicated failure"
            );
          }
          break;
        }
        case "insertCode": {
          const editor = window.activeTextEditor;
          if (editor) {
            const position = editor.selection.active;
            editor.edit((editBuilder) => {
              editBuilder.insert(position, data.text);
            });
            this._outputChannel.appendLine(
              `✍️ Inserted code at ${position.line}:${position.character
              } (length=${(data.text || "").length})`
            );
          }
          break;
        }
        case "requestFileInfo": {
          const activeEditor = window.activeTextEditor;

          if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            const fileContent = activeEditor.document.getText();

            webviewView.webview.postMessage({
              command: "fileContentResponse",
              filePath: filePath,
              fileContent: fileContent,
            });
            this._outputChannel.appendLine(
              `📄 Provided file info: ${filePath} (chars=${fileContent.length})`
            );
          } else {
            webviewView.webview.postMessage({
              command: "fileContentResponse",
              filePath: "",
              fileContent: "",
            });
            this._outputChannel.appendLine(
              "📄 File info requested but no active editor"
            );
          }
          break;
        }

        case "openMarkdown":
          this._outputChannel.appendLine(
            `📘 Opening markdown preview: ${data?.name || "<untitled>"}`
          );
          await vscode.commands.executeCommand(
            "extension.openMarkdownPreview",
            data.name,
            data.text
          );
          break;
        case "requestGitInfo": {
          try {
            const gitExtension =
              vscode.extensions.getExtension("vscode.git")?.exports;
            const api = gitExtension?.getAPI(1);
            const repo = api?.repositories[0];

            if (repo) {
              const remoteUrl = repo.state.remotes[0]?.fetchUrl || "";
              let organization = "";
              let repository = "";

              const match = remoteUrl.match(
                /[:\/]([^\/]+)\/([^\/.]+)(?:\.git)?$/
              );
              if (match) {
                organization = match[1];
                repository = match[2];
              }

              // Get the latest commit hash
              const latestCommitHash = repo.state.HEAD?.commit || "";

              webviewView.webview.postMessage({
                command: "gitInfoResponse",
                organization,
                repository,
                latestCommitHash, // Add the commit hash to the response
              });
              this._outputChannel.appendLine(
                `🔗 Git info provided: ${organization}/${repository} @ ${latestCommitHash}`
              );
            } else {
              webviewView.webview.postMessage({
                command: "gitInfoResponse",
                organization: "",
                repository: "",
                latestCommitHash: "",
                error: "No Git repository found.",
              });
              this._outputChannel.appendLine(
                "⚠️ No Git repository found while requesting git info"
              );
            }
          } catch (err: any) {
            webviewView.webview.postMessage({
              command: "gitInfoResponse",
              organization: "",
              repository: "",
              latestCommitHash: "",
              error: err.message,
            });
            this.logError("Error while fetching git info", err);
          }
          break;
        }
        case "signUp":
          this._outputChannel.appendLine(`🔗 Opening external signup URL`);
          vscode.env.openExternal(vscode.Uri.parse(data.url));
          return;

        case "ready":
          if (this.sendOnReady && this.pendingMessage && this.webview) {
            window.showInformationMessage("Webview is ready, sending pending message...");
            window.showInformationMessage(JSON.stringify(this.pendingMessage, null, 2));
            webviewView.webview.postMessage(this.pendingMessage);
            this.pendingMessage = null;
            this.sendOnReady = false; // reset so normal opens don't trigger sends
          }

      }
    });
  }

  startPollingForStateChanges() {
    // Initialize last known state
    this.lastKnownUserData =
      this.extensionContext.globalState.get<string>("userData");

    // Set up an interval to poll for changes
    this.pollingInterval = setInterval(() => {
      const currentUserData =
        this.extensionContext.globalState.get<string>("userData");

      // Check if user data has changed
      if (this.lastKnownUserData !== currentUserData) {
        this.lastKnownUserData = currentUserData; // Update last known state

        // Broadcast change to all webviews
        SidebarWebViewProvider.broadcastToAllWebviews({
          command: "userDataResponse",
          user: currentUserData ? JSON.parse(currentUserData) : null,
        });
        this._outputChannel.appendLine(
          "🔄 Detected user data change and broadcasted to all webviews"
        );
      }
    }, 2000); // Poll every 2 seconds

    //Clear interval on disposal to avoid memory leaks
    this.extensionContext.subscriptions.push({
      dispose: () => clearInterval(this.pollingInterval!),
    });
    this._outputChannel.appendLine(
      "⏱️ Started polling for state changes (userData)"
    );
  }

  static broadcastToAllWebviews(message: any) {
    SidebarWebViewProvider.instances.forEach((instance) => {
      if (instance.webview) {
        instance.webview.webview.postMessage(message);
      }
    });
  }

  // Sends the current file content to the webview
  private sendFileContentToWebview(editor: any) {
    const document = editor.document;
    const filePath = document.uri.fsPath;
    const fileContent = document.getText();

    if (this.webview) {
      this.webview.webview.postMessage({
        command: "fileContentResponse",
        filePath: filePath,
        fileContent: fileContent,
      });
    }
  }

  public async sendAnalysisResultToWebview(
    editor: any,
    analysisPayload?: any,
    commit: boolean = false,
    trigger: boolean = false,
    op?: vscode.OutputChannel
  ) {
    // vscode.window.showInformationMessage("Sending analysis result to webview...");
    const document = editor.document;
    this.pendingMessage = {
      command: "analyzecommitContentResponse",
      ...(analysisPayload && { analysis: analysisPayload }),
      commit,
      trigger,
    };

    this.sendOnReady = true; // only send when opened via command

    // ✅ Ask for readiness (if already open, webview will answer)
    this.webview?.webview.postMessage({ command: "requestReady" });
  }

  public sendCommitResultToWebview(
    editor: any,
    analysisPayload?: any,
    op?: vscode.OutputChannel
  ) {
    const document = editor.document;
    if (this.webview) {
      const logMsg =
        "DEBUG: analysisPayload (committed) = " +
        JSON.stringify(
          analysisPayload
            ? {
              keys: Object.keys(analysisPayload || {}),
              preview: String(analysisPayload).slice(0, 200),
            }
            : null,
          null,
          2
        );
      if (op && typeof op.appendLine === "function") {
        op.appendLine(logMsg);
      }
      this._outputChannel.appendLine(
        "📤 Sending committed analysis payload to webview"
      );

      this.webview.webview.postMessage({
        command: "commitContentResponse",
        ...(analysisPayload && { analysis: analysisPayload }),
      });
    }
  }

  public sendUncommitedchangesToWebview(
    editor: any,
    analysisPayload?: any,
    op?: vscode.OutputChannel
  ) {
    const document = editor.document;
    if (this.webview) {
      const logMsg =
        "DEBUG: analysisPayload = " + JSON.stringify(analysisPayload, null, 2);
      if (op && typeof op.appendLine === "function") {
        op.appendLine(logMsg);
      } else {
        console.log(logMsg); // fallback to console
      }
      this._outputChannel.appendLine(
        "📤 Sending uncommitted analysis payload to webview"
      );

      this.webview.webview.postMessage({
        command: "uncommitContentResponse",
        ...(analysisPayload && { analysis: analysisPayload }),
      });
    }
  }

  // private async openMarkdownPreview(title: string, markdownContent: string) {
  //   const activeEditor = vscode.window.activeTextEditor;

  //   // Create in-memory markdown document
  //   const document = await vscode.workspace.openTextDocument({
  //     language: "markdown",
  //     content: markdownContent,
  //   });

  //   // Check if ViewColumn.Two is already in use
  //   const existingColumnTwo = vscode.window.visibleTextEditors.find(
  //     (editor) => editor.viewColumn === vscode.ViewColumn.Two
  //   );

  //   // Only trigger the preview if it's not already open in column two
  //   if (!existingColumnTwo) {
  //     await vscode.commands.executeCommand(
  //       "markdown.showPreviewToSide",
  //       document.uri
  //     );
  //   } else {
  //     // Just show the new markdown content in the same preview
  //     await vscode.commands.executeCommand(
  //       "markdown.showPreview",
  //       document.uri
  //     );
  //   }

  //   // Restore focus to original editor
  //   if (activeEditor) {
  //     await vscode.window.showTextDocument(activeEditor.document, {
  //       viewColumn: activeEditor.viewColumn,
  //       selection: activeEditor.selection,
  //       preserveFocus: false,
  //     });
  //   }
  // }

  private async openMarkdownPreview(title: string, markdownContent: string) {
    const encodedContent = encodeURIComponent(markdownContent);
    const previewUri = vscode.Uri.parse(
      `markdown-preview://preview/${title}.md?${encodedContent}`
    );

    // Check if ViewColumn.Two is already in use
    const existingColumnTwo = vscode.window.visibleTextEditors.find(
      (editor) => editor.viewColumn === vscode.ViewColumn.Two
    );

    // Only trigger the preview if it's not already open in column two
    if (!existingColumnTwo) {
      await vscode.commands.executeCommand(
        "markdown.showPreviewToSide",
        previewUri
      );
    } else {
      // Just show the new markdown content in the same preview
      await vscode.commands.executeCommand("markdown.showPreview", previewUri);
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getHtmlForWebview(webview: Webview, extensionUri: Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [
      "codesherlock-react-view",
      "build",
      "assets",
      "index.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
      "codesherlock-react-view",
      "build",
      "assets",
      "index.js",
    ]);

    const imageUri = getUri(webview, extensionUri, [
      "codesherlock-react-view",
      "build",
      "images",
      "image.svg",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
style-src 'self' https://*.vscode-cdn.net 'unsafe-inline' https://fonts.googleapis.com; 
font-src https://fonts.gstatic.com; 
script-src 'nonce-${nonce}' ${webview.cspSource};  
img-src ${webview.cspSource} https: data:;  
connect-src 'self' data: ${API_BASE_URL} ${WS_BASE_URL} 
https://js.monitor.azure.com 
https://dc.services.visualstudio.com 
https://eastus-8.in.applicationinsights.azure.com
vscode-resource:;">

              <link rel="stylesheet" type="text/css" href="${stylesUri}">
                <style>
                  body {
                         padding: 0;
                         margin: 0;
                  } 
                </style>
              <title>CodeSherlock</title>
            </head>
            <body>
                <script nonce="${nonce}">
                  window.imageUri = "${imageUri}";
                </script>
              <div id="root"></div>
              <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
            </body>
          </html>
        `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
}
