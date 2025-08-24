
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { Link } from 'react-router-dom';

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isOnSale?: boolean;
};

type ProductCardProps = {
  product: Product;
  onQuickAdd?: (product: Product) => void;
};

const ProductCard = ({ product, onQuickAdd }: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd?.(product);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-orange-gradient text-white text-xs font-semibold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {product.isOnSale && discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-orange-500/80 backdrop-blur-sm hover:bg-white dark:hover:bg-orange-600/90 transition-colors duration-200"
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full orange-button flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Quick Add
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Colors */}
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{product.colors.length - 4}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
