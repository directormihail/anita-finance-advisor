#!/usr/bin/env node

/**
 * Simple Deploy Script - Fixed and Reliable
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Simple Deploy - Fixed and Reliable');
console.log('=====================================');

// Read environment variables
const envFile = '.env.local';
if (!fs.existsSync(envFile)) {
    console.log('❌ .env.local file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envFile, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

console.log(`📋 Found ${Object.keys(envVars).length} environment variables`);

// Update vercel.json
const vercelConfig = {
    "version": 2,
    "builds": [
        {
            "src": "package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "build"
            }
        }
    ],
    "routes": [
        {
            "src": "/static/(.*)",
            "dest": "/static/$1"
        },
        {
            "src": "/(.*)",
            "dest": "/index.html"
        }
    ],
    "env": envVars
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('✅ Updated vercel.json');

// Create proper GitHub Actions workflow
const workflowContent = `name: Deploy to Vercel

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_OPENAI_API_KEY: \${{ secrets.REACT_APP_OPENAI_API_KEY }}
        REACT_APP_SUPABASE_URL: \${{ secrets.REACT_APP_SUPABASE_URL }}
        REACT_APP_SUPABASE_ANON_KEY: \${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.ORG_ID }}
        vercel-project-id: \${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'`;

// Ensure .github/workflows directory exists
const workflowDir = '.github/workflows';
if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
}

fs.writeFileSync('.github/workflows/deploy.yml', workflowContent);
console.log('✅ Updated GitHub Actions workflow');

// Git operations
try {
    console.log('📝 Committing changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Auto-deploy: Update configuration"', { stdio: 'inherit' });
    console.log('✅ Changes committed');
} catch (error) {
    console.log('⚠️  Git commit failed, continuing...');
}

// Push to GitHub
try {
    console.log('📤 Pushing to GitHub...');
    execSync('git push', { stdio: 'inherit' });
    console.log('✅ Pushed to GitHub');
} catch (error) {
    console.log('⚠️  Git push failed, continuing...');
}

console.log('');
console.log('🎉 Deployment initiated!');
console.log('');
console.log('📋 Environment Variables to add to Vercel:');
console.log('==========================================');
Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key} = ${value}`);
});
console.log('');
console.log('🔮 Future deployments will be automatic when you push to GitHub!');
