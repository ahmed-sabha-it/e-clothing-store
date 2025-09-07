import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Image from '@/components/AppImage';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import { getProductsByCategory } from '@/data/products';
import { Spinner } from '@/components/ui/spinner';

const AccessoriesSection = ({ loading = false }) => {
  const accessories = getProductsByCategory('accessories').slice(0, 4);


  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Section Header */}
        <div className="flex items-center justify-between mb-20">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg">
                <Icon name="ShoppingBag" size={16} className="mr-2" />
                Accessories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Accessories Collection
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl">
              Complete your look with premium accessories that blend style and functionality
            </p>
          </div>
          {/* Desktop View All Button */}
          <Link to="/category/accessories" className="hidden lg:block">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-6 py-3  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium hover:scale-105 transition-transform duration-300"
            >
              View All Accessories
            </Button>
          </Link>
        </div>

        {/* Enhanced Accessories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            // Enhanced Accessory Cards using EnhancedProductCard
            accessories?.map((accessory, index) => (
              <EnhancedProductCard
                key={accessory.id}
                product={accessory}
                index={index}
              />
            ))
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
          <Link to="/category/accessories">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-8 py-4  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              View All Accessories
            </Button>
          </Link>
        </div>

        {/* Enhanced CTA Section */}
        {/* <div className="mt-20">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-12 text-white text-center relative overflow-hidden shadow-2xl"> */}
            {/* Background Pattern */}
            {/* <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white rounded-full"></div>
            </div>
            
            <div className="relative space-y-8">
              <h3 className="text-3xl md:text-4xl font-bold">
                Discover More Accessories
              </h3>
              <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed">
                Explore our complete collection of premium accessories and find the perfect pieces to express your unique style
              </p>
              <Link to="/product-catalog-browse?category=accessories">
                <Button 
                  variant="secondary"
                  size="lg"
                  iconName="ArrowRight" 
                  iconSize={20}
                  className="bg-white text-purple-700 hover:bg-gray-100 font-bold text-lg px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Shop All Accessories
                </Button>
              </Link>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </section>
  );
};

export default AccessoriesSection;