import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI, userAPI, orderAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollToTop } from '../../utils/scrollToTop';
// import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import ProfileHeader from './components/ProfileHeader';
import LoyaltyCard from './components/LoyaltyCard';
import PersonalInfoForm from './components/PersonalInfoForm';
import AddressBook from './components/AddressBook';
import OrderHistory from './components/OrderHistory';
// import WishlistSection from './components/WishlistSection';
import PreferencesSettings from './components/PreferencesSettings';
import ConfirmationModal from './components/ConfirmationModal';

const UserProfileManagement = () => {
  useScrollToTop();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User data from API
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    memberSince: '',
    location: '',
    dateOfBirth: '',
    gender: ''
  });

  const [loyaltyData, setLoyaltyData] = useState({
    tier: 'Gold',
    points: 2450,
    nextTierPoints: 5000,
    totalSpent: 0,
    benefits: [
      'Free shipping on all orders',
      'Early access to sales',
      'Birthday month discount'
    ]
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      fullName: 'John Doe',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'New York',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: 2,
      label: 'Work',
      fullName: 'John Doe',
      street: '456 Business Ave',
      apartment: 'Suite 200',
      city: 'New York',
      state: 'New York',
      zipCode: '10002',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ]);

  const [orders, setOrders] = useState([]);

  // const [wishlistItems, setWishlistItems] = useState([
  //   {
  //     id: 1,
  //     name: 'Premium Leather Jacket',
  //     brand: 'StyleCraft',
  //     price: 199.99,
  //     originalPrice: 249.99,
  //     image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
  //     selectedSize: 'L',
  //     selectedColor: 'Black',
  //     inStock: true,
  //     dateAdded: '2024-01-12T09:00:00Z'
  //   },
  //   {
  //     id: 2,
  //     name: 'Casual Sneakers',
  //     brand: 'ComfortWalk',
  //     price: 89.99,
  //     originalPrice: null,
  //     image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
  //     selectedSize: '10',
  //     selectedColor: 'White',
  //     inStock: false,
  //     dateAdded: '2024-01-08T16:30:00Z'
  //   },
  //   {
  //     id: 3,
  //     name: 'Elegant Evening Dress',
  //     brand: 'GlamourLine',
  //     price: 159.99,
  //     originalPrice: 199.99,
  //     image: 'https://images.unsplash.com/photo-1566479179817-c0b0b5b1b9e8?w=300&h=300&fit=crop',
  //     selectedSize: 'M',
  //     selectedColor: 'Navy',
  //     inStock: true,
  //     dateAdded: '2024-01-05T11:15:00Z'
  //   }
  // ]);

  const [preferences, setPreferences] = useState({
    notifications: {
      email: {
        orderUpdates: true,
        promotions: true,
        newArrivals: false,
        priceDrops: true,
        newsletter: false
      },
      sms: {
        orderUpdates: true,
        promotions: false,
        deliveryAlerts: true
      }
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      personalizedAds: true,
      analytics: true
    },
    shopping: {
      currency: 'USD',
      language: 'en',
      defaultShipping: 'standard',
      autoSaveToWishlist: false,
      showOutOfStock: true
    },
    theme: {
      mode: 'light',
      colorScheme: 'default'
    }
  });

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'orders', label: 'Orders', icon: 'Package' },
    // { id: 'wishlist', label: 'Wishlist', icon: 'Heart' },
    { id: 'addresses', label: 'Addresses', icon: 'MapPin' },
    { id: 'preferences', label: 'Settings', icon: 'Settings' }
  ];

  // Fetch user profile data and orders from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile
        const profileResponse = await userAPI.getProfile();
        const user = profileResponse.data || profileResponse.user || profileResponse;
        
        setUserData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          avatar: user.profile_picture || user.avatar || '',
          memberSince: user.created_at ? new Date(user.created_at).getFullYear().toString() : '',
          location: user.location || user.address || '',
          dateOfBirth: user.date_of_birth || user.dateOfBirth || '',
          gender: user.gender || ''
        });

        // Fetch user orders
        try {
          const ordersResponse = await orderAPI.getAll();
          const ordersData = ordersResponse.data || ordersResponse.orders || ordersResponse;
          
          // Transform backend order data to match frontend format
          const transformedOrders = Array.isArray(ordersData) ? ordersData.map(order => ({
            id: order.id,
            date: order.created_at,
            status: order.status || 'pending',
            total: parseFloat(order.total_price || 0),
            subtotal: parseFloat(order.total_price || 0),
            shipping: 0,
            tax: 0,
            discount: 0,
            items: order.order_specifications?.map(spec => ({
              name: spec.specification?.product?.name || 'Product',
              image: spec.specification?.product?.image || '/placeholder.svg',
              size: spec.specification?.name === 'Size' ? spec.specification?.value : 'N/A',
              color: spec.specification?.name === 'Color' ? spec.specification?.value : 'N/A',
              quantity: spec.quantity || 1,
              price: parseFloat(spec.specification?.price || 0)
            })) || [],
            shippingAddress: {
              name: user.name || 'User',
              street: order.address_description || 'N/A',
              city: 'N/A',
              state: 'N/A',
              zipCode: 'N/A',
              country: 'N/A'
            },
            paymentMethod: {
              type: 'N/A',
              last4: 'N/A'
            }
          })) : [];
          
          setOrders(transformedOrders);
          
          // Calculate total spent from actual orders
          const totalSpent = transformedOrders.reduce((sum, order) => sum + order.total, 0);
          
          // Update loyalty data with real spending
          setLoyaltyData(prev => ({
            ...prev,
            totalSpent: totalSpent,
            // Calculate tier based on spending
            tier: totalSpent >= 2000 ? 'Platinum' : totalSpent >= 1000 ? 'Gold' : totalSpent >= 500 ? 'Silver' : 'Bronze',
            // Calculate points (1 point per dollar spent)
            points: Math.floor(totalSpent),
            nextTierPoints: totalSpent >= 2000 ? 5000 : totalSpent >= 1000 ? 2000 : totalSpent >= 500 ? 1000 : 500
          }));
          
        } catch (orderErr) {
          console.error('Error fetching orders:', orderErr);
          // Don't fail the entire profile load if orders fail
          setOrders([]);
        }
        
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab && tabs.find(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Event handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (formData) => {
    try {
      setLoading(true);
      
      // Update profile via API
      await userAPI.updateProfile(formData);
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        ...formData
      }));
      
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleAddAddress = (addressData) => {
    const newAddress = {
      ...addressData,
      id: Date.now()
    };
    setAddresses(prev => [...prev, newAddress]);
  };

  const handleEditAddress = (addressId, addressData) => {
    setAddresses(prev => 
      prev.map(addr => 
        addr.id === addressId ? { ...addr, ...addressData } : addr
      )
    );
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
  };

  const handleSetDefaultAddress = (addressId) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
  };

  // const handleRemoveFromWishlist = (itemId) => {
  //   setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  // };

  // const handleMoveToCart = (item) => {
  //   // TODO: Integrate with cart API
  //   // console.log('Moving to cart:', item);
  //   // Remove from wishlist after moving to cart
  //   handleRemoveFromWishlist(item.id);
  // };

  // const handleClearWishlist = () => {
  //   if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
  //     setWishlistItems([]);
  //   }
  // };

  const handleSavePreferences = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, we still clear local data
    } finally {
      // Use auth context to clear state and cookies
      logout();
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      navigate('/signin');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 animate-fade-in">
    
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          {!isEditingProfile && (
            <>
              <ProfileHeader 
                user={userData} 
                onEditProfile={handleEditProfile}
              />
              
              {/* Loyalty Card - Only show on overview */}
              {activeTab === 'overview' && (
                <LoyaltyCard loyaltyData={loyaltyData} />
              )}
            </>
          )}

          {/* Navigation Tabs */}
          {!isEditingProfile && (
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg mb-6 animate-fade-in animation-delay-450">
              <div className="flex overflow-x-auto">
                <div className="flex flex-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-smooth ${
                        activeTab === tab.id
                          ? 'text-accent border-b-2 border-accent' :'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
                
                {/* Logout Button */}
                <div className="flex items-center px-4">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-2 text-white bg-red-900 px-4 py-2 text-sm font-medium    dark:hover:text-white hover:bg-red-700 dark:hover:bg-red-700 rounded-md transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name={isLoggingOut ? 'Loader2' : 'LogOut'} size={16} className={isLoggingOut ? 'animate-spin' : ''} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="space-y-6">
            {isEditingProfile ? (
              <PersonalInfoForm
                user={userData}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in animation-delay-600">
                    {/* Recent Orders */}
                    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6 animate-fade-in animation-delay-750">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-accent hover:text-accent/80 text-sm font-medium transition-smooth"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-orange-100/50 dark:bg-gray-700/50 rounded-md">
                            <div>
                              <p className="font-medium text-foreground">#{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">${order.total.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">{order.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6 animate-fade-in animation-delay-750">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Account Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-orange-100/50 dark:bg-gray-700/50 rounded-md">
                          <div className="text-2xl font-bold text-foreground">{orders.length}</div>
                          <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        {/* <div className="text-center p-4 bg-orange-100/50 dark:bg-gray-700/50 rounded-md">
                          <div className="text-2xl font-bold text-foreground">{wishlistItems.length}</div>
                          <div className="text-sm text-muted-foreground">Wishlist Items</div>
                        </div> */}
                        <div className="text-center p-4 bg-orange-100/50 dark:bg-gray-700/50 rounded-md">
                          <div className="text-2xl font-bold text-foreground">{addresses.length}</div>
                          <div className="text-sm text-muted-foreground">Saved Addresses</div>
                        </div>
                        <div className="text-center p-4 bg-orange-100/50 dark:bg-gray-700/50 rounded-md">
                          <div className="text-2xl font-bold text-foreground">${loyaltyData.totalSpent}</div>
                          <div className="text-sm text-muted-foreground">Total Spent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="animate-fade-in animation-delay-600">
                    <OrderHistory orders={orders} />
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className="animate-fade-in animation-delay-600">
                    <WishlistSection
                      wishlistItems={wishlistItems}
                      onRemoveItem={handleRemoveFromWishlist}
                      onMoveToCart={handleMoveToCart}
                      onClearWishlist={handleClearWishlist}
                    />
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="animate-fade-in animation-delay-600">
                    <AddressBook
                      addresses={addresses}
                      onAddAddress={handleAddAddress}
                      onEditAddress={handleEditAddress}
                      onDeleteAddress={handleDeleteAddress}
                      onSetDefault={handleSetDefaultAddress}
                    />
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="animate-fade-in animation-delay-600">
                    <PreferencesSettings
                      preferences={preferences}
                      onSave={handleSavePreferences}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isLoggingOut}
      />
    </div>
  );
};

export default UserProfileManagement;