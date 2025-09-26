import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''; 
  const imageUrl = product.images && product.images[0] 
    ? `${apiBaseUrl}${product.images[0]}` 
    : 'https://via.placeholder.com/400x500';

  return (
    <Link to={`/producto/${product.id}`} className="group block text-left">
      <div className="overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="pt-4">
        <h3 className="text-sm font-medium text-brand-primary-text mb-1 truncate group-hover:underline">
          {product.name}
        </h3>
        <p className="text-base font-bold text-black">
          ${product.price.toLocaleString('es-AR')}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;