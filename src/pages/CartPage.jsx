import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, Tag, X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button1';
import { Input } from '@/components/ui/input';
import { useScrollToTop } from '../utils/scrollToTop';

const CartPage = () => {
  useScrollToTop();
  const { user } = useAuth();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    coupon, 
    getDiscountAmount, 
    getFinalTotal, 
    applyCoupon, 
    removeCoupon 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Start shopping to add items to your cart.
        </p>
        <Link to="/category/all" className="orange-button">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8 animate-fade-in animation-delay-150">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <span className="text-sm text-muted-foreground">({cartItems.length} items)</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6 animate-fade-in animation-delay-300">
          {cartItems.map((item, index) => {
            // Determine the key based on whether it's a server or local item
            const itemKey = user 
              ? `server-${item.cartItemId || item.id}` 
              : `local-${item.id}-${item.size}-${item.color}`;
            
            return (
              <div 
                key={itemKey}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in"
                style={{ animationDelay: `${450 + (index * 100)}ms` }}
              >
                <div className="flex gap-6">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {item.quantity}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        <Link to={`/product/${item.productId || item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground"></span>
                        {item.category}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      {user && item.specName ? (
                        // For authenticated users with server cart
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.specName}:</span>
                          <span className="bg-muted px-2 py-1 rounded text-xs font-medium">
                            {item.specValue}
                          </span>
                        </div>
                      ) : (
                        // For guests with local cart
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Size:</span>
                            <span className="bg-muted px-2 py-1 rounded text-xs font-medium">{item.size || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Color:</span>
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-4 h-4 rounded-full border border-border"
                                style={{ backgroundColor: item.color?.toLowerCase() || '#gray' }}
                              />
                              <span className="capitalize text-xs font-medium">{item.color || 'N/A'}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          ${(item.unitPrice || item.price).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">each</span>
                      </div>
                      
                      <div className="flex items-center  gap-3">
                        <div className="flex items-center  bg-primary rounded-full border border-border rounded-lg bg-background">
                          <button
                            onClick={() => {
                              const cartId = user ? item.cartItemId : item.id;
                              updateQuantity(cartId, item.size, item.color, Math.max(0, item.quantity - 1));
                            }}
                            className="px-3 py-2 bg-primary hover:bg-muted transition-colors"
                          >
                            <Minus className="" />
                          </button>
                          <span className="px-3 py-2 bg-primary text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const cartId = user ? item.cartItemId : item.id;
                              updateQuantity(cartId, item.size, item.color, item.quantity + 1);
                            }}
                            className="px-3 py-2 hover:bg-muted bg-primary transition-colors"
                          >
                            <Plus className="rounded-all border-left-1 border-1 border-white" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => {
                            const cartId = user ? item.cartItemId : item.id;
                            removeFromCart(cartId, item.size, item.color);
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="animate-fade-in animation-delay-600">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm sticky top-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
            
            {/* Coupon Section */}
            <div className="mb-6">
              {!coupon ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={async () => {
                        const success = await applyCoupon(couponCode);
                        if (success) {
                          setCouponCode('');
                          setCouponError('');
                        } else {
                          setCouponError('Invalid coupon code');
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className='bg-primary'
                    >
                      <Tag className="h-4 w-4  mr-1" />
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-500">{couponError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter your coupon code to get discount
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {coupon.code} applied
                    </span>
                  </div>
                  <Button
                    onClick={removeCoupon}
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
              </div>
              {coupon && getDiscountAmount() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    Discount ({coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`})
                  </span>
                  <span className="font-medium text-green-600">
                    -${getDiscountAmount().toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${(getFinalTotal() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">
                    ${(getFinalTotal() * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {user ? (
              <Link to="/checkout" className="w-full orange-button py-3 text-lg block text-center">
                Proceed to Checkout
              </Link>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200 mb-2">
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign in required</span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Please sign in to proceed with checkout
                  </p>
                </div>
                <Link to="/signin" className="w-full orange-button py-3 text-lg block text-center">
                  Sign In to Checkout
                </Link>
              </div>
            )}
            
            <Link to="/category/all" className="w-full mt-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CartPage;
