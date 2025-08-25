import * as vscode from "vscode";
import * as path from "path";

// Add global type declarations for Node.js functions
declare global {
  function setTimeout(callback: (...args: any[]) => void, ms: number): any;
  function clearTimeout(timeoutId: any): void;
}

// ✅ Single, comprehensive Issue interface
export interface Issue {
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

export interface TrackedIssue {
  issue: Issue;
  originalCode: string[];
  greenLineCount: number;
  redRanges: vscode.Range[];
  greenRanges: vscode.Range[];
  commentThread: vscode.CommentThread; // SINGLE comment thread for both issue & solution
}

// Global storage maps
export const fileIssuesMap = new Map<string, TrackedIssue[]>();
export const pendingIssuesMap = new Map<string, Issue[]>();
export const appliedIssuesMap = new Map<string, TrackedIssue[]>();
export const markdownContentStore = new Map<string, string>();

// Decorations
export const greenDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(129,184,139,0.5)", // #81b88b with opacity
  isWholeLine: true,
});

export const redDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(228,103,107,0.5)", // #e4676b with opacity
  isWholeLine: true,
});

// ✅ SINGLE Comment Decoration
export const singleCommentDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(255, 193, 7, 0.1)", // Light yellow background
  isWholeLine: true,
  overviewRulerColor: "rgba(255, 193, 7, 0.8)", // Yellow in ruler
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  border: "1px solid rgba(255, 193, 7, 0.3)",
  borderRadius: "2px",
});

let commentController: vscode.CommentController;

export type SetupDeps = {
  initializeGitWatching: (context: vscode.ExtensionContext, op: vscode.OutputChannel) => Promise<any>;
  registerWebViewProvider: (context: vscode.ExtensionContext, op: vscode.OutputChannel) => void;
  registerMarkdownContentProvider: (context: vscode.ExtensionContext) => void;
  registerPreviewCommand: (context: vscode.ExtensionContext) => void;
  registerIssueCommands: (context: vscode.ExtensionContext) => void;
  registerCommentToggleCommands: (context: vscode.ExtensionContext) => void;
  registerFocusOnIssueCommand: (context: vscode.ExtensionContext) => void;
  IssueCodeLensProvider: new () => vscode.CodeLensProvider;
  restoreHighlightsForEditor: (editor: vscode.TextEditor, op?: vscode.OutputChannel) => boolean;
  checkAndApplyPendingIssues: (editor: vscode.TextEditor, op?: vscode.OutputChannel) => Promise<boolean>;
  redDecoration: vscode.TextEditorDecorationType;
  greenDecoration: vscode.TextEditorDecorationType;
  getAppInsightsInstance?: () => { trackTrace: (t: { message: string; properties?: any; severityLevel?: number | undefined }) => void } | null | undefined;
};

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
        (editor: vscode.TextEditor) =>
          editor.document.uri.fsPath.toLowerCase() ===
          absolutePath.toLowerCase()
      );

      if (openEditor) {
        // File is open - apply highlights immediately
        op?.appendLine(
          `️ File is currently open - applying highlights immediately`
        );
        await applyIssuesInteractiveToOpenEditor(openEditor, fileIssues, op);
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

  if (results.errors.length > 0) {
    op?.appendLine(`❌ Errors encountered: ${results.errors.length}`);
    results.errors.forEach((error) => op?.appendLine(`   ${error}`));
  }
  return results;
}

