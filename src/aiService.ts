// Direct API implementation - no config needed

// ANITA Personality Configuration
export interface AnitaPersonality {
  name: string;
  tone: 'sassy' | 'professional' | 'friendly' | 'motivational';
  expertise: string[];
  catchphrases: string[];
  emojiStyle: 'heavy' | 'moderate' | 'minimal';
  responseLength: 'short' | 'medium' | 'long';
  financialAdviceStyle: 'conservative' | 'balanced' | 'aggressive';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'anita';
  timestamp: Date;
  transaction?: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
  };
}

// Default ANITA personality
export const defaultPersonality: AnitaPersonality = {
  name: 'ANITA',
  tone: 'sassy',
  expertise: ['personal finance', 'budgeting', 'expense tracking', 'financial planning'],
  catchphrases: ['💅', 'Periodt!', 'Let\'s get financial!', 'Money moves!', 'Spill the tea!'],
  emojiStyle: 'heavy',
  responseLength: 'medium',
  financialAdviceStyle: 'balanced'
};

class AIService {
  private personality: AnitaPersonality = defaultPersonality;
  private apiKey: string = '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';

  constructor() {
    console.log('AIService initialized with API key:', this.apiKey.substring(0, 20) + '...');
  }

  // Update ANITA's personality
  updatePersonality(newPersonality: Partial<AnitaPersonality>) {
    this.personality = { ...this.personality, ...newPersonality };
  }

