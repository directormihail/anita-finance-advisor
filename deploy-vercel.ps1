# Automated Vercel Environment Setup for Windows
Write-Host "Automated Vercel Environment Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}
Write-Host ""

# Set environment variables
Write-Host "Setting REACT_APP_OPENAI_API_KEY..." -ForegroundColor Cyan
vercel env add REACT_APP_OPENAI_API_KEY production
vercel env add REACT_APP_OPENAI_API_KEY preview
vercel env add REACT_APP_OPENAI_API_KEY development
Write-Host ""

Write-Host "Setting REACT_APP_SUPABASE_URL..." -ForegroundColor Cyan
vercel env add REACT_APP_SUPABASE_URL production
vercel env add REACT_APP_SUPABASE_URL preview
vercel env add REACT_APP_SUPABASE_URL development
Write-Host ""

Write-Host "Setting REACT_APP_SUPABASE_ANON_KEY..." -ForegroundColor Cyan
vercel env add REACT_APP_SUPABASE_ANON_KEY production
vercel env add REACT_APP_SUPABASE_ANON_KEY preview
vercel env add REACT_APP_SUPABASE_ANON_KEY development
Write-Host ""

# Deploy
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod
Write-Host ""

Write-Host "Deployment complete!" -ForegroundColor Green
