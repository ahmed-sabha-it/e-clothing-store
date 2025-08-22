import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const WishlistSection = ({ wishlistItems, onRemoveItem, onMoveToCart, onClearWishlist }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('dateAdded');

  const sortOptions = [
    { value: 'dateAdded', label: 'Date Added' },
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'brand', label: 'Brand' }
  ];

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const handleMoveSelectedToCart = () => {
    selectedItems.forEach(itemId => {
      const item = wishlistItems.find(w => w.id === itemId);
      if (item) {
        onMoveToCart(item);
      }
    });
    setSelectedItems([]);
  };

  const handleRemoveSelected = () => {
    if (window.confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      selectedItems.forEach(itemId => onRemoveItem(itemId));
      setSelectedItems([]);
    }
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'brand':
        return a.brand.localeCompare(b.brand);
      case 'dateAdded':
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-0">
          My Wishlist ({wishlistItems.length})
        </h2>
        
        {wishlistItems.length > 0 && (
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClearWishlist}
              iconName="Trash2"
              iconPosition="left"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">Save items you love to buy them later</p>
          <Button onClick={() => window.location.href = '/product-catalog'}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <>
          {/* Bulk Actions */}
          {wishlistItems.length > 1 && (
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-orange-100/50 dark:bg-gray-700/50 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === wishlistItems.length}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">
                  Select All ({selectedItems.length} selected)
                </span>
              </label>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMoveSelectedToCart}
                    iconName="ShoppingCart"
                    iconPosition="left"
                  >
                    Move to Cart ({selectedItems.length})
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveSelected}
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Remove ({selectedItems.length})
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg p-4 hover:border-accent/50 transition-smooth"
              >
                {/* Selection Checkbox */}
                {wishlistItems.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-border"
                    />
                  </div>
                )}

                {/* Product Image */}
                <div className="aspect-square bg-orange-100/50 dark:bg-gray-700/50 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-medium text-foreground line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {item.inStock ? (
                      <span className="text-xs text-success">In Stock</span>
                    ) : (
                      <span className="text-xs text-error">Out of Stock</span>
                    )}
                  </div>

                  {/* Selected Options */}
                  {(item.selectedSize || item.selectedColor) && (
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && (
                        <div className="flex items-center space-x-1">
                          <span>Color:</span>
                          <div
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: item.selectedColor.toLowerCase() }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => onMoveToCart(item)}
                    disabled={!item.inStock}
                    iconName="ShoppingCart"
                    iconPosition="left"
                    className="w-full"
                  >
                    {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/product-detail?id=${item.id}`}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      iconName="Trash2"
                      className="px-3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistSection;