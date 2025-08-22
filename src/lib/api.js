// api.js
// Centralized API service for all backend communication

import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginAttempt = error.config?.url?.includes('/login');
      const skipRedirect = error.config?.skipAuthRedirect;

      if (!isLoginAttempt && !skipRedirect) {
        Cookies.remove('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/signin') {
          window.location.replace('/signin');
        }
      }
    }
    return Promise.reject(error);
  }
);

// CSRF token helper
const getCsrfCookie = async () => {
  await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
    withCredentials: true
  });
};

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    await getCsrfCookie();
    const response = await api.post('/login', credentials);
    if (response.data?.data?.token) {
      Cookies.set('token', response.data.data.token);
      // Store user data in localStorage for chat
      if (response.data?.data?.user) {
        const user = {
          id: response.data.data.user.id,
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          profile_picture: response.data.data.user.profile_picture,
          avatar: response.data.data.user.profile_picture
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    return response.data;
  },

  // Register user
  register: async (userData) => {
    await getCsrfCookie();
    const response = await api.post('/register', userData);
    if (response.data?.data?.token) {
      Cookies.set('token', response.data.data.token);
      if (response.data?.data?.user) {
        const user = {
          id: response.data.data.user.id,
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          profile_picture: response.data.data.user.profile_picture || response.data.data.user.profile_image,
          balance: response.data.data.user.balance || 0
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.warn('Backend logout failed, clearing token locally:', error);
      throw error;
    } finally {
      Cookies.remove('token');
      localStorage.removeItem('user');
    }
  },

  // Check authentication status
  checkAuth: async () => {
    const response = await api.get('/auth/check', { skipAuthRedirect: true });
    return response.data;
  },

  // Refresh token
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    await getCsrfCookie();
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    await getCsrfCookie();
    const response = await api.post('/reset-password', resetData);
    return response.data;
  }
};

// User API calls
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/user/profile', { skipAuthRedirect: true });
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/user/password', passwordData);
    return response.data;
  },

  // Get user balance
  getBalance: async () => {
    const response = await api.get('/user/balance');
    return response.data;
  },

  // Get recharge requests
  getRechargeRequests: async () => {
    const response = await api.get('/user/recharge-requests');
    return response.data;
  },

  // Get user orders
  getOrders: async () => {
    const response = await api.get('/user/orders');
    return response.data;
  },

  // Get user cart
  getCart: async () => {
    const response = await api.get('/user/cart');
    return response.data;
  },

  // Get user wishlist
  getWishlist: async () => {
    const response = await api.get('/user/wishlist');
    return response.data;
  }
};

// Product API calls
export const productAPI = {
  // Get all products
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product (authenticated users)
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (authenticated users)
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (authenticated users)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Search products
  search: async (query, filters = {}) => {
    const response = await api.get('/products', {
      params: { search: query, ...filters }
    });
    return response.data;
  }
};

// Category API calls
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get single category
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category (authenticated users)
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category (authenticated users)
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (authenticated users)
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

// Cart API calls
export const cartAPI = {
  // Get cart items
  getAll: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  add: async (cartData) => {
    const response = await api.post('/cart', cartData);
    return response.data;
  },

  // Update cart item
  update: async (id, cartData) => {
    const response = await api.put(`/cart/${id}`, cartData);
    return response.data;
  },

  // Remove item from cart
  remove: async (id) => {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },

  // Clear entire cart
  clear: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};

// Order API calls
export const orderAPI = {
  // Get all orders
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Update order
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // Delete order
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancel: async (id) => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  // Complete order
  complete: async (id) => {
    const response = await api.patch(`/orders/${id}/complete`);
    return response.data;
  }
};

// Wishlist API calls
export const wishlistAPI = {
  // Get wishlist items
  getAll: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add item to wishlist
  add: async (wishlistData) => {
    const response = await api.post('/wishlist', wishlistData);
    return response.data;
  },

  // Update wishlist item
  update: async (id, wishlistData) => {
    const response = await api.put(`/wishlist/${id}`, wishlistData);
    return response.data;
  },

  // Remove item from wishlist
  remove: async (id) => {
    const response = await api.delete(`/wishlist/${id}`);
    return response.data;
  }
};

// Review API calls
export const reviewAPI = {
  // Get all reviews
  getAll: async (params = {}) => {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  // Get single review
  getById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // Create review
  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update review
  update: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Delete review
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};

// Payment API calls
export const paymentAPI = {
  // Get all payments
  getAll: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Get single payment
  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Create manual payment
  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Update payment
  update: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  // Delete payment
  delete: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // Pay with balance
  payWithBalance: async (paymentData) => {
    const response = await api.post('/payments/pay-with-balance', paymentData);
    return response.data;
  },

  // Request balance recharge
  requestRecharge: async (rechargeData) => {
    const response = await api.post('/payments/request-recharge', rechargeData);
    return response.data;
  },

  // Get recharge requests (admin)
  getRechargeRequests: async () => {
    const response = await api.get('/payments/recharge-requests');
    return response.data;
  },

  // Approve recharge request (admin)
  approveRechargeRequest: async (id) => {
    const response = await api.patch(`/payments/recharge-requests/${id}/approve`);
    return response.data;
  }
};

// Coupon API calls
export const couponAPI = {
  // Get all coupons
  getAll: async () => {
    const response = await api.get('/coupons');
    return response.data;
  },

  // Get single coupon
  getById: async (id) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  // Create coupon (authenticated users)
  create: async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response.data;
  },

  // Update coupon (authenticated users)
  update: async (id, couponData) => {
    const response = await api.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  // Delete coupon (authenticated users)
  delete: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },

  // Apply coupon
  apply: async (code) => {
    const response = await api.post('/coupons/apply', { code });
    return response.data;
  }
};

// Specification API calls
export const specificationAPI = {
  // Get all specifications
  getAll: async () => {
    const response = await api.get('/specifications');
    return response.data;
  },

  // Get single specification
  getById: async (id) => {
    const response = await api.get(`/specifications/${id}`);
    return response.data;
  },

  // Create specification (authenticated users)
  create: async (specData) => {
    const response = await api.post('/specifications', specData);
    return response.data;
  },

  // Update specification (authenticated users)
  update: async (id, specData) => {
    const response = await api.put(`/specifications/${id}`, specData);
    return response.data;
  },

  // Delete specification (authenticated users)
  delete: async (id) => {
    const response = await api.delete(`/specifications/${id}`);
    return response.data;
  }
};

// Order Specification API calls
export const orderSpecificationAPI = {
  // Get all order specifications
  getAll: async (params = {}) => {
    const response = await api.get('/order-specifications', { params });
    return response.data;
  },

  // Get single order specification
  getById: async (id) => {
    const response = await api.get(`/order-specifications/${id}`);
    return response.data;
  },

  // Create order specification
  create: async (orderSpecData) => {
    const response = await api.post('/order-specifications', orderSpecData);
    return response.data;
  },

  // Update order specification
  update: async (id, orderSpecData) => {
    const response = await api.put(`/order-specifications/${id}`, orderSpecData);
    return response.data;
  },

  // Delete order specification
  delete: async (id) => {
    const response = await api.delete(`/order-specifications/${id}`);
    return response.data;
  }
};

// Export the configured axios instance for custom calls
export default api;
