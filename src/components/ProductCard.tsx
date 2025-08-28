import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/producto/${product.id}`} className="group block">
      {/* Usamos la nueva clase 'card-hover' para la transición de la sombra */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl card-hover">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            // La transición del 'transform' se aplica con las clases de Tailwind
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
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
          {/* La transición de color en el título la maneja la regla global de 'a' */}
          <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#D8A7B1]">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-gray-900">
            ${product.price.toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;