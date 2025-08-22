
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Watch } from 'lucide-react';

const AccessoriesSection = () => {
  const accessories = [
    {
      id: 'hats',
      name: 'Hats',
      image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80',
      description: 'Stylish caps and beanies'
    },
    {
      id: 'watches',
      name: 'Watches',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      description: 'Premium timepieces'
    },
    {
      id: 'belts',
      name: 'Belts',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      description: 'Leather and fabric belts'
    },
    {
      id: 'scarfs',
      name: 'Scarfs',
      image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?auto=format&fit=crop&w=600&q=80',
      description: 'Cozy winter accessories'
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Your Look
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection of accessories to add the perfect finishing touch to any outfit
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              className="group bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={accessory.image}
                  alt={accessory.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{accessory.name}</h3>
                <p className="text-sm text-muted-foreground">{accessory.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/category/accessories"
            className="inline-flex items-center gap-2 orange-button"
          >
            <Watch className="h-4 w-4" />
            Shop All Accessories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AccessoriesSection;
