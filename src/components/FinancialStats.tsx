import React from 'react';
import './FinancialStats.css';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface FinancialStatsProps {
  transactions?: Transaction[];
}

const FinancialStats: React.FC<FinancialStatsProps> = ({ transactions = [] }) => {
  // Calculate real data from transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const income = currentMonthTransactions.filter(t => t.type === 'income');
  const expenses = currentMonthTransactions.filter(t => t.type === 'expense');

  // Calculate expense categories
  const expenseCategories = expenses.reduce((acc, transaction) => {
    const category = transaction.category || 'Other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseData = Object.entries(expenseCategories).map(([name, value], index) => ({
    name,
    value,
    color: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#10b981', '#f59e0b'][index % 7]
  }));

  // Calculate monthly data for the last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === date.getMonth() && 
             transactionDate.getFullYear() === date.getFullYear();
    });
    
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    monthlyData.push({
      month: monthName,
      income: monthIncome,
      expenses: monthExpenses
    });
  }

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // Calculate max value for bar scaling
  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.income, d.expenses)));

  return (
    <div className="financial-stats">
      <div className="stats-section">
        <h4>Monthly Expenses</h4>
        {expenseData.length > 0 ? (
          <>
            <div className="expense-legend">
              {expenseData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            No expenses recorded this month
          </div>
        )}
      </div>

      <div className="stats-section">
        <h4>Income vs Expenses (Last 6 Months)</h4>
        <div className="bar-chart-container">
          <div className="bar-chart">
            {monthlyData.map((data, index) => (
              <div key={index} className="bar-group">
                <div className="bar-labels">
                  <span className="month-label">{data.month}</span>
                </div>
                <div className="bars">
                  <div 
                    className="bar income-bar" 
                    style={{ 
                      height: `${(data.income / maxValue) * 100}%`,
                      backgroundColor: '#10b981'
                    }}
                    title={`Income: $${data.income.toFixed(2)}`}
                  />
                  <div 
                    className="bar expense-bar" 
                    style={{ 
                      height: `${(data.expenses / maxValue) * 100}%`,
                      backgroundColor: '#ef4444'
                    }}
                    title={`Expenses: $${data.expenses.toFixed(2)}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="chart-legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }} />
              <span>Income</span>
            </div>
            <div className="chart-legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }} />
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">Total Monthly Income</span>
          <span className="summary-value positive">${totalIncome.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Monthly Expenses</span>
          <span className="summary-value">${totalExpenses.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Net Balance</span>
          <span className={`summary-value ${totalIncome - totalExpenses >= 0 ? 'positive' : ''}`}>
            ${(totalIncome - totalExpenses).toFixed(2)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Savings Rate</span>
          <span className="summary-value positive">{savingsRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialStats;