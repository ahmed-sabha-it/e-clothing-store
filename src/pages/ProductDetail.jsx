import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';
import StarRating from '@/components/StarRating';
import { productAPI, specificationAPI, reviewAPI } from '@/lib/api';
import { formatProductForDisplay } from '@/utils/productUtils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import useScrollToTop from '../utils/scrollToTop'
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isProductWishlisted } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [specifications, setSpecifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specificationsLoading, setSpecificationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpecifications, setSelectedSpecifications] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [displayRating, setDisplayRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userReviewId, setUserReviewId] = useState(null);

  // Move fetchReviews outside useEffect so it can be used in handleRatingChange
  const fetchReviews = async (specs) => {
    try {
      setReviewsLoading(true);
      // Get all reviews for all specifications of this product
      const allReviews = await reviewAPI.getAll();
      
      // Filter reviews for this product's specifications
      const specIds = specs.map(spec => spec.id);
      const productReviews = allReviews.data?.filter(review => 
        specIds.includes(review.specification_id)
      ) || [];
      
      setReviews(productReviews);
      
      // Check if current user has already reviewed this product
      const currentUserId = 1; // TODO: Get from auth context
      const userReview = productReviews.find(review => review.user_id === currentUserId);
      
      if (userReview) {
        setHasUserReviewed(true);
        setUserReviewId(userReview.id);
        setUserRating(userReview.rating);
      } else {
        setHasUserReviewed(false);
        setUserReviewId(null);
        setUserRating(0);
      }
      
      // Calculate average rating
      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
        setDisplayRating(Math.round(avgRating)); // Round to nearest whole number
        setReviewCount(productReviews.length);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productAPI.getById(id);
        const rawProduct = response.data || response.product || response;
        const formattedProduct = formatProductForDisplay(rawProduct);
        
        setProduct(formattedProduct);
        
        // Initialize rating to 0 by default
        setDisplayRating(0);
        setReviewCount(0);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const fetchSpecifications = async () => {
      try {
        setSpecificationsLoading(true);
        const specs = await specificationAPI.getByProductId(id);
        setSpecifications(specs);
        return specs;
      } catch (err) {
        console.error('Error fetching specifications:', err);
        return [];
      } finally {
        setSpecificationsLoading(false);
      }
    };

    if (id) {
      const loadData = async () => {
        await fetchProduct();
        const specs = await fetchSpecifications();
        if (specs.length > 0) {
          await fetchReviews(specs);
        }
      };
      loadData();
    }
  }, [id]);

  // Helper functions for specifications
  const getSpecificationsByType = (type) => {
    return specifications.filter(spec => 
      spec.name.toLowerCase().includes(type.toLowerCase())
    );
  };

  const isColorSpec = (specName) => {
    const colorKeywords = ['color', 'colour'];
    return colorKeywords.some(keyword => 
      specName.toLowerCase().includes(keyword)
    );
  };

  const parseColor = (colorValue) => {
    // Handle common color names
    const colorMap = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#f59e0b',
      'purple': '#8b5cf6',
      'pink': '#ec4899',
      'black': '#000000',
      'white': '#ffffff',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'orange': '#f97316',
      'brown': '#92400e',
      'navy': '#1e3a8a',
      'maroon': '#7f1d1d'
    };
    
    const lowerValue = colorValue.toLowerCase();
    return colorMap[lowerValue] || lowerValue;
  };

  const handleSpecificationSelect = (specName, spec) => {
    setSelectedSpecifications(prev => ({
      ...prev,
      [specName]: spec
    }));
  };

  const handleRatingChange = async (newRating) => {
    setUserRating(newRating);
    
    try {
      if (specifications.length === 0) {
        toast({
          title: "Error",
          description: "Cannot submit review: Product has no specifications.",
          variant: "destructive",
        });
        return;
      }

      const specificationId = specifications[0].id;
      const currentUserId = 1; // TODO: Get from auth context
      
      if (hasUserReviewed && userReviewId) {
        // Update existing review
        await reviewAPI.update(userReviewId, {
          user_id: currentUserId,
          specification_id: specificationId,
          rating: newRating,
          comment: "" // Optional comment field
        });
        
        toast({
          title: "Rating updated",
          description: `You updated your rating to ${newRating} out of 5 stars.`,
        });
      } else {
        // Create new review
        await reviewAPI.create({
          user_id: currentUserId,
          specification_id: specificationId,
          rating: newRating,
          comment: "" // Optional comment field
        });
        
        toast({
          title: "Rating submitted",
          description: `You rated this product ${newRating} out of 5 stars.`,
        });
      }

      // Refresh reviews after successful submission/update
      await fetchReviews(specifications);
      
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast({
        title: "Error",
        description: hasUserReviewed ? "Failed to update rating. Please try again." : "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if required specifications are selected
    const requiredSpecs = specifications.filter(spec => 
      ['size', 'color'].some(type => spec.name.toLowerCase().includes(type))
    );
    
    const specTypes = [...new Set(requiredSpecs.map(spec => {
      if (spec.name.toLowerCase().includes('size')) return 'size';
      if (spec.name.toLowerCase().includes('color')) return 'color';
      return spec.name.toLowerCase();
    }))];
    
    for (const type of specTypes) {
      if (!selectedSpecifications[type]) {
        toast({
          title: `Please select a ${type}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Pass the product with selected specifications to CartContext
    // CartContext will handle server API calls for authenticated users
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      specifications: selectedSpecifications, // This contains the full spec objects with IDs
      quantity: quantity,
      category: product.category,
      // For backwards compatibility with local cart (guests)
      size: selectedSpecifications.size?.value,
      color: selectedSpecifications.color?.value
    });

    // Success toast is now handled by CartContext
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    // Pass product with selected specifications to WishlistContext
    // For authenticated users, it will use selected specs or fallback to first spec (Option B)
    // For guests, it will use the local wishlist
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      specifications: selectedSpecifications, // This contains the full spec objects with IDs
      // For backwards compatibility with local wishlist (guests)
      size: selectedSpecifications.size?.value,
      color: selectedSpecifications.color?.value
    });

    // Success/error toasts are now handled by WishlistContext
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  useEffect(()=>{useScrollToTop();},[])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-2xl font-bold hover:from-orange-600 hover:to-amber-600"
          >
            <Icon name="Home" size={16} className="mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Mock additional images for gallery (since we might only have one image from API)
  const productImages = [
    product.image,
    product.image, // Duplicate for demo - replace with actual additional images when available
    product.image,
    product.image
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Link to="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Home
          </Link>
          <Icon name="ChevronRight" size={16} />
          <Link to={`/category/${product.category?.toLowerCase()}`} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {product.category}
          </Link>
          <Icon name="ChevronRight" size={16} />
          <span className="text-orange-600 dark:text-orange-400 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl">
              <Image
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              
              {/* Image Navigation */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : productImages.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev < productImages.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <Icon name="ChevronRight" size={20} />
                  </button>
                </>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 border border-white/30 shadow-lg"
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

            {/* Thumbnail Images */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-orange-500 ring-2 ring-orange-200' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full">
                  {product.brand}
                </span>
                {product.stock > 0 ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
              
              {/* Rating */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={20}
                        className={i < displayRating 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {displayRating > 0 ? `${displayRating} (${reviewCount} reviews)` : 'No reviews yet'}
                  </span>
                </div>
                
                {/* User Rating Section */}
                <div className="bg-orange-50 dark:bg-gray-800/50 rounded-xl p-4 border border-orange-200 dark:border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {hasUserReviewed ? 'Update your rating:' : 'Rate this product:'}
                  </h4>
                  {hasUserReviewed && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      You rated this at {userRating} stars before
                    </p>
                  )}
                  <StarRating
                    initialRating={userRating}
                    onRatingChange={handleRatingChange}
                    size={28}
                    className="justify-start"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description :</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Specifications Selection */}
            {specifications.length > 0 && (
              <div className="space-y-6">
                {/* Group specifications by type */}
                {[...new Set(specifications.map(spec => {
                  if (spec.name.toLowerCase().includes('size')) return 'size';
                  if (spec.name.toLowerCase().includes('color')) return 'color';
                  return spec.name.toLowerCase();
                }))].map(specType => {
                  const specsOfType = specifications.filter(spec => {
                    if (specType === 'size') return spec.name.toLowerCase().includes('size');
                    if (specType === 'color') return spec.name.toLowerCase().includes('color');
                    return spec.name.toLowerCase() === specType;
                  });

                  if (specsOfType.length === 0) return null;

                  return (
                    <div key={specType} className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {specType}
                      </h3>
                      
                      {/* Color specifications - display as color swatches */}
                      {specType === 'color' ? (
                        <div className="flex flex-wrap gap-3">
                          {specsOfType.map((spec) => (
                            <button
                              key={spec.id}
                              onClick={() => handleSpecificationSelect(specType, spec)}
                              className={`w-12 h-12 rounded-full border-4 transition-all relative ${
                                selectedSpecifications[specType]?.id === spec.id
                                  ? 'border-orange-500 scale-110'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400'
                              }`}
                              style={{ backgroundColor: parseColor(spec.value) }}
                              title={spec.value}
                            >
                              {/* White border for light colors */}
                              {['white', '#ffffff', '#fff'].includes(parseColor(spec.value).toLowerCase()) && (
                                <div className="absolute inset-1 rounded-full border border-gray-300"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Other specifications - display as buttons */
                        <div className="flex flex-wrap gap-3">
                          {specsOfType.map((spec) => (
                            <button
                              key={spec.id}
                              onClick={() => handleSpecificationSelect(specType, spec)}
                              className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${
                                selectedSpecifications[specType]?.id === spec.id
                                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 text-gray-700 dark:text-gray-300 dark:hover:border-orange-400'
                              }`}
                            >
                              {spec.value}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}


              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <Icon name="Minus" size={16} />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[60px] text-center text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(product.stock || 99, prev + 1))}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {product.stock} available
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl text-lg font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <div className="flex gap-4">
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  className="flex-1 border-2  bg-red-600  text-white  py-3 rounded-2xl font-bold hover:bg-red-700 transition-all duration-300"
                >
                  <Icon 
                    name="Heart" 
                    size={16} 
                    className={`mr-2 ${isProductWishlisted(product.id) ? 'fill-current' : ''}`} 
                  />
                  {isProductWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Customer Reviews ({reviewCount})
            </h2>
            
            {reviewsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="md" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {review.user?.name || 'Anonymous User'}
                          </h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={16}
                                className={i < review.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                        {review.specification && (
                          <div className="mt-2">
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                              {review.specification.name}: {review.specification.value}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="MessageSquare" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProductDetail;
