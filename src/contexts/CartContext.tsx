
import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  category: string;
};

export type Coupon = {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isValid: boolean;
};

type CartContextType = {
  cartItems: CartItem[];
  coupon: Coupon | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Valid coupons for demo
const validCoupons: Record<string, Omit<Coupon, 'code' | 'isValid'>> = {
  'SAVE10': { type: 'percentage', value: 10 },
  'SAVE20': { type: 'percentage', value: 20 },
  'SAVE50': { type: 'fixed', value: 50 },
  'WELCOME15': { type: 'percentage', value: 15 },
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
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

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
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

  const removeFromCart = (id: string, size: string, color: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.id === id && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
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
    if (!coupon || !coupon.isValid) return 0;
    
    const subtotal = getTotalPrice();
    if (coupon.type === 'percentage') {
      return subtotal * (coupon.value / 100);
    } else {
      return Math.min(coupon.value, subtotal);
    }
  };

  const getFinalTotal = () => {
    return getTotalPrice() - getDiscountAmount();
  };

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (validCoupons[upperCode]) {
      setCoupon({
        code: upperCode,
        ...validCoupons[upperCode],
        isValid: true,
      });
      return true;
    }
    return false;
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
