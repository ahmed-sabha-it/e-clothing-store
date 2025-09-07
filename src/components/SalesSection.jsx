import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import SalesCard from '@/components/SalesCard';
import { getProductsByCategory } from '@/data/products';

const SalesSection = () => {
  const salesProducts = getProductsByCategory('sale');


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
                <Icon name="Zap" size={16} className="mr-2" />
                Limited Time Offers
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Sale Items
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl">
              Don't miss out on these incredible deals - limited time offers you won't want to miss
            </p>
          </div>
          <Link to="/category/sale" className="hidden lg:block">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-6 py-3  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium hover:scale-105 transition-transform duration-300"
            >
              View All Sales
            </Button>
          </Link>
        </div>

        {/* Enhanced Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Enhanced Product Cards */}
          {salesProducts.slice(0, 4).map((product, index) => (
            <SalesCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
          <Link to="/category/sale">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-8 py-4  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              View All Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SalesSection;