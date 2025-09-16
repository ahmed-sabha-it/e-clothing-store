
import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../utils/scrollToTop';
import { Trash2, Heart } from 'lucide-react';

const WishlistPage = () => {
  useScrollToTop();
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Save items you love by clicking the heart icon on any product.
        </p>
        <Link to="/category/all" className="orange-button">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8 animate-fade-in animation-delay-150">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <span className="text-sm text-muted-foreground">({wishlistItems.length} items)</span>
        </div>
        
        {user ? (
          // Authenticated users: Show server wishlist items with specification details
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in animation-delay-300">
            {wishlistItems.map((item, index) => {
              const itemKey = `server-${item.wishlistItemId || item.id}`;
              
              return (
                <div 
                  key={itemKey}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in"
                  style={{ animationDelay: `${450 + (index * 100)}ms` }}
                >
                  <div className="relative">
                    <Link to={`/product/${item.productId || item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.wishlistItemId || item.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <Link to={`/product/${item.productId || item.id}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.category}
                    </p>
                    
                    {/* Show specification details for authenticated users */}
                    {item.specName && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{item.specName}:</span>
                        <span className="bg-muted px-2 py-1 rounded text-xs font-medium">
                          {item.specValue}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-foreground">
                        ${(item.unitPrice || item.price).toFixed(2)}
                      </span>
                      {item.basePrice && item.specPrice && (
                        <span className="text-xs text-muted-foreground">
                          ${item.basePrice.toFixed(2)} + ${item.specPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Guest users: Show local wishlist items using product cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-fade-in animation-delay-300">
            {wishlistItems.map((item, index) => {
              // Convert wishlist item to product format for EnhancedProductCard
              const product = {
                ...item,
                rating: 4.5,
                reviewCount: 0,
                colors: item.color ? [item.color] : ['black'],
                sizes: item.size ? [item.size] : ['M'],
                originalPrice: undefined,
                isNew: false,
                isOnSale: false,
                isPopular: false,
                gradient: "from-purple-500 to-pink-500"
              };
              
              return (
                <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${450 + (index * 100)}ms` }}>
                  <EnhancedProductCard
                    product={product}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
