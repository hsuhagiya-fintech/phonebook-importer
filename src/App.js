import "./App.css";
import FileUpload from "./components/ FileUpload.js";
import ContactUpload from "./components/ContactUpload.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/upload" element={<ContactUpload />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// #export the fn

export default App;


import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }


  import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

//added
// /.jhfkhjksdfs
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

//added
// /.jhfkhjksdfs
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }


  import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }

  ///aknjwbshf
  //testing commit


  //sdfjkhdsjfherhfiu


  //testing....
//
//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }


  import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }

  ///aknjwbshf
  //testing commit


  //sdfjkhdsjfherhfiu


  //testing....
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

//added
// /.jhfkhjksdfs
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

//added
// /.jhfkhjksdfs
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }


  import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }

  ///aknjwbshf
  //testing commit


  //sdfjkhdsjfherhfiu


  //testing....
//
//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }


  import "./ContactUpload.css";
import CreateTableForContactUpload from "./CreateTableForContactUpload";
import { useNavigate,useLocation } from "react-router-dom";
export default function ContactUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // const file = location.state?.file;


  return (
    <>
      <div className="header-container">
        <button className="header-button" onClick={() => navigate("/")}>
          ← Back to Upload
        </button>

        <div className="header-title-group">
          <h1 className="header-title">Phonebook Data</h1>
          <p className="header-subtitle">Manage your imported contacts</p>
        </div>

        <button className="header-button" onClick={() => navigate("/")}>
          New Upload
        </button>
      </div>

      <div>
        <CreateTableForContactUpload/>
      </div>
    </>
  );
}
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
dotenv.config({ path: path.join(__dirname, "../.env") });
import { registerWebViewProvider } from "./panels/SidePanel";
import { getAppInsightsInstance } from "./logging/AppInsights";
import { getRepositories } from "./vscode-extensionapi";
import {analyzeUncommittedChanges1} from "./vscode-extensionapi"

const appInsights = getAppInsightsInstance();

let logoutCommand: Disposable | undefined;

const markdownContentStore = new Map<string, string>();

export async function activate(context: ExtensionContext) {
  vscode.window.showInformationMessage(" Activated..... ");
  const op = window.createOutputChannel("CodeSherlockAI");
  op.appendLine("Extension is Activated ..... ");

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

//   const repos = await getRepositories();

//   op.appendLine(`Found Repo:\n${JSON.stringify(repos, null, 2)}`);

try {
  const res = await analyzeUncommittedChanges1(op);
  op.appendLine("✅ Uncommitted Analysis response:\n" + JSON.stringify(res, null, 2));
} catch (err: any) {
  op.appendLine("❌ Error during Uncommitted Analysis:\n" + err?.message || JSON.stringify(err));
}

  // const { execSync } = require("child_process");

  // try {
  //   const latestCommit = execSync("git rev-parse HEAD", {
  //     cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? undefined,
  //   })
  //     .toString()
  //     .trim();

  //   const res = await analyzeCommittedChanges1(latestCommit, op);
  //   op.appendLine(
  //     `Analysis Result Without commit:\n${JSON.stringify(res, null, 2)}`
  //   );
  // } catch (err: any) {
  //   op.appendLine(
  //     `⚠️ Skipping initial commit analysis. Reason: ${err.message}`
  //   );
  // }

  ///aknjwbshf
  //testing commit


  //sdfjkhdsjfherhfiu

//
  //testing....
