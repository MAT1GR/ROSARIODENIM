import React, { useState, useEffect } from 'react';

interface ProductMediaGalleryProps {
  images: string[];
}

const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState('');

  // --- INICIO DE LA CORRECCIÓN DEFINITIVA ---
  // Este useEffect se asegura de que solo se seleccione una imagen
  // cuando el array 'images' realmente tenga contenido.
  // Esto evita el error de intentar acceder a images[0] cuando aún está vacío.
  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]); // Se ejecuta cada vez que el array de imágenes cambia.
  // --- FIN DE LA CORRECCIÓN DEFINITIVA ---

  // Si el array de imágenes está vacío o aún no ha cargado,
  // muestra un placeholder claro.
  if (!images || images.length === 0) {
    return (
      <div className="flex-1 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Imagen no disponible</p>
      </div>
    );
  }

  const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  // Usamos la variable de entorno, igual que en las tarjetas
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${apiBaseUrl}${imagePath}`;
}

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Miniaturas */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === image ? 'border-brand-pink' : 'border-transparent'}`}
            onClick={() => setSelectedImage(image)}
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
      <div className="flex-1 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        {/* Se asegura de que solo se intente mostrar la imagen si hay una seleccionada */}
        {selectedImage && (
          <img
            src={getImageUrl(selectedImage)}
            alt="Imagen principal del producto"
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>
    </div>
  );
};

export default ProductMediaGallery;