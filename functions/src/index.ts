const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Import all functions from their respective modules
const users = require("./modules/users/users.functions");
const journals = require("./modules/journals/journals.functions");
const papers = require("./modules/papers/papers.functions");
const indexing = require("./modules/indexing/indexing.functions");
const databases = require("./modules/databases/databases.functions");
const audit = require("./modules/audit/audit.functions");
const jobs = require("./jobs/scheduler");

// Export all functions
module.exports = {
    ...users,
    ...journals,
    ...papers,
    ...indexing,
    ...databases,
    ...audit,
    ...jobs
};