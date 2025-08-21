// utils120.js
// Lightweight utility helpers (120 lines).
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
    for (const fn of list) {
        try { 
            fn(...args); 
        } catch (error) {
            console.error(`Error in event handler for event '${evt}':`, error);
        }
    }
}
}
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

export default {};

// utils120.js
// Lightweight utility helpers (120 lines).
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
// 🔍 ISSUE: EXC-100 - High Severity
// Lines 78-81
// Lack of Exception Handling in Event Emitters
  emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) try { fn(...args); } catch (_) {}
  }
// ✅ SOLUTION: EXC-100
// Implement Error Logging
emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) {
        try { 
            fn(...args); 
        } catch (error) {
            console.error(`Error in event handler for event '${evt}':`, error);
        }
    }
}
}
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}
// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

export default {};
const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};


// utils120.js
// Lightweight utility helpers (120 lines).
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
// 🔍 ISSUE: EXC-100 - High Severity
// Lines 78-81
// Lack of Exception Handling in Event Emitters
  emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) try { fn(...args); } catch (_) {}
  }
// ✅ SOLUTION: EXC-100
// Implement Error Logging
emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) {
        try { 
            fn(...args); 
        } catch (error) {
            console.error(`Error in event handler for event '${evt}':`, error);
        }
    }
}
}
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}
// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

export default {};
const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};


// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};
// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};

// utils120.js
// Lightweight utility helpers (120 lines).
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
// 🔍 ISSUE: EXC-100 - High Severity
// Lines 78-81
// Lack of Exception Handling in Event Emitters
  emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) try { fn(...args); } catch (_) {}
  }
// ✅ SOLUTION: EXC-100
// Implement Error Logging
emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) {
        try { 
            fn(...args); 
        } catch (error) {
            console.error(`Error in event handler for event '${evt}':`, error);
        }
    }
}
}
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}
// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

export default {};
const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};


// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};
// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};

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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};


// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};
// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};



// utils120.js
// Lightweight utility helpers (120 lines).
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
interface GitInfo {
  organization: string;
  repository: string;
  latestCommitHash: string;
}

interface FileItem {
  filename: string;
  status: string;
  new_content: string;
  patch: string;
}

interface CommitProps {
  gitInfo: GitInfo | null;
  commitExtraInfo?: any; // Optional prop for extra commit info
}

interface CommitAnalysisState {
  running: boolean;
  data: any[];
  error: string | null;
}

const Commit: React.FC<CommitProps> = ({ gitInfo, commitExtraInfo }) => {
  const { userId, name } = useSelector(selectUser);
  const [uncommitFiles, setUncommitFiles] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [commitFiles, setCommitFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"uncommitted" | "lastCommit">("uncommitted");
  const [load, setLoad] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const [commitAnalysis, setCommitAnalysis] = useState<CommitAnalysisState>({
      running: false,
      data: [],
      error: null,
  });

  const [commitReview] = useCommitReviewMutation();
  const gitInfoRef = useRef(gitInfo);

  console.log("Git Info:", gitInfo);


export default {};




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

// padding line 84
// padding line 85
// padding line 86
// padding line 87
// padding line 88
// padding line 89
// padding line 90
// padding line 91
// padding line 92
// padding line 93
// padding line 94
// padding line 95
// padding line 96
// padding line 97
// padding line 98
// padding line 99
// padding line 100
// padding line 101
// padding line 102
// padding line 103
// padding line 104
// padding line 105
// padding line 106
// padding line 107
// padding line 108
// padding line 109
// padding line 110
// padding line 111
// padding line 112
// padding line 113
// padding line 114
// padding line 115
// padding line 116
// padding line 117
// padding line 118
// padding line 119
export default {};