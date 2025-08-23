import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesSettings = ({ preferences, onSave }) => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    // notifications: {
    //   email: {
    //     orderUpdates: preferences?.notifications?.email?.orderUpdates ?? true,
    //     promotions: preferences?.notifications?.email?.promotions ?? true,
    //     newArrivals: preferences?.notifications?.email?.newArrivals ?? false,
    //     priceDrops: preferences?.notifications?.email?.priceDrops ?? true,
    //     newsletter: preferences?.notifications?.email?.newsletter ?? false
    //   },
    //   sms: {
    //     orderUpdates: preferences?.notifications?.sms?.orderUpdates ?? true,
    //     promotions: preferences?.notifications?.sms?.promotions ?? false,
    //     deliveryAlerts: preferences?.notifications?.sms?.deliveryAlerts ?? true
    //   },
    //   push: {
    //     orderUpdates: preferences?.notifications?.push?.orderUpdates ?? true,
    //     promotions: preferences?.notifications?.push?.promotions ?? false,
    //     newArrivals: preferences?.notifications?.push?.newArrivals ?? false
    //   }
    // },
    // privacy: {
    //   profileVisibility: preferences?.privacy?.profileVisibility ?? 'private',
    //   dataSharing: preferences?.privacy?.dataSharing ?? false,
    //   personalizedAds: preferences?.privacy?.personalizedAds ?? true,
    //   analytics: preferences?.privacy?.analytics ?? true
    // },
    shopping: {
      currency: preferences?.shopping?.currency ?? 'USD',
      language: preferences?.shopping?.language ?? 'en',
      defaultShipping: preferences?.shopping?.defaultShipping ?? 'standard',
      autoSaveToWishlist: preferences?.shopping?.autoSaveToWishlist ?? false,
      showOutOfStock: preferences?.shopping?.showOutOfStock ?? true
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
      colorScheme: preferences?.theme?.colorScheme ?? 'default'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('notifications');

  // const handleNotificationChange = (category, type, value) => {
  //   setSettings(prev => ({
  //     ...prev,
  //     notifications: {
  //       ...prev.notifications,
  //       [category]: {
  //         ...prev.notifications[category],
  //         [type]: value
  //       }
  //     }
  //   }));
  // };

  // const handlePrivacyChange = (setting, value) => {
  //   setSettings(prev => ({
  //     ...prev,
  //     privacy: {
  //       ...prev.privacy,
  //       [setting]: value
  //     }
  //   }));
  // };

  const handleShoppingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      shopping: {
        ...prev.shopping,
        [setting]: value
      }
    }));
  };

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
    // { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    // { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
    { id: 'theme', label: 'Appearance', icon: 'Palette' }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Preferences & Settings</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-smooth ${
                  activeSection === section.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-orange-100/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon name={section.icon} size={18} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        <div className="flex-1">
          {/* Notifications Section */}
          {/* {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <Checkbox
                    label="Order updates and shipping notifications"
                    description="Get notified about order status changes"
                    checked={settings.notifications.email.orderUpdates}
                    onChange={(e) => handleNotificationChange('email', 'orderUpdates', e.target.checked)}
                  />
                  <Checkbox
                    label="Promotional offers and discounts"
                    description="Receive exclusive deals and promotions"
                    checked={settings.notifications.email.promotions}
                    onChange={(e) => handleNotificationChange('email', 'promotions', e.target.checked)}
                  />
                  <Checkbox
                    label="New arrivals and product launches"
                    description="Be first to know about new products"
                    checked={settings.notifications.email.newArrivals}
                    onChange={(e) => handleNotificationChange('email', 'newArrivals', e.target.checked)}
                  />
                  <Checkbox
                    label="Price drop alerts"
                    description="Get notified when wishlist items go on sale"
                    checked={settings.notifications.email.priceDrops}
                    onChange={(e) => handleNotificationChange('email', 'priceDrops', e.target.checked)}
                  />
                  <Checkbox
                    label="Newsletter and style tips"
                    description="Fashion trends and styling advice"
                    checked={settings.notifications.email.newsletter}
                    onChange={(e) => handleNotificationChange('email', 'newsletter', e.target.checked)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">SMS Notifications</h3>
                <div className="space-y-3">
                  <Checkbox
                    label="Order and delivery updates"
                    description="Critical order status via SMS"
                    checked={settings.notifications.sms.orderUpdates}
                    onChange={(e) => handleNotificationChange('sms', 'orderUpdates', e.target.checked)}
                  />
                  <Checkbox
                    label="Flash sales and time-sensitive offers"
                    description="Limited-time promotions via SMS"
                    checked={settings.notifications.sms.promotions}
                    onChange={(e) => handleNotificationChange('sms', 'promotions', e.target.checked)}
                  />
                  <Checkbox
                    label="Delivery alerts"
                    description="Real-time delivery notifications"
                    checked={settings.notifications.sms.deliveryAlerts}
                    onChange={(e) => handleNotificationChange('sms', 'deliveryAlerts', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          )} */}

          {/* Privacy Section
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <Checkbox
                    label="Allow data sharing with partners"
                    description="Share anonymized data to improve services"
                    checked={settings.privacy.dataSharing}
                    onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                  />

                  <Checkbox
                    label="Personalized advertisements"
                    description="Show ads based on your shopping behavior"
                    checked={settings.privacy.personalizedAds}
                    onChange={(e) => handlePrivacyChange('personalizedAds', e.target.checked)}
                  />

                  <Checkbox
                    label="Analytics and performance tracking"
                    description="Help us improve the website experience"
                    checked={settings.privacy.analytics}
                    onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          )} */}

          {/* Shopping Section */}
          {activeSection === 'shopping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Shopping Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.shopping.currency}
                      onChange={(e) => handleShoppingChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Language
                    </label>
                    <select
                      value={settings.shopping.language}
                      onChange={(e) => handleShoppingChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Default Shipping
                    </label>
                    <select
                      value={settings.shopping.defaultShipping}
                      onChange={(e) => handleShoppingChange('defaultShipping', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="standard">Standard (5-7 days)</option>
                      <option value="express">Express (2-3 days)</option>
                      <option value="overnight">Overnight</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <Checkbox
                    label="Auto-save viewed items to wishlist"
                    description="Automatically save items you spend time viewing"
                    checked={settings.shopping.autoSaveToWishlist}
                    onChange={(e) => handleShoppingChange('autoSaveToWishlist', e.target.checked)}
                  />

                  <Checkbox
                    label="Show out-of-stock items"
                    description="Display unavailable products in search results"
                    checked={settings.shopping.showOutOfStock}
                    onChange={(e) => handleShoppingChange('showOutOfStock', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Theme Section */}
          {activeSection === 'theme' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Theme Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: 'Sun' },
                        { value: 'dark', label: 'Dark', icon: 'Moon' },
                       
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleThemeChange('mode', option.value)}
                          className={`flex flex-col items-center space-y-2 p-4 border rounded-lg transition-smooth ${
                            (option.value === 'dark' ? isDark : !isDark)
                              ? 'border-accent bg-accent/10' :'border-border hover:border-accent/50'
                          }`}
                        >
                          <Icon name={option.icon} size={24} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
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

export default PreferencesSettings;