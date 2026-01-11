# JobFlow Deployment Guide

This guide will walk you through deploying JobFlow to production.

## Prerequisites
- GitHub account (✅ You have this)
- Vercel account (free tier is fine)
- Database provider account (Neon, Supabase, or Render - free tiers available)

---

## Step 1: Set Up Production Database

### Option A: Neon (Recommended - Easiest)
1. Go to https://neon.tech and sign up (free)
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://user:password@host/dbname?sslmode=require`)
4. Save this for Step 4

### Option B: Supabase
1. Go to https://supabase.com and sign up (free)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection Pooling recommended)
5. Save this for Step 4

### Option C: Render
1. Go to https://render.com and sign up (free)
2. Create a new PostgreSQL database
3. Copy the Internal Database URL
4. Save this for Step 4

---

## Step 2: Generate AUTH_SECRET

Run this command locally to generate a secure AUTH_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need this for Step 4.

---

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your `JobFlow` repository
4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. **DON'T CLICK DEPLOY YET** - We need to add environment variables first

---

## Step 4: Configure Environment Variables in Vercel

Before deploying, add these environment variables in Vercel:

1. In the Vercel project setup, scroll to "Environment Variables"
2. Add the following variables:

   ```
   DATABASE_URL = (your production database connection string from Step 1)
   AUTH_SECRET = (the secret you generated in Step 2)
   NODE_ENV = production
   ```

3. Click "Add" for each variable

---

## Step 5: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

---

## Step 6: Run Database Migrations

After deployment, you need to run your Prisma migrations:

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations
npx prisma migrate deploy
```

### Option B: Using Vercel Dashboard
1. Go to your project in Vercel
2. Open the "Deployments" tab
3. Click on the latest deployment
4. Open the "Functions" tab
5. You can run migrations through a one-time script (see below)

### Option C: Create a Migration Script
We can create a script to run migrations (I'll help you with this)

---

## Step 7: Verify Deployment

1. Visit your Vercel URL
2. Create a new account
3. Test the app functionality
4. Check that data is being saved to your production database

---

## Future Deployments

After the initial setup:
- Just push to GitHub → Vercel auto-deploys
- Database migrations run automatically (if configured)
- Zero downtime updates

---

## Troubleshooting

### Database Connection Issues
- Make sure your DATABASE_URL includes `?sslmode=require` for SSL
- Check that your database allows connections from Vercel IPs (most cloud databases do by default)

### Migration Issues
- Make sure migrations are in the `prisma/migrations` folder
- Run `npx prisma migrate deploy` after deployment

### Build Errors
- Check the Vercel build logs
- Ensure all environment variables are set correctly
- Make sure `NODE_ENV=production` is set

---

## Optional: Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
