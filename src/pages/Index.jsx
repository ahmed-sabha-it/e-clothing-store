
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';

import SalesSection from '@/components/SalesSection';
import { getProductsByCategory } from '@/data/products';
import { useScrollToTop } from '@/utils/scrollToTop';

const Index = () => {
  useScrollToTop();
  const saleProducts = getProductsByCategory('sale');
  
  
  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <SalesSection products={saleProducts} loading={false} />
    </div>
  );
};

export default Index;
