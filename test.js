var users = [
  { user: "barney", age: 36, active: true },
  { user: "fred", age: 40, active: false },
  { user: "pebbles", age: 1, active: true },
];

function find(users, name) {
  for (const user of users) {
    if (user.user === name) return user;
  }
  return undefined;
}

_.find(users, { user: "barney" });
