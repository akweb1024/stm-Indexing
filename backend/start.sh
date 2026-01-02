#!/bin/sh
set -e

echo "🚀 Starting STM Indexing Platform..."

# Apply database migrations (push schema state)
echo "📦 Applying database schema..."
cd backend && ./node_modules/.bin/prisma db push --accept-data-loss && cd ..

# Seed the database
echo "🌱 Seeding database..."
# We allow seeding to fail if it's already seeded, but we log the attempt
cd backend && ./node_modules/.bin/ts-node prisma/seed.ts || echo "⚠️ Seed attempt finished (might already exist)" && cd ..

# Start the server
echo "🟢 Starting server..."
cd backend && node dist/index.js
