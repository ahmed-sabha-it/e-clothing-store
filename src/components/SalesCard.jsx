import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import { useWishlist } from '@/contexts/WishlistContext';

const SalesCard = ({ product, index = 0 }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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
        category: product.brand || product.category || 'Product',
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative h-full"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Sale Banner */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-2 font-bold text-sm tracking-wide">
          🔥 FLASH SALE 🔥
        </div>
      </div>

      {/* Enhanced Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mt-8">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Enhanced Sale Badge */}
        {product?.salePrice && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg animate-pulse">
            -{product?.discount}% OFF
          </div>
        )}

        {/* Timer Badge */}
        <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-2xl text-xs font-bold">
          ⏰ Limited Time
        </div>

        {/* Enhanced Wishlist Button */}
        <button onClick={handleWishlistToggle} className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/30 shadow-lg">
          <Icon 
             name="Heart" 
             size={18} 
             className={`transition-colors ${isInWishlist(product.id.toString()) ? 'text-red-500 fill-current' : 'text-gray-700 hover:text-red-500'}`} 
           />
        </button>
      </div>

      {/* Enhanced Product Info */}
      <div className="p-6 space-y-4 flex flex-col flex-1">
        {/* Brand */}
        <p className="text-sm text-red-600 uppercase tracking-wider font-bold">
          {product?.brand}
        </p>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
          {product?.name}
        </h3>

        {/* Enhanced Price Section */}
        <div className="space-y-2">
          {product?.salePrice ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-lg text-gray-500 line-through font-medium">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product?.price)}
            </span>
          )}
          
          {/* Savings Amount */}
          {product?.salePrice && (
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
              💰 Save {formatPrice(product.price - product.salePrice)}
            </div>
          )}
        </div>

        {/* Enhanced Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={14}
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

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <div className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-2xl text-center font-bold group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300 shadow-lg">
            Add to Cart
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SalesCard;
