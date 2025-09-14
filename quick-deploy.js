#!/usr/bin/env node

/**
 * Quick Deploy Script - Fully Automated
 * Handles everything: environment variables, git, and deployment
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Quick Deploy - Fully Automated');
console.log('==================================');

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

// Git operations
try {
    console.log('📝 Committing changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Auto-deploy: Update environment variables"', { stdio: 'inherit' });
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
console.log('📋 Next steps:');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Click on your project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add these variables:');
console.log('');

Object.entries(envVars).forEach(([key, value]) => {
    console.log(`   ${key} = ${value}`);
});

console.log('');
console.log('5. Redeploy your project');
console.log('');
console.log('🔮 Future deployments will be automatic when you push to GitHub!');
console.log('🔑 To add new APIs: npm run add-api');
