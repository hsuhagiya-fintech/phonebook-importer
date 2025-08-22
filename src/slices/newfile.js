import { ExtensionContext, window, Disposable } from "vscode";
import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";
import {
  initializeGitWatching,
  waitForRepositories,
  setupRepositoryWatching,
  handleGitAction,
  showCommitAnalysisUI,
  getCommitAnalysisData,
  mapGitStatus,
  getFileContent,
  getPatchData,
  generateAlternativeDiff,
  generateEnhancedDiff,
  // sendToAnalysisPipeline,
  type AnalysisPayload,
  analyzeCommittedChanges,
  analyzeCommittedChanges1,
} from "./vscode-extensionapi";

// Load the .env file
dotenv.config({ path: path.join(__dirname || process.cwd(), "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import { analyzeUncommittedChanges1 } from "./vscode-extensionapi";

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

let commentController: vscode.CommentController;

// ✅ Single, comprehensive Issue interface
interface Issue {
  id: string | null;
  uid: string;
  issue: string;
  issue_code_snippet: string;
  severity: string;
  severity_level: number;
  solution: string;
  solution_code_snippet: string;
  start_line: number;
  end_line: number;
}

interface TrackedIssue {
  issue: Issue;
  originalCode: string[];
  greenLineCount: number;
  redRanges: vscode.Range[];
  greenRanges: vscode.Range[];
  commentThread: vscode.CommentThread; // SINGLE comment thread for both issue & solution
}
const fileIssuesMap = new Map<string, TrackedIssue[]>();

const greenDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(129,184,139,0.5)", // #81b88b with opacity
  isWholeLine: true,
});

const redDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(228,103,107,0.5)", // #e4676b with opacity
  isWholeLine: true,
});

// ✅ SINGLE Comment Decoration
const singleCommentDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(255, 193, 7, 0.1)", // Light yellow background
  isWholeLine: true,
  overviewRulerColor: "rgba(255, 193, 7, 0.8)", // Yellow in ruler
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  border: "1px solid rgba(255, 193, 7, 0.3)",
  borderRadius: "2px",
});
// // 🟠 Issue Comment Decoration
// const issueCommentDecoration = vscode.window.createTextEditorDecorationType({
//   backgroundColor: "rgba(255,165,0,0.2)", // lighter orange
//   isWholeLine: true,
//   overviewRulerColor: "rgba(255,165,0,0.9)",
//   overviewRulerLane: vscode.OverviewRulerLane.Right,
//   border: "1px solid rgba(255,180,80,0.8)",
//   borderRadius: "3px",
//   after: {
//     contentText: " 🔍 ISSUE",
//     color: "rgba(255,140,0,1)", // deeper orange for text
//     fontWeight: "bold",
//     margin: "0 0 0 10px"
//   }
// });

// // ✅ Solution Comment Decoration
// const solutionCommentDecoration = vscode.window.createTextEditorDecorationType({
//   backgroundColor: "rgba(0,128,0,0.2)", // lighter dark green
//   isWholeLine: true,
//   overviewRulerColor: "rgba(0,128,0,0.9)",
//   overviewRulerLane: vscode.OverviewRulerLane.Right,
//   border: "1px solid rgba(60,160,60,0.8)",
//   borderRadius: "3px",
//   after: {
//     contentText: " ✅ SOLUTION",
//     color: "rgba(0,128,0,1)",
//     fontWeight: "bold",
//     margin: "0 0 0 10px"
//   }
// });

// ✅ Global storage for pending issues (not yet applied to files)
const pendingIssuesMap = new Map<string, Issue[]>();

// ✅ Global storage for applied issues with their decorations
const appliedIssuesMap = new Map<string, TrackedIssue[]>();

// ✅ BACKGROUND PROCESSING: Store issues without opening files
export async function processAllIssuesBackground(
  issuesObject: Record<string, Issue[]>,
  op?: vscode.OutputChannel,
  options?: { silent?: boolean }
) {
  op?.appendLine(`\n🎯 PROCESSING ALL ISSUES IN BACKGROUND`);
  op?.appendLine(
    `📋 Total files to process: ${Object.keys(issuesObject).length}`
  );

  const results = {
    totalFiles: 0,
    processedFiles: 0,
    totalIssues: 0,
    backgroundFiles: 0,
    errors: [] as string[],
  };

  for (const [filePath, fileIssues] of Object.entries(issuesObject)) {
    if (!fileIssues || fileIssues.length === 0) {
      op?.appendLine(`⚠️ Skipping ${filePath} - no issues found`);
      continue;
    }

    results.totalFiles++;
    results.totalIssues += fileIssues.length;

    op?.appendLine(`\n📁 Processing file: ${filePath}`);
    op?.appendLine(`📋 Issues in this file: ${fileIssues.length}`);

    try {
      // Resolve file path but don't check if it exists
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        op?.appendLine("❌ No workspace folder found");
        continue;
      }

      let absolutePath: string;
      if (path.isAbsolute(filePath)) {
        absolutePath = filePath;
      } else {
        absolutePath = path.join(workspaceFolder.uri.fsPath, filePath);
      }

      // Check if file is currently open in an editor
      const openEditor = vscode.window.visibleTextEditors.find(
        (editor) =>
          editor.document.uri.fsPath.toLowerCase() ===
          absolutePath.toLowerCase()
      );

      if (openEditor) {
        // File is open - apply highlights immediately
        op?.appendLine(
          `👁️ File is currently open - applying highlights immediately`
        );
try {
    await applyIssuesInteractiveToOpenEditor(openEditor, fileIssues, op);
} catch (error: any) {
    op?.appendLine(`❌ Error applying issues to the open editor: ${error.message}`);
}
        results.processedFiles++;
      } else {
        // File is not open - store for later processing
        op?.appendLine(
          `💾 File not open - storing issues for background processing`
        );
        pendingIssuesMap.set(absolutePath.toLowerCase(), fileIssues);
        results.backgroundFiles++;
      }
    } catch (error: any) {
      const errorMsg = `❌ Error processing ${filePath}: ${error.message}`;
      op?.appendLine(errorMsg);
      results.errors.push(errorMsg);
    }
  }

  // Final summary
  op?.appendLine(`\n📊 BACKGROUND PROCESSING COMPLETE!`);
  op?.appendLine(`✅ Files processed immediately: ${results.processedFiles}`);
  op?.appendLine(`💾 Files stored for background: ${results.backgroundFiles}`);
  op?.appendLine(`📋 Total issues: ${results.totalIssues}`);

  if (results.errors.length > 0) {
    op?.appendLine(`❌ Errors encountered: ${results.errors.length}`);
    results.errors.forEach((error) => op?.appendLine(`   ${error}`));
  }

  // Show user notification (unless silenced)
  if (!options?.silent) {
    vscode.window.showInformationMessage(
      `🎉 Processed ${results.processedFiles} open files, ${results.backgroundFiles} files queued for background processing!`
    );
  }

  return results;
}

