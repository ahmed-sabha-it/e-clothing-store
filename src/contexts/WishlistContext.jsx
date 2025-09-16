import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI, specificationAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Server wishlist items for authenticated users
  const [serverWishlistItems, setServerWishlistItems] = useState([]);
  
  // Local wishlist items for guests
  const [localWishlistItems, setLocalWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Determine which wishlist items to use based on auth status
  const wishlistItems = user ? serverWishlistItems : localWishlistItems;

  // Map server wishlist item to UI-friendly format
  const mapServerWishlistItem = (item) => {
    const product = item.specification?.product || {};
    const spec = item.specification || {};
    
    const basePrice = parseFloat(product.price || 0);
    const specPrice = parseFloat(spec.price || 0);
    const unitPrice = basePrice + specPrice;
    
    return {
      // Server-specific fields
      id: item.id, // This is the wishlist item ID from server
      wishlistItemId: item.id,
      specificationId: spec.id,
      
      // Product fields
      productId: product.id,
      name: product.name || 'Unknown Product',
      image: product.image_url || product.image || '/placeholder.svg',
      category: product.category?.name || 'Product',
      
      // Specification fields
      specName: spec.name || '',
      specValue: spec.value || '',
      size: spec.name?.toLowerCase().includes('size') ? spec.value : null,
      color: spec.name?.toLowerCase().includes('color') ? spec.value : null,
      
      // Pricing
      basePrice,
      specPrice,
      price: unitPrice, // For compatibility with existing code
      unitPrice,
    };
  };

  // Load wishlist from server for authenticated users
  const loadServerWishlist = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await wishlistAPI.getAll();
      const items = response.data || [];
      const mappedItems = items.map(mapServerWishlistItem);
      setServerWishlistItems(mappedItems);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast({
        title: "Failed to load wishlist",
        description: "We couldn't load your wishlist items. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load server wishlist when user changes
  useEffect(() => {
    if (user) {
      loadServerWishlist();
    } else {
      setServerWishlistItems([]);
    }
  }, [user]);

  // Save local wishlist to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(localWishlistItems));
    }
  }, [localWishlistItems, user]);

  // Add to wishlist function
  const addToWishlist = async (item) => {
    if (user) {
      // Authenticated: Add to server wishlist
      try {
        // Handle different input formats
        let specificationToAdd = null;
        
        if (item.specifications && typeof item.specifications === 'object') {
          // From ProductDetail: item.specifications is an object of selected specs
          // For wishlist, we'll use the first selected spec (or could be enhanced to add all)
          const selectedSpecs = Object.values(item.specifications).filter(spec => spec?.id);
          specificationToAdd = selectedSpecs[0];
        } else if (item.specificationId) {
          // Direct specification ID provided
          specificationToAdd = { id: item.specificationId };
        } else if (item.id && !item.specifications) {
          // Quick add from card: fetch specifications and use first one (Option B)
          try {
            const specs = await specificationAPI.getByProductId(item.id);
            if (specs && specs.length > 0) {
              specificationToAdd = specs[0];
              
              // Show toast if multiple options exist
              if (specs.length > 1) {
                toast({
                  title: "Default variant added to wishlist",
                  description: "Visit the product page to add other variants.",
                });
              }
            } else {
              toast({
                title: "Cannot add to wishlist",
                description: "This product has no available options.",
                variant: "destructive",
              });
              return;
            }
          } catch (error) {
            console.error('Failed to fetch specifications:', error);
            toast({
              title: "Failed to add to wishlist",
              description: "Could not load product options.",
              variant: "destructive",
            });
            return;
          }
        }
        
        // Add specification to server wishlist
        if (specificationToAdd?.id) {
          try {
            await wishlistAPI.add({
              specification_id: specificationToAdd.id
            });
            
            // Reload wishlist from server
            await loadServerWishlist();
            
            toast({
              title: "Added to wishlist",
              description: `${item.name || 'Item'} has been added to your wishlist.`,
            });
          } catch (error) {
            if (error.response?.status === 409) {
              // Item already in wishlist
              toast({
                title: "Already in wishlist",
                description: "This item is already in your wishlist.",
              });
            } else {
              console.error('Failed to add to wishlist:', error);
              toast({
                title: "Failed to add to wishlist",
                description: error.response?.data?.message || "Please try again.",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        toast({
          title: "Failed to add to wishlist",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Guest: Use local wishlist
      setLocalWishlistItems(prev => {
        const exists = prev.find(wishlistItem => wishlistItem.id === item.id);
        if (exists) return prev;
        return [...prev, item];
      });
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    if (user) {
      // Authenticated: Remove from server
      try {
        await wishlistAPI.remove(wishlistItemId);
        await loadServerWishlist();
        
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        });
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        toast({
          title: "Failed to remove item",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Guest: Remove from local wishlist
      // For guests, wishlistItemId is actually the product ID
      setLocalWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));
    }
  };

  // Toggle wishlist (add if not present, remove if present)
  const toggleWishlist = async (item) => {
    if (user) {
      // For authenticated users, check by specification ID if available
      if (item.specificationId) {
        const isWishlisted = serverWishlistItems.some(wItem => wItem.specificationId === item.specificationId);
        if (isWishlisted) {
          const wishlistItem = serverWishlistItems.find(wItem => wItem.specificationId === item.specificationId);
          await removeFromWishlist(wishlistItem.wishlistItemId);
        } else {
          await addToWishlist({ ...item, specificationId: item.specificationId });
        }
      } else {
        // Product-level toggle - check if any variant is wishlisted
        const isProductWishlisted = serverWishlistItems.some(wItem => wItem.productId === item.id);
        if (isProductWishlisted) {
          // Remove first variant found for this product
          const wishlistItem = serverWishlistItems.find(wItem => wItem.productId === item.id);
          await removeFromWishlist(wishlistItem.wishlistItemId);
        } else {
          await addToWishlist(item);
        }
      }
    } else {
      // Guest: Toggle local wishlist by product ID
      const isWishlisted = localWishlistItems.some(wItem => wItem.id === item.id);
      if (isWishlisted) {
        removeFromWishlist(item.id);
      } else {
        addToWishlist(item);
      }
    }
  };

  // Check if a specific specification is wishlisted
  const isWishlistedBySpec = (specificationId) => {
    if (user) {
      return serverWishlistItems.some(item => item.specificationId === specificationId);
    }
    return false; // Guests don't have spec-level wishlist
  };

  // Check if a product is wishlisted (any variant)
  const isProductWishlisted = (productId) => {
    if (user) {
      return serverWishlistItems.some(item => item.productId === productId);
    } else {
      return localWishlistItems.some(item => item.id === productId);
    }
  };

  // Legacy method for backward compatibility
  const isInWishlist = (productId) => {
    return isProductWishlisted(productId);
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (user) {
      // For server wishlist, remove all items individually
      try {
        const removePromises = serverWishlistItems.map(item => 
          wishlistAPI.remove(item.wishlistItemId)
        );
        await Promise.all(removePromises);
        setServerWishlistItems([]);
        
        toast({
          title: "Wishlist cleared",
          description: "All items have been removed from your wishlist.",
        });
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
        toast({
          title: "Failed to clear wishlist",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Guest: Clear local wishlist
      setLocalWishlistItems([]);
    }
  };

  // Get wishlist count
  const getWishlistCount = () => wishlistItems.length;

  // Migrate local wishlist to server on login
  const migrateLocalWishlistToServer = async () => {
    if (!user || localWishlistItems.length === 0) return;
    
    try {
      for (const item of localWishlistItems) {
        // Try to find specifications for the product
        try {
          const specs = await specificationAPI.getByProductId(item.id);
          
          // Try to match by size/color if available
          let matchedSpec = null;
          
          if (item.size || item.color) {
            matchedSpec = specs.find(spec => {
              const matchesSize = !item.size || (spec.name?.toLowerCase().includes('size') && spec.value === item.size);
              const matchesColor = !item.color || (spec.name?.toLowerCase().includes('color') && spec.value === item.color);
              return matchesSize && matchesColor;
            });
          }
          
          // Use matched spec or first available
          const specToAdd = matchedSpec || specs[0];
          
          if (specToAdd) {
            try {
              await wishlistAPI.add({
                specification_id: specToAdd.id
              });
            } catch (error) {
              // Ignore 409 conflicts (already exists)
              if (error.response?.status !== 409) {
                console.error('Failed to migrate wishlist item:', item, error);
              }
            }
          }
        } catch (error) {
          console.error('Failed to migrate wishlist item:', item, error);
        }
      }
      
      // Clear local wishlist after migration
      setLocalWishlistItems([]);
      localStorage.removeItem('wishlist');
      
      // Reload server wishlist
      await loadServerWishlist();
      
      toast({
        title: "Wishlist synced",
        description: "Your wishlist items have been saved to your account.",
      });
    } catch (error) {
      console.error('Failed to migrate wishlist:', error);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    if (user && localWishlistItems.length > 0) {
      // User just logged in and has local items
      migrateLocalWishlistToServer();
    }
  }, [user]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      isWishlistedBySpec,
      isProductWishlisted,
      clearWishlist,
      getWishlistCount,
      refreshWishlist: loadServerWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
