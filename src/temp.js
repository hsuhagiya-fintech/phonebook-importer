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
  constructor(scope = 'app', level = 'info') { // Accept level as a parameter
    this.scope = scope;
    this.level = level; // Injected log level
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
// The `emit` method in the `SimpleEventEmitter` class does not properly handle exceptions thrown by the event handlers, which could lead to unhandled promise rejections or silent failures in the application.
  emit(evt, ...args) {
    const list = this.map.get(evt) || [];
    for (const fn of list) try { fn(...args); } catch (_) {}
  }
// ✅ SOLUTION: EXC-100
// Improve the exception handling mechanism in the `emit` method to provide better logging and feedback when an error occurs during the execution of an event handler. This can be achieved by logging the error message instead of silently ignoring it. This will help in identifying issues during development and debugging.
emit(evt, ...args) {
  const list = this.map.get(evt) || [];
  for (const fn of list) {
    try {
      fn(...args);
    } catch (error) {
      console.error(`Error occurred while emitting event '${evt}':`, error);
    }
  }
}
}
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

export default {};