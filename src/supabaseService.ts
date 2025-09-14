// ANITA Finance Advisor - Supabase Service
// Service for managing messages and transactions with Supabase

import { createClient } from '@supabase/supabase-js';
import config from './config';

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

interface SupabaseData {
  id: string;
  account_id: string;
  message_text?: string;
  sender?: 'user' | 'anita';
  message_id?: string;
  data_type: 'message' | 'transaction';
  transaction_type?: 'income' | 'expense';
  transaction_amount?: number;
  transaction_category?: string;
  transaction_description?: string;
  created_at: string;
}

// Supabase configuration
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export class SupabaseAnitaService {
  private static instance: SupabaseAnitaService;
  private accountId = 'default-user';

  static getInstance(): SupabaseAnitaService {
    if (!SupabaseAnitaService.instance) {
      SupabaseAnitaService.instance = new SupabaseAnitaService();
    }
    return SupabaseAnitaService.instance;
  }

  // Save message to Supabase
  async saveMessage(message: Message): Promise<void> {
    try {
      const messageData: Partial<SupabaseData> = {
        account_id: this.accountId,
        message_text: message.text,
        sender: message.sender,
        message_id: message.id,
        data_type: 'message',
        created_at: message.timestamp.toISOString()
      };

      const { error } = await supabase
        .from('anita_data')
        .insert([messageData]);

      if (error) {
        console.error('Error saving message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  // Save transaction to Supabase
  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactionData: Partial<SupabaseData> = {
        account_id: this.accountId,
        message_text: transaction.description,
        message_id: transaction.id,
        data_type: 'transaction',
        transaction_type: transaction.type,
        transaction_amount: transaction.amount,
        transaction_category: transaction.category,
        transaction_description: transaction.description,
        created_at: transaction.date.toISOString()
      };

      const { error } = await supabase
        .from('anita_data')
        .insert([transactionData]);

      if (error) {
        console.error('Error saving transaction:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  // Get messages from Supabase
  async getMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('anita_data')
        .select('*')
        .eq('account_id', this.accountId)
        .eq('data_type', 'message')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return [];
      }

      return data.map((item: SupabaseData) => ({
        id: item.message_id || item.id,
        text: item.message_text || '',
        sender: item.sender || 'user',
        timestamp: new Date(item.created_at)
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  // Get transactions from Supabase
  async getTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('anita_data')
        .select('*')
        .eq('account_id', this.accountId)
        .eq('data_type', 'transaction')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading transactions:', error);
        return [];
      }

      return data.map((item: SupabaseData) => ({
        id: item.message_id || item.id,
        type: item.transaction_type || 'income',
        amount: item.transaction_amount || 0,
        category: item.transaction_category || 'Other',
        description: item.transaction_description || '',
        date: new Date(item.created_at)
      }));
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  // Get all data (messages and transactions) from Supabase
  async getAllData(): Promise<{ messages: Message[]; transactions: Transaction[] }> {
    try {
      const { data, error } = await supabase
        .from('anita_data')
        .select('*')
        .eq('account_id', this.accountId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading data:', error);
        return { messages: [], transactions: [] };
      }

      const messages: Message[] = [];
      const transactions: Transaction[] = [];

      data.forEach((item: SupabaseData) => {
        if (item.data_type === 'message') {
          messages.push({
            id: item.message_id || item.id,
            text: item.message_text || '',
            sender: item.sender || 'user',
            timestamp: new Date(item.created_at)
          });
        } else if (item.data_type === 'transaction') {
          transactions.push({
            id: item.message_id || item.id,
            type: item.transaction_type || 'income',
            amount: item.transaction_amount || 0,
            category: item.transaction_category || 'Other',
            description: item.transaction_description || '',
            date: new Date(item.created_at)
          });
        }
      });

      return { messages, transactions };
    } catch (error) {
      console.error('Error loading data:', error);
      return { messages: [], transactions: [] };
    }
  }

  // Clear all data for the account
  async clearAllData(): Promise<void> {
    try {
      const { error } = await supabase
        .from('anita_data')
        .delete()
        .eq('account_id', this.accountId);

      if (error) {
        console.error('Error clearing data:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Set account ID (for future multi-user support)
  setAccountId(accountId: string): void {
    this.accountId = accountId;
  }
}

// Export singleton instance
export const supabaseAnitaService = SupabaseAnitaService.getInstance();
