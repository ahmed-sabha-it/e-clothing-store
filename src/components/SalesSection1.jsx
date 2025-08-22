
import React from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';

const SalesSection = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const saleProducts = getProductsByCategory('sale');
  


  const handleQuickAdd = (product) => {
    // Add with default size and color
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: defaultSize,
      color: defaultColor,
      category: product.category
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (saleProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-red-50 dark:bg-red-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tag className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Limited Time Sale
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on these amazing deals - up to 50% off selected items
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {saleProducts.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/category/sale"
            className="inline-flex items-center gap-2 orange-button"
          >
            <Tag className="h-4 w-4" />
            View All Sale Items
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SalesSection;
