#!/bin/sh
set -e

echo "🚀 Starting STM Indexing Platform..."

# Apply database migrations (push schema state)
echo "📦 Applying database schema..."
cd backend && ./node_modules/.bin/prisma db push && cd ..

# Seed the database
echo "🌱 Seeding database..."
cd backend && ./node_modules/.bin/ts-node prisma/seed.ts && cd ..

# Start the server
echo "🟢 Starting server..."
node backend/dist/index.js
