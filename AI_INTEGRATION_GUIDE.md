# ANITA AI Integration Guide

## Overview
ANITA now has full AI integration with GPT-3.5, allowing for intelligent, contextual responses and a customizable personality system. This guide will help you set up and configure the AI features.

## Features Added

### 🤖 AI-Powered Responses
- **GPT-3.5 Integration**: ANITA now uses OpenAI's GPT-3.5 for intelligent, contextual responses
- **Context Awareness**: AI responses consider your transaction history and conversation context
- **Fallback System**: Graceful fallback to predefined responses if AI is unavailable

### 🎭 Personality Customization
- **Tone Selection**: Choose from Sassy, Professional, Friendly, or Motivational
- **Emoji Style**: Heavy, Moderate, or Minimal emoji usage
- **Response Length**: Short, Medium, or Long responses
- **Financial Advice Style**: Conservative, Balanced, or Aggressive
- **Expertise Areas**: Customize ANITA's knowledge areas
- **Catchphrases**: Personalize ANITA's signature phrases

### 🔧 Enhanced Transaction Parsing
- **AI-Enhanced Parsing**: More accurate transaction detection and categorization
- **Context-Aware Categorization**: Better understanding of transaction context
- **Improved Description Extraction**: Better parsing of transaction descriptions

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration (already configured)
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration (NEW)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Optional Settings
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### 2. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### 3. Install Dependencies
The OpenAI package has already been installed. If you need to reinstall:

```bash
npm install openai
```

### 4. Start the Application
```bash
npm start
```

## Usage Guide

### Customizing ANITA's Personality

1. **Access Settings**: Click on the Settings tab in the sidebar
2. **ANITA AI Tab**: Select the "ANITA AI" tab in settings
3. **Customize Personality**: Use the personality settings panel to:
   - Choose communication tone
   - Set emoji style preferences
   - Adjust response length
   - Select financial advice style
   - Add/remove expertise areas
   - Customize catchphrases

### AI Features in Action

#### Smart Transaction Recognition
- **Before**: "I spent 50 on food" → Basic parsing
- **After**: "I spent $50 on groceries at Whole Foods" → AI understands context, better categorization

#### Contextual Responses
- **Before**: Generic responses regardless of financial situation
- **After**: Personalized advice based on your spending patterns and financial goals

#### Intelligent Categorization
- **Before**: Manual category selection
- **After**: AI automatically categorizes transactions based on description and context

## Technical Implementation

### AI Service Architecture
```
src/aiService.ts
├── Personality Configuration
├── OpenAI Integration
├── Context Generation
├── Response Generation
└── Fallback System
```

### Key Components
- **AIService Class**: Main service handling all AI operations
- **Personality System**: Configurable personality parameters
- **Context Builder**: Generates financial context for AI
- **Response Generator**: Creates contextual AI responses
- **Transaction Parser**: Enhanced transaction parsing

### Configuration Options
```typescript
interface AnitaPersonality {
  name: string;
  tone: 'sassy' | 'professional' | 'friendly' | 'motivational';
  expertise: string[];
  catchphrases: string[];
  emojiStyle: 'heavy' | 'moderate' | 'minimal';
  responseLength: 'short' | 'medium' | 'long';
  financialAdviceStyle: 'conservative' | 'balanced' | 'aggressive';
}
```

## Troubleshooting

### Common Issues

1. **AI Not Responding**
   - Check if `REACT_APP_OPENAI_API_KEY` is set correctly
   - Verify API key has sufficient credits
   - Check browser console for error messages

2. **Fallback Responses Only**
   - AI service falls back to predefined responses when:
     - No API key provided
     - API request fails
     - Network issues

3. **Personality Not Saving**
   - Personality settings are stored in memory
   - Changes apply immediately to new conversations
   - Refresh page to reset to default personality

### Debug Mode
Enable debug mode by setting `REACT_APP_DEBUG=true` in your `.env` file to see detailed logs.

## Cost Considerations

### OpenAI API Usage
- **Model**: GPT-3.5-turbo (cost-effective)
- **Max Tokens**: 500 per response
- **Temperature**: 0.7 (balanced creativity)
- **Estimated Cost**: ~$0.001-0.002 per conversation

### Optimization Tips
- Responses are cached during the session
- Fallback system reduces API calls
- Configurable token limits prevent overuse

## Future Enhancements

### Planned Features
- **Personality Persistence**: Save personality settings to database
- **Advanced Analytics**: AI-powered financial insights
- **Goal Setting**: AI-assisted financial goal planning
- **Voice Integration**: Voice-based interactions
- **Multi-language Support**: Localized responses

### Customization Options
- **Custom Prompts**: Advanced users can modify system prompts
- **Response Templates**: Create custom response patterns
- **Integration APIs**: Connect with other financial services

## Security & Privacy

### Data Handling
- **API Calls**: Only conversation context sent to OpenAI
- **No Sensitive Data**: Financial amounts and personal info not sent
- **Local Storage**: Personality settings stored locally
- **Encryption**: All API communications encrypted

### Best Practices
- Keep API keys secure
- Monitor API usage regularly
- Use environment variables for configuration
- Regular security updates

## Support

### Getting Help
- Check the browser console for error messages
- Verify environment variables are set correctly
- Test with simple messages first
- Check OpenAI API status if issues persist

### Reporting Issues
- Include error messages from console
- Describe steps to reproduce
- Include your configuration (without API keys)
- Specify browser and OS version

---

**Note**: This AI integration enhances ANITA's capabilities while maintaining the existing functionality. The fallback system ensures the app works even without AI connectivity.
