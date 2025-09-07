import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import SalesCard from '@/components/SalesCard';
import NewProductCard from "@/components/NewProductCard"
import { getProductsByCategory } from '@/data/products';
import { getSaleProductsByCategory } from '@/data/salesProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Filter, X } from 'lucide-react';
import { useScrollToTop } from '../utils/scrollToTop';
import { productAPI } from '@/lib/api';
import { getNewArrivalProducts, formatProductsForDisplay, getProductsByCategory as filterProductsByCategory, getCategoryTitle } from '@/utils/productUtils';

const CategoryPage = () => {
  useScrollToTop();
  const { category } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('name');

  // Fetch products based on category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Special handling for sale category - use mock sales data
        if (category === 'sale') {
          const saleProducts = getSaleProductsByCategory('sale');
          setAllProducts(saleProducts);
          setLoading(false);
          return;
        }
        
        const response = await productAPI.getAll();
        const apiProducts = response.data || response.products || [];
        const formattedProducts = formatProductsForDisplay(apiProducts);
        
        let filteredProducts;
        
        if (category === 'new-arrivals') {
          // Special handling for new arrivals - filter by date
          filteredProducts = getNewArrivalProducts(formattedProducts);
        } else {
          // Filter by category for men, women, kids, accessories, etc.
          filteredProducts = filterProductsByCategory(formattedProducts, category);
        }
        
        setAllProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        // Fallback to static data
        if (category === 'sale') {
          const saleProducts = getSaleProductsByCategory('sale');
          setAllProducts(saleProducts);
        } else {
          const staticProducts = getProductsByCategory(category || 'all');
          setAllProducts(staticProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleQuickAdd = (product) => {
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

  const filteredProducts = allProducts
    .filter(product => {
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes.includes(size));
      const colorMatch = selectedColors.length === 0 || selectedColors.some(color => product.colors.includes(color.toLowerCase()));
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return sizeMatch && colorMatch && priceMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const allSizes = [...new Set(allProducts.flatMap(p => p.sizes))];
  const allColors = [...new Set(allProducts.flatMap(p => p.colors))];

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 500]);
  };

  const categoryTitle = getCategoryTitle(category || 'all');

  return (
    <div className="py-8 animate-fade-in">
      {/* Filters Panel (Centered) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex justify-center animate-fade-in animation-delay-150">
        <div className="w-full max-w-lg space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h3>
            {(selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Size Filter */}
          <div className="animate-fade-in animation-delay-300">
            <h4 className="font-medium text-foreground mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSizes(prev =>
                      prev.includes(size)
                        ? prev.filter(s => s !== size)
                        : [...prev, size]
                    );
                  }}
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    selectedSizes.includes(size)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="animate-fade-in animation-delay-450">
            <h4 className="font-medium text-foreground mb-3">Color</h4>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColors(prev =>
                      prev.includes(color)
                        ? prev.filter(c => c !== color)
                        : [...prev, color]
                    );
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    selectedColors.includes(color)
                      ? 'border-primary scale-110'
                      : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="animate-fade-in animation-delay-600">
            <h4 className="font-medium text-foreground mb-3">Price Range</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">${priceRange[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
       
      </div>

       {/* Products Grid */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in animation-delay-750">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">{categoryTitle}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="name">Sort by Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-xl animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading products: {error}</p>
              <p className="text-muted-foreground">Showing fallback data</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {filteredProducts.map((product, index) => {
                // SIMPLE RENDERING LOGIC
                if (product.salePrice && product.discount) {
                  // Product has sale price = use SalesCard
                  return <SalesCard key={product.id} product={product} index={index} />;
                } else if (category === "new-arrivals" || product.id.toString().startsWith('new-')) {
                  // New arrivals category or product ID starts with 'new-' = use NewProductCard
                  return <NewProductCard key={product.id} product={product} index={index} />;
                } else {
                  // Normal product = use EnhancedProductCard
                  return <EnhancedProductCard key={product.id} product={product} index={index} />;
                }
              })}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 animate-fade-in animation-delay-900">
              <p className="text-muted-foreground">
                {category === 'new-arrivals' ? 'No new arrivals in the last 7 days.' : 'No products match your current filters.'}
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 orange-button"
              >
                Clear Filters
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default CategoryPage;
