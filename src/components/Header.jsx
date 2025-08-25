import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from '@/components/Logo';
import  Button  from '@/components/ui/Button';
const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'All', href: '/category/all' },
    { name: 'Men', href: '/category/men' },
    { name: 'Women', href: '/category/women' },
    { name: 'Kids', href: '/category/kids' },
    { name: 'Accessories', href: '/category/accessories' },
    { name: 'New Arrivals', href: '/category/new-arrivals' },
    { name: 'Sale', href: '/category/sale' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  // Don't render header for admin users
  if (isAuthenticated && (user?.is_admin || user?.role === 'admin')) {
    return null;
  }

  return (
    <header className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black border-b border-border sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="sm" className="flex-shrink-0" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 ml-4 lg:ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors duration-200 font-medium whitespace-nowrap ${
                  location.pathname === item.href
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

         

          {/* Right Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4 ml-2 lg:ml-4">
            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button> */}
 {/* Search Icon */}
 <div className="flex items-center ml-4 lg:ml-6">
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label="Search products"
            >
              <Search className="h-5 w-5 text-foreground" />
            </button>
          </div>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200 relative"
            >
              <Heart className="h-5 w-5 text-foreground" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-gradient text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200 relative"
            >
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-gradient text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
             {/* User */}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  <User className="h-5 w-5 text-foreground" />
                </Link>
              ) : (
                <Link to="/signin">
                  <Button 
                    variant="gradient" 
                    iconName="LogIn" 
                    iconSize={16}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded text-sm font-bold shadow-lg font-medium hover:scale-105 transition-transform duration-300"
                  >
                    Log In
                  </Button>
                </Link>
              )}
           
           
           

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-primary bg-primary/10 border-l-4 border-primary'
                    : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <button
                onClick={() => { navigate('/search'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 text-foreground hover:text-primary hover:bg-muted"
              >
                <Search className="h-4 w-4" />
                <span>Search Products</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
