#!/bin/sh
set -e

echo "🚀 Starting STM Indexing Platform..."

# Apply database migrations (push schema state)
echo "📦 Applying database schema..."
npx prisma db push --schema=./backend/prisma/schema.prisma

# Seed the database
echo "🌱 Seeding database..."
cd backend && npx ts-node prisma/seed.ts && cd ..

# Start the server
echo "🟢 Starting server..."
node backend/dist/index.js
