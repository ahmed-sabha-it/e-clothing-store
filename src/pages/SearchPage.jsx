import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import SalesCard from '@/components/SalesCard';
import NewProductCard from "@/components/NewProductCard";
import { getProductsByCategory } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Filter, X, Search } from 'lucide-react';
import { useScrollToTop } from '../utils/scrollToTop';
import { productAPI } from '@/lib/api';
import { formatProductsForDisplay } from '@/utils/productUtils';

const SearchPage = () => {

  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('name');
  
  // API state
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch all products from API when user searches
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.getAll();
      const apiProducts = response.data || response.products || response || [];
      const formattedProducts = formatProductsForDisplay(apiProducts);
      
      setAllProducts(formattedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
      
      // Fallback to static data if API fails
      const staticProducts = [
        ...getProductsByCategory('men'),
        ...getProductsByCategory('women'),
        ...getProductsByCategory('kids'),
        ...getProductsByCategory('accessories'),
        ...getProductsByCategory('new-arrivals'),
        ...getProductsByCategory('sale')
      ];
      
      // Remove duplicates based on product id
      const uniqueStaticProducts = staticProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );
      
      setAllProducts(uniqueStaticProducts);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when user types or applies filters
  useEffect(() => {
    if (searchQuery.trim() || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) {
      if (!hasSearched) {
        setHasSearched(true);
        fetchAllProducts();
      }
    }
  }, [searchQuery, selectedCategories, priceRange, hasSearched]);
  
 
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

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const filteredProducts = allProducts
    .filter(product => {
      // Search query filter
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);
      
      // Price filter
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];

      return searchMatch && categoryMatch && priceMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return a.id.toString().startsWith('new-') ? -1 : 1;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Get unique filter options
  const allCategories = [...new Set(allProducts.map(p => p.category))];

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="py-8 animate-fade-in">
        {/* Search Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Search Products</h1>
            <p className="text-xl text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Category</h4>
                <div className="space-y-2">
                  {allCategories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories(prev => [...prev, category]);
                          } else {
                            setSelectedCategories(prev => prev.filter(c => c !== category));
                          }
                        }}
                        className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>


              {/* Price Range */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-8">${priceRange[0]}</span>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-8">${priceRange[1]}</span>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasSearched && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Results'}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
                </p>
                {error && (
                  <p className="text-red-600 text-sm mt-1">
                    Error loading products: {error} (showing fallback data)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State - No Search */}
          {!hasSearched && !loading && (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Start searching for products</h3>
                <p className="text-muted-foreground">
                  Use the search bar above or apply filters to find products
                </p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {hasSearched && !loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => {
                // Use same rendering logic as CategoryPage
                if (product.salePrice && product.discount) {
                  return <SalesCard key={product.id} product={product} index={index} />;
                } else if (product.id.toString().startsWith('new-')) {
                  return <NewProductCard key={product.id} product={product} index={index} />;
                } else {
                  return <EnhancedProductCard key={product.id} product={product} index={index} />;
                }
              })}
            </div>
          )}

          {/* No Results */}
          {hasSearched && !loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No products match "${searchQuery}" with your current filters.`
                    : 'No products match your current filters.'
                  }
                </p>
                {(hasActiveFilters || searchQuery) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      clearFilters();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-300"
                  >
                    Clear Search & Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
