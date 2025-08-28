import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../hooks/useCart';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link to="/tienda" className="text-[#D8A7B1] hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const selectedSizeInfo = selectedSize ? product.sizes[selectedSize] : null;
  const isInStock = selectedSizeInfo?.available && selectedSizeInfo?.stock > 0;

  const handleAddToCart = () => {
    if (selectedSize && isInStock) {
      addToCart(product, selectedSize, quantity);
      alert(`¡Agregado al carrito! ${product.name} talle ${selectedSize}`);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          to="/tienda"
          className="inline-flex items-center text-gray-600 hover:text-[#D8A7B1] mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-[#D8A7B1]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-gray-900">${product.price.toLocaleString('es-AR')}</p>
            </div>

            <div className="prose prose-gray">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Talle</h3>
                <Link
                  to="/tallas"
                  className="text-sm text-[#D8A7B1] hover:underline"
                >
                  ¿No sabes tu talle? Mide tu jean perfecto con nuestra guía
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(product.sizes).map(([size, info]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!info.available}
                    className={`py-3 px-4 text-center border rounded-lg transition-colors ${
                      !info.available
                        ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed'
                        : selectedSize === size
                        ? 'border-[#D8A7B1] bg-[#D8A7B1] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-[#D8A7B1]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSizeInfo && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedSizeInfo.measurements}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium mb-3">Cantidad</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-600 hover:text-[#D8A7B1] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-gray-600 hover:text-[#D8A7B1] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {selectedSizeInfo && selectedSizeInfo.stock <= 3 && (
                  <p className="text-sm text-red-600 font-medium">
                    ¡Últimas {selectedSizeInfo.stock} unidades!
                  </p>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !isInStock}
              className={`w-full py-4 text-lg font-medium rounded-lg transition-colors ${
                selectedSize && isInStock
                  ? 'bg-[#D8A7B1] hover:bg-[#c69ba5] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {!selectedSize ? 'SELECCIONA UN TALLE' : !isInStock ? 'AGOTADO' : 'AÑADIR AL CARRITO'}
            </button>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <h4 className="font-medium mb-2">Detalles del Producto</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Material:</strong> {product.material}</li>
                  <li><strong>Tiro:</strong> {product.rise}</li>
                  <li><strong>Calce:</strong> {product.fit}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;