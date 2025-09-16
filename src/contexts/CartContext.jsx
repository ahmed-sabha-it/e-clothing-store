import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponAPI, cartAPI, specificationAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Server cart items for authenticated users
  const [serverCartItems, setServerCartItems] = useState([]);
  
  // Local cart items for guests
  const [localCartItems, setLocalCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Determine which cart items to use based on auth status
  const cartItems = user ? serverCartItems : localCartItems;

  // Map server cart item to UI-friendly format
  const mapServerCartItem = (item) => {
    const product = item.specification?.product || {};
    const spec = item.specification || {};
    
    const basePrice = parseFloat(product.price || 0);
    const specPrice = parseFloat(spec.price || 0);
    const unitPrice = basePrice + specPrice;
    
    return {
      // Server-specific fields
      id: item.id, // This is the cart item ID from server
      cartItemId: item.id,
      specificationId: spec.id,
      
      // Product fields
      productId: product.id,
      name: product.name || 'Unknown Product',
      image: product.image_url || product.image || '/placeholder.svg',
      category: product.category?.name || 'Product',
      
      // Specification fields
      specName: spec.name || '',
      specValue: spec.value || '',
      size: spec.name?.toLowerCase().includes('size') ? spec.value : null,
      color: spec.name?.toLowerCase().includes('color') ? spec.value : null,
      
      // Pricing
      basePrice,
      specPrice,
      price: unitPrice, // For compatibility with existing code
      unitPrice,
      
      // Quantity
      quantity: item.quantity || 1
    };
  };

  // Load cart from server for authenticated users
  const loadServerCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await cartAPI.getAll();
      const items = response.data || [];
      const mappedItems = items.map(mapServerCartItem);
      setServerCartItems(mappedItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast({
        title: "Failed to load cart",
        description: "We couldn't load your cart items. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load server cart when user changes
  useEffect(() => {
    if (user) {
      loadServerCart();
    } else {
      setServerCartItems([]);
    }
  }, [user]);

  // Save local cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(localCartItems));
    }
  }, [localCartItems, user]);

  // Save coupon to localStorage
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('coupon');
    }
  }, [coupon]);

  // Add to cart function
  const addToCart = async (item) => {
    if (user) {
      // Authenticated: Add to server cart
      try {
        // Handle different input formats
        let specificationsToAdd = [];
        
        if (item.specifications && typeof item.specifications === 'object') {
          // From ProductDetail: item.specifications is an object of selected specs
          specificationsToAdd = Object.values(item.specifications).filter(spec => spec?.id);
        } else if (item.specificationId) {
          // Direct specification ID provided
          specificationsToAdd = [{ id: item.specificationId }];
        } else if (item.id && !item.specifications) {
          // Quick add from card: fetch specifications and use first one
          try {
            const specs = await specificationAPI.getByProductId(item.id);
            if (specs && specs.length > 0) {
              specificationsToAdd = [specs[0]];
              
              // Show toast if multiple options exist
              if (specs.length > 1) {
                toast({
                  title: "Default variant added",
                  description: "Visit the product page to select other options.",
                });
              }
            } else {
              toast({
                title: "Cannot add to cart",
                description: "This product has no available options.",
                variant: "destructive",
              });
              return;
            }
          } catch (error) {
            console.error('Failed to fetch specifications:', error);
            toast({
              title: "Failed to add to cart",
              description: "Could not load product options.",
              variant: "destructive",
            });
            return;
          }
        }
        
        // Add each specification to server cart
        const quantity = item.quantity || 1;
        let addedCount = 0;
        
        for (const spec of specificationsToAdd) {
          if (spec?.id) {
            try {
              await cartAPI.add({
                specification_id: spec.id,
                quantity: quantity
              });
              addedCount++;
            } catch (error) {
              console.error('Failed to add specification to cart:', error);
            }
          }
        }
        
        if (addedCount > 0) {
          // Reload cart from server
          await loadServerCart();
          
          toast({
            title: "Added to cart",
            description: `${item.name || 'Item'} has been added to your cart.`,
          });
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
        toast({
          title: "Failed to add to cart",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Guest: Use local cart
      setLocalCartItems(prev => {
        const existingItem = prev.find(
          cartItem => cartItem.id === item.id && 
                      cartItem.size === item.size && 
                      cartItem.color === item.color
        );
        
        if (existingItem) {
          return prev.map(cartItem =>
            cartItem.id === item.id && 
            cartItem.size === item.size && 
            cartItem.color === item.color
              ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
              : cartItem
          );
        }
        
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      });
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId, size, color) => {
    if (user) {
      // Authenticated: Remove from server
      try {
        await cartAPI.remove(cartItemId);
        await loadServerCart();
        
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart.",
        });
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        toast({
          title: "Failed to remove item",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Guest: Remove from local cart
      // For guests, cartItemId is actually the product ID
      setLocalCartItems(prev => prev.filter(
        item => !(item.id === cartItemId && item.size === size && item.color === color)
      ));
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId, size, color);
      return;
    }
    
    if (user) {
      // Authenticated: Update on server
      try {
        await cartAPI.update(cartItemId, { quantity });
        await loadServerCart();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        toast({
          title: "Failed to update quantity",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Guest: Update local cart
      setLocalCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (user) {
      // Authenticated: Clear on server
      try {
        await cartAPI.clear();
        setServerCartItems([]);
        
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        });
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast({
          title: "Failed to clear cart",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Guest: Clear local cart
      setLocalCartItems([]);
    }
  };

  // Calculate totals
  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.unitPrice || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon || !coupon.is_active) return 0;
    
    const subtotal = getTotalPrice();
    
    // Check minimum purchase requirement
    if (coupon.minimum_purchase && subtotal < coupon.minimum_purchase) {
      return 0;
    }
    
    if (coupon.discount_type === 'percentage') {
      return subtotal * (coupon.discount_value / 100);
    } else {
      return Math.min(coupon.discount_value, subtotal);
    }
  };

  const getFinalTotal = () => {
    return getTotalPrice() - getDiscountAmount();
  };

  // Apply coupon
  const applyCoupon = async (code) => {
    try {
      const totalAmount = getTotalPrice();
      const response = await couponAPI.apply(code, totalAmount);
      if (response.status && response.data) {
        setCoupon(response.data.coupon);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Migrate local cart to server on login
  const migrateLocalCartToServer = async () => {
    if (!user || localCartItems.length === 0) return;
    
    try {
      for (const item of localCartItems) {
        // Try to find specifications for the product
        try {
          const specs = await specificationAPI.getByProductId(item.id);
          
          // Try to match by size/color if available
          let matchedSpec = null;
          
          if (item.size || item.color) {
            matchedSpec = specs.find(spec => {
              const matchesSize = !item.size || (spec.name?.toLowerCase().includes('size') && spec.value === item.size);
              const matchesColor = !item.color || (spec.name?.toLowerCase().includes('color') && spec.value === item.color);
              return matchesSize && matchesColor;
            });
          }
          
          // Use matched spec or first available
          const specToAdd = matchedSpec || specs[0];
          
          if (specToAdd) {
            await cartAPI.add({
              specification_id: specToAdd.id,
              quantity: item.quantity
            });
          }
        } catch (error) {
          console.error('Failed to migrate item:', item, error);
        }
      }
      
      // Clear local cart after migration
      setLocalCartItems([]);
      localStorage.removeItem('cart');
      
      // Reload server cart
      await loadServerCart();
      
      toast({
        title: "Cart synced",
        description: "Your cart items have been saved to your account.",
      });
    } catch (error) {
      console.error('Failed to migrate cart:', error);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    if (user && localCartItems.length > 0) {
      // User just logged in and has local items
      migrateLocalCartToServer();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{
      cartItems,
      coupon,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getDiscountAmount,
      getFinalTotal,
      applyCoupon,
      removeCoupon,
      refreshCart: loadServerCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
