// Product utility functions for filtering and sorting

/**
 * Check if a product was created within the last N days
 * @param {string} createdAt - Product creation date (ISO string)
 * @param {number} days - Number of days to check (default: 7)
 * @returns {boolean} - True if product was created within the specified days
 */
export const isProductCreatedWithinDays = (createdAt, days = 7) => {
  if (!createdAt) return false;
  
  const productDate = new Date(createdAt);
  const currentDate = new Date();
  const daysDifference = Math.floor((currentDate - productDate) / (1000 * 60 * 60 * 24));
  
  return daysDifference <= days;
};

/**
 * Filter products created within the last N days
 * @param {Array} products - Array of products
 * @param {number} days - Number of days to filter by (default: 7)
 * @returns {Array} - Filtered products
 */
export const getProductsFromLastDays = (products, days = 7) => {
  if (!Array.isArray(products)) return [];
  
  return products.filter(product => 
    isProductCreatedWithinDays(product.created_at, days)
  );
};

/**
 * Get the latest N products sorted by creation date
 * @param {Array} products - Array of products
 * @param {number} limit - Number of products to return (default: 4)
 * @returns {Array} - Latest products
 */
export const getLatestProducts = (products, limit = 4) => {
  if (!Array.isArray(products)) return [];
  
  return products
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
};

/**
 * Get new arrival products (created within last 7 days)
 * @param {Array} products - Array of products
 * @returns {Array} - New arrival products
 */
export const getNewArrivalProducts = (products) => {
  return getProductsFromLastDays(products, 7);
};

/**
 * Format product data for display components
 * @param {Object} product - Raw product from API
 * @returns {Object} - Formatted product for components
 */
export const formatProductForDisplay = (product) => {
  if (!product) return null;
  
  return {
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    originalPrice: product.original_price ? parseFloat(product.original_price) : null,
    image: product.image_url || product.image || '/placeholder.svg',
    category: product.category?.name || product.category_name || 'Product',
    brand: product.brand || product.category?.name || 'Brand',
    description: product.description || '',
    stock: product.stock || 0,
    rating: product.average_rating || product.rating || 4.5,
    reviewCount: product.reviews_count || product.review_count || 0,
    colors: product.specifications?.filter(spec => spec.name.toLowerCase() === 'color')?.map(spec => spec.value) || ['Black'],
    sizes: product.specifications?.filter(spec => spec.name.toLowerCase() === 'size')?.map(spec => spec.value) || ['M'],
    specifications: product.specifications || [],
    created_at: product.created_at,
    updated_at: product.updated_at
  };
};

/**
 * Format multiple products for display
 * @param {Array} products - Array of raw products from API
 * @returns {Array} - Array of formatted products
 */
export const formatProductsForDisplay = (products) => {
  if (!Array.isArray(products)) return [];
  
  return products.map(formatProductForDisplay).filter(Boolean);
};


/**
 * Filter products by category
 * @param {Array} products - Array of products
 * @param {string} categoryName - Category to filter by (men, women, kids, accessories, etc.)
 * @returns {Array} - Filtered products
 */
export const getProductsByCategory = (products, categoryName) => {
  if (!Array.isArray(products)) return [];
  if (!categoryName || categoryName === 'all') return products;
  
  const normalizedCategory = categoryName.toLowerCase();
   
  return products.filter(product => {
    const productCategory = product.category?.toLowerCase() || '';
    
    // Handle different category matching strategies
    switch (normalizedCategory) {
      case 'men':
        return productCategory.includes('men') || 
               productCategory.includes('male') ||
               productCategory === 'men\'s' ||
               productCategory === 'mens';
      
      case 'women':
        return productCategory.includes('women') || 
               productCategory.includes('female') ||
               productCategory === 'women\'s' ||
               productCategory === 'womens';
      
      case 'kids':
        return productCategory.includes('kids') || 
               productCategory.includes('children') ||
               productCategory.includes('child') ||
               productCategory === 'kids\'';
      
      case 'accessories':
        return productCategory.includes('accessories') || 
               productCategory.includes('accessory') ||
               productCategory === 'accessories';
      
      case 'sale':
        return product.salePrice || product.discount || product.originalPrice;
      
      default:
        // Exact match for other categories
        return productCategory === normalizedCategory;
    }
  });
};

/**
 * Map category route names to display titles
 * @param {string} category - Category route name
 * @returns {string} - Display title
 */
export const getCategoryTitle = (category) => {
  switch (category) {
    case 'men': return 'Men\'s Collection';
    case 'women': return 'Women\'s Collection';
    case 'kids': return 'Kids\' Collection';
    case 'accessories': return 'Accessories';
    case 'new-arrivals': return 'New Arrivals';
    case 'sale': return 'Sale Items';
    default: return 'All Products';
  }
};
