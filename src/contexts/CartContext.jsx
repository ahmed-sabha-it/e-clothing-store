import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponAPI } from '@/lib/api';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('coupon');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('coupon');
    }
  }, [coupon]);

  const addToCart = (item) => {
    setCartItems(prev => {
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
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems(prev => prev.filter(
      item => !(item.id === id && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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

  return (
    <CartContext.Provider value={{
      cartItems,
      coupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getDiscountAmount,
      getFinalTotal,
      applyCoupon,
      removeCoupon
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
