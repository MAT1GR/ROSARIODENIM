import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, PlayCircle, Image as ImageIcon } from 'lucide-react';

interface ProductMediaGalleryProps {
  product: Product;
}

const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({ product }) => {
  const allMedia = product.video 
    ? [{ type: 'video', url: product.video }, ...product.images.map(url => ({ type: 'image', url }))]
    : product.images.map(url => ({ type: 'image', url }));

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // --- COMIENZO DE LA CORRECCIÓN ---
  // Si no hay medios, no se puede continuar.
  if (allMedia.length === 0) {
    return (
      <div className="w-full">
        <div className="relative aspect-[4/5] bg-gray-200 flex items-center justify-center">
          <ImageIcon size={48} className="text-gray-400" />
        </div>
      </div>
    );
  }
  // --- FIN DE LA CORRECCIÓN ---

  const goToNext = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % allMedia.length);
  };

  const goToPrev = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + allMedia.length) % allMedia.length);
  };

  const currentMedia = allMedia[currentMediaIndex];

  return (
    <div className="w-full">
      <div className="relative aspect-[4/5] bg-gray-200">
        {currentMedia.type === 'video' ? (
          <iframe 
            src={currentMedia.url} 
            title="Video del producto" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
            className="w-full h-full object-cover"
          ></iframe>
        ) : (
          <img 
            src={`http://localhost:3001${currentMedia.url}`} 
            alt={`${product.name} - Vista ${currentMediaIndex + 1}`} 
            className="w-full h-full object-cover" 
          />
        )}
      </div>

      {allMedia.length > 1 && (
        <div className="px-4 sm:px-0 mt-2">
            <div className="flex space-x-2 overflow-x-auto no-scrollbar py-2">
            {allMedia.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden relative ${
                  index === currentMediaIndex ? 'border-brand-pink' : 'border-transparent'
                } hover:border-brand-pink-hover transition-colors`}
              >
                {media.type === 'video' ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <PlayCircle size={32} className="text-white opacity-75" />
                  </div>
                ) : (
                  <img
                    src={`http://localhost:3001${media.url}`}
                    alt={`${product.name} - Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <PlayCircle size={24} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMediaGallery;