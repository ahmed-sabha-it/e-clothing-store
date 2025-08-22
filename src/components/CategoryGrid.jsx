import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      title: "Men",
      description: "Discover the latest men\'s fashion",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      link: "/product-catalog-browse?category=men",
      icon: "User",
      gradient: "from-blue-600 to-indigo-700"
    },
    {
      id: 2,
      title: "Women",
      description: "Explore women\'s collections",
      image: "https://images.unsplash.com/photo-1494790108755-2616c39ca6b3?w=600&h=400&fit=crop",
      link: "/product-catalog-browse?category=women",
      icon: "Users",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      title: "Kids",
      description: "Fun and comfortable for kids",
      image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=400&fit=crop",
      link: "/product-catalog-browse?category=kids",
      icon: "Baby",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 4,
      title: "Accessories",
      description: "Complete your perfect look",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop",
      link: "/product-catalog-browse?category=accessories",
      icon: "ShoppingBag",
      gradient: "from-purple-600 to-violet-700"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-400 to-amber-500 transform rotate-6 scale-150"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg">
                <Icon name="Sparkles" size={16} className="mr-2" />
                Categories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent leading-tight md:leading-tight whitespace-pre-line">
                Shop by Category
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Find exactly what you're looking for in our carefully curated collections
            </p>
          </div>
          <Link to="/product-catalog-browse" className="hidden lg:block">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-6 py-3  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium hover:scale-105 transition-transform duration-300"
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.link}
 className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Category Image with Overlay */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                
                {/* Floating Icon */}
                <div className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-6">
                  <Icon 
                    name={category.icon} 
                    size={28} 
                    className="text-white drop-shadow-sm" 
                  />
                </div>
                
                {/* Hover Effect Particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-ping delay-200"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping delay-500"></div>
                </div>
              </div>

              {/* Enhanced Category Info */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-white/90 text-base leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-base font-medium group-hover:text-white transition-all duration-300">
                    <span className="border-b border-white/40 group-hover:border-white pb-1">
                      Shop Now
                    </span>
                    <Icon 
                      name="ArrowRight" 
                      size={18} 
                      className="ml-3 transition-all duration-300 group-hover:translate-x-2" 
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center lg:hidden">
          <Link to="/product-catalog-browse">
            <Button 
              variant="gradient" 
              iconName="ArrowRight" 
              iconSize={16}
              className="px-8 py-4  bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg font-medium rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;