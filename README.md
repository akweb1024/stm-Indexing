# STM Journal Indexing & Intelligence Suite

This is a secure, modular, multi-tenant indexing management system for STM Journals.

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- Java JDK (for Firebase Emulator Suite)
- Firebase CLI

### Installation
1. Clone the repository.
2. Install root dependencies: `npm install`
3. Install functions dependencies: `cd functions && npm install && cd ..`

### Firebase Emulator Setup
1. **Initialize Firebase:**
   ```bash
   firebase init
   ```
   - Select "Use an existing project" and choose your Firebase project.
   - Select Functions and Firestore.
   - Do NOT overwrite any files.

2. **Configure Emulator:**
   ```bash
   firebase setup:emulators:firestore
   firebase setup:emulators:pubsub
   firebase setup:emulators:storage
   firebase setup:emulators:auth
   ```
3. **Start Emulator Suite:**
   ```bash
   firebase emulators:start --import=./seed-data --export-on-exit
   ```
   The `--import` flag will load the seed data from `./seed-data`.

### Running the Application
1. **Start the frontend:**
   ```bash
   npm run dev
   ```
2. **Access the app:**
   - Open your browser to `http://localhost:5173`

## Deployment
1. **Deploy Functions, Firestore rules, and indexes:**
   ```bash
   firebase deploy
   ```
2. **Build and deploy the frontend to Firebase Hosting:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
