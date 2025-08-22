
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useScrollToTop } from '../utils/scrollToTop';

const ProductPage = () => {
  useScrollToTop();
  const { id } = useParams();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleAddToCart = () => {
    if (!product) return;
    
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0];
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      category: product.category
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square animate-fade-in animation-delay-150">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6 animate-fade-in animation-delay-300">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground capitalize">{product.category}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="animate-fade-in animation-delay-450">
              <label className="block text-sm font-medium text-foreground mb-2">Size</label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                      selectedSize === size || (!selectedSize && size === product.sizes[0])
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in animation-delay-600">
              <label className="block text-sm font-medium text-foreground mb-2">Color</label>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 ${
                      selectedColor === color || (!selectedColor && color === product.colors[0])
                        ? 'border-primary scale-110'
                        : 'border-border hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 animate-fade-in animation-delay-750">
            <button 
              onClick={handleAddToCart}
              className="flex-1 orange-button py-3"
            >
              Add to Cart
            </button>
            <button className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors duration-200">
              ♡
            </button>
          </div>

          <div className="prose prose-sm text-muted-foreground animate-fade-in animation-delay-900">
            <p>
              This is a high-quality {product.name.toLowerCase()} perfect for any occasion. 
              Made with premium materials and designed for comfort and style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
