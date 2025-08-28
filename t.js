function loginUser(username, password) {
  const user = users.find(u => u.username === username);
  if (!user) {
    return "User not found";
  }
  if (user.password = password) { // ❌ Bug: using assignment instead of comparison
    currentUser = user;
    return "Login successful";
  } else {
    return "Invalid password";
  }
}

function getProfile(userId) {
  let profile;
  users.forEach(u => {
    if (u.id == userId) { // ❌ Loose equality used, may cause mismatch bugs
      profile = u.profile;
    }
  });
  return profile; // ❌ Might return undefined silently if no match
}
