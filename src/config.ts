// ANITA Finance Advisor - Configuration
// Simple configuration for the application

export const config = {
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  debug: process.env.REACT_APP_DEBUG === 'true' || false,
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || 'http://127.0.0.1:54321',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  },
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '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',
    model: 'gpt-3.5-turbo',
    maxTokens: 500,
    temperature: 0.7
  }
};

export default config;