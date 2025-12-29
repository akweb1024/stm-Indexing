# Threat Model

This document outlines the threat model for the STM Journal Indexing & Intelligence Suite.

## Threats & Mitigations

### 1. Unauthorized Access to Data

*   **Threat:** A user from one tenant accessing data from another tenant.
*   **Mitigation:** All Firestore queries are strictly filtered by `tenantId`. Security rules and Cloud Functions enforce this.

*   **Threat:** An editor from one journal accessing data from another journal within the same tenant.
*   **Mitigation:** User documents contain `assignedJournalIDs`. Security rules and Cloud Functions check this array.

### 2. Privilege Escalation

*   **Threat:** An editor changing their own role to `journal_manager`.
*   **Mitigation:** Role changes are only allowed via the `users.setRole` function, which is restricted to `super_admin`.

### 3. Insecure Direct Object References (IDOR)

*   **Threat:** A user changing the `journalId` in an API call to access an unauthorized journal.
*   **Mitigation:** The backend verifies that the user is authorized for the requested `journalId`.

### 4. Secret Leakage

*   **Threat:** A WordPress application password being exposed to the client.
*   **Mitigation:** All secrets are stored in Google Secret Manager and are only accessed by Cloud Functions. They are never sent to the client.

### 5. Denial of Service (DoS)

*   **Threat:** A malicious user overwhelming the system with requests.
*   **Mitigation:** Cloud Functions have rate limiting. Firestore has its own built-in protections.
