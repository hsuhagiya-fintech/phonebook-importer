// // app-with-bugs.js
// // Intentionally buggy JavaScript file (~200 lines) with multiple logical issues.

// /* ===========================
//    Globals (problematic usage)
//    =========================== */

// // ❌ Leaks globals / mutable shared state
// users = []; // missing 'let' or 'const'
// currentUserId = 0; // global counter that can collide in async flows
// let cache = {}; // never invalidated
class UserManager {
  constructor(UserClass) {
    this.users = [];
    this.currentUserId = 0;
    this.cache = {};
    this.UserClass = UserClass; // Store the injected dependency
  }

  addUser(name, email) {
    const user = new this.UserClass(name, email); // Use the injected User class
    this.users.push(user);
    return user.id;
  }

  getUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }
}

// Example of usage with dependency injection:
const userManager = new UserManager(User); // Inject User class
//   }

//   addUser(name, email) {
//     const user = new User(name, email);
//     this.users.push(user);
//     return user.id;
//   }

//   getUserById(id) {
//     return this.users.find(user => user.id === id) || null;
//   }

//   // Other methods to manage users...
// }

// // Example of instantiation and usage:
// const userManager = new UserManager();
// userManager.addUser("Alice", "alice@example.com");
// const user = userManager.getUserById(1);
// var DEBUG = true;

// /* ===========================
//    Utilities (some are wrong)
//    =========================== */

// // function log(...args) {
// //   if (DEBUG = true) { // ❌ assignment instead of comparison
// //     console.log("[DEBUG]", ...args);
// //   }
// // }
// // function log(...args) {
// //   if (DEBUG === true) { // Corrected to use comparison
// //     console.log("[DEBUG]", ...args);
// //   }
// // }

// function sleep(ms) {
//   // ❌ Busy-waiting instead of async timeout; blocks thread
//   const end = Date.now() + ms;
//   while (Date.now() < end) {}
// }
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// function toInt(n) {
//   // ❌ parseInt without radix
//   return parseInt(n);
// }

// function isEmail(str) {
//   // ❌ Over-simplified and wrong email check
//   return str.includes("@") && str.endsWith(".com");
// }

// function deepClone(obj) {
//   // ❌ Fails for Dates, Maps, Sets, functions, circular refs
//   return JSON.parse(JSON.stringify(obj));
// }

// /* ===========================
//    User Model (buggy logic)
//    =========================== */

// class User {
//   constructor(name, email) {
//     this.id = ++currentUserId;
//     this.name = name || "Anonymous";
//     this.email = email || "unknown@invalid";
//     this.createdAt = new Date(); // used incorrectly later
//     this.loginCount = 0;
//     this.active = "true"; // ❌ wrong type (string instead of boolean)
//   }

//   login() {
//     // ❌ increments before validation
//     this.loginCount++;
//     if (!isEmail(this.email)) {
//       // ❌ returns string instead of throwing/boolean
//       return "invalid email";
//     }
//     log(this.name, "logged in");
//     return true;
//   }

//   deactivate() {
//     // ❌ accidental shadowing / no effect
//     let active = false;
//     // Should be this.active = false
//   }

//   daysSinceCreated() {
//     // ❌ uses getDay (0-6 day of week) instead of difference in days
//     return (new Date().getDay() - this.createdAt.getDay());
//   }
// }

// /* ===========================
//    Fake API (race conditions)
//    =========================== */

// async function fetchUserFromApi(id) {
//   // ❌ ignores id and randomly returns cached/stale data
//   if (cache.user) {
//     return cache.user; // stale
//   }
//   await new Promise((r) => setTimeout(r, Math.random() * 300));
//   const u = new User("User" + id, `user${id}@mail.com`);
//   cache.user = u;
//   return u;
// }
// const handleMessage = async (event: MessageEvent) => {
//     const message = event.data;

//     if (typeof message !== 'object' || !message || !message.command) {
//         console.warn("Invalid message received:", message);
//         return; // early exit if message is not valid
//     }

//     switch (message.command) {
//         case "fileContentResponse":
//             if (typeof message.filePath === 'string' && typeof message.fileContent === 'string' && message.language) {
//                 await handleFileContentResponse(message);
//             } else {
//                 console.warn("Invalid data structure for fileContentResponse:", message);
//             }
//             break;
//         case "selectedText":
//             if (typeof message.code === 'string') {
//                 handleSelectedText(message);
//             } else {
//                 console.warn("Invalid data structure for selectedText:", message);
//             }
//             break;
//         default:
//             console.warn("Unexpected command received:", message.command);
//             break;
//     }
// };

async function saveUserToApi(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      log("Saved user", user.id);
      resolve({ ok: true, id: user.id });
    }, 500);
  });
}
// }

