import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import SalesCard from '@/components/SalesCard';

// Static list of products exclusively for the Sales section
const salesProducts = [
  {
    id: 1,
    name: 'Vintage Denim Jacket',
    brand: 'ThreadWear',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    price: 120,
    salePrice: 79,
    discount: 34,
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: 2,
    name: 'Canvas Sneakers',
    brand: 'KickStart',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    price: 60,
    salePrice: 39,
    discount: 35,
    rating: 4.2,
    reviewCount: 142
  },
  {
    id: 3,
    name: 'Classic Leather Belt',
    brand: 'BuckleUp',
    image: 'https://ix-marketing.imgix.net/autotagging.png?auto=format,compress&w=1946',
    price: 45,
    salePrice: 29,
    discount: 36,
    rating: 4.7,
    reviewCount: 57
  },
  {
    id: 4,
    name: 'Summer Straw Hat',
    brand: 'SunShade',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    price: 30,
    salePrice: 19,
    discount: 37,
    rating: 4.3,
    reviewCount: 34
  }
];

const SalesSection = () => {

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
      <div className="aspect-[3/4] bg-gradient-to-br from-red-200 to-orange-200 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4" />
        <div className="h-5 bg-gray-200 rounded-full animate-pulse w-1/2" />
      </div>
    </div>
  );

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
          <Link to="/product-catalog-browse?sale=true" className="hidden lg:block">
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
          {salesProducts.map((product, index) => (
            <SalesCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
          <Link to="/product-catalog-browse?sale=true">
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