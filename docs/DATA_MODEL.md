# Firestore Data Model

This document describes the Firestore data model for the application.

## Collections

- **users:** Stores user information, including their role, tenant, and assigned journals.
- **journals:** Stores information about each journal, including its connection details to WordPress.
- **papers:** Stores information about each paper, including its indexing status.
- **indexing_applications:** Stores information about indexing applications for each journal.
- **database_configs:** Stores the configuration for each database plugin.
- **audit_logs:** Stores an immutable log of all actions taken in the system.
- **tasks:** Stores tasks that need to be completed.

## Unique Rules

- **DOI uniqueness:** The DOI for each paper must be unique per journal. This is enforced by using a deterministic document ID or a separate uniqueness collection.

## Composite Indexes

- `papers`: `tenantId` + `journalId` + `pubDate` desc
- `papers`: `tenantId` + `journalId` + `indexing.scholar.status` + `pubDate` desc
- `indexing_applications`: `tenantId` + `journalId` + `databaseName` + `status`
- `audit_logs`: `tenantId` + `timestamp` desc
