# Architecture

The application is a single-page application (SPA) built with React and Vite, with a backend powered by Firebase services.

- **Frontend:** React, TypeScript, Material-UI for the UI components, React Query for data fetching, and Zustand for state management.
- **Backend:** Firebase Firestore as the database, Firebase Authentication for user management, Firebase Functions for server-side logic, and Firebase Hosting for deploying the web app.
- **Security:** Security is a core component, with RBAC enforced at both the Firestore and Cloud Function levels. Google Secret Manager is used for all secrets.
