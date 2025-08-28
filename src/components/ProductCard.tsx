import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const availableSizes = Object.keys(product.sizes).filter(size => product.sizes[size].available);
  const lowestStock = Math.min(...Object.values(product.sizes).map(s => s.stock));

  return (
    <Link to={`/producto/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-[#D8A7B1] text-white text-xs px-2 py-1 rounded-full">
              NUEVO
            </span>
          )}
          {product.isBestSeller && (
            <span className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              MÁS VENDIDO
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#D8A7B1] transition-colors">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-gray-900 mb-2">
            ${product.price.toLocaleString('es-AR')}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Talles disponibles: {availableSizes.join(', ')}
          </p>
          {lowestStock <= 3 && lowestStock > 0 && (
            <p className="text-xs text-red-600 font-medium">
              ¡Últimas {lowestStock} unidades!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;