export async function applyIssuesInteractiveToOpenEditor(
  editor: vscode.TextEditor,
  issuesParam: Issue[],
  op?: vscode.OutputChannel
) {
  const filePath = editor.document.uri.fsPath;

  op?.appendLine(
    `🚀 Applying issues to open editor: ${path.basename(filePath)}`
  );
  op?.appendLine(`📋 Processing ${issuesParam.length} issues`);

  const tracked: TrackedIssue[] = [];
  const doc = editor.document;

  // Sort issues by start line to apply them from top to bottom
  const sortedIssues = [...issuesParam].sort(
    (a, b) => a.start_line - b.start_line
  );
  op?.appendLine(`🔢 Issues sorted by line number`);

  let lineOffset = 0; // Track how many lines we've added

  for (let i = 0; i < sortedIssues.length; i++) {
    const issue = sortedIssues[i];
    op?.appendLine(
      `\n🔄 Processing issue ${i + 1}/${sortedIssues.length}: ${issue.uid}`
    );

    const adjustedStartLine = issue.start_line - 1 + lineOffset;
    const adjustedEndLine = issue.end_line - 1 + lineOffset;

    op?.appendLine(
      `📍 Original lines: ${issue.start_line}-${issue.end_line}, Adjusted: ${
        adjustedStartLine + 1
      }-${adjustedEndLine + 1}`
    );
// Improved exception handling within the applyIssuesInteractiveToOpenEditor function
try {
    // Creating the comment thread and performing other operations
} catch (error: any) {
    op?.appendLine(`❌ Error processing issue ${issue.uid}: ${error.message}`);
}

    // 🎨 SINGLE comment for both issue and solution
    const commentRange = new vscode.Range(
      adjustedStartLine,
      0,
      adjustedStartLine,
      0
    );
    const commentThread = commentController.createCommentThread(
      doc.uri,
      commentRange,
      []
    );

    // ✅ SINGLE comment with both issue and solution
    // ✅ SINGLE comment with both issue and solution
    commentThread.comments = [
      {
        body: new vscode.MarkdownString(`## 🔍 Issue: ${issue.uid}
**Severity:** ${issue.severity} (Level ${issue.severity_level})

### ❌ Problem:
${issue.issue}

**Lines:** ${issue.start_line}-${issue.end_line}

---

### ✅ Solution:
${issue.solution}

**Action:** Use the Accept/Reject buttons below to apply or dismiss this fix.

*Click the gear icon to toggle visibility*`),
        mode: vscode.CommentMode.Preview,
        author: { name: "CodeSherlock AI" },
      },
    ];

    // ✅ Set to EXPANDED by default with click-to-toggle
    commentThread.collapsibleState =
      vscode.CommentThreadCollapsibleState.Expanded;
    commentThread.canReply = false;

    // Create RED ranges for problematic lines (adjusted for comment offset)
    const redRanges: vscode.Range[] = [];
    for (
      let lineNum = adjustedStartLine;
      lineNum <= adjustedEndLine;
      lineNum++
    ) {
      if (lineNum >= 0 && lineNum < doc.lineCount) {
        redRanges.push(
          new vscode.Range(lineNum, 0, lineNum, doc.lineAt(lineNum).text.length)
        );
      }
    }

    // Insert green solution preview
    const solutionLines = issue.solution_code_snippet.split(/\r?\n/);
    const insertPos = adjustedEndLine + 1;

    await editor.edit((editBuilder: vscode.TextEditorEdit) => {
      const insertText = solutionLines.join("\n") + "\n";
      editBuilder.insert(new vscode.Position(insertPos, 0), insertText);
    });

    // Create GREEN ranges for solution lines
    const greenRanges: vscode.Range[] = [];
    for (
      let lineNum = insertPos;
      lineNum < insertPos + solutionLines.length;
      lineNum++
    ) {
      if (lineNum >= 0 && lineNum < editor.document.lineCount) {
        const lineText = editor.document.lineAt(lineNum).text;
        greenRanges.push(
          new vscode.Range(lineNum, 0, lineNum, lineText.length)
        );
      }
    }

    tracked.push({
      issue,
      originalCode: [],
      greenLineCount: solutionLines.length,
      redRanges,
      greenRanges,
      commentThread, // SINGLE comment thread
    });

    // ✅ Apply all decorations with debugging
    const allRedRanges = tracked.flatMap((t) => t.redRanges);
    const allGreenRanges = tracked.flatMap((t) => t.greenRanges);

    op?.appendLine(`🎨 Applying decorations:`);
    op?.appendLine(`   🔴 Red ranges: ${allRedRanges.length}`);
    op?.appendLine(`   🟢 Green ranges: ${allGreenRanges.length}`);

    editor.setDecorations(redDecoration, allRedRanges);
    editor.setDecorations(greenDecoration, allGreenRanges);

    // Store in applied issues map (persistent across file switches)
    const mapKey = filePath.toLowerCase();
    appliedIssuesMap.set(mapKey, tracked);
    fileIssuesMap.set(mapKey, tracked); // For CodeLens compatibility

    // Remove from pending since it's now applied
    pendingIssuesMap.delete(mapKey);

    vscode.commands.executeCommand("editor.action.codeLens.refresh");
    op?.appendLine(`💾 Stored issues for persistent highlighting`);
  }
}

// // ✅ NEW: Generate issue description comment
// function generateIssueComment(issue: Issue): string[] {
//   return [
//     `// ISSUE: ${issue.uid} - ${issue.severity} Severity`,
//     `// Lines ${issue.start_line}-${issue.end_line}`,
//     `// ${issue.issue}`,
//   ];
// }

// // ✅ NEW: Generate solution description comment
// function generateSolutionComment(issue: Issue): string[] {
//   return [
//     `// SOLUTION: ${issue.uid}`,
//     `// ${issue.solution}`,
//   ];
// }

// ✅ ENHANCED: Restore highlights with collapsed comments
// ✅ ENHANCED: Restore highlights with collapsed comments
export function restoreHighlightsForEditor(
  editor: vscode.TextEditor,
  op?: vscode.OutputChannel
) {
  const filePath = editor.document.uri.fsPath.toLowerCase();
  const appliedIssues = appliedIssuesMap.get(filePath);

  if (appliedIssues && appliedIssues.length > 0) {
    op?.appendLine(
      `🔄 Restoring highlights for: ${path.basename(
        editor.document.uri.fsPath
      )}`
    );

    const allRedRanges = appliedIssues.flatMap((t) => t.redRanges);
    const allGreenRanges = appliedIssues.flatMap((t) => t.greenRanges);

    editor.setDecorations(redDecoration, allRedRanges);
    editor.setDecorations(greenDecoration, allGreenRanges);

    // 🎨 NEW: Restore comment threads in collapsed state
    // 🎨 NEW: Restore comment threads in EXPANDED state
    appliedIssues.forEach((tracked) => {
      if (tracked.commentThread && tracked.commentThread.comments.length > 0) {
        // ✅ FIXED: Keep comments EXPANDED when restoring
        tracked.commentThread.collapsibleState =
          vscode.CommentThreadCollapsibleState.Expanded;
      }
    });

    return true;
  }

  return false;
}

// ✅ CHECK AND APPLY PENDING ISSUES when a file is opened
export async function checkAndApplyPendingIssues(
  editor: vscode.TextEditor,
  op?: vscode.OutputChannel
) {
  const filePath = editor.document.uri.fsPath.toLowerCase();
  const pendingIssues = pendingIssuesMap.get(filePath);

  if (pendingIssues && pendingIssues.length > 0) {
    op?.appendLine(
      `🎯 Found pending issues for newly opened file: ${path.basename(
        editor.document.uri.fsPath
      )}`
    );
    await applyIssuesInteractiveToOpenEditor(editor, pendingIssues, op);
    return true;
  }

  return false;
}
// ✅ MAIN FUNCTION: Apply issues to a specific file (kept for backward compatibility)
export async function applyIssuesInteractive(
  filePath: string,
  issuesParam: Issue[],
  op?: vscode.OutputChannel
) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder is open.");
    op?.appendLine("❌ No workspace folder is open.");
    return;
  }

  op?.appendLine(`🚀 Starting applyIssuesInteractive for file: ${filePath}`);
  op?.appendLine(`📋 Processing ${issuesParam.length} issues`);

  // ✅ Fix: Handle both absolute and relative paths properly
  let absolutePath: string;
  if (path.isAbsolute(filePath)) {
    absolutePath = filePath;
  } else {
    absolutePath = path.join(workspaceFolder.uri.fsPath, filePath);
  }

  op?.appendLine(`📁 Resolved absolute path: ${absolutePath}`);

  const doc = await vscode.workspace.openTextDocument(absolutePath);
  op?.appendLine(`📄 Document opened successfully`);

  let editor = vscode.window.visibleTextEditors.find(
    (e) => e.document.uri.fsPath.toLowerCase() === absolutePath.toLowerCase()
  );

  // Show the document to make the highlights visible
  if (!editor) {
    editor = await vscode.window.showTextDocument(doc, {
      preview: false,
      preserveFocus: false,
    });
    op?.appendLine(`👁️ Document displayed in editor`);
  } else {
    op?.appendLine(`👁️ Document was already open in editor`);
  }

  // Use the new function for open editors
  await applyIssuesInteractiveToOpenEditor(editor, issuesParam, op);
}

