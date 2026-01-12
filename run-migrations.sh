#!/bin/bash
# Run Prisma migrations on production database
# Make sure DATABASE_URL is set to your production database

echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "✅ Migrations complete!"
