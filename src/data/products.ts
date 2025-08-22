// Product type definition
export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isOnSale?: boolean;
  isPopular?:boolean
};

import { salesProducts } from './salesProducts';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    price: 29.99,
    // originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    category: 'men',
    rating: 4.5,
    reviews: 128,
    colors: ['black', 'white', 'gray', 'navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    
  },
  {
    id: '2',
    name: 'Elegant Summer Dress',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
    category: 'women',
    rating: 4.8,
    reviews: 89,
    colors: ['blue', 'red', 'yellow', 'green'],
    sizes: ['XS', 'S', 'M', 'L'],
    isNew: true
  },
  {
    id: '3',
    name: 'Kids Adventure Shorts',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&q=80',
    category: 'kids',
    rating: 4.3,
    reviews: 64,
    colors: ['blue', 'green', 'orange'],
    sizes: ['4Y', '6Y', '8Y', '10Y', '12Y']
  },
  {
    id: '4',
    name: 'Premium Denim Jacket',
    price: 129.99,
    // originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    category: 'men',
    rating: 4.7,
    reviews: 203,
    colors: ['blue', 'black', 'gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isOnSale: true
  },
  {
    id: '5',
    name: 'Casual Sneakers',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
    rating: 4.4,
    reviews: 156,
    colors: ['white', 'black', 'gray', 'red'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    isPopular: true,
  },
 
 
  {
    id: '8',
    name: 'Designer Handbag',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
    rating: 4.8,
    reviews: 134,
    colors: ['black', 'brown', 'tan', 'red'],
    sizes: ['One Size']
  },
  {
    id: '9',
    name: 'Classic Baseball Cap',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
    rating: 4.3,
    reviews: 87,
    colors: ['black', 'navy', 'white', 'red'],
    sizes: ['One Size'],
    isNew: true
  },
  {
    id: '10',
    name: 'Premium Leather Watch',
    price: 249.99,
    // originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
    rating: 4.9,
    reviews: 203,
    colors: ['brown', 'black'],
    sizes: ['One Size'],
    // isOnSale: true
  },
  {
    id: '11',
    name: 'Genuine Leather Belt',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80',
    category: 'accessories', 
    rating: 4.6,
    reviews: 142,
    colors: ['brown', 'black', 'tan'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '12',
    name: 'Cozy Winter Scarf',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
    rating: 4.4,
    reviews: 96,
    colors: ['gray', 'navy', 'burgundy', 'cream'],
    sizes: ['One Size'],
    isNew: true
  }
];

export const getProductsByCategory = (category: string) => {
  if (category === 'all') return sampleProducts;
  if (category === 'new-arrivals') return sampleProducts.filter(p => p.isNew);
  if (category === 'sale') return salesProducts;
  return sampleProducts.filter(p => p.category === category);
};

export const getProductById = (id: string) => {
  return sampleProducts.find(p => p.id === id);
};