// ✅ Enhanced Accept/Reject commands with detailed logging
export function registerIssueCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.acceptIssue",
      async (filePath: string, index: number) => {
        const outputChannel =
          vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.appendLine(`\n🟢 ACCEPT COMMAND TRIGGERED`);
        outputChannel.appendLine(`📁 File: ${filePath}`);
        outputChannel.appendLine(`🔢 Issue index: ${index}`);

        const trackedIssues = fileIssuesMap.get(filePath.toLowerCase());
        if (!trackedIssues || !trackedIssues[index]) {
          outputChannel.appendLine(
            `❌ No tracked issues found for file: ${filePath}`
          );
          return;
        }

        // ✅ DECLARE tracked ONCE at the beginning
        const tracked = trackedIssues[index];
        if (tracked.commentThread) {
          tracked.commentThread.dispose();
        }
        outputChannel.appendLine(
          `✅ Found tracked issue: ${tracked.issue.uid}`
        );

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          outputChannel.appendLine(`❌ No active editor found`);
          return;
        }

        try {
          // Now you can use tracked safely
          const redRanges = tracked.redRanges || [];
          const greenRanges = tracked.greenRanges || [];

          if (redRanges.length === 0 || greenRanges.length === 0) {
            outputChannel.appendLine(
              `❌ Missing red/green ranges for issue ${tracked.issue.uid}`
            );
            return;
          }

          // Compute block bounds
          const blockStartLine = redRanges[0].start.line;
          const blockEndLine = greenRanges[greenRanges.length - 1].end.line;

          const doc = editor.document;
          const blockStartPos = new vscode.Position(blockStartLine, 0);
          const blockEndPos =
            blockEndLine + 1 < doc.lineCount
              ? new vscode.Position(blockEndLine + 1, 0)
              : doc.lineAt(blockEndLine).rangeIncludingLineBreak.end;

          const oldBlockLineCount = redRanges.length + greenRanges.length;
          const newBlockLineCount = tracked.greenLineCount;
          const delta = newBlockLineCount - oldBlockLineCount;

          outputChannel.appendLine(
            `📍 Replacing block ${blockStartLine + 1}..${
              blockEndLine + 1
            } (old lines: ${oldBlockLineCount}, new lines: ${newBlockLineCount}, delta: ${delta})`
          );

          await editor.edit((editBuilder) => {
            editBuilder.replace(
              new vscode.Range(blockStartPos, blockEndPos),
              tracked.issue.solution_code_snippet + "\n"
            );
          });

          outputChannel.appendLine(`✅ Code replacement completed`);

          // Adjust remaining tracked issues and update decorations
          finalizeAfterIssueEdit(editor, filePath, index, [
            {
              startLine: blockStartLine,
              oldLines: oldBlockLineCount,
              newLines: newBlockLineCount,
            },
          ]);

          outputChannel.appendLine(
            `🎉 Successfully applied fix for issue: ${tracked.issue.uid}`
          );
          vscode.window.showInformationMessage(
            `✅ Applied fix for issue: ${tracked.issue.uid}`
          );
        } catch (error: any) {
          outputChannel.appendLine(`❌ Error applying fix: ${error.message}`);
          vscode.window.showErrorMessage(
            `Error applying fix: ${error.message}`
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.rejectIssue",
      async (filePath: string, index: number) => {
        const outputChannel =
          vscode.window.createOutputChannel("CodeSherlockAI");
        // Defer logging until after user confirmation to avoid confusion

        const trackedIssues = fileIssuesMap.get(filePath.toLowerCase());
        if (!trackedIssues || !trackedIssues[index]) {
          outputChannel.appendLine(
            `❌ Reject: No tracked issues found for file: ${filePath}`
          );
          return;
        }

        const tracked = trackedIssues[index];

        if (tracked.commentThread) {
          tracked.commentThread.dispose();
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          outputChannel.appendLine(`❌ Reject: No active editor found`);
          return;
        }

        // Extra safety: ensure the active editor is the same file as the command target
        const activeFile = editor.document.uri.fsPath.toLowerCase();
        if (activeFile !== filePath.toLowerCase()) {
          outputChannel.appendLine(
            `⚠️ Reject: Active editor does not match target file. Aborting.`
          );
          outputChannel.appendLine(`   Active: ${activeFile}`);
          outputChannel.appendLine(`   Target: ${filePath.toLowerCase()}`);
          return;
        }

        // Confirm with the user to avoid accidental triggers
        const confirm = await vscode.window.showInformationMessage(
          `Reject solution for issue ${tracked.issue.uid}?`,
          // { modal: true },
          "Reject"
        );
        if (confirm !== "Reject") {
          outputChannel.appendLine(`ℹ️ Reject cancelled by user`);
          return;
        }

        // Now log that the reject command is truly executing
        outputChannel.appendLine(
          `\n🔴 REJECT COMMAND TRIGGERED @ ${new Date().toISOString()}`
        );
        outputChannel.appendLine(`📁 File: ${filePath}`);
        outputChannel.appendLine(`🔢 Issue index: ${index}`);
        outputChannel.appendLine(
          `✅ Found tracked issue: ${tracked.issue.uid}`
        );

        try {
          // Reject: keep the original (red) code, remove solution (green) and both comments
          const issueCommentRanges: vscode.Range[] = [];
          const greenRanges = tracked.greenRanges || [];

          const deletions: { startLine: number; endLine: number }[] = [];

          if (greenRanges.length > 0) {
            deletions.push({
              startLine: greenRanges[0].start.line,
              endLine: greenRanges[greenRanges.length - 1].end.line,
            });
          }
          if (issueCommentRanges.length > 0) {
            deletions.push({
              startLine: issueCommentRanges[0].start.line,
              endLine:
                issueCommentRanges[issueCommentRanges.length - 1].end.line,
            });
          }

          // Compute the earliest line to figure out where to shift from, and total deleted lines
          const blockStartLine =
            deletions.length > 0
              ? Math.min(...deletions.map((d) => d.startLine))
              : 0;
          const totalDeletedLines = deletions.reduce(
            (acc, d) => acc + (d.endLine - d.startLine + 1),
            0
          );

          outputChannel.appendLine(
            `📍 Reject: deleting ${deletions.length} blocks, total lines: ${totalDeletedLines}`
          );

          if (deletions.length > 0) {
            const doc = editor.document;
            await editor.edit((editBuilder) => {
              // Delete from bottom to top to avoid interfering ranges within the single edit batch
              deletions
                .sort((a, b) => b.startLine - a.startLine)
                .forEach(({ startLine, endLine }) => {
                  const startPos = new vscode.Position(startLine, 0);
                  const endPos =
                    endLine + 1 < doc.lineCount
                      ? new vscode.Position(endLine + 1, 0)
                      : doc.lineAt(endLine).rangeIncludingLineBreak.end;
                  editBuilder.delete(new vscode.Range(startPos, endPos));
                });
            });

            outputChannel.appendLine(
              `✅ Rejected solution — removed comments and green lines`
            );

            // After deletion, adjust remaining issues and update decorations
            // Build segments for each deletion block
            const segments = deletions
              .sort((a, b) => a.startLine - b.startLine)
              .map(({ startLine, endLine }) => ({
                startLine,
                oldLines: endLine - startLine + 1,
                newLines: 0,
              }));
            finalizeAfterIssueEdit(editor, filePath, index, segments);

            outputChannel.appendLine(
              `🎉 Successfully rejected fix for issue: ${tracked.issue.uid}`
            );
            vscode.window.showInformationMessage(
              `❌ Rejected fix for issue: ${tracked.issue.uid}`
            );
          }
        } catch (error: any) {
          outputChannel.appendLine(`❌ Error rejecting fix: ${error.message}`);
          vscode.window.showErrorMessage(
            `Error rejecting fix: ${error.message}`
          );
        }
      }
    )
  );
}

