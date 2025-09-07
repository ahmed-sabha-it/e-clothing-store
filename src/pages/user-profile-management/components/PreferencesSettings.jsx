import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesSettings = ({ preferences, onSave }) => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    theme: {
      mode: isDark ? 'dark' : 'light',
      colorScheme: preferences?.theme?.colorScheme ?? 'default'
    }
  });

  const [isLoading, setIsLoading] = useState(false);


  const handleThemeChange = (setting, value) => {
    if (setting === 'mode') {
      // Toggle the global theme when mode changes
      if ((value === 'dark' && !isDark) || (value === 'light' && isDark)) {
        toggleTheme();
      }
    }
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(settings);
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'theme', label: 'Appearance', icon: 'Palette' }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Preferences & Settings</h2>

      {/* Theme Section - Simplified */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Theme Mode</h3>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { value: 'light', label: 'Light Mode', icon: 'Sun' },
              { value: 'dark', label: 'Dark Mode', icon: 'Moon' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange('mode', option.value)}
                className={`flex flex-col items-center space-y-3 p-6 border-2 rounded-xl transition-all duration-200 ${
                  (option.value === 'dark' ? isDark : !isDark)
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon name={option.icon} size={32} className="text-current" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Choose your preferred theme mode. Changes apply immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;