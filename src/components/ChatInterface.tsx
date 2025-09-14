import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { aiService } from '../aiService';
import './ChatInterface.css';

interface Message {
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

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface ChatInterfaceProps {
  onTransactionAdd?: (transaction: Transaction) => void;
  onMessageAdd?: (message: Message) => void;
  messages: Message[];
  user: SupabaseUser;
  transactions: Transaction[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onTransactionAdd, onMessageAdd, messages, user, transactions }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      console.log('🧪 Testing API connection on component mount...');
      const isConnected = await aiService.testConnection();
      if (isConnected) {
        console.log('🎉 ANITA is ready with AI capabilities!');
      } else {
        console.warn('⚠️ ANITA is running in fallback mode');
      }
    };
    testAPI();
  }, []);

  // Use AI service for transaction parsing
  const parseTransaction = (message: string): Transaction | null => {
    return aiService.parseTransaction(message);
  };

  // Use AI service for generating responses
  const getAnitaResponse = async (userMessage: string, transaction?: Transaction): Promise<string> => {
    return await aiService.generateResponse(userMessage, transactions, messages, transaction);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const transaction = parseTransaction(inputText);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      transaction: transaction || undefined
    };

    onMessageAdd?.(userMessage);
    
    // Add transaction to local state if one was parsed
    if (transaction) {
      onTransactionAdd?.(transaction);
    }
    
    setInputText('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await getAnitaResponse(inputText, transaction || undefined);
      
      const anitaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'anita',
        timestamp: new Date()
      };
      
      onMessageAdd?.(anitaResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Let me try again! 💅",
        sender: 'anita',
        timestamp: new Date()
      };
      onMessageAdd?.(fallbackResponse);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1 className="main-title">ANITA</h1>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-avatar">
              {message.sender === 'anita' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              {message.transaction && (
                <div className={`transaction-info ${message.transaction.type}`}>
                  <span className="transaction-amount">
                    {message.transaction.type === 'income' ? '+' : '-'}${message.transaction.amount}
                  </span>
                  <span className="transaction-desc">{message.transaction.description}</span>
                </div>
              )}
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message anita">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask ANITA anything! She's your AI friend who's great with money 💅"
            rows={1}
            className="input-field"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
