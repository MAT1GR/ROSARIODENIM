import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <-- AÑADIR useNavigate
import { ArrowLeft, Plus, Minus, CheckCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // <-- Hook para la redirección
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && selectedSize && isInStock) {
      addToCart(product, selectedSize, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // --- NUEVA FUNCIÓN ---
  const handleBuyNow = () => {
    if (product && selectedSize && isInStock) {
      addToCart(product, selectedSize, quantity);
      navigate('/carrito'); // Redirige al carrito
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando producto...</p>
      </div>
    );
  }

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
          <div className="space-y-4 sticky top-28 self-start">
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
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-gray-900">${product.price.toLocaleString('es-AR')}</p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Talle</h3>
                <Link to="/tallas" className="text-sm text-[#D8A7B1] hover:underline">
                  Guía de tallas
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(product.sizes).map(([size, info]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!info.available}
                    className={`py-3 px-4 text-center border rounded-lg transition-all duration-200 ${
                      !info.available
                        ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                        : selectedSize === size
                        ? 'border-[#D8A7B1] bg-[#D8A7B1] text-white ring-2 ring-offset-1 ring-[#D8A7B1]'
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
                    className="p-3 text-gray-600 hover:text-[#D8A7B1] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-600 hover:text-[#D8A7B1] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {selectedSizeInfo && selectedSizeInfo.stock <= 5 && selectedSizeInfo.stock > 0 && (
                  <p className="text-sm text-red-600 font-medium">
                    ¡Últimas {selectedSizeInfo.stock} unidades!
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !isInStock || addedToCart}
                    className={`w-full py-3 text-md font-medium rounded-lg transition-all duration-300 flex items-center justify-center border ${
                        addedToCart 
                        ? 'bg-green-500 text-white border-green-500'
                        : (selectedSize && isInStock)
                        ? 'bg-white text-[#D8A7B1] border-[#D8A7B1] hover:bg-gray-50'
                        : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                >
                    {addedToCart ? (
                    <>
                        <CheckCircle className="mr-2" size={20} /> ¡Agregado!
                    </>
                    ) : (
                    'Añadir al Carrito'
                    )}
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={!selectedSize || !isInStock}
                    className={`w-full py-3 text-md font-medium rounded-lg transition-colors flex items-center justify-center ${
                        (selectedSize && isInStock)
                        ? 'bg-[#D8A7B1] hover:bg-[#c69ba5] text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <ShoppingBag className="mr-2" size={20} />
                  { !selectedSize ? 'Selecciona un talle' : !isInStock ? 'Agotado' : 'Comprar Ahora' }
                </button>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <h4 className="font-medium mb-2">Detalles del Producto</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
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