import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/Button';
import OrderDetailModal from './OrderDetailModal';

const OrderHistory = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' }
  ];

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  const handleReorder = (order) => {
    // TODO: Integrate with order API
    // console.log('Reordering:', order.id);
  };

  const handleTrackOrder = (order) => {
    // TODO: Integrate with tracking API
    // console.log('Tracking:', order.id);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-0">Order History</h2>
        <div className="text-sm text-muted-foreground">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by order ID or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {paginatedOrders.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all' ?'Try adjusting your search or filter criteria' :'Start shopping to see your orders here'
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => window.location.href = '/product-catalog'}>
              Start Shopping
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="border border-border rounded-lg p-4 hover:border-accent/50 transition-smooth"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 lg:mb-0">
                  <div>
                    <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${order.total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-orange-100/50 dark:bg-gray-700/50 rounded-md border-2 border-background flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 bg-orange-100/50 dark:bg-gray-700/50 rounded-md border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {order.items.slice(0, 2).map(item => item.name).join(', ')}
                    {order.items.length > 2 && ` and ${order.items.length - 2} more`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View Details
                </Button>
                
                {['shipped', 'processing'].includes(order.status.toLowerCase()) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTrackOrder(order)}
                    iconName="Truck"
                    iconPosition="left"
                  >
                    Track Order
                  </Button>
                )}
                
                {order.status.toLowerCase() === 'delivered' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order)}
                    iconName="RotateCcw"
                    iconPosition="left"
                  >
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            />
            
            <span className="px-3 py-1 text-sm">
              {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
            />
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReorder={handleReorder}
          onTrack={handleTrackOrder}
        />
      )}
    </div>
  );
};

export default OrderHistory;