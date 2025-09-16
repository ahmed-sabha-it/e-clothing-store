import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const EnhancedProductCard = ({ product, index = 0 }) => {
  const { toggleWishlist, isProductWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Pass product info to WishlistContext
    // For authenticated users, WishlistContext will fetch specifications and use the first one (Option B)
    // For guests, it will use the local wishlist with default values
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || product.brand || 'Product',
      // For backwards compatibility with local wishlist (guests)
      size: product.sizes?.[0] || 'Default',
      color: product.colors?.[0] || 'Default',
    });

    // Success/error toasts are now handled by WishlistContext
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Pass product info to CartContext
    // For authenticated users, CartContext will fetch specifications and use the first one
    // For guests, it will use the local cart with default values
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      // For backwards compatibility with local cart (guests)
      size: product.sizes?.[0] || 'Default',
      color: product.colors?.[0] || 'Default',
    });

    // Success toast is now handled by CartContext
  };

  // Default gradient if not provided
  const gradient = product.gradient || "from-blue-500 to-orange-500";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 h-full"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Enhanced Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-120"
        />
        
        {/* Enhanced Popular Badge */}
        {product?.isPopular && (
          <div className={`absolute top-6 left-6 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm`}>
            <Icon name="Star" size={14} className="inline mr-2" />
            POPULAR
          </div>
        )}

        {/* New Badge */}
        {product?.isNew && (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm">
            <Icon name="Sparkles" size={14} className="inline mr-2" />
            NEW
          </div>
        )}

        {/* Sale Badge */}
        {/* {product?.isOnSale && product?.originalPrice && (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm">
            <Icon name="Tag" size={14} className="inline mr-2" />
            SALE
          </div>
        )} */}

        {/* Enhanced Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/30 shadow-lg z-20"
        >
          <Icon 
            name="Heart" 
            size={20} 
            className={`transition-colors ${
              isProductWishlisted(product.id) 
                ? 'text-red-500 fill-current' 
                : 'text-gray-700 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Enhanced Product Info */}
      <div className="p-6 space-y-5 flex flex-col flex-1">
        {/* Brand */}
        <p className="text-sm text-orange-700 uppercase tracking-wider font-bold">
          {product?.brand || product?.category}
        </p>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {product?.name}
        </h3>

        {/* Enhanced Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={16}
                className={i < Math.floor(product?.rating || 0) 
                  ? 'text-yellow-500 fill-current' :'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            <span className="mr-1">{product?.rating || 0}</span>
            {product?.reviewCount > 0 && (
              <span>({product.reviewCount})</span>
            )}
          </span>
        </div>


        {/* Enhanced Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-2xl text-center font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default EnhancedProductCard;
