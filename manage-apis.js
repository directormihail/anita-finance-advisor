#!/usr/bin/env node

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
        const envLine = `${keyName}=${keyValue}`;
        fs.appendFileSync(this.envFile, `\n${envLine}`);
        
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