// ✅ Helper function to remove issue from tracking and update decorations
function removeIssueFromTracking(
  editor: vscode.TextEditor,
  filePath: string,
  index: number
) {
  const trackedIssues = fileIssuesMap.get(filePath.toLowerCase());
  if (!trackedIssues) return;

  // Remove the issue at the specified index
  trackedIssues.splice(index, 1);

  // Update the map
  fileIssuesMap.set(filePath.toLowerCase(), trackedIssues);

  // Reapply decorations for remaining issues
  const allRedRanges = trackedIssues.flatMap((t) => t.redRanges);
  const allGreenRanges = trackedIssues.flatMap((t) => t.greenRanges);

  editor.setDecorations(redDecoration, allRedRanges);
  editor.setDecorations(greenDecoration, allGreenRanges);

  // Refresh CodeLens
  vscode.commands.executeCommand("editor.action.codeLens.refresh");
}

// Shift remaining tracked issues after an edit so their ranges stay aligned with the document
function finalizeAfterIssueEdit(
  editor: vscode.TextEditor,
  filePath: string,
  removedIndex: number,
  segments: { startLine: number; oldLines: number; newLines: number }[]
) {
  const mapKey = filePath.toLowerCase();
  const trackedIssues = fileIssuesMap.get(mapKey);
  if (!trackedIssues) return;

  // Remove the processed issue
  trackedIssues.splice(removedIndex, 1);

  // Helper to shift a range by a provided delta lines
  const shiftRangeByDelta = (r: vscode.Range, delta: number): vscode.Range => {
    const start = new vscode.Position(r.start.line + delta, r.start.character);
    const end = new vscode.Position(r.end.line + delta, r.end.character);
    return new vscode.Range(start, end);
  };

  // Normalize and sort segments by start line
  const ordered = [...segments].sort((a, b) => a.startLine - b.startLine);

  // Shift ranges for issues based on cumulative deltas of prior segments
  for (const t of trackedIssues) {
    const firstLine = Math.min(
      ...[
        t.redRanges?.[0]?.start.line ?? Number.MAX_SAFE_INTEGER,
        t.greenRanges?.[0]?.start.line ?? Number.MAX_SAFE_INTEGER,
      ]
    );

    let cumulativeDelta = 0;
    for (const seg of ordered) {
      const segEndBefore = seg.startLine + seg.oldLines - 1;
      if (firstLine > segEndBefore) {
        cumulativeDelta += seg.newLines - seg.oldLines;
      }
    }

    if (cumulativeDelta !== 0) {
      t.redRanges = (t.redRanges || []).map((r) =>
        shiftRangeByDelta(r, cumulativeDelta)
      );
      t.greenRanges = (t.greenRanges || []).map((r) =>
        shiftRangeByDelta(r, cumulativeDelta)
      );
    }
  }

  // Update map
  fileIssuesMap.set(mapKey, trackedIssues);

  // Re-apply decorations based on updated ranges
  const allRedRanges = trackedIssues.flatMap((t) => t.redRanges);
  const allGreenRanges = trackedIssues.flatMap((t) => t.greenRanges);

  editor.setDecorations(redDecoration, allRedRanges);
  editor.setDecorations(greenDecoration, allGreenRanges);

  vscode.commands.executeCommand("editor.action.codeLens.refresh");
}

// ✅ ENHANCED: Much better Accept/Reject button UI
export class IssueCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const filePath = document.uri.fsPath.toLowerCase();
    const trackedIssues = fileIssuesMap.get(filePath);
    if (!trackedIssues) return [];

    const lenses: vscode.CodeLens[] = [];

    trackedIssues.forEach((tracked, index) => {
      const greenRanges = tracked.greenRanges;
      if (greenRanges.length > 0) {
        const lastGreenRange = greenRanges[greenRanges.length - 1];
        const lensLine = Math.min(
          document.lineCount - 1,
          lastGreenRange.end.line + 1
        );
        const range = new vscode.Range(lensLine, 0, lensLine, 0);

        // 🎨 ENHANCED: Much better Accept button
        lenses.push(
          new vscode.CodeLens(range, {
            title: "$(check) ✅ Accept Solution",
            command: "extension.acceptIssue",
            arguments: [filePath, index],
            tooltip: `Apply the suggested fix for issue: ${tracked.issue.uid}`,
          })
        );

        // 🎨 ENHANCED: Much better Reject button
        lenses.push(
          new vscode.CodeLens(range, {
            title: "$(x) ❌ Reject Solution",
            command: "extension.rejectIssue",
            arguments: [filePath, index],
            tooltip: `Dismiss the suggested fix for issue: ${tracked.issue.uid}`,
          })
        );
      }
    });

    return lenses;
  }
}

// ✅ NEW: Command to toggle individual comment visibility
export function registerCommentToggleCommands(
  context: vscode.ExtensionContext
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.toggleIssueComment",
      (threadId: string) => {
        // Find the comment thread by ID and toggle it
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const filePath = editor.document.uri.fsPath.toLowerCase();
        const appliedIssues = appliedIssuesMap.get(filePath);

        if (appliedIssues) {
          appliedIssues.forEach((tracked) => {
            if (tracked.commentThread && tracked.issue.uid === threadId) {
              const currentState = tracked.commentThread.collapsibleState;
              tracked.commentThread.collapsibleState =
                currentState === vscode.CommentThreadCollapsibleState.Collapsed
                  ? vscode.CommentThreadCollapsibleState.Expanded
                  : vscode.CommentThreadCollapsibleState.Collapsed;
            }
          });
        }
      }
    )
  );
}

// ✅ Helper functions
async function tryFindByBasenameAcrossWorkspace(
  basename: string
): Promise<string | null> {
  const matches = await vscode.workspace.findFiles(
    `**/${basename}`,
    "**/node_modules/**",
    5
  );
  if (matches.length > 0) return matches[0].fsPath;
  return null;
}

async function ensureFileExists(fsPath: string): Promise<string> {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(fsPath));
    return fsPath;
  } catch {
    const fallback = await tryFindByBasenameAcrossWorkspace(
      path.basename(fsPath)
    );
    if (fallback) return fallback;
    throw new Error(`Unable to resolve nonexistent file '${fsPath}'`);
  }
}