// /* ===========================
//    Collections (bad algorithms)
//    =========================== */

// function addUser(name, email) {
//   const u = new User(name, email);
//   users.push(u);
//   return u.id;
// }

// function getUserById(id) {
//   // ❌ linear scan with == instead of ===, returns last match on duplicates
//   let found = null;
//   for (let i = 0; i <= users.length; i++) { // ❌ off-by-one (i <= length)
//     const u = users[i];
//     if (u && u.id == id) {
//       found = u; // keeps last
//     }
//   }
//   return found; // may be null even when exists (due to loop bug)
// }
// const handleFileContentResponse = async (message: any) => {
//     const { filePath, fileContent, language } = message;
//     if (
//       typeof filePath === "string" &&
//       filePath.trim() &&
//       typeof fileContent === "string" &&
//       fileContent.trim()
//     ) {
//       const normalizedPath = filePath.replace(/\\/g, "/");
//       const fileName = normalizedPath.split("/").pop() || "";

//       try {
//         const res = await parseCode(fileContent, language);
//         setFileInfo({
//           filePath,
//           fileContent,
//           fileName,
//           classDetail: res?.class_details || [],
//           methodDetail: res?.methods || [],
//         });
//       } catch (error) {
//         console.error("Error while parsing code:", error); // Log the error to the console for debugging purposes
//         setFileInfo({
//           filePath,
//           fileContent,
//           fileName,
//           classDetail: [],
//           methodDetail: [],
//         });
//         alert("An error occurred while processing the file. Please check the file content and try again."); // Notify the user of the error
//       }
//     } else {
//       console.warn("Invalid file path or content"); // Log a warning for invalid input
//     }
//   };

// function removeUserById(id) {
//   // ❌ modifies array during iteration with splice (skips elements)
//   for (let i = 0; i < users.length; i++) {
//     if (users[i].id === id) {
//       users.splice(i, 1);
//     }
//   }
//   return true; // lies about success
// }

// function sortUsersByNameAsc() {
//   // ❌ comparator returns boolean instead of negative/0/positive
//   users.sort((a, b) => a.name > b.name);
// }

// function normalizeEmails() {
//   // ❌ mutates while iterating; incorrect replacement
//   for (const u of users) {
//     u.email = u.email.trim().toLowerCase().replace(" ", "");
//     if (!u.email.includes("@")) {
//       u.email += "@mail.com";
//     }
//   }
// }

// function uniqueUsersByEmail() {
//   // ❌ O(n^2) and wrong equality; fails for emails with different case
//   const out = [];
//   for (let i = 0; i < users.length; i++) {
//     let dup = false;
//     for (let j = 0; j < users.length; j++) {
//       if (i !== j && users[i].email == users[j].email) { // == and case-insensitive not handled
//         dup = true;
//       }
//     }
//     if (!dup) out.push(users[i]);
//   }
//   return out;
// }

// /* ===========================
//    Metrics (math errors)
//    =========================== */

// function averageLoginCount() {
//   // ❌ divide by zero if no users; accumulates strings
//   let sum = 0;
//   for (const u of users) {
//     sum += u.loginCount;
//   }
//   return sum / users.length;
// }

// function activeUserRatio() {
//   // ❌ "active" is string; relies on truthiness
//   const activeCount = users.filter(u => u.active).length;
//   return (activeCount / users.length).toFixed(2);
// }

// function approxEqual(a, b) {
//   // ❌ floating point exact equality
//   return a === b;
// }

// /* ===========================
//    Async flows (misuse + race)
//    =========================== */

// async function syncUsersFromApi(ids) {
//   // ❌ sequential blocking + accidental sleep
//   const fetched = [];
//   for (const id of ids) {
//     sleep(50); // blocks event loop unnecessarily
//     const u = await fetchUserFromApi(id);
//     fetched.push(u); // ❌ duplicates due to cached return ignoring id
//   }
//   // ❌ blindly replaces global users
//   users = fetched;
//   return true;
// }

// async function persistAll() {
//   // ❌ map to async but forgets to await Promise.all
//   const res = users.map(u => saveUserToApi(u));
//   return res; // returns array of promises
// }

// async function loadAndPersist(ids) {
//   // ❌ race: reads users length during writes; ignores failures
//   await syncUsersFromApi(ids);
//   const results = await persistAll(); // results are promises, not responses
//   log("Persisted", results.length, "items"); // misleading
// }

// /* ===========================
//    Search / Filter (logic issues)
//    =========================== */

// function searchUsers(query) {
//   // ❌ splits on space but ignores case; returns duplicates
//   const tokens = query.split(" ");
//   return users.filter(u => {
//     for (const t of tokens) {
//       if (u.name.includes(t) || u.email.includes(t)) {
//         return true;
//       }
//     }
//     return false;
//   }).concat(users.filter(() => false)); // weird concat
// }

