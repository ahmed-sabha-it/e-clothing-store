
import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../utils/scrollToTop';

const WishlistPage = () => {
  useScrollToTop();
  const { wishlistItems } = useWishlist();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground mb-8 animate-fade-in animation-delay-150">
        My Wishlist ({wishlistItems.length} items)
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-fade-in animation-delay-300">
        {wishlistItems.map((item, index) => {
          // Convert wishlist item to product format for EnhancedProductCard
          const product = {
            ...item,
            rating: 4.5,
            reviewCount: 0,
            colors: ['black'],
            sizes: ['M'],
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
    </div>
  );
};

export default WishlistPage;
