import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Settings from './components/Settings';
import FinancePage from './components/FinancePage';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import './App.css';

type ViewType = 'chat' | 'settings' | 'finance';
type Theme = 'dark' | 'light';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! Any new expenses or incomes today?",
      sender: 'anita',
      timestamp: new Date()
    }
  ]);
  const [theme, setTheme] = useState<Theme>('dark');

  // Check for existing session and set up auth state listener
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load messages from Supabase
  const loadMessages = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('anita_data')
        .select('*')
        .eq('account_id', user.id)
        .eq('data_type', 'message')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const loadedMessages: Message[] = data.map((item: any) => ({
        id: item.message_id || item.id,
        text: item.message_text || '',
        sender: item.sender || 'user',
        timestamp: new Date(item.transaction_date || item.created_at)
      }));

      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [user]);

  // Load transactions from Supabase
  const loadTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('anita_data')
        .select('*')
        .eq('account_id', user.id)
        .eq('data_type', 'transaction')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      const loadedTransactions: Transaction[] = data.map((item: any) => ({
        id: item.message_id || item.id,
        type: item.transaction_type || 'income',
        amount: item.transaction_amount || 0,
        category: item.transaction_category || 'Other',
        description: item.transaction_description || '',
        date: new Date(item.transaction_date || item.created_at)
      }));

      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, [user]);

  // Load data when user changes
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('anita-theme') as Theme;
        if (savedTheme) {
          setTheme(savedTheme);
        }

        // Load data from Supabase
        await loadMessages();
        await loadTransactions();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [user, loadMessages, loadTransactions]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('anita-theme', theme);
  }, [theme]);

  const handleTransactionAdd = async (transaction: Transaction) => {
    if (!user) {
      console.error('No user found when trying to save transaction');
      return;
    }

    console.log('Saving transaction:', transaction);
    console.log('User ID:', user.id);

    try {
      const { error } = await supabase
        .from('anita_data')
        .insert([{
          account_id: user.id,
          message_text: transaction.description,
          transaction_type: transaction.type,
          transaction_amount: transaction.amount,
          transaction_category: transaction.category,
          transaction_date: transaction.date.toISOString(),
          data_type: 'transaction'
        }]);

      if (error) {
        console.error('Supabase error saving transaction:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        alert(`Failed to save transaction: ${error.message}`);
        return;
      }

      console.log('Transaction saved successfully');
      await loadTransactions();
    } catch (error) {
      console.error('Exception saving transaction:', error);
      alert(`Failed to save transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMessageAdd = async (message: Message) => {
    if (!user) {
      console.error('No user found when trying to save message');
      return;
    }

    console.log('Saving message:', message);
    console.log('User ID:', user.id);
    console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);

    try {
      const { error } = await supabase
        .from('anita_data')
        .insert([{
          account_id: user.id,
          message_text: message.text,
          sender: message.sender,
          transaction_date: message.timestamp.toISOString(),
          data_type: 'message'
        }]);

      if (error) {
        console.error('Supabase error saving message:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        alert(`Failed to save message: ${error.message}`);
        return;
      }

      console.log('Message saved successfully');
      await loadMessages();
    } catch (error) {
      console.error('Exception saving message:', error);
      alert(`Failed to save message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Calculate financial summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;
  
  // Get all transactions sorted by date (newest first)
  const allTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ANITA...</p>
        </div>
      </div>
    );
  }

  // Show auth component if not logged in
  if (!user) {
    return <Auth onAuthSuccess={() => setLoading(false)} />;
  }

  return (
    <div className="app">
      <Sidebar 
        onViewChange={setCurrentView} 
        currentView={currentView}
        totalBalance={netBalance}
        monthlyIncome={totalIncome}
        monthlyExpenses={totalExpenses}
        recentTransactions={allTransactions}
        user={user}
      />
      <div className="main-content">
        {currentView === 'chat' && (
          <ChatInterface 
            onTransactionAdd={handleTransactionAdd} 
            onMessageAdd={handleMessageAdd} 
            messages={messages}
            user={user}
            transactions={transactions}
          />
        )}
        {currentView === 'settings' && <Settings onThemeChange={handleThemeChange} currentTheme={theme} user={user} />}
        {currentView === 'finance' && <FinancePage transactions={transactions} user={user} />}
      </div>
    </div>
  );
};

export default App;