function normalizeAndJoinSegments(p: string): string {
  const parts = p
    .split(/[\\/]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.join(path.sep);
}

async function resolveFilePath(filePath: string): Promise<string> {
  const clean = normalizeAndJoinSegments(filePath);

  if (path.isAbsolute(clean)) {
    return await ensureFileExists(clean);
  }

  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    throw new Error("No workspace folder found");
  }

  const abs = path.join(folders[0].uri.fsPath, clean);
  return await ensureFileExists(abs);
}

// ✅ Simplified function - no auto file creation, just error if file doesn't exist
async function ensureFileExistsForProcessing(
  filePath: string,
  op?: vscode.OutputChannel
): Promise<string | null> {
  try {
    // Only try to resolve existing files - no creation
    const resolvedPath = await resolveFilePath(filePath);
    op?.appendLine(`✅ File exists: ${resolvedPath}`);
    return resolvedPath;
  } catch (error: any) {
    // File doesn't exist - just log error, don't create
    const errorMsg = `❌ File not found: ${filePath} - ${error.message}`;
    op?.appendLine(errorMsg);
    return null;
  }
}

// ✅ NEW: Main function to process the entire issues object
export async function processAllIssues(
  issuesObject: Record<string, Issue[]>,
  opParam?: vscode.OutputChannel
) {
  opParam?.appendLine(`\n🎯 PROCESSING ALL ISSUES`);
  opParam?.appendLine(
    `📋 Total files to process: ${Object.keys(issuesObject).length}`
  );

  const results = {
    totalFiles: 0,
    processedFiles: 0,
    totalIssues: 0,
    processedIssues: 0,
    errors: [] as string[],
  };

  for (const [filePath, fileIssues] of Object.entries(issuesObject)) {
    if (!fileIssues || fileIssues.length === 0) {
      opParam?.appendLine(`⚠️ Skipping ${filePath} - no issues found`);
      continue;
    }

    results.totalFiles++;
    results.totalIssues += fileIssues.length;

    opParam?.appendLine(`\n📁 Processing file: ${filePath}`);
    opParam?.appendLine(`📋 Issues in this file: ${fileIssues.length}`);

    try {
      // Only try to resolve existing files - no auto-creation
      const resolvedPath = await ensureFileExistsForProcessing(
        filePath,
        opParam
      );

      if (resolvedPath) {
        await applyIssuesInteractive(resolvedPath, fileIssues, opParam);
        results.processedFiles++;
        results.processedIssues += fileIssues.length;

        opParam?.appendLine(
          `✅ Successfully processed ${filePath} with ${fileIssues.length} issues`
        );
      } else {
        const errorMsg = `❌ File not found: ${filePath} - Please ensure the file exists in your workspace`;
        opParam?.appendLine(errorMsg);
        results.errors.push(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = `❌ Error processing ${filePath}: ${error.message}`;
      opParam?.appendLine(errorMsg);
      results.errors.push(errorMsg);
    }

    // Add small delay to prevent overwhelming VS Code
    await new Promise<void>((resolve) => global.setTimeout(resolve, 100));
  }

  // Final summary
  opParam?.appendLine(`\n📊 PROCESSING COMPLETE!`);
  opParam?.appendLine(
    `✅ Files processed: ${results.processedFiles}/${results.totalFiles}`
  );
  opParam?.appendLine(
    `✅ Issues processed: ${results.processedIssues}/${results.totalIssues}`
  );

  if (results.errors.length > 0) {
    opParam?.appendLine(`❌ Errors encountered: ${results.errors.length}`);
    results.errors.forEach((error) => opParam?.appendLine(`   ${error}`));
  }

  // Show user notification
  if (results.processedFiles > 0) {
    vscode.window.showInformationMessage(
      `🎉 Processed ${results.processedFiles} files with ${results.processedIssues} issues! Check your editor for red/green highlights.`
    );
  } else {
    vscode.window.showWarningMessage(
      `⚠️ No files could be processed. Please check that the files exist in your workspace.`
    );
  }

  return results;
}

// ✅ Create a test file function with proper error handling
async function createTestFileIfNeeded(
  op: vscode.OutputChannel
): Promise<string | null> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    op.appendLine("❌ No workspace folder found");
    return null;
  }

  const testFilePath = path.join(
    workspaceFolder.uri.fsPath,
    "src",
    "components",
    "FileUpload.js"
  );
  const testFileUri = vscode.Uri.file(testFilePath);

  try {
    // Check if file exists
    await vscode.workspace.fs.stat(testFileUri);
    op.appendLine(`✅ File exists: ${testFilePath}`);
    return "src/components/FileUpload.js";
  } catch {
    // File doesn't exist, create it
    op.appendLine(`📁 Creating directories and test file: ${testFilePath}`);

    try {
      // Create directories
      const dirUri = vscode.Uri.file(path.dirname(testFilePath));
      await vscode.workspace.fs.createDirectory(dirUri);

      // Create test file content
      const testContent = `// Test file for CodeSherlock extension
import React from 'react';

const FileUpload = () => {
  // This is a test component
  try {
    const res = await analyzeUncommittedChanges1(op);
    op.appendLine("✅ Uncommitted Analysis response:\\n" + JSON.stringify(res, null, 2));
  } catch (err: any) {
    op.appendLine("❌ Error during Uncommitted Analysis:\\n" + err?.message || JSON.stringify(err));
  }

  return (
    <div>
      <h1>File Upload Component</h1>
      <input type="file" />
    </div>
  );
};

export default FileUpload;
`;

      // Write file
      await vscode.workspace.fs.writeFile(
        testFileUri,
        Buffer.from(testContent, "utf8")
      );
      op.appendLine(`✅ Created test file: ${testFilePath}`);
      return "src/components/FileUpload.js";
    } catch (createError) {
      op.appendLine(`❌ Error creating test file: ${createError}`);
      return null;
    }
  }
}

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

  // 🎨 NEW: Initialize comment controller for issue/solution descriptions
  commentController = vscode.comments.createCommentController(
    "codesherlock-issues",
    "CodeSherlock Issues"
  );
  context.subscriptions.push(commentController);

  registerWebViewProvider(context, op);
  registerMarkdownContentProvider(context);
  registerPreviewCommand(context);

  //added
  const machineId = vscode.env.machineId;

  // Check if the device ID has already been logged
  const hasLoggedDevice = context.globalState.get<boolean>("hasLoggedDevice");

  if (!hasLoggedDevice) {
    await context.globalState.update("hasLoggedDevice", true);
    // Log successful API call
    appInsights?.trackTrace({
      message: "User installed an CodeSherlock.ai extension",
      properties: { machineId, vs_code: true },
      severityLevel: 0,
    });
  }

  registerIssueCommands(context); // needed for Accept/Reject to run
  registerCommentToggleCommands(context); // ✅ NEW: Add this line
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { scheme: "file" },
      new IssueCodeLensProvider()
    )
  );

  // ✅ Register event listeners for background processing
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(
      async (editor: vscode.TextEditor | undefined) => {
        if (editor) {
          const outputChannel =
            vscode.window.createOutputChannel("CodeSherlockAI");

          // First try to restore existing highlights
          const restored = restoreHighlightsForEditor(editor, outputChannel);

          if (!restored) {
            // No existing highlights, check for pending issues
            await checkAndApplyPendingIssues(editor, outputChannel);
          }
        }
      }
    )
  );

  // ✅ Register the main BACKGROUND command to process issues object
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.processIssuesBackground",
      async (issuesObject: Record<string, Issue[]>) => {
        const outputChannel =
          vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.show();

        if (!issuesObject || Object.keys(issuesObject).length === 0) {
          outputChannel.appendLine(
            "❌ No issues object provided or empty object"
          );
          vscode.window.showErrorMessage("No issues to process");
          return;
        }

        outputChannel.appendLine(
          "🚀 Processing issues object in background..."
        );
        const results = await processAllIssuesBackground(
          issuesObject,
          outputChannel
        );

        return results;
      }
    )
  );

  // ✅ New: Register a silent background command for incremental per-file updates
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.processIssuesBackgroundSilent",
      async (issuesObject: Record<string, Issue[]>) => {
        const outputChannel =
          vscode.window.createOutputChannel("CodeSherlockAI");
        if (!issuesObject || Object.keys(issuesObject).length === 0) {
          outputChannel.appendLine(
            "❌ No issues object provided or empty object (silent)"
          );
          return;
        }
        outputChannel.appendLine(
          "🤫 Processing issues object silently in background..."
        );
        const results = await processAllIssuesBackground(
          issuesObject,
          outputChannel,
          { silent: true }
        );
        return results;
      }
    )
  );

  // ✅ Register the main command to process issues object (original - opens files)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.processIssues",
      async (issuesObject: Record<string, Issue[]>) => {
        const outputChannel =
          vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.show();

        if (!issuesObject || Object.keys(issuesObject).length === 0) {
          outputChannel.appendLine(
            "❌ No issues object provided or empty object"
          );
          vscode.window.showErrorMessage("No issues to process");
          return;
        }

        outputChannel.appendLine("🚀 Processing issues object...");
        const results = await processAllIssues(issuesObject, outputChannel);

        return results;
      }
    )
  );

  // ✅ Register a test highlighting command for debugging
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.testHighlighting",
      async () => {
        const outputChannel =
          vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.show();

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          outputChannel.appendLine("❌ No active editor found");
          vscode.window.showErrorMessage("Please open a file first");
          return;
        }

        outputChannel.appendLine("🧪 Testing highlighting on current file...");

        // Create test decorations on first few lines
        const testRedRanges = [
          new vscode.Range(0, 0, 0, editor.document.lineAt(0).text.length),
          new vscode.Range(1, 0, 1, editor.document.lineAt(1).text.length),
        ];

        const testGreenRanges = [
          new vscode.Range(2, 0, 2, editor.document.lineAt(2).text.length),
          new vscode.Range(3, 0, 3, editor.document.lineAt(3).text.length),
        ];

        editor.setDecorations(redDecoration, testRedRanges);
        editor.setDecorations(greenDecoration, testGreenRanges);

        outputChannel.appendLine(
          "✅ Test highlighting applied to lines 1-2 (red) and 3-4 (green)"
        );
        outputChannel.appendLine(
          "👀 If you can see the highlighting, the decorations are working!"
        );

        vscode.window.showInformationMessage(
          "Test highlighting applied! Check lines 1-4 in your editor."
        );
      }
    )
  );

  //   // ✅ Test the new BACKGROUND processing function
  //   try {
  //     op.appendLine("🔍 Testing background processing function...");

  //     // Sample issues object matching your structure
  //     const issuesObject = {
  //   "src/components/FileUpload.js": [
  //     {
  //       "id": null,
  //       "uid": "RES-100",
  //       "issue": "Inefficient use of environment variables leading to potential resource leaks.",
  //       "issue_code_snippet": "DB_CONFIG = {\n    \"drivername\": \"postgresql+psycopg2\",\n    \"username\": os.getenv(\"DB_USERNAME\"),\n    \"password\": os.getenv(\"DB_PASSWORD\"),\n    \"host\": os.getenv(\"DB_HOST\"),\n    \"port\": int(os.getenv(\"DB_PORT\")),\n    \"database\": os.getenv(\"DB_DATABASE\"),\n}",
  //       "severity": "High",
  //       "severity_level": 3,
  //       "solution": "The current implementation utilizes `os.getenv()` multiple times for fetching environment variables which can lead to performance hits, especially if these environment variables are accessed frequently throughout the application. The environment variable retrieval can be improved by caching fetching results during the initialization phase to reduce redundant calls. This approach enhances both performance and resource utilization, as it mitigates the overhead of multiple lookups.",
  //       "solution_code_snippet": "# Caching environment variables\nDB_USERNAME = os.getenv(\"DB_USERNAME\")\nDB_PASSWORD = os.getenv(\"DB_PASSWORD\")\nDB_HOST = os.getenv(\"DB_HOST\")\nDB_PORT = os.getenv(\"DB_PORT\")\nDB_DATABASE = os.getenv(\"DB_DATABASE\")\n\nDB_CONFIG = {\n    \"drivername\": \"postgresql+psycopg2\",\n    \"username\": DB_USERNAME,\n    \"password\": DB_PASSWORD,\n    \"host\": DB_HOST,\n    \"port\": int(DB_PORT) if DB_PORT else None,\n    \"database\": DB_DATABASE,\n}",
  //       "start_line": 59,
  //       "end_line": 66
  //     },
  //     {
  //       id: null,
  //       uid: "EXC-100",
  //       issue: "The code lacks comprehensive exception handling in asynchronous functions, which can lead to unhandled promise rejections and cause the application to crash or exhibit unexpected behavior. For example, many await calls in the `applyIssuesInteractive` function and the message handling in `SidebarWebViewProvider` do not catch potential errors.",
  //       issue_code_snippet: "export async function applyIssuesInteractive(filePath: string, issues: Issue[]) {\n  const originalUri = vscode.Uri.file(filePath);\n  let doc = await vscode.workspace.openTextDocument(originalUri);\n  let text = doc.getText();\n\n  // Sort so we apply from top to bottom\n  issues.sort((a, b) => a.start_line - b.start_line);\n\n  // We'll store applied changes so we can later \"apply all remaining\"\n  const acceptedIssues: Issue[] = [];\n\n  for (const issue of issues) {\n    const originalLines = text.split(/\\r?\\n/);\n    const start = issue.start_line - 1;\n    const end = issue.end_line - 1;\n    const solutionLines = issue.solution_code_snippet.split(/\\r?\\n/);\n\n    // Make a preview with this single fix\n    const previewLines = [...originalLines];\n    previewLines.splice(start, end - start + 1, ...solutionLines);\n    const fixedText = previewLines.join(\"\\n\");\n\n    // Create virtual document for diff preview\n    const scheme = \"codesherlk-fix-preview\";\n    const virtualUri = vscode.Uri.parse(`${scheme}://${issue.uid}/${filePath}`);\n\n    const provider = new (class implements vscode.TextDocumentContentProvider {\n      onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();\n      onDidChange = this.onDidChangeEmitter.event;\n      provideTextDocumentContent(uri: vscode.Uri) {\n        return fixedText;\n      }\n    })();\n\n    const registration = vscode.workspace.registerTextDocumentContentProvider(scheme, provider);\n\n    // Show diff just for this issue\n    await vscode.commands.executeCommand(\n      \"vscode.diff\",\n      originalUri,\n      virtualUri,\n      `Fix Preview: ${issue.uid} (${filePath})`\n    );\n\n    // Ask user for this single fix\n    const choice = await vscode.window.showInformationMessage(\n      `Apply fix for issue ${issue.uid}?`,\n      \"Apply\",\n      \"Skip\"\n    );\n\n    if (choice === \"Apply\") {\n      acceptedIssues.push(issue);\n      text = fixedText; // update base text so subsequent fixes apply on top\n    }\n\n    registration.dispose();\n  }\n\n  // If we have accepted fixes, apply them\n  if (acceptedIssues.length > 0) {\n    const edit = new vscode.WorkspaceEdit();\n    const fullRange = new vscode.Range(\n      doc.positionAt(0),\n      doc.positionAt(doc.getText().length)\n    );\n    edit.replace(originalUri, fullRange, text);\n    await vscode.workspace.applyEdit(edit);\n    await doc.save();\n    vscode.window.showInformationMessage(`Applied ${acceptedIssues.length} fixes to ${filePath}.`);\n  } else {\n    vscode.window.showInformationMessage(`No fixes applied to ${filePath}.`);\n  }\n}",
  //       severity: "High",
  //       "severity_level": 3,
  //       "solution": "To enhance exception handling, wrap asynchronous calls with try-catch blocks to catch and handle potential errors gracefully. This ensures that the application remains stable and provides useful error messages.",
  //       "solution_code_snippet": "export async function applyIssuesInteractive(filePath: string, issues: Issue[]) {\n  try {\n    const originalUri = vscode.Uri.file(filePath);\n    let doc = await vscode.workspace.openTextDocument(originalUri);\n    let text = doc.getText();\n\n    issues.sort((a, b) => a.start_line - b.start_line);\n    const acceptedIssues: Issue[] = [];\n\n    for (const issue of issues) {\n      const originalLines = text.split(/\\r?\\n/);\n      const start = issue.start_line - 1;\n      const end = issue.end_line - 1;\n      const solutionLines = issue.solution_code_snippet.split(/\\r?\\n/);\n      const previewLines = [...originalLines];\n      previewLines.splice(start, end - start + 1, ...solutionLines);\n      const fixedText = previewLines.join(\"\\n\");\n      const scheme = \"codesherlk-fix-preview\";\n      const virtualUri = vscode.Uri.parse(`${scheme}://${issue.uid}/${filePath}`);\n      const provider = new (class implements vscode.TextDocumentContentProvider {\n        onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();\n        onDidChange = this.onDidChangeEmitter.event;\n        provideTextDocumentContent(uri: vscode.Uri) {\n          return fixedText;\n        }\n      })();\n\n      const registration = vscode.workspace.registerTextDocumentContentProvider(scheme, provider);\n      await vscode.commands.executeCommand(\"vscode.diff\", originalUri, virtualUri, `Fix Preview: ${issue.uid} (${filePath})`);\n      const choice = await vscode.window.showInformationMessage(`Apply fix for issue ${issue.uid}?`, \"Apply\", \"Skip\");\n\n      if (choice === \"Apply\") {\n        acceptedIssues.push(issue);\n        text = fixedText; // update base text so subsequent fixes apply on top\n      }\n\n      registration.dispose();\n    }\n\n    if (acceptedIssues.length > 0) {\n      const edit = new vscode.WorkspaceEdit();\n      const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));\n      edit.replace(originalUri, fullRange, text);\n      await vscode.workspace.applyEdit(edit);\n      await doc.save();\n      vscode.window.showInformationMessage(`Applied ${acceptedIssues.length} fixes to ${filePath}.`);\n    } else {\n      vscode.window.showInformationMessage(`No fixes applied to ${filePath}.`);\n    }\n  } catch (error) {\n    vscode.window.showErrorMessage(`Error applying issues: ${error.message}`);\n  }\n}",
  //       start_line: 52,
  //       end_line: 125
  //     }
  //   ],
  //   "src/components/CreateTableForContactUpload.js": [
  //     {
  //       "id": null,
  //       "uid": "EXC-100",
  //       "issue": "The code lacks comprehensive exception handling in asynchronous functions, which can lead to unhandled promise rejections and cause the application to crash or exhibit unexpected behavior. For example, many await calls in the `applyIssuesInteractive` function do not catch potential errors.",
  //       "issue_code_snippet": "export async function applyIssuesInteractive(filePath: string, issues: Issue[]) {\n  const absolute = await resolveFilePath(filePath);\n  const originalUri = vscode.Uri.file(absolute);\n  const doc = await vscode.workspace.openTextDocument(originalUri);\n  let text = doc.getText();\n\n  // Sort by start line; we'll adjust with a cumulative line offset\n  const sorted = [...issues].sort((a, b) => a.start_line - b.start_line);\n\n  let appliedCount = 0;\n  let lineOffset = 0;\n\n  for (const issue of sorted) {\n    const originalLines = text.split(/\\r?\\n/);\n\n    // Adjust for previous accepted edits\n    const start = issue.start_line - 1 + lineOffset;\n    const end = issue.end_line - 1 + lineOffset;\n\n    if (start < 0 || start >= originalLines.length) {\n      vscode.window.showWarningMessage(`Skipping ${issue.uid} (out of range) in ${filePath}`);\n      continue;\n    }\n\n    const solutionLines = issue.solution_code_snippet.split(/\\r?\\n/);\n    const previewLines = [...originalLines];\n    const removeCount = Math.max(0, end - start + 1);\n    previewLines.splice(start, removeCount, ...solutionLines);\n    const fixedText = previewLines.join(\"\\n\");\n\n    const virtualUri = vscode.Uri.parse(\n      `${FIX_PREVIEW_SCHEME}://${encodeURIComponent(issue.uid)}/${normalizeAndJoinSegments(filePath).replace(/\\\\/g, \"/\")}`\n    );\n    setPreviewContent(virtualUri, fixedText);\n\n    const choice = await vscode.window.showInformationMessage(\n      `Apply fix for ${issue.uid} in ${path.basename(filePath)}?`,\n      \"Apply\",\n      \"Skip\",\n      \"Cancel All\"\n    );\n\n    if (choice === \"Cancel All\") break;\n\n    if (choice === \"Apply\") {\n      text = fixedText;\n      appliedCount += 1;\n      lineOffset += solutionLines.length - removeCount; // keep subsequent indexes aligned\n    }\n  }\n\n  if (appliedCount > 0) {\n    const edit = new vscode.WorkspaceEdit();\n    const fullRange = new vscode.Range(\n      doc.positionAt(0),\n      doc.positionAt(doc.getText().length)\n    );\n    edit.replace(originalUri, fullRange, text);\n    await vscode.workspace.applyEdit(edit);\n    await doc.save();\n    vscode.window.showInformationMessage(`Applied ${appliedCount} fixes to ${filePath}.`);\n  } else {\n    vscode.window.showInformationMessage(`No fixes applied to ${filePath}.`);\n  }\n}",
  //       "severity": "High",
  //       "severity_level": 3,
  //       "solution": "To enhance exception handling, wrap asynchronous calls with try-catch blocks to catch and handle potential errors gracefully. This ensures that the application remains stable and provides useful error messages.",
  //       "solution_code_snippet": "export async function applyIssuesInteractive(filePath: string, issues: Issue[]) {\n  try {\n    const absolute = await resolveFilePath(filePath);\n    const originalUri = vscode.Uri.file(absolute);\n    const doc = await vscode.workspace.openTextDocument(originalUri);\n    let text = doc.getText();\n\n    const sorted = [...issues].sort((a, b) => a.start_line - b.start_line);\n\n    let appliedCount = 0;\n    let lineOffset = 0;\n\n    for (const issue of sorted) {\n      const originalLines = text.split(/\\r?\\n/);\n      const start = issue.start_line - 1 + lineOffset;\n      const end = issue.end_line - 1 + lineOffset;\n\n      if (start < 0 || start >= originalLines.length) {\n        vscode.window.showWarningMessage(`Skipping ${issue.uid} (out of range) in ${filePath}`);\n        continue;\n      }\n\n      const solutionLines = issue.solution_code_snippet.split(/\\r?\\n/);\n      const previewLines = [...originalLines];\n      const removeCount = Math.max(0, end - start + 1);\n      previewLines.splice(start, removeCount, ...solutionLines);\n      const fixedText = previewLines.join(\"\\n\");\n\n      const virtualUri = vscode.Uri.parse(\n        `${FIX_PREVIEW_SCHEME}://${encodeURIComponent(issue.uid)}/${normalizeAndJoinSegments(filePath).replace(/\\\\/g, \"/\")}`\n      );\n      setPreviewContent(virtualUri, fixedText);\n\n      const choice = await vscode.window.showInformationMessage(\n        `Apply fix for ${issue.uid} in ${path.basename(filePath)}?`,\n        \"Apply\",\n        \"Skip\",\n        \"Cancel All\"\n      );\n\n      if (choice === \"Cancel All\") break;\n\n      if (choice === \"Apply\") {\n        text = fixedText;\n        appliedCount += 1;\n        lineOffset += solutionLines.length - removeCount; // keep subsequent indexes aligned\n      }\n    }\n\n    if (appliedCount > 0) {\n      const edit = new vscode.WorkspaceEdit();\n      const fullRange = new vscode.Range(\n        doc.positionAt(0),\n        doc.positionAt(doc.getText().length)\n      );\n      edit.replace(originalUri, fullRange, text);\n      await vscode.workspace.applyEdit(edit);\n      await doc.save();\n      vscode.window.showInformationMessage(`Applied ${appliedCount} fixes to ${filePath}.`);\n    } else {\n      vscode.window.showInformationMessage(`No fixes applied to ${filePath}.`);\n    }\n  } catch (error) {\n    vscode.window.showErrorMessage(`Error applying issues: ${error.message}`);\n  }\n}",
  //       "start_line": 67,
  //       "end_line": 327
  //     },
  //     {
  //       "id": null,
  //       "uid": "RES-100",
  //       "issue": "Potential Memory Leak Due to Unmanaged Instances of TextDocumentContentProvider",
  //       "issue_code_snippet": "const provider = new (class implements vscode.TextDocumentContentProvider {\n  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();\n  onDidChange = this.onDidChangeEmitter.event;\n  provideTextDocumentContent(uri: vscode.Uri) {\n    return fixedText;\n  }\n})();\nconst registration = vscode.workspace.registerTextDocumentContentProvider(scheme, provider);",
  //       "severity": "High",
  //       "severity_level": 3,
  //       "solution": "Register Provider Once and Dispose After Use",
  //       "solution_code_snippet": "const provider = new (class implements vscode.TextDocumentContentProvider {\n  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();\n  onDidChange = this.onDidChangeEmitter.event;\n  provideTextDocumentContent(uri: vscode.Uri) {\n    return fixedText;\n  }\n})();\n\nconst registration = vscode.workspace.registerTextDocumentContentProvider(scheme, provider);\n\nfor (const issue of issues) {\n  // ... logic for applying fixes ...\n}\n\n// Cleanup after processing all issues\nregistration.dispose();",
  //       "start_line": 503,
  //       "end_line": 560
  //     }
  //   ],
  //   "src/slices/temp.js": [
  //     {
  //       "id": null,
  //       "uid": "MOD-100",
  //       "issue": "Lack of Modularity in Error Handling.",
  //       "issue_code_snippet": "try {\n  const res = await analyzeUncommittedChanges1(op);\n  op.appendLine(\"✅ Uncommitted Analysis response:\\n\" + JSON.stringify(res, null, 2));\n} catch (err: any) {\n  op.appendLine(\"❌ Error during Uncommitted Analysis:\\n\" + err?.message || JSON.stringify(err));\n}",
  //       "severity": "High",
  //       "severity_level": 3,
  //       "solution": "Extract the Error Handling into a Separate Function.",
  //       "solution_code_snippet": "async function handleUncommittedAnalysis(op) {\n  try {\n    const res = await analyzeUncommittedChanges1(op);\n    op.appendLine(\"✅ Uncommitted Analysis response:\\n\" + JSON.stringify(res, null, 2));\n  } catch (err: any) {\n    handleError(op, err);\n  }\n}\n\nfunction handleError(op, err: any) {\n  op.appendLine(\"❌ Error during Uncommitted Analysis:\\n\" + err?.message || JSON.stringify(err));\n}\n\n// Usage\nawait handleUncommittedAnalysis(op);",
  //       "start_line": 49,
  //       "end_line": 54
  //     },
  //     {
  //       "id": null,
  //       "uid": "COD-100",
  //       "issue": "The code potentially allows for unverified input to be processed and logged, which could lead to sensitive information exposure or manipulation.",
  //       "issue_code_snippet": "op.appendLine(\"✅ Uncommitted Analysis response:\\n\" + JSON.stringify(res, null, 2));",
  //       "severity": "High",
  //       "severity_level": 3,
  //       "solution": "Implement input sanitization and avoid direct string concatenation for output logging. Instead of concatenating, use template literals, and ensure that sensitive data is adequately protected before logging.",
  //       "solution_code_snippet": "op.appendLine(`✅ Uncommitted Analysis response:\\n${JSON.stringify(res, null, 2)}`);",
  //       "start_line": 51,
  //       "end_line": 51
  //     }
  //   ]
  // };

  //     // Process in background - only highlights open files, queues others
  //     // const results = await processAllIssuesBackground(issuesObject, op);

  //     op.appendLine("🎉 Background processing completed!");
  //     op.appendLine("💡 HOW IT WORKS:");
  //     op.appendLine("   🔴 Files already open → Highlighted immediately");
  //     op.appendLine("   💾 Files not open → Stored for background processing");
  //     op.appendLine("   🔄 When you open a file → Highlights applied automatically");
  //     op.appendLine("   ✅ Switch between files → Highlights persist");
  //     op.appendLine("   📋 Accept/Reject buttons remain functional");

  //   } catch (error: any) {
  //     op.appendLine(`❌ Error in background processing: ${error.message}`);
  //     op.appendLine(`📋 Error stack: ${error.stack}`);
  //   }    op.appendLine("   📋 CodeLens buttons (Accept/Reject) below green sections");
  //     op.appendLine("   ❌ Error logs for files that don't exist");

  // } catch (error: any) {
  //   op.appendLine(`❌ Error in processAllIssues: ${error.message}`);
  //   op.appendLine(`📋 Error stack: ${error.stack}`);
  // }

  op.appendLine("Vs-Code API is Activating... ");

  // Initialize Git functionality and get Analysis Payload
  const analysisPayload: AnalysisPayload = await initializeGitWatching(
    context,
    op
  );
}