  // Get current personality
  getPersonality(): AnitaPersonality {
    return this.personality;
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing OpenAI API connection...');
      console.log('🔑 Using API key:', this.apiKey.substring(0, 20) + '...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello! Just testing the connection.' }],
          max_tokens: 50
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API connection test successful!', data);
        console.log('📊 Usage info:', data.usage);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ API connection test failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('💥 API connection test error:', error);
      return false;
    }
  }

  // Generate system prompt based on personality and context
  private generateSystemPrompt(transactions: Transaction[], recentMessages: Message[]): string {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpenses;

    const recentTransactionSummary = transactions
      .slice(-5)
      .map(t => `${t.type}: $${t.amount} - ${t.description} (${t.category})`)
      .join(', ');

    return `You are ANITA, a sassy and knowledgeable AI assistant with a special focus on personal finance. You're like a best friend who happens to be really good with money! Here's your personality and context:

PERSONALITY:
- Name: ${this.personality.name}
- Tone: ${this.personality.tone}
- Expertise: ${this.personality.expertise.join(', ')} + general knowledge, life advice, and casual conversation
- Catchphrases: ${this.personality.catchphrases.join(', ')}
- Emoji Style: ${this.personality.emojiStyle}
- Response Length: ${this.personality.responseLength}
- Financial Advice Style: ${this.personality.financialAdviceStyle}

CURRENT FINANCIAL CONTEXT:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Net Balance: $${netBalance.toFixed(2)}
- Recent Transactions: ${recentTransactionSummary || 'None'}

RESPONSE GUIDELINES:
1. You're a general AI assistant who can talk about ANYTHING - not just finance!
2. Always maintain your sassy, confident personality with appropriate emojis
3. When users ask general questions, answer them with your personality and expertise
4. When users mention financial transactions, automatically track them and provide insights
5. Use your catchphrases naturally in all conversations
6. Keep responses ${this.personality.responseLength} and engaging
7. Be helpful, encouraging, and fun in all interactions
8. Use emojis ${this.personality.emojiStyle === 'heavy' ? 'frequently' : this.personality.emojiStyle === 'moderate' ? 'moderately' : 'sparingly'}
9. You can discuss topics like: technology, relationships, career advice, health, entertainment, current events, etc.
10. Always be supportive and give practical advice when possible

Remember: You're a versatile AI friend who loves to chat about anything, but you're especially good at helping with money matters! Keep it real and keep it fun! 💅`;
  }

  // Generate AI response using direct API call
  async generateResponse(
    userMessage: string, 
    transactions: Transaction[], 
    recentMessages: Message[],
    detectedTransaction?: Transaction
  ): Promise<string> {
    console.log('🤖 Generating AI response for:', userMessage);
    
    try {
      const systemPrompt = this.generateSystemPrompt(transactions, recentMessages);
      console.log('📝 System prompt generated, length:', systemPrompt.length);
      
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = recentMessages
        .slice(-10)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      console.log('🚀 Making OpenAI API call...');
      console.log('🔑 API Key (first 20 chars):', this.apiKey.substring(0, 20) + '...');
      console.log('📝 Request body:', JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      }, null, 2));
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received:', data);
      console.log('📊 Token usage:', data.usage);
      console.log('💰 Estimated cost: $' + (data.usage?.total_tokens * 0.0005 / 1000).toFixed(6));
      
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (aiResponse) {
        console.log('🎉 AI Response:', aiResponse.substring(0, 100) + '...');
        return aiResponse;
      } else {
        console.warn('⚠️ No content in API response, using fallback');
        return this.getFallbackResponse(userMessage, detectedTransaction);
      }
      
    } catch (error) {
      console.error('💥 OpenAI API Error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return this.getFallbackResponse(userMessage, detectedTransaction);
    }
  }

  // Fallback response when AI is not available
  private getFallbackResponse(userMessage: string, transaction?: Transaction): string {
    if (transaction) {
      if (transaction.type === 'income') {
        const responses = [
          `Nice! 💰 I've added $${transaction.amount} income for "${transaction.description}" to your records. Keep that money flowing! 💅`,
          `Awesome! 💚 $${transaction.amount} income from "${transaction.description}" has been recorded. You're doing great! ✨`,
          `Perfect! 💸 I've logged your $${transaction.amount} income for "${transaction.description}". Keep up the good work! 💪`,
          `Excellent! 💰 Your $${transaction.amount} income from "${transaction.description}" is now tracked. Money moves! 🚀`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      } else {
        const responses = [
          `Got it! 💸 I've recorded $${transaction.amount} expense for "${transaction.description}". Let's keep track of those spending habits! 😉`,
          `Noted! 💳 $${transaction.amount} spent on "${transaction.description}" has been logged. Stay mindful of your budget! 💭`,
          `Recorded! 📝 I've added your $${transaction.amount} expense for "${transaction.description}". Keep tracking! 📊`,
          `Done! ✅ $${transaction.amount} expense for "${transaction.description}" is now in your records. Stay on top of it! 🎯`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    const responses = [
      "Hey there! 💅 What's on your mind today? I can chat about anything or help track your money moves!",
      "What's the tea? ☕ Tell me about your day, ask me anything, or share your financial updates!",
      "Spill it! 💅 I'm here to chat about whatever you want - life, money, or just random thoughts!",
      "What's up? 💸 I can help with advice, answer questions, or track your transactions!",
      "Hey bestie! 💳 What's happening? I'm here for whatever you need!",
      "What's going on? 💰 I'm your AI friend who's great with money but loves all kinds of conversations!",
      "Let's chat! 📊 Tell me about your day, ask me anything, or share your money moves!",
      "What's new? 💅 I'm here to help with anything - from life advice to tracking your finances!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Parse transaction from user message (enhanced version)
  parseTransaction(message: string): Transaction | null {
    // Clean the message
    const cleanMessage = message.trim().toLowerCase();
    
    // Extract number from message (handles $, commas, decimals)
    const numberMatch = cleanMessage.match(/(?:^|\s)(-?\$?\d+(?:,\d{3})*(?:\.\d{2})?)(?:\s|$)/);
    if (!numberMatch) {
      return null;
    }
    
    // Parse the amount
    let amountStr = numberMatch[1].replace(/[$,]/g, ''); // Remove $ and commas
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount)) {
      return null;
    }
    
    // Determine if it's income or expense based on keywords
    const incomeKeywords = ['income', 'earned', 'made', 'received', 'got', 'deposited', 'added', 'salary', 'wage', 'bonus', 'payment', 'refund', 'rebate', 'plus', 'positive', 'gain'];
    const expenseKeywords = ['spent', 'expense', 'bought', 'paid', 'cost', 'withdrew', 'deducted', 'bill', 'charge', 'purchase', 'minus', 'negative', 'loss', 'debt', 'owe'];
    
    const hasIncomeKeyword = incomeKeywords.some(keyword => cleanMessage.includes(keyword));
    const hasExpenseKeyword = expenseKeywords.some(keyword => cleanMessage.includes(keyword));
    
    // If message is just a number, treat as income by default
    if (!hasIncomeKeyword && !hasExpenseKeyword && /^-?\d+(?:\.\d{2})?$/.test(cleanMessage)) {
      return {
        id: Date.now().toString(),
        type: 'income',
        amount: Math.abs(amount), // Ensure positive for income
        category: 'Income',
        description: 'Income',
        date: new Date()
      };
    }
    
    // If message starts with negative number, treat as expense
    if (amount < 0 || cleanMessage.startsWith('-')) {
      return {
        id: Date.now().toString(),
        type: 'expense',
        amount: Math.abs(amount), // Make positive for expense
        category: 'Other',
        description: 'Expense',
        date: new Date()
      };
    }
    
    // Determine type based on keywords
    let type: 'income' | 'expense';
    let description: string;
    
    if (hasIncomeKeyword && !hasExpenseKeyword) {
      type = 'income';
      description = 'Income';
    } else if (hasExpenseKeyword && !hasIncomeKeyword) {
      type = 'expense';
      description = 'Expense';
    } else if (hasIncomeKeyword && hasExpenseKeyword) {
      // If both keywords present, use the one that appears first
      const incomeIndex = Math.min(...incomeKeywords.map(keyword => cleanMessage.indexOf(keyword)).filter(i => i !== -1));
      const expenseIndex = Math.min(...expenseKeywords.map(keyword => cleanMessage.indexOf(keyword)).filter(i => i !== -1));
      
      if (incomeIndex < expenseIndex) {
        type = 'income';
        description = 'Income';
      } else {
        type = 'expense';
        description = 'Expense';
      }
    } else {
      // Default to income if no clear keywords
      type = 'income';
      description = 'Income';
    }
    
    // Try to extract description from the message
    const words = cleanMessage.split(/\s+/);
    const descriptionWords = words.filter(word => 
      !incomeKeywords.includes(word) && 
      !expenseKeywords.includes(word) && 
      !word.match(/^-?\$?\d+(?:,\d{3})*(?:\.\d{2})?$/) &&
      word.length > 1
    );
    
    if (descriptionWords.length > 0) {
      description = descriptionWords.join(' ').trim();
    }
    
    // Categorize expenses
    let category = type === 'income' ? 'Income' : 'Other';
    if (type === 'expense') {
      const desc = description.toLowerCase();
      if (desc.includes('food') || desc.includes('restaurant') || desc.includes('grocery') || desc.includes('dining') || desc.includes('lunch') || desc.includes('dinner')) {
        category = 'Food';
      } else if (desc.includes('gas') || desc.includes('transport') || desc.includes('uber') || desc.includes('taxi') || desc.includes('fuel') || desc.includes('parking')) {
        category = 'Transport';
      } else if (desc.includes('rent') || desc.includes('housing') || desc.includes('mortgage') || desc.includes('utilities') || desc.includes('electric') || desc.includes('water')) {
        category = 'Housing';
      } else if (desc.includes('entertainment') || desc.includes('movie') || desc.includes('game') || desc.includes('netflix') || desc.includes('spotify') || desc.includes('subscription')) {
        category = 'Entertainment';
      } else if (desc.includes('health') || desc.includes('medical') || desc.includes('doctor') || desc.includes('pharmacy') || desc.includes('insurance')) {
        category = 'Healthcare';
      } else if (desc.includes('shopping') || desc.includes('clothes') || desc.includes('clothing') || desc.includes('amazon') || desc.includes('store')) {
        category = 'Shopping';
      } else if (desc.includes('education') || desc.includes('school') || desc.includes('course') || desc.includes('book') || desc.includes('tuition')) {
        category = 'Education';
      }
    }
    
    return {
      id: Date.now().toString(),
      type,
      amount,
      category,
      description,
      date: new Date()
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
