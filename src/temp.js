


// // export function registerPreviewCommand(context: vscode.ExtensionContext) {
// //   context.subscriptions.push(
// //     vscode.commands.registerCommand(
// //       "extension.openMarkdownPreview",
// //       async (title: string, markdownContent: string) => {
// //         if (!title || !markdownContent) {
// //           vscode.window.showErrorMessage("Missing title or markdown content.");
// //           return;
// //         }

// //         const key = `${Date.now()}-${title.replace(/\s+/g, "-")}`;
// //         const previewUri = vscode.Uri.parse(
// //           `markdown-preview://preview/${key}`
// //         );

// //         // ✅ Store the content for the provider to access
// //         markdownContentStore.set(key, markdownContent);

// //         // Open the preview
// //         const existingColumnTwo = vscode.window.visibleTextEditors.find(
// //           (editor) => editor.viewColumn === vscode.ViewColumn.Two
// //         );

// //         if (!existingColumnTwo) {
// //           await vscode.commands.executeCommand(
// //             "markdown.showPreviewToSide",
// //             previewUri
// //           );
// //         } else {
// //           await vscode.commands.executeCommand(
// //             "markdown.showPreview",
// //             previewUri
// //           );
// //         }
// //       }
// //     )
// //   );
// // }

export function deactivate() {
  if (logoutCommand) {
    logoutCommand.dispose();
  }
}