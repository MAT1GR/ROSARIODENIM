import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/producto/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 group-hover:shadow-lg group-hover:border-brand-pink transition-all duration-300">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-brand-pink text-white text-xs px-2.5 py-1 rounded-full font-bold tracking-wider">
              NUEVO
            </span>
          )}
          {product.isBestSeller && (
            <span className="absolute top-3 right-3 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-full font-bold tracking-wider">
              MÁS VENDIDO
            </span>
          )}
        </div>
        
        <div className="p-4 text-center">
          <h3 className="font-bold text-gray-800 text-base mb-1 truncate group-hover:text-brand-pink transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-black text-brand-primary-text">
            ${product.price.toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;