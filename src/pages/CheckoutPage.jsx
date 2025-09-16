import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button1';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Lock, CreditCard, MapPin, User, Mail, Phone, ShoppingBag } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useScrollToTop } from '../utils/scrollToTop';
import { orderAPI, specificationAPI } from '@/lib/api';

const CheckoutPage = () => {
  useScrollToTop();
  const { cartItems, getTotalPrice, getFinalTotal, getDiscountAmount, coupon, clearCart } = useCart();
  const { user } = useAuth();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create a fake order that bypasses payment validation
  const createFakeOrder = async () => {
    setIsProcessing(true);

    try {
      // Check if user is authenticated
      if (!user || !user.id) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to place an order.",
          variant: "destructive",
        });
        setIsProcessing(false);
        navigate('/signin');
        return;
      }

      // Build specifications array from cart items
      const specifications = [];
      
      for (const item of cartItems) {
        // For authenticated users with server cart
        if (user && item.specificationId) {
          specifications.push({
            specification_id: item.specificationId,
            quantity: item.quantity
          });
        }
        // For authenticated users who somehow have local items (edge case)
        else if (item.specifications && Object.values(item.specifications).length > 0) {
          // Use the selected specifications from ProductDetail
          Object.values(item.specifications).forEach(spec => {
            if (spec.id) {
              specifications.push({
                specification_id: spec.id,
                quantity: item.quantity
              });
            }
          });
        } else {
          // Fallback: fetch specifications for the product
          try {
            const productSpecs = await specificationAPI.getByProductId(item.productId || item.id);
            
            if (productSpecs && productSpecs.length > 0) {
              // Try to match by size/color if available
              let matchedSpec = null;
              
              if (item.size || item.color) {
                matchedSpec = productSpecs.find(spec => {
                  const matchesSize = !item.size || (spec.name?.toLowerCase().includes('size') && spec.value === item.size);
                  const matchesColor = !item.color || (spec.name?.toLowerCase().includes('color') && spec.value === item.color);
                  return matchesSize && matchesColor;
                });
              }
              
              // Use matched spec or first available
              const specToUse = matchedSpec || productSpecs[0];
              specifications.push({
                specification_id: specToUse.id,
                quantity: item.quantity
              });
            } else {
              // If no specifications found, show warning and skip this item
              toast({
                title: "Warning",
                description: `Product "${item.name}" has no specifications. Skipping this item.`,
                variant: "warning",
              });
            }
          } catch (specError) {
            toast({
              title: "Error",
              description: `Failed to fetch specifications for "${item.name}".`,
              variant: "destructive",
            });
          }
        }
      }

      // If no specifications could be found at all, show error
      if (specifications.length === 0) {
        toast({
          title: "Order Failed",
          description: "Unable to process order. No product specifications found.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Build order payload
      const orderPayload = {
        user_id: user?.id || 1, // Use authenticated user's ID
        total_price: getFinalTotal(),
        address_description: "Test Order - No Address Required", // Default address for fake order
        status: "pending",
        specifications: specifications
      };

      // Skip coupon inclusion for fake orders to avoid validation issues

      // Create the order via API
      const response = await orderAPI.create(orderPayload);

      if (response.status) {
        toast({
          title: "Order Placed Successfully!",
          description: `Order #${response.data.id} has been created. Thank you for your purchase!`,
        });
        
        // Clear cart and redirect
        clearCart();
        navigate('/profile'); // Redirect to profile to see orders
      } else {
        throw new Error(response.message || "Failed to create order");
      }

    } catch (error) {
      let errorMessage = "Failed to place order. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const errors = error.response.data.errors;
        const errorFields = Object.keys(errors);
        errorMessage = `Validation failed: ${errorFields.map(field => `${field}: ${errors[field][0]}`).join(', ')}`;
      }
      
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use the fake order creation instead of form validation
    await createFakeOrder();
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

            {/* Simplified Place Order Button - No form validation required */}
            <Button 
              type="button"
              onClick={createFakeOrder}
              className="w-full orange-button py-3 text-lg animate-fade-in animation-delay-900"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner size={16} className="mr-2" />
                  Processing Order...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Place Order - ${total.toFixed(2)}
                </>
              )}
            </Button>
            
            {/* Optional: Add a note about simplified checkout */}
            <p className="text-sm text-muted-foreground text-center mt-4">
              Note: This is a simplified checkout. No payment information is required.
            </p>
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
                    Discount ({coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`})
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
