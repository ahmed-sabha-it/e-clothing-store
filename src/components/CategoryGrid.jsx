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
      link: "/category/men",
      icon: "User",
      gradient: "from-blue-600 to-indigo-700"
    },
    {
      id: 2,
      title: "Women",
      description: "Explore women\'s collections",
      image: "data:image/jpeg;base64,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",
      link: "/category/women",
      icon: "Users",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      title: "Kids",
      description: "Fun and comfortable for kids",
      image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=400&fit=crop",
      link: "/category/kids",
      icon: "Baby",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 4,
      title: "Accessories",
      description: "Complete your perfect look",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop",
      link: "/category/accessories",
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
          <Link to="/category/all" className="hidden lg:block">
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