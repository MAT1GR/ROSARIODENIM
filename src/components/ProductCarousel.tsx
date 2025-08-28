import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  return (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="w-64 flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;