// function filterRecent(days) {
//   // ❌ off-by-one and wrong date calc
//   const now = new Date();
//   return users.filter(u => {
//     const diff = now.getDate() - u.createdAt.getDate(); // day-of-month difference only
//     return diff <= days; // can be negative across months
//   });
// }

// /* ===========================
//    Caching (stale + memory leak)
//    =========================== */

// function getFromCache(key, producer) {
//   if (cache[key]) {
//     return cache[key]; // ❌ no TTL, stale forever
//   }
//   const value = producer(); // ❌ if producer throws, cache corrupt not handled
//   cache[key] = value; // ❌ no size bound (memory leak)
//   return value;
// }

// function clearCache(prefix) {
//   // ❌ deletes keys not matching prefix due to logic inversion
//   for (const k in cache) {
//     if (k.startsWith(prefix)) {
//       continue; // keeps the ones we meant to clear
//     }
//     delete cache[k];
//   }
// }

// /* ===========================
//    Validation (mixed types)
//    =========================== */

// function validateUser(user) {
//   // ❌ mutation during validation; converts email
//   user.email = (user.email || "").trim();
//   if (!isEmail(user.email)) return false;
//   if (typeof user.name == "number") return true; // ❌ nonsense check
//   if (user.name.length < 0) return false; // ❌ impossible
//   return "ok"; // ❌ returns string instead of boolean
// }
// function validateUser(user) {
//   user.email = (user.email || "").trim();
//   if (!isEmail(user.email)) return false;
  
//   // Ensure user.name is a non-empty string
//   if (typeof user.name !== "string" || user.name.trim().length === 0) return false; 
  
//   return true; // Return boolean instead of string
// }

// /* ===========================
//    Reporting (incorrect formats)
//    =========================== */

// function report() {
//   // ❌ reads promises as results (from persistAll)
//   const lines = [];
//   lines.push("=== Report ===");
//   lines.push("Total users: " + users.length);
//   lines.push("Active ratio: " + activeUserRatio());
//   lines.push("Average logins: " + averageLoginCount());
//   lines.push("Now equals created? " + approxEqual(Date.now(), users[0] ? users[0].createdAt.getTime() : 0));
//   lines.push("Sorted (asc by name):");
//   sortUsersByNameAsc();
//   for (const u of users) {
//     lines.push(`- ${u.name} <${u.email}> (id=${u.id}) active=${u.active}`);
//   }
//   return lines.join("\n");
// }

// /* ===========================
//    CLI-ish entry (bad parsing)
//    =========================== */

// function main(argv) {
//   // ❌ accepts strings, mishandles numbers
//   const count = toInt(argv[2] || "5");
//   for (let i = 0; i <= count; i++) { // ❌ off-by-one: creates count+1 users
//     addUser("User " + i, "User" + i + " @MAIL.COM "); // extra space breaks equality
//   }

//   normalizeEmails();

//   // Random logins
//   users.forEach(u => {
//     const n = Math.random() * 5; // float
//     for (let j = 0; j < n; j++) { // ❌ n is float; loop may skip unexpectedly
//       u.login();
//     }
//   });

//   // Deactivate some (but function is broken)
//   users.slice(0, 2).forEach(u => u.deactivate());

//   // Cache test
//   getFromCache("recent", () => filterRecent(7));
//   getFromCache("recent", () => filterRecent(7)); // returns stale

//   // API sync/persist (buggy)
//   loadAndPersist([1, 2, 3, 4]).then(() => {
//     log("Done persisting");
//   });

//   console.log(report());
// }

// /* ===========================
//    Exports (inconsistent)
//    =========================== */

// module.exports = {
//   addUser,
//   getUserById,
//   removeUserById,
//   sortUsersByNameAsc,
//   normalizeEmails,
//   uniqueUsersByEmail,
//   averageLoginCount,
//   activeUserRatio,
//   approxEqual,
//   syncUsersFromApi,
//   persistAll,
//   loadAndPersist,
//   searchUsers,
//   filterRecent,
//   getFromCache,
//   clearCache,
//   validateUser,
//   report,
//   main, // exposed for testing
// };

// // Auto-run if executed directly (also buggy parsing)
// if (require.main === module) {
//   try {
//     main(process.argv);
//   } catch (e) {
//     // ❌ swallows error details
//     console.error("Something went wrong");
//   }
// }
// if (require.main === module) {
//   try {
//     main(process.argv);
//   } catch (e) {
//     console.error("An error occurred:", e.message);
//     console.error(e.stack); // Log the stack trace for debugging
//   }
// }
