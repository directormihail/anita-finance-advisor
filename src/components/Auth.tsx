import React, { useState } from 'react';
import { Mail, Lock, Loader2, CheckCircle, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Auth.css';

interface AuthProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'signin' | 'signup' | 'simple' | 'email-sent';

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setMessage('Invalid email or password. Please try again.');
      } else {
        onAuthSuccess();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        setMessage('Error creating account. Please try again.');
      } else {
        setAuthMode('email-sent');
        setMessage('Check your email for the verification link!');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleSimpleAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Create account without email verification
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Simple account error:', error);
        setMessage('Error creating account. Please try again.');
      } else {
        // For simple accounts, we'll sign them in immediately
        // Note: This might require additional Supabase configuration
        setMessage('Account created successfully! You can now sign in.');
        setAuthMode('signin');
      }
    } catch (error) {
      console.error('Simple account error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address first.');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        setMessage('Error sending password reset email. Please try again.');
      } else {
        setMessage('Password reset email sent! Check your email for reset instructions.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Resend error:', error);
        setMessage('Error resending verification email. Please try again.');
      } else {
        setMessage('Verification email resent! Check your email.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case 'signin':
        return (
          <form onSubmit={handleEmailPasswordSignIn} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinning" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="forgot-password">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password-button"
                disabled={loading || !email}
              >
                Forgot your password?
              </button>
            </div>

            <div className="auth-switch">
              <p>Don't have an account? <button type="button" onClick={() => setAuthMode('signup')} className="switch-button">Sign up</button></p>
              <p>Want a quick start? <button type="button" onClick={() => setAuthMode('simple')} className="switch-button">Create Simple Account</button></p>
            </div>
          </form>
        );

      case 'signup':
        return (
          <form onSubmit={handleEmailPasswordSignUp} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading || !email || !password || !confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinning" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>


            <div className="auth-switch">
              <p>Already have an account? <button type="button" onClick={() => setAuthMode('signin')} className="switch-button">Sign in</button></p>
            </div>
          </form>
        );

      case 'simple':
        return (
          <form onSubmit={handleSimpleAccount} className="auth-form">
            <div className="simple-account-header">
              <User size={48} className="simple-icon" />
              <h2>Quick Start with ANITA</h2>
              <p>Create a simple account to get started immediately</p>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinning" />
                  Creating Account...
                </>
              ) : (
                'Create Simple Account'
              )}
            </button>

            <div className="auth-switch">
              <p>Want full features? <button type="button" onClick={() => setAuthMode('signup')} className="switch-button">Sign up with verification</button></p>
              <p>Already have an account? <button type="button" onClick={() => setAuthMode('signin')} className="switch-button">Sign in</button></p>
            </div>
          </form>
        );

      case 'email-sent':
        return (
          <div className="email-sent">
            <CheckCircle size={48} className="success-icon" />
            <h2>Check Your Email</h2>
            <p>We've sent a verification link to <strong>{email}</strong></p>
            <p>Click the link in your email to complete your account setup.</p>
            
            <div className="resend-section">
              <p>Didn't receive the email?</p>
              <button 
                onClick={handleResend}
                disabled={loading}
                className="resend-button"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    Resending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            </div>

            <div className="auth-switch">
              <p>Want to try a different email? <button type="button" onClick={() => setAuthMode('signup')} className="switch-button">Go back</button></p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <div className="logo-icon">A</div>
            <span className="logo-text">ANITA</span>
          </div>
          <h1>Welcome to ANITA</h1>
          <p>Your personal finance AI assistant</p>
        </div>

        {renderAuthForm()}

        {message && (
          <div className={`auth-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="auth-footer">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
