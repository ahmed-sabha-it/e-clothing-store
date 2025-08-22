import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderDetailModal = ({ order, onClose, onReorder, onTrack }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      case 'returned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-orange-100/50 dark:bg-gray-700/50 text-muted-foreground border-border';
    }
  };

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()) },
    { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status.toLowerCase()) },
    { status: 'delivered', label: 'Delivered', completed: order.status.toLowerCase() === 'delivered' }
  ];

  return (
    <div className="fixed inset-0 bg-orange-900/20 dark:bg-gray-900/50 flex items-center justify-center z-[1200] p-4">
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Order Details</h2>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">${order.total.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Tracking Progress */}
          {order.status.toLowerCase() !== 'cancelled' && (
            <div className="bg-orange-100/50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">Order Progress</h3>
              <div className="flex items-center justify-between">
                {trackingSteps.map((step, index) => (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-orange-100/50 dark:bg-gray-700/50 border-2 border-border'
                    }`}>
                      {step.completed ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs text-center mt-2 text-muted-foreground">
                      {step.label}
                    </span>
                    {index < trackingSteps.length - 1 && (
                      <div className={`absolute h-0.5 w-full mt-4 ${
                        step.completed ? 'bg-success' : 'bg-border'
                      }`} style={{ left: '50%', width: 'calc(100% - 2rem)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <div className="w-16 h-16 bg-orange-100/50 dark:bg-gray-700/50 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${item.price.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Shipping Address</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="CreditCard" size={16} />
                <span className="text-muted-foreground">
                  {order.paymentMethod.type} ending in {order.paymentMethod.last4}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-orange-100/50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border">
          {['shipped', 'processing'].includes(order.status.toLowerCase()) && (
            <Button
              onClick={() => onTrack(order)}
              iconName="Truck"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              Track Order
            </Button>
          )}
          
          {order.status.toLowerCase() === 'delivered' && (
            <Button
              onClick={() => onReorder(order)}
              iconName="RotateCcw"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              Reorder
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;