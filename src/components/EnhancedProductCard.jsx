import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import { useWishlist } from '@/contexts/WishlistContext';

const EnhancedProductCard = ({ product, index = 0 }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id.toString())) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || product.brand || 'Product',
      });
    }
  };

  // Default gradient if not provided
  const gradient = product.gradient || "from-blue-500 to-purple-500";

  return (
    <Link
      to={`/product-detail-view?id=${product.id}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105"
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
          className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/30 shadow-lg"
        >
          <Icon 
            name="Heart" 
            size={20} 
            className={`transition-colors ${
              isInWishlist(product.id.toString()) 
                ? 'text-red-500 fill-current' 
                : 'text-gray-700 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Enhanced Product Info */}
      <div className="p-8 space-y-5">
        {/* Brand */}
        <p className="text-sm text-purple-600 uppercase tracking-wider font-bold">
          {product?.brand || product?.category}
        </p>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
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
            ({product?.reviewCount || product?.reviews || 0})
          </span>
        </div>

        {/* Colors (if available) */}
        {product?.colors && product.colors.length > 0 && (
          <div className="flex gap-2">
            {product.colors.slice(0, 4).map((color, colorIndex) => (
              <div
                key={colorIndex}
                className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 font-medium flex items-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

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
      </div>
    </Link>
  );
};

export default EnhancedProductCard;
