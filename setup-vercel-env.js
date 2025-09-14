#!/usr/bin/env node

// Vercel Environment Variables Setup Script
// This script helps you set up environment variables for Vercel deployment

const fs = require('fs');
const path = require('path');

console.log('🔧 Vercel Environment Variables Setup');
console.log('=====================================\n');

// Read the .env.local file
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse environment variables
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

console.log('📋 Environment Variables to add to Vercel:');
console.log('==========================================\n');

Object.entries(envVars).forEach(([key, value]) => {
    console.log(`🔑 ${key}`);
    console.log(`   Value: ${value}`);
    console.log(`   Environment: Production, Preview, Development`);
    console.log('');
});

console.log('📝 Instructions:');
console.log('================');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Click on your "anita-finance-advisor" project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add each variable above with the values shown');
console.log('5. Make sure to select "Production", "Preview", and "Development" for each');
console.log('6. Click "Save" for each variable');
console.log('7. Go to Deployments tab and redeploy your latest deployment');
console.log('\n✅ After setup, your app will automatically deploy with these variables!');