export async function applyIssuesInteractiveToOpenEditor(
  editor: vscode.TextEditor,
  issuesParam: Issue[],
  op?: vscode.OutputChannel
) {
  function ensureCommentController(): vscode.CommentController {
    if (!commentController) {
      commentController = vscode.comments.createCommentController(
        "codesherlock-issues",
        "CodeSherlock Issues"
      );
    }
    return commentController;
  }
  const filePath = editor.document.uri.fsPath;

  op?.appendLine(
    ` Applying issues to open editor: ${path.basename(filePath)}`
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
      ` Original lines: ${issue.start_line}-${issue.end_line}, Adjusted: ${
        adjustedStartLine + 1
      }-${adjustedEndLine + 1} (offset: ${lineOffset})`
    );

    //  SINGLE comment for both issue and solution
    const commentRange = new vscode.Range(
      adjustedStartLine,
      0,
      adjustedStartLine,
      0
    );
    const commentThread = ensureCommentController().createCommentThread(
      doc.uri,
      commentRange,
      []
    );

    // ✅ SINGLE comment with both issue and solution
    commentThread.comments = [
      {
        body: new vscode.MarkdownString(`## Issue: ${issue.uid}
**Severity:** ${issue.severity} (Level ${issue.severity_level})

### Problem:
${issue.issue}

### Issue Code Snippet:
\`\`\`
${issue.issue_code_snippet}
\`\`\`

**Lines:** ${issue.start_line}-${issue.end_line}

---

### Solution:
${issue.solution}

**Action:** Use the Accept/Reject buttons below to apply or dismiss this fix.

*Click the gear icon to toggle visibility*

[🔍 Click to focus on this issue](command:extension.focusOnIssue?${encodeURIComponent(JSON.stringify({ filePath: filePath, issueId: issue.uid, startLine: issue.start_line, endLine: issue.end_line }))})`),
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

    // ✅ CRITICAL FIX: Update lineOffset for next issue
    lineOffset += solutionLines.length;
    op?.appendLine(`📈 Updated line offset to: ${lineOffset} (added ${solutionLines.length} lines)`);

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
    (e: vscode.TextEditor) => e.document.uri.fsPath.toLowerCase() === absolutePath.toLowerCase()
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
            ` Replacing block ${blockStartLine + 1}..${
              blockEndLine + 1
            } (old lines: ${oldBlockLineCount}, new lines: ${newBlockLineCount}, delta: ${delta})`
          );

          await editor.edit((editBuilder: vscode.TextEditorEdit) => {
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
        } catch (error: any) {
          outputChannel.appendLine(`❌ Error applying fix: ${error.message}`);
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
            await editor.edit((editBuilder: vscode.TextEditorEdit) => {
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
              `Rejected fix for issue: ${tracked.issue.uid}`
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

// ✅ ENHANCED: Much better Accept/Reject button UI with correct positioning
export class IssueCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const filePath = document.uri.fsPath.toLowerCase();
    const trackedIssues = fileIssuesMap.get(filePath);
    if (!trackedIssues) return [];

    const lenses: vscode.CodeLens[] = [];

    trackedIssues.forEach((tracked, index) => {
      const greenRanges = tracked.greenRanges;
      if (greenRanges.length > 0) {
        // ✅ FIXED: Position buttons at the end of the green solution block
        const lastGreenRange = greenRanges[greenRanges.length - 1];
        const lensLine = Math.min(
          document.lineCount - 1,
          lastGreenRange.end.line + 1
        );
        const range = new vscode.Range(lensLine, 0, lensLine, 0);

        // 🎨 ENHANCED: Much better Accept button
        lenses.push(
          new vscode.CodeLens(range, {
            title: "**$✅ Accept Solution**",
            command: "extension.acceptIssue",
            arguments: [filePath, index],
            tooltip: `Apply the suggested fix for issue: ${tracked.issue.uid}`,
          })
        );

        // 🎨 ENHANCED: Much better Reject button
        lenses.push(
          new vscode.CodeLens(range, {
            title: "**$❌ Reject Solution**",
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

// ✅ NEW: Command to focus on a specific issue comment
export function registerFocusOnIssueCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.focusOnIssue",
      async (args: { filePath: string; issueId: string; startLine: number; endLine: number }) => {
        const outputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.appendLine(` Focusing on issue: ${args.issueId}`);
        
        try {
          // Open the file if it's not already open
          const doc = await vscode.workspace.openTextDocument(args.filePath);
          const editor = await vscode.window.showTextDocument(doc, {
            preview: false,
            preserveFocus: false,
          });

          // Calculate the range to highlight
          const startPos = new vscode.Position(args.startLine - 1, 0);
          const endPos = new vscode.Position(args.endLine - 1, 0);
          const range = new vscode.Range(startPos, endPos);

          // Set selection and reveal the range
          editor.selection = new vscode.Selection(startPos, endPos);
          editor.revealRange(range, vscode.TextEditorRevealType.InCenter);

          // Highlight the range temporarily
          const tempDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: "rgba(255, 255, 0, 0.3)", // Light yellow highlight
            border: "2px solid #FFD700",
            borderRadius: "2px",
          });

          editor.setDecorations(tempDecoration, [range]);

          // Remove the temporary decoration after 3 seconds
          setTimeout(() => {
            tempDecoration.dispose();
          }, 3000);

          // Try to focus on the comment in the COMMENTS panel
          // This will trigger the comment to be visible
          const filePath = args.filePath.toLowerCase();
          const trackedIssues = fileIssuesMap.get(filePath);
          if (trackedIssues) {
            const tracked = trackedIssues.find(t => t.issue.uid === args.issueId);
            if (tracked && tracked.commentThread) {
              // Expand the comment thread to make it visible
              tracked.commentThread.collapsibleState = vscode.CommentThreadCollapsibleState.Expanded;
              
              // Try to reveal the comment in the COMMENTS panel
              vscode.commands.executeCommand("comments.focus");
            }
          }

          outputChannel.appendLine(`✅ Focused on issue ${args.issueId} at lines ${args.startLine}-${args.endLine}`);
          
        } catch (error: any) {
          outputChannel.appendLine(`❌ Error focusing on issue: ${error.message}`);
          vscode.window.showErrorMessage(`Error focusing on issue: ${error.message}`);
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
    await new Promise<void>((resolve) => {
      // Use setTimeout directly since we're in a Node.js environment
      setTimeout(resolve, 100);
    });
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

  return results;
}

export function registerMarkdownContentProvider(context: vscode.ExtensionContext) {
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

export async function setupCodeSherlockFeatures(
  context: vscode.ExtensionContext,
  op: vscode.OutputChannel,
  deps: SetupDeps
): Promise<void> {
  // Comment controller
  const commentController = vscode.comments.createCommentController(
    "codesherlock-issues",
    "CodeSherlock Issues"
  );
  context.subscriptions.push(commentController);

  deps.registerWebViewProvider(context, op);
  deps.registerMarkdownContentProvider(context);
  deps.registerPreviewCommand(context);
  registerFocusOnIssueCommand(context); // Register the new command

  // First-run telemetry
  const appInsights = deps.getAppInsightsInstance?.() || undefined;
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

  // Commands/providers/listeners
  deps.registerIssueCommands(context);
  deps.registerCommentToggleCommands(context);
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { scheme: "file" },
      new deps.IssueCodeLensProvider()
    )
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(
      async (editor: vscode.TextEditor | undefined) => {
        if (editor) {
          const outputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
          const restored = deps.restoreHighlightsForEditor(editor, outputChannel);
          if (!restored) {
            await deps.checkAndApplyPendingIssues(editor, outputChannel);
          }
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.processIssuesBackground",
      async (issuesObject: Record<string, any[]>) => {
        const outputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.show();
        if (!issuesObject || Object.keys(issuesObject).length === 0) {
          outputChannel.appendLine("❌ No issues object provided or empty object");
          vscode.window.showErrorMessage("No issues to process");
          return;
        }
        outputChannel.appendLine("🚀 Processing issues object in background...");
        await processAllIssuesBackground(issuesObject, outputChannel);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.processIssuesBackgroundSilent",
      async (issuesObject: Record<string, any[]>) => {
        const outputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
        if (!issuesObject || Object.keys(issuesObject).length === 0) {
          outputChannel.appendLine("❌ No issues object provided or empty object (silent)");
          return;
        }
        outputChannel.appendLine("🤫 Processing issues object silently in background...");
        await processAllIssuesBackground(issuesObject, outputChannel, { silent: true });
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.processIssues",
      async (issuesObject: Record<string, any[]>) => {
        const outputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.show();
        if (!issuesObject || Object.keys(issuesObject).length === 0) {
          outputChannel.appendLine("❌ No issues object provided or empty object");
          vscode.window.showErrorMessage("No issues to process");
          return;
        }
        outputChannel.appendLine("🚀 Processing issues object...");
        await processAllIssues(issuesObject, outputChannel);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codesherlock.testHighlighting",
      async () => {
        const outputChannel = vscode.window.createOutputChannel("CodeSherlockAI");
        outputChannel.show();
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          outputChannel.appendLine("❌ No active editor found");
          vscode.window.showErrorMessage("Please open a file first");
          return;
        }
        outputChannel.appendLine("🧪 Testing highlighting on current file...");
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
        outputChannel.appendLine("✅ Test highlighting applied to lines 1-2 (red) and 3-4 (green)");
        outputChannel.appendLine(" If you can see the highlighting, the decorations are working!");
      }
    )
  );

  await deps.initializeGitWatching(context, op);
}


