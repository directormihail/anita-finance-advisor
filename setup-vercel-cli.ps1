# Vercel CLI Setup Script for Windows PowerShell
# This script uses Vercel CLI to set up environment variables

Write-Host "🔧 Setting up Vercel Environment Variables with CLI" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host ""
Write-Host "🔐 Setting up environment variables..." -ForegroundColor Yellow

# Set environment variables using Vercel CLI
Write-Host "Setting REACT_APP_OPENAI_API_KEY..." -ForegroundColor Cyan
vercel env add REACT_APP_OPENAI_API_KEY production

Write-Host "Setting REACT_APP_SUPABASE_URL..." -ForegroundColor Cyan  
vercel env add REACT_APP_SUPABASE_URL production

Write-Host "Setting REACT_APP_SUPABASE_ANON_KEY..." -ForegroundColor Cyan
vercel env add REACT_APP_SUPABASE_ANON_KEY production

Write-Host ""
Write-Host "🚀 Redeploying project..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✅ Setup complete! Your app should now be deployed with the new environment variables." -ForegroundColor Green
Write-Host "🌐 Check your Vercel dashboard for the deployment status." -ForegroundColor Blue
