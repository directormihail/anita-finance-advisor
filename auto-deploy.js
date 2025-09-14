#!/usr/bin/env node

/**
 * Fully Automated Vercel Deployment System
 * Handles API keys, environment variables, and automatic deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AutoDeployer {
    constructor() {
        this.envFile = '.env.local';
        this.vercelConfig = 'vercel.json';
        this.gitIgnoreFile = '.gitignore';
    }

    // Read environment variables from .env.local
    readEnvVars() {
        if (!fs.existsSync(this.envFile)) {
            console.log('❌ .env.local file not found!');
            return {};
        }

        const envContent = fs.readFileSync(this.envFile, 'utf8');
        const envVars = {};

        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envVars[key.trim()] = value.trim();
            }
        });

        return envVars;
    }

    // Generate Vercel environment variables configuration
    generateVercelEnvConfig(envVars) {
        const envConfig = {};
        Object.keys(envVars).forEach(key => {
            envConfig[key] = envVars[key];
        });
        return envConfig;
    }

    // Update vercel.json with environment variables (for reference only)
    updateVercelConfig(envVars) {
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
            "env": this.generateVercelEnvConfig(envVars)
        };

        fs.writeFileSync(this.vercelConfig, JSON.stringify(vercelConfig, null, 2));
        console.log('✅ Updated vercel.json with environment variables');
    }

    // Generate Vercel CLI commands for setting environment variables
    generateVercelCommands(envVars) {
        const commands = [];
        
        commands.push('#!/bin/bash');
        commands.push('echo "🤖 Automated Vercel Environment Setup"');
        commands.push('echo "====================================="');
        commands.push('');
        
        // Check if Vercel CLI is installed
        commands.push('if ! command -v vercel &> /dev/null; then');
        commands.push('    echo "📦 Installing Vercel CLI..."');
        commands.push('    npm install -g vercel');
        commands.push('fi');
        commands.push('');
        
        // Login to Vercel
        commands.push('echo "🔐 Logging into Vercel..."');
        commands.push('vercel login');
        commands.push('');
        
        // Set environment variables
        Object.entries(envVars).forEach(([key, value]) => {
            commands.push(`echo "Setting ${key}..."`);
            commands.push(`vercel env add ${key} production`);
            commands.push(`vercel env add ${key} preview`);
            commands.push(`vercel env add ${key} development`);
            commands.push('');
        });
        
        // Deploy
        commands.push('echo "🚀 Deploying to Vercel..."');
        commands.push('vercel --prod');
        commands.push('');
        commands.push('echo "✅ Deployment complete!"');
        
        return commands.join('\n');
    }

    // Generate PowerShell script for Windows
    generatePowerShellScript(envVars) {
        const commands = [];
        
        commands.push('# Automated Vercel Environment Setup for Windows');
        commands.push('Write-Host "🤖 Automated Vercel Environment Setup" -ForegroundColor Green');
        commands.push('Write-Host "=====================================" -ForegroundColor Green');
        commands.push('');
        
        // Check if Vercel CLI is installed
        commands.push('if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {');
        commands.push('    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow');
        commands.push('    npm install -g vercel');
        commands.push('}');
        commands.push('');
        
        // Set environment variables
        Object.entries(envVars).forEach(([key, value]) => {
            commands.push(`Write-Host "Setting ${key}..." -ForegroundColor Cyan`);
            commands.push(`vercel env add ${key} production`);
            commands.push(`vercel env add ${key} preview`);
            commands.push(`vercel env add ${key} development`);
            commands.push('');
        });
        
        // Deploy
        commands.push('Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow');
        commands.push('vercel --prod');
        commands.push('');
        commands.push('Write-Host "✅ Deployment complete!" -ForegroundColor Green');
        
        return commands.join('\n');
    }

    // Generate GitHub Actions workflow for automatic deployment
    generateGitHubActions(envVars) {
        const envVarsYaml = Object.entries(envVars)
            .map(([key, value]) => `        ${key}: ${{ secrets.${key} }}`)
            .join('\n');

        const workflow = `name: Deploy to Vercel

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
${envVarsYaml}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'`;

        return workflow;
    }

    // Create all automation files
    createAutomationFiles() {
        const envVars = this.readEnvVars();
        
        if (Object.keys(envVars).length === 0) {
            console.log('❌ No environment variables found in .env.local');
            return;
        }

        console.log('🤖 Creating automation files...');

        // 1. Update vercel.json
        this.updateVercelConfig(envVars);

        // 2. Create bash script
        const bashScript = this.generateVercelCommands(envVars);
        fs.writeFileSync('deploy-vercel.sh', bashScript);
        fs.chmodSync('deploy-vercel.sh', '755');

        // 3. Create PowerShell script
        const psScript = this.generatePowerShellScript(envVars);
        fs.writeFileSync('deploy-vercel.ps1', psScript);

        // 4. Create GitHub Actions workflow
        const workflow = this.generateGitHubActions(envVars);
        const workflowDir = '.github/workflows';
        if (!fs.existsSync(workflowDir)) {
            fs.mkdirSync(workflowDir, { recursive: true });
        }
        fs.writeFileSync(
            path.join(workflowDir, 'deploy.yml'),
            `# This file was auto-generated by auto-deploy.js
# Do not edit manually - run 'node auto-deploy.js' to regenerate

${workflow}`
        );

        // 5. Create API management script
        this.createAPIManagementScript();

        console.log('✅ Automation files created:');
        console.log('   📄 deploy-vercel.sh (Linux/Mac)');
        console.log('   📄 deploy-vercel.ps1 (Windows)');
        console.log('   📄 .github/workflows/deploy.yml (GitHub Actions)');
        console.log('   📄 manage-apis.js (API management)');
    }

    // Create API management script for adding new APIs
    createAPIManagementScript() {
        const apiManager = `#!/usr/bin/env node

/**
 * API Management Script
 * Easily add new API keys and environment variables
 */

