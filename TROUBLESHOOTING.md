# Troubleshooting Deployment Issues

## Error: "URL must start with the protocol `postgresql://` or `postgres://`"

This error means your `DATABASE_URL` environment variable in Vercel is either:
1. Not set
2. Set incorrectly (wrong format)
3. Contains extra characters or whitespace

### Solution:

1. **Go to your Vercel Dashboard**
   - Navigate to your project
   - Go to **Settings** → **Environment Variables**

2. **Check/Set DATABASE_URL**
   - Look for `DATABASE_URL`
   - If it's missing, add it
   - If it exists, check the format

3. **Correct Format:**
   ```
   postgresql://username:password@host:port/database?sslmode=require
   ```
   
   Examples:
   - **Neon**: `postgresql://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`
   - **Supabase**: `postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require`
   - **Render**: `postgresql://user:pass@dpg-xxx-xxx-a.oregon-postgres.render.com/dbname?sslmode=require`

4. **Common Issues:**
   - ❌ Missing `?sslmode=require` (required for cloud databases)
   - ❌ Extra spaces or quotes around the URL
   - ❌ Using `DATABASE_URL` from connection pooling instead of direct connection
   - ❌ Wrong protocol (should be `postgresql://` not `postgres://` or `http://`)

5. **After fixing:**
   - Click **Save**
   - **Redeploy** your application (or it will auto-redeploy on next push)

### Verify Your Database URL:

1. Copy your database connection string from your database provider
2. Make sure it starts with `postgresql://`
3. Add `?sslmode=require` at the end if it's not already there
4. Paste it into Vercel's DATABASE_URL field (no quotes, no spaces)

### Test the Connection:

After setting the environment variable, visit:
- `/api/health` - This will test if your database connection works
