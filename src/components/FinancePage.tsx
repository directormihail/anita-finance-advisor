import React from 'react';
import FinancialStats from './FinancialStats';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import './FinancePage.css';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface FinancePageProps {
  transactions: Transaction[];
  user: SupabaseUser;
}

const FinancePage: React.FC<FinancePageProps> = ({ transactions, user }) => {

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="finance-page">
      <div className="finance-header">
        <h1>Finance Dashboard - Live!</h1>
      </div>
      
      <div className="finance-content">
        <FinancialStats transactions={transactions} />
        
        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          {sortedTransactions.length > 0 ? (
            <div className="transactions-list">
              {sortedTransactions.map((transaction) => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-icon">
                    {transaction.type === 'income' ? (
                      <TrendingUp size={20} />
                    ) : (
                      <DollarSign size={20} />
                    )}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-category">{transaction.category}</div>
                    <div className="transaction-date">
                      <Calendar size={14} />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-transactions">
              <p>No transactions recorded yet. Start by telling ANITA about your income or expenses!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
