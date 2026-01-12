# Run Database Migrations

Your database tables don't exist yet. Run migrations to create them.

## Quick Method (Run Locally)

1. **Set your production DATABASE_URL temporarily:**
   ```bash
   export DATABASE_URL="postgresql://neondb_owner:npg_CmibXEV01KqL@ep-cold-glitter-aese6n4k-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Verify:**
   ```bash
   npx prisma studio
   ```
   (This will open Prisma Studio - you should see your tables)

## Alternative: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login and link:**
   ```bash
   vercel login
   vercel link
   ```

3. **Pull environment variables and run migrations:**
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

## What This Does

- Creates all database tables (users, sessions, job_applications, connections, outreach_entries)
- Applies all migrations in the correct order
- Safe to run multiple times (idempotent)

## After Running Migrations

Your app should work! Try signing up or logging in again.
