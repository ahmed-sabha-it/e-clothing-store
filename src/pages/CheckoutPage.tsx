
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button1';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, MapPin, User, Mail, Phone, Lock } from 'lucide-react';
import { useScrollToTop } from '../utils/scrollToTop';

const CheckoutPage = () => {
  useScrollToTop();
  const { cartItems, getTotalPrice, getFinalTotal, getDiscountAmount, coupon, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });
      clearCart();
      navigate('/');
      setIsProcessing(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some items to your cart before checking out.
        </p>
        <Button onClick={() => navigate('/category/all')} className="orange-button">
          Continue Shopping
        </Button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const discountedSubtotal = getFinalTotal();
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground mb-8 animate-fade-in animation-delay-150">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-8 animate-fade-in animation-delay-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-fade-in animation-delay-450">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-fade-in animation-delay-600">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-fade-in animation-delay-750">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Payment Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full orange-button py-3 text-lg animate-fade-in animation-delay-900"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Lock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Place Order - ${total.toFixed(2)}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 animate-fade-in animation-delay-1050">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div 
                  key={`${item.id}-${item.size}-${item.color}`} 
                  className="flex gap-3 animate-fade-in"
                  style={{ animationDelay: `${1200 + (index * 100)}ms` }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {coupon && discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    Discount ({coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`})
                  </span>
                  <span className="text-green-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
