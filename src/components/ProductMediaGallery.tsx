/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';

interface ProductMediaGalleryProps {
  images: string[];
}

const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (images && images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return `${apiBaseUrl}${imagePath}`;
  };

  const handleThumbnailClick = (image: string) => {
    if (image === selectedImage) return; // No hacer nada si es la misma imagen

    setTransitioning(true); // Inicia la transición (hace la imagen actual transparente)

    // Después de que la transición de salida termine, cambia la imagen y la hace visible
    setTimeout(() => {
      setSelectedImage(image);
      setTransitioning(false);
    }, 200); // 200ms, coincide con la duración en la clase de la imagen
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex-1 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Imagen no disponible</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Miniaturas */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${selectedImage === image ? 'border-brand-pink' : 'border-transparent hover:border-gray-300'}`}
            onClick={() => handleThumbnailClick(image)}
          >
            <img
              src={getImageUrl(image)}
              alt={`Miniatura del producto ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Imagen Principal */}
      <div className="flex-1 w-full overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center min-h-[400px]">
        {selectedImage && (
          <img
            src={getImageUrl(selectedImage)}
            alt="Imagen principal del producto"
            className={`max-h-full max-w-full object-contain transition-opacity duration-200 ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
      </div>
    </div>
  );
};

export default ProductMediaGallery;