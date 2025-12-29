# Security

Security is a top priority for this application. Here's a summary of the security measures in place:

- **Role-Based Access Control (RBAC):**  RBAC is enforced twice:
    1. **Firestore Security Rules:**  Data access is restricted at the database level.
    2. **Cloud Functions:**  Each function verifies the user's role and permissions before executing.
- **Multi-Factor Authentication (MFA):** MFA is required for privileged roles.
- **Secret Management:**  All secrets are stored in Google Secret Manager. No secrets are stored in the client-side code or in Firestore.
- **Audit Logging:**  All state-mutating actions are logged in an immutable `audit_logs` collection.
- **Data Validation:**  All data is validated using Zod on the server-side.
