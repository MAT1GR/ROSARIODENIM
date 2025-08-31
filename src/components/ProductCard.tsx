import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // --- CORRECCIÓN AQUÍ ---
  // Nos aseguramos de que la imagen tenga una URL completa.
  const imageUrl = product.images[0] ? `http://localhost:3001${product.images[0]}` : 'https://via.placeholder.com/400x500';

  return (
    <Link to={`/producto/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 group-hover:shadow-lg group-hover:border-brand-pink transition-all duration-300">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={imageUrl} // Usamos la URL corregida
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 right-3 flex flex-col items-start gap-y-2">
            {product.isNew && (
              <span className="bg-brand-pink text-white text-xs px-2.5 py-1 rounded-full font-bold tracking-wider">
                NUEVO
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-gray-900 text-white text-xs px-2.5 py-1 rounded-full font-bold tracking-wider">
                MÁS VENDIDO
              </span>
            )}
          </div>
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