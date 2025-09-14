# ANITA Finance Advisor - Environment Setup

## Supabase Configuration

Your Supabase project has been configured with the following details:

- **Project URL**: `https://kezregiqfxlrvaxytdet.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (configured)

## Local Development Setup

### Option 1: Environment Variables (Recommended)

Create a `.env.local` file in your project root:

```bash
# Create .env.local file
cat > .env.local << 'EOF'
REACT_APP_SUPABASE_URL=https://kezregiqfxlrvaxytdet.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlenJlZ2lxZnhscnZheHl0ZGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5MTgsImV4cCI6MjA3MzI3MjkxOH0.X4QWu0W31Kv_8KGQ6h_n4PYnQOMTX85CYbWJVbv2AxM
EOF
```

### Option 2: Direct Configuration

The configuration is already set up in `src/supabaseClient.ts` with environment variables, so the app will work with proper environment setup.

## Production Deployment

### Vercel Deployment

```bash
# Set environment variables in Vercel
vercel env add REACT_APP_SUPABASE_URL production
# When prompted, enter: https://kezregiqfxlrvaxytdet.supabase.co

vercel env add REACT_APP_SUPABASE_ANON_KEY production
# When prompted, enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlenJlZ2lxZnhscnZheHl0ZGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5MTgsImV4cCI6MjA3MzI3MjkxOH0.X4QWu0W31Kv_8KGQ6h_n4PYnQOMTX85CYbWJVbv2AxM

# Deploy to production
vercel --prod
```

### Other Platforms

For other deployment platforms, set these environment variables:

- `REACT_APP_SUPABASE_URL`: `https://kezregiqfxlrvaxytdet.supabase.co`
- `REACT_APP_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlenJlZ2lxZnhscnZheHl0ZGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5MTgsImV4cCI6MjA3MzI3MjkxOH0.X4QWu0W31Kv_8KGQ6h_n4PYnQOMTX85CYbWJVbv2AxM`

## Database Schema

The following tables have been created in your Supabase database:

### anita_data table
- Stores chat messages and financial transactions
- Includes RLS policies for user data isolation
- Columns: id, account_id, message_text, sender, transaction_type, transaction_amount, transaction_category, transaction_description, transaction_date, data_type, created_at, updated_at

### profiles table
- Stores user profile information
- Includes RLS policies for user data isolation
- Columns: id, name, email, phone, location, created_at, updated_at

### Triggers
- Automatic profile creation when new users sign up
- Profile data is automatically populated from auth.users table

## Testing the Configuration

1. Start the development server:
   ```bash
   npm start
   ```

2. Open the app in your browser and try to sign in with email magic link
3. Once authenticated, try adding a transaction through the chat interface
4. Check the Supabase dashboard to verify data is being saved correctly

## Files Updated

- `src/supabaseClient.ts` - New Supabase client configuration
- `src/components/Auth.tsx` - New authentication component
- `src/App.tsx` - Updated with authentication state management
- `src/components/ChatInterface.tsx` - Updated for Supabase integration
- `src/components/Settings.tsx` - Updated for profile management
- `src/components/Sidebar.tsx` - Updated with user info and sign out
- `src/components/FinancePage.tsx` - Updated to accept user prop

## Next Steps

1. Set up your environment variables (REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY)
2. Test the authentication flow
3. Test data persistence through the chat interface
4. Deploy to production with environment variables
