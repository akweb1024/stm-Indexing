import * as admin from "firebase-admin";
admin.initializeApp();

// Import all functions from their respective modules
import * as users from "./modules/users/users.functions";
import * as journals from "./modules/journals/journals.functions";
import * as papers from "./modules/papers/papers.functions";
import * as indexing from "./modules/indexing/indexing.functions";
import * as databases from "./modules/databases/databases.functions";
import * as audit from "./modules/audit/audit.functions";
import * as jobs from "./jobs/scheduler";

// Export all functions
export {
    users,
    journals,
    papers,
    indexing,
    databases,
    audit,
    jobs
};