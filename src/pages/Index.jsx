
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import AccessoriesSection from '@/components/AccessoriesSection';
import SalesSection from '@/components/SalesSection';
import { getProductsByCategory } from '@/data/products';

const Index = () => {
  const saleProducts = getProductsByCategory('sale');
  
  
  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <SalesSection products={saleProducts} loading={false} />
      <AccessoriesSection />
    </div>
  );
};

export default Index;
