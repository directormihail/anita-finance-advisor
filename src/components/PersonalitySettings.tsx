import React, { useState, useEffect } from 'react';
import { Bot, Palette, Zap, Target, MessageSquare, DollarSign } from 'lucide-react';
import { aiService, AnitaPersonality } from '../aiService';
import './PersonalitySettings.css';

interface PersonalitySettingsProps {
  onPersonalityChange?: (personality: AnitaPersonality) => void;
}

const PersonalitySettings: React.FC<PersonalitySettingsProps> = ({ onPersonalityChange }) => {
  const [personality, setPersonality] = useState<AnitaPersonality>(aiService.getPersonality());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setPersonality(aiService.getPersonality());
  }, []);

  const handlePersonalityChange = (updates: Partial<AnitaPersonality>) => {
    const newPersonality = { ...personality, ...updates };
    setPersonality(newPersonality);
    aiService.updatePersonality(updates);
    onPersonalityChange?.(newPersonality);
  };

  const toneOptions = [
    { value: 'sassy', label: 'Sassy 💅', description: 'Confident, witty, and a bit cheeky' },
    { value: 'professional', label: 'Professional 💼', description: 'Formal, helpful, and business-like' },
    { value: 'friendly', label: 'Friendly 😊', description: 'Warm, approachable, and encouraging' },
    { value: 'motivational', label: 'Motivational 🚀', description: 'Energetic, inspiring, and goal-oriented' }
  ];

  const emojiStyles = [
    { value: 'heavy', label: 'Heavy', description: 'Lots of emojis everywhere! 🎉✨💅' },
    { value: 'moderate', label: 'Moderate', description: 'Some emojis for emphasis 😊💡' },
    { value: 'minimal', label: 'Minimal', description: 'Just a few key emojis 💰' }
  ];

  const responseLengths = [
    { value: 'short', label: 'Short', description: 'Quick, concise responses' },
    { value: 'medium', label: 'Medium', description: 'Balanced, informative responses' },
    { value: 'long', label: 'Long', description: 'Detailed, comprehensive responses' }
  ];

  const adviceStyles = [
    { value: 'conservative', label: 'Conservative', description: 'Safe, traditional financial advice' },
    { value: 'balanced', label: 'Balanced', description: 'Mix of safe and growth-oriented advice' },
    { value: 'aggressive', label: 'Aggressive', description: 'Growth-focused, higher risk advice' }
  ];

  const expertiseOptions = [
    'personal finance', 'budgeting', 'expense tracking', 'financial planning',
    'investment advice', 'debt management', 'saving strategies', 'retirement planning',
    'tax optimization', 'credit management', 'insurance', 'real estate'
  ];

  const catchphraseOptions = [
    '💅', 'Periodt!', 'Let\'s get financial!', 'Money moves!', 'Spill the tea!',
    'Yasss!', 'Slay!', 'No cap!', 'Facts!', 'Period!', 'Bestie!', 'Queen!',
    'Let\'s go!', 'That\'s it!', 'Periodt!', 'Say less!', 'Bet!', 'Period!'
  ];

  return (
    <div className="personality-settings">
      <button 
        className="personality-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Customize ANITA's personality"
      >
        <Bot size={20} />
        <span>Customize ANITA</span>
      </button>

      {isOpen && (
        <div className="personality-panel">
          <div className="personality-header">
            <h3>Customize ANITA's Personality</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="personality-sections">
            {/* Tone Selection */}
            <div className="personality-section">
              <div className="section-header">
                <MessageSquare size={18} />
                <h4>Communication Tone</h4>
              </div>
              <div className="tone-options">
                {toneOptions.map(option => (
                  <label key={option.value} className="tone-option">
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      checked={personality.tone === option.value}
                      onChange={(e) => handlePersonalityChange({ tone: e.target.value as any })}
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Emoji Style */}
            <div className="personality-section">
              <div className="section-header">
                <Palette size={18} />
                <h4>Emoji Style</h4>
              </div>
              <div className="emoji-options">
                {emojiStyles.map(option => (
                  <label key={option.value} className="emoji-option">
                    <input
                      type="radio"
                      name="emojiStyle"
                      value={option.value}
                      checked={personality.emojiStyle === option.value}
                      onChange={(e) => handlePersonalityChange({ emojiStyle: e.target.value as any })}
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Response Length */}
            <div className="personality-section">
              <div className="section-header">
                <MessageSquare size={18} />
                <h4>Response Length</h4>
              </div>
              <div className="length-options">
                {responseLengths.map(option => (
                  <label key={option.value} className="length-option">
                    <input
                      type="radio"
                      name="responseLength"
                      value={option.value}
                      checked={personality.responseLength === option.value}
                      onChange={(e) => handlePersonalityChange({ responseLength: e.target.value as any })}
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Financial Advice Style */}
            <div className="personality-section">
              <div className="section-header">
                <DollarSign size={18} />
                <h4>Financial Advice Style</h4>
              </div>
              <div className="advice-options">
                {adviceStyles.map(option => (
                  <label key={option.value} className="advice-option">
                    <input
                      type="radio"
                      name="financialAdviceStyle"
                      value={option.value}
                      checked={personality.financialAdviceStyle === option.value}
                      onChange={(e) => handlePersonalityChange({ financialAdviceStyle: e.target.value as any })}
                    />
                    <div className="option-content">
                      <span className="option-label">{option.label}</span>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Expertise Areas */}
            <div className="personality-section">
              <div className="section-header">
                <Target size={18} />
                <h4>Expertise Areas</h4>
              </div>
              <div className="expertise-grid">
                {expertiseOptions.map(expertise => (
                  <label key={expertise} className="expertise-option">
                    <input
                      type="checkbox"
                      checked={personality.expertise.includes(expertise)}
                      onChange={(e) => {
                        const newExpertise = e.target.checked
                          ? [...personality.expertise, expertise]
                          : personality.expertise.filter(exp => exp !== expertise);
                        handlePersonalityChange({ expertise: newExpertise });
                      }}
                    />
                    <span>{expertise}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Catchphrases */}
            <div className="personality-section">
              <div className="section-header">
                <Zap size={18} />
                <h4>Favorite Catchphrases</h4>
              </div>
              <div className="catchphrase-grid">
                {catchphraseOptions.map(phrase => (
                  <label key={phrase} className="catchphrase-option">
                    <input
                      type="checkbox"
                      checked={personality.catchphrases.includes(phrase)}
                      onChange={(e) => {
                        const newCatchphrases = e.target.checked
                          ? [...personality.catchphrases, phrase]
                          : personality.catchphrases.filter(cp => cp !== phrase);
                        handlePersonalityChange({ catchphrases: newCatchphrases });
                      }}
                    />
                    <span>{phrase}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="personality-footer">
            <button 
              className="reset-button"
              onClick={() => {
                const defaultPersonality = {
                  name: 'ANITA',
                  tone: 'sassy' as const,
                  expertise: ['personal finance', 'budgeting', 'expense tracking', 'financial planning'],
                  catchphrases: ['💅', 'Periodt!', 'Let\'s get financial!', 'Money moves!', 'Spill the tea!'],
                  emojiStyle: 'heavy' as const,
                  responseLength: 'medium' as const,
                  financialAdviceStyle: 'balanced' as const
                };
                setPersonality(defaultPersonality);
                aiService.updatePersonality(defaultPersonality);
                onPersonalityChange?.(defaultPersonality);
              }}
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalitySettings;
