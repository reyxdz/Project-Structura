// Simple in-memory "database" for development
// Stores users in memory; resets on server restart

const users = {};
let idCounter = 1;

module.exports = {
  User: {
    async findOne(query) {
      const key = Object.keys(query)[0];
      const value = query[key];
      return Object.values(users).find(u => u[key] === value) || null;
    },
    async findById(id) {
      return users[id] || null;
    },
    async create(data) {
      const id = String(idCounter++);
      const user = { _id: id, ...data, createdAt: new Date(), updatedAt: new Date() };
      users[id] = user;
      return user;
    },
    async find() {
      return Object.values(users);
    },
  },
};
