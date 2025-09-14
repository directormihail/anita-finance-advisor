# ANITA Finance Advisor - Deployment Guide

## Vercel Deployment

### Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`

### Deploy to Vercel

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project in Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add these variables:
     - `REACT_APP_SUPABASE_URL`: `https://kezregiqfxlrvaxytdet.supabase.co`
     - `REACT_APP_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlenJlZ2lxZnhscnZheHl0ZGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5MTgsImV4cCI6MjA3MzI3MjkxOH0.X4QWu0W31Kv_8KGQ6h_n4PYnQOMTX85CYbWJVbv2AxM`

### Alternative: One-Command Deploy

```bash
# Set environment variables and deploy
vercel env add REACT_APP_SUPABASE_URL production
# Enter: https://kezregiqfxlrvaxytdet.supabase.co

vercel env add REACT_APP_SUPABASE_ANON_KEY production  
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlenJlZ2lxZnhscnZheHl0ZGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5MTgsImV4cCI6MjA3MzI3MjkxOH0.X4QWu0W31Kv_8KGQ6h_n4PYnQOMTX85CYbWJVbv2AxM

vercel --prod
```

## Database Setup

The database schema has been fixed to use `message_text` instead of `message` column. The `vercel.json` file includes the environment variables for immediate deployment.

## Troubleshooting

### Database Connection Issues
- Ensure your Supabase project is active
- Check that the anon key is correct
- Verify the project URL is accessible

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors with `npm run build`
- Ensure all environment variables are set

### Deployment Issues
- Check Vercel logs in the dashboard
- Verify environment variables are set correctly
- Ensure the build completes successfully locally first