const fs = require('fs');
const readline = require('readline');

class APIManager {
    constructor() {
        this.envFile = '.env.local';
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async addNewAPI() {
        console.log('🔑 Add New API Key');
        console.log('==================');
        
        const keyName = await this.question('Enter API key name (e.g., REACT_APP_STRIPE_API_KEY): ');
        const keyValue = await this.question('Enter API key value: ');
        const description = await this.question('Enter description (optional): ');
        
        // Add to .env.local
        const envLine = \`\${keyName}=\${keyValue}\`;
        fs.appendFileSync(this.envFile, \`\\n\${envLine}\`);
        
        console.log('✅ API key added to .env.local');
        
        // Regenerate automation files
        console.log('🔄 Regenerating automation files...');
        const { execSync } = require('child_process');
        execSync('node auto-deploy.js', { stdio: 'inherit' });
        
        console.log('✅ Automation files updated!');
        console.log('📝 Next steps:');
        console.log('   1. Run ./deploy-vercel.ps1 (Windows) or ./deploy-vercel.sh (Linux/Mac)');
        console.log('   2. Or push to GitHub for automatic deployment');
        
        this.rl.close();
    }

    question(prompt) {
        return new Promise(resolve => {
            this.rl.question(prompt, resolve);
        });
    }
}

// Run the API manager
const manager = new APIManager();
manager.addNewAPI().catch(console.error);
`;

        fs.writeFileSync('manage-apis.js', apiManager);
        fs.chmodSync('manage-apis.js', '755');
    }

    // Main execution
    run() {
        console.log('🤖 Fully Automated Vercel Deployment System');
        console.log('==========================================');
        
        this.createAutomationFiles();
        
        console.log('');
        console.log('🚀 Quick Start:');
        console.log('   Windows: .\\deploy-vercel.ps1');
        console.log('   Linux/Mac: ./deploy-vercel.sh');
        console.log('');
        console.log('🔑 Add New APIs:');
        console.log('   node manage-apis.js');
        console.log('');
        console.log('📚 GitHub Actions:');
        console.log('   Push to GitHub for automatic deployment');
    }
}

// Run the auto deployer
const deployer = new AutoDeployer();
deployer.run();
