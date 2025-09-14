import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Upload,
  Trash2,
  Edit3,
  Save,
  Loader2,
  Bot
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import PersonalitySettings from './PersonalitySettings';
import './Settings.css';

interface SettingsProps {
  onThemeChange: (theme: 'dark' | 'light') => void;
  currentTheme: 'dark' | 'light';
  user: SupabaseUser;
}

const Settings: React.FC<SettingsProps> = ({ onThemeChange, currentTheme, user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: user.email || '',
    phone: '',
    location: '',
    joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfileData({
          name: data.name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          location: data.location || '',
          joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user]);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, [user, loadProfile]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
        return;
      }

      setIsEditing(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = (theme: 'dark' | 'light') => {
    onThemeChange(theme);
  };

  const handleClearData = async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('anita_data')
          .delete()
          .eq('account_id', user.id);

        if (error) {
          console.error('Error clearing data:', error);
          alert('Failed to clear data. Please try again.');
          return;
        }

        alert('All data cleared successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'anita', label: 'ANITA AI', icon: Bot },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="settings-main">
          {activeTab === 'anita' && (
            <div className="settings-section">
              <h2>ANITA AI Personality</h2>
              <p>Customize ANITA's personality, tone, and expertise areas to match your preferences.</p>
              <PersonalitySettings />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="profile-card">
                <div className="profile-avatar">
                  <User size={40} />
                </div>
                <div className="profile-info">
                  <h3>{profileData.name}</h3>
                  <p>ANITA Premium Member</p>
                  <span className="member-since">Member since {profileData.joinDate}</span>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button className="save-button" onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spinning" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button className="cancel-button" onClick={() => setIsEditing(false)} disabled={loading}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="settings-section">
              <h2>Billing & Subscription</h2>
              <div className="billing-card">
                <div className="billing-info">
                  <h3>ANITA Premium</h3>
                  <p>Unlimited financial advice and advanced analytics</p>
                  <span className="price">$9.99/month</span>
                </div>
                <button className="manage-button">Manage Subscription</button>
              </div>
              
              <div className="payment-methods">
                <h3>Payment Methods</h3>
                <div className="payment-card">
                  <CreditCard size={20} />
                  <span>**** **** **** 1234</span>
                  <span className="card-type">Visa</span>
                </div>
                <button className="add-payment">Add Payment Method</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <div className="notification-settings">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your financial insights</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Push Notifications</h4>
                    <p>Get alerts for important financial updates</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Weekly Reports</h4>
                    <p>Receive weekly financial summaries</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy & Security</h2>
              <div className="privacy-settings">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Data Export</h4>
                    <p>Download your financial data</p>
                  </div>
                  <button className="action-button">
                    <Download size={16} />
                    Export Data
                  </button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Data Import</h4>
                    <p>Import data from other financial apps</p>
                  </div>
                  <button className="action-button">
                    <Upload size={16} />
                    Import Data
                  </button>
                </div>
                <div className="setting-item danger">
                  <div className="setting-info">
                    <h4>Clear All Data</h4>
                    <p>Clear all messages and transactions from local storage</p>
                  </div>
                  <button className="danger-button" onClick={handleClearData}>
                    <Trash2 size={16} />
                    Clear Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              <div className="appearance-settings">
                <div className="theme-selector">
                  <h4>Theme</h4>
                  <div className="theme-options">
                    <div 
                      className={`theme-option ${currentTheme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleThemeSelect('dark')}
                    >
                      <div className="theme-preview dark"></div>
                      <span>Dark</span>
                    </div>
                    <div 
                      className={`theme-option ${currentTheme === 'light' ? 'active' : ''}`}
                      onClick={() => handleThemeSelect('light')}
                    >
                      <div className="theme-preview light"></div>
                      <span>Light</span>
                    </div>
                  </div>
                </div>
                <div className="accent-selector">
                  <h4>Accent Color</h4>
                  <div className="color-options">
                    <div className="color-option active" style={{backgroundColor: '#667eea'}}></div>
                    <div className="color-option" style={{backgroundColor: '#10b981'}}></div>
                    <div className="color-option" style={{backgroundColor: '#f59e0b'}}></div>
                    <div className="color-option" style={{backgroundColor: '#ef4444'}}></div>
                    <div className="color-option" style={{backgroundColor: '#8b5cf6'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
