#!/bin/sh
set -e

echo "🚀 Starting STM Indexing Platform..."

# Navigate to backend once to simplify commands
cd backend

# 1. Apply database migrations
# Using 'db push' is okay for prototyping, but for production, 
# 'prisma migrate deploy' is usually preferred.
echo "📦 Applying database schema..."
npx prisma db push --accept-data-loss

# 2. Seed the database
# Instead of ts-node, it is faster to run the seed via npx prisma
echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️ Seed attempt finished or already exists"

# 3. Start the server
echo "🟢 Starting server..."
# Using the absolute path to the compiled JS
node dist/index.js