import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Sun, Moon, Menu, X,LogIn } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import  Button  from '@/components/ui/Button';
const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Men', href: '/category/men' },
    { name: 'Women', href: '/category/women' },
    { name: 'Kids', href: '/category/kids' },
    { name: 'Accessories', href: '/category/accessories' },
    { name: 'New Arrivals', href: '/category/new-arrivals' },
    { name: 'Sale', href: '/category/sale' },
  ];
  return (
    <header className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black border-b border-border sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="sm" className="mr-auto" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 ml-6 sm:ml-10 lg:ml-20">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center max-w-md flex-1 mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2  border border-primary  bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg  text-foreground outline-none ring-1 ring-primary focus:ring-2 border-transparent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button>

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
                    LogIn
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
                className="block px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
