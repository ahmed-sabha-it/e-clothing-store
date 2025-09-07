import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import EnhancedProductCard from './EnhancedProductCard';
import NewProductCard from './NewProductCard';
import { newArrivalProducts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { Spinner } from '@/components/ui/spinner';
import { productAPI } from '@/lib/api';
import { getLatestProducts, formatProductsForDisplay } from '@/utils/productUtils';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        const allProducts = response.data || response.products || [];
        const formattedProducts = formatProductsForDisplay(allProducts);
        const latestProducts = getLatestProducts(formattedProducts, 4);
        setProducts(latestProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Fallback to static data if API fails
        const fallbackProducts = newArrivalProducts.slice(0, 4);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products;

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

    toast.success(
      "Added to cart "+ `${product.name} has been added to your cart.`,
    "")
  };

  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between mb-20">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg">
                <Icon name="Star" size={16} className="mr-2" />
               New Arrival
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                New Products
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl">
              Discover our Newest selection of  items you'll absolutely love
            </p>
          </div>
          <Link to="/category/new-arrivals" className="hidden lg:block">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-6 py-3  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium hover:scale-105 transition-transform duration-300"
            >
              View All Featured
            </Button>
          </Link>
        </div>
 
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">Failed to load new arrivals</p>
            <p className="text-sm text-gray-500">Showing fallback products</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product, index) => (
              <NewProductCard 
                key={product.id} 
                product={product}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No new arrivals available</p>
          </div>
        )}
        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
          <Link to="/category/new-arrivals">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-8 py-4  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              View All Featured
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