function registerMarkdownContentProvider(context: vscode.ExtensionContext) {
  const provider: vscode.TextDocumentContentProvider = {
    provideTextDocumentContent(uri: vscode.Uri): string {
      const key = uri.path.slice(1);
      return markdownContentStore.get(key) || "Content not found.";
    },
  };

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      "markdown-preview",
      provider
    )
  );
}

export function registerPreviewCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.openMarkdownPreview",
      async (title: string, markdownContent: string) => {
        if (!title || !markdownContent) {
          vscode.window.showErrorMessage("Missing title or markdown content.");
          return;
        }

        const key = `${Date.now()}-${title.replace(/\s+/g, "-")}`;
        const previewUri = vscode.Uri.parse(
          `markdown-preview://preview/${key}`
        );

        // ✅ Store the content for the provider to access
        markdownContentStore.set(key, markdownContent);

        // Open the preview
        const existingColumnTwo = vscode.window.visibleTextEditors.find(
          (editor: vscode.TextEditor) =>
            editor.viewColumn === vscode.ViewColumn.Two
        );

        if (!existingColumnTwo) {
          await vscode.commands.executeCommand(
            "markdown.showPreviewToSide",
            previewUri
          );
        } else {
          await vscode.commands.executeCommand(
            "markdown.showPreview",
            previewUri
          );
        }
      }
    )
  );
}

export function deactivate() {
  if (logoutCommand) {
    logoutCommand.dispose();
  }
}
