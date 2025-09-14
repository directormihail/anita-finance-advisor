import React from 'react';
import { 
  MessageCircle, 
  Settings, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  LogOut
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import './Sidebar.css';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface SidebarProps {
  onViewChange: (view: 'chat' | 'settings' | 'finance') => void;
  currentView: 'chat' | 'settings' | 'finance';
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  recentTransactions?: Transaction[];
  user: SupabaseUser;
}

const Sidebar: React.FC<SidebarProps> = ({ onViewChange, currentView, totalBalance, monthlyIncome, monthlyExpenses, recentTransactions = [], user }) => {
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">A</div>
          <span className="logo-text">ANITA</span>
        </div>
        <p className="tagline">Your Finance AI Assistant</p>
      </div>

      <div className="sidebar-nav">
        <button 
          className={`nav-item ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => onViewChange('chat')}
        >
          <MessageCircle size={20} />
          <span>Chat with ANITA</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'finance' ? 'active' : ''}`}
          onClick={() => onViewChange('finance')}
        >
          <BarChart3 size={20} />
          <span>Finance Dashboard</span>
        </button>
        <button 
          className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => onViewChange('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="quick-stats">
          <div className="quick-stat">
            <DollarSign size={16} />
            <span>Total Balance</span>
            <span className={`stat-value ${totalBalance >= 0 ? 'positive' : ''}`}>
              ${totalBalance.toLocaleString()}
            </span>
          </div>
          <div className="quick-stat">
            <TrendingUp size={16} />
            <span>This Month Income</span>
            <span className="stat-value positive">+${monthlyIncome.toLocaleString()}</span>
          </div>
          <div className="quick-stat">
            <DollarSign size={16} />
            <span>This Month Expenses</span>
            <span className="stat-value">-${monthlyExpenses.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="recent-transactions">
          <h4>All Transactions ({recentTransactions.length})</h4>
          {recentTransactions.length > 0 ? (
            <div className="recent-transactions-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className={`recent-transaction ${transaction.type}`}>
                  <div className="transaction-info">
                    <span className="transaction-desc">{transaction.description}</span>
                    <span className="transaction-category">{transaction.category}</span>
                  </div>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-transactions-sidebar">
              <p>No transactions yet. Start chatting with ANITA!</p>
            </div>
          )}
        </div>

        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="sign-out-button" onClick={handleSignOut}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
