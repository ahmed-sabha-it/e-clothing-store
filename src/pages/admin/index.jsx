import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import  Button  from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Package,
  Users,
  Tag,
  Menu,
  Moon,
  Sun,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Eye,
  X,
  User
} from 'lucide-react';
import ProductManagement from './components/ProductManagement';
import CouponManagement from './components/CouponManagement';
import UsersManagement from './components/UsersManagement';
import Dashboard from './components/Dashboard';
import AccountManagement from './components/AccountManagement';

const AdminPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Check if user is admin
    if (!user || (!user.is_admin && user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Trigger re-animation when tab changes
    setAnimationKey(prev => prev + 1);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'account', label: 'Account', icon: User },
  ];

  const stats = [
    { label: 'Total Sales', value: '$45,231', change: '+12.5%', icon: DollarSign },
    { label: 'Total Orders', value: '1,234', change: '+8.2%', icon: ShoppingBag },
    { label: 'Active Users', value: '892', change: '+15.3%', icon: Users },
   
  ];

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black transition-colors duration-300 ${theme}`}>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-50/95 via-amber-50/95 to-yellow-50/95 dark:from-gray-800/95 dark:via-gray-900/95 dark:to-black/95 border-b border-orange-200/50 dark:border-gray-700/50 backdrop-blur-lg lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="animate-fade-in">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black border-r border-orange-200/50 dark:border-gray-700/50">
            <div className="flex flex-col h-full">
              <div className="sr-only">
                <h2>Admin Navigation Menu</h2>
                <p>Navigate through different admin sections</p>
              </div>
              <div className="mb-8 pb-6 border-b border-orange-200/50 dark:border-gray-700/50 animate-fade-in animation-delay-150">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
              </div>
              <nav className="flex-1 space-y-2">
                {sidebarItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:from-orange-600 hover:to-amber-600' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-orange-100/50 dark:hover:bg-gray-800/50'
                    }`}
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-auto pt-6 border-t border-orange-200/50 dark:border-gray-700/50 space-y-3 animate-fade-in animation-delay-600">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-full"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-5 w-5" />
                </Button> */}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold animate-fade-in animation-delay-150">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="animate-fade-in animation-delay-300"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="animate-fade-in animation-delay-450"
          >
            <LogOut className="h-5 w-5" />
          </Button> */}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-black/90 border-r border-orange-200/50 dark:border-gray-700/50 backdrop-blur-sm flex flex-col p-6 z-40 hidden lg:flex">
        <div className="mb-8 pb-6 border-b border-orange-200/50 dark:border-gray-700/50 animate-fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:from-orange-600 hover:to-amber-600' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-orange-100/50 dark:hover:bg-gray-800/50'
              }`}
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t space-y-3 animate-fade-in animation-delay-600">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-full border-orange-200 dark:border-gray-700 hover:bg-orange-100/50 dark:hover:bg-gray-800/50"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
          {/* <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button> */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="sticky top-0 z-30 bg-gradient-to-r from-orange-50/95 via-amber-50/95 to-yellow-50/95 dark:from-gray-800/95 dark:via-gray-900/95 dark:to-black/95 backdrop-blur-lg border-b border-orange-200/50 dark:border-gray-700/50 px-6 py-4 flex items-center justify-between animate-fade-in">
          <h1 className="text-2xl font-bold">
            {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          
        </div>

        <div className="p-6" key={animationKey}>
          {activeTab === 'dashboard' && <Dashboard stats={stats} />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'coupons' && <CouponManagement />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'account' && <AccountManagement />}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
