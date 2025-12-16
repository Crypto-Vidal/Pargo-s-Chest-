# Vercel Deployment Fix

The app was crashing because SQLite doesn't work on Vercel. Follow these steps:

## Step 1: Set Up Vercel Postgres (FREE)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project: `pargo-s-chest`
3. Click the **Storage** tab at the top
4. Click **Create Database**
5. Select **Postgres** (it's free!)
6. Click **Create**
7. Accept the terms and create the database

## Step 2: Connect the Database

After creating the database, Vercel will show you environment variables. You need to:

1. Go to **Settings** → **Environment Variables**
2. Vercel should have automatically added these:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

3. **Add these two variables** (if not already there):
   - Name: `DATABASE_URL` → Value: Copy from `POSTGRES_PRISMA_URL`
   - Name: `DIRECT_URL` → Value: Copy from `POSTGRES_URL_NON_POOLING`

## Step 3: Redeploy

1. Go back to the **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"** is OFF
5. Click **Redeploy**

## That's it!

Your app should now work on mobile at: `https://pargo-s-chest.vercel.app`

---

## Alternative: Use Neon (if you prefer)

If you don't want to use Vercel Postgres, you can use [Neon](https://neon.tech/) (also free):

1. Go to https://neon.tech/
2. Sign up and create a project
3. Copy the connection string
4. In Vercel, add environment variables:
   - `DATABASE_URL` → your Neon connection string
   - `DIRECT_URL` → your Neon connection string (same)
5. Redeploy
