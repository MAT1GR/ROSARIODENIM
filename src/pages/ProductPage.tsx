import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Info, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart.tsx';

// Componente para los breadcrumbs (migas de pan)
const Breadcrumbs: React.FC<{ product: Product }> = ({ product }) => (
    <nav className="text-xs text-brand-secondary mb-3">
        <Link to="/" className="hover:text-brand-primary">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/tienda" className="hover:text-brand-primary uppercase">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="font-bold text-brand-primary uppercase">{product.name}</span>
    </nav>
);

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) setProduct(await response.json());
        else setProduct(null);
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
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };
  
  const handleBuyNow = () => {
    if (product && selectedSize && isInStock) {
      addToCart(product, selectedSize, quantity);
      navigate('/carrito');
    }
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode) return;
    setIsCalculating(true);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postalCode }),
      });
      const data = await response.json();
      setShippingCost(data.cost);
    } catch (error) {
      console.error("Error al calcular envío:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
  }
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center"><p>Producto no encontrado.</p></div>;
  }

  const selectedSizeInfo = selectedSize ? product.sizes[selectedSize] : null;
  const isInStock = selectedSizeInfo?.available && selectedSizeInfo?.stock > 0;

  return (
    <div className="bg-brand-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          
          {/* Columna de Imágenes (Izquierda) */}
          <div className="w-full space-y-4">
            {product.images.map((image, index) => (
                <div key={index} className="bg-brand-light">
                    <img src={image} alt={`${product.name} - Vista ${index + 1}`} className="w-full h-full object-cover" />
                </div>
            ))}
          </div>

          {/* Columna de Información (Derecha) */}
          <div className="w-full lg:sticky lg:top-24 h-fit pt-8 lg:pt-0">
            <Breadcrumbs product={product} />
            <h1 className="text-2xl font-extrabold text-brand-primary tracking-wide uppercase">{product.name}</h1>
            <p className="text-3xl font-extrabold text-brand-primary mt-4">${product.price.toLocaleString('es-AR')}</p>
            <Link to="#" className="text-xs text-brand-secondary hover:underline mt-1 inline-block">Ver más detalles</Link>

            <div className="mt-6">
              <p className="text-sm font-bold text-brand-primary mb-2">Talle: <span className="font-normal text-brand-secondary">{selectedSize || 'Selecciona un talle'}</span></p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(product.sizes).map(([size, info]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!info.available}
                    className={`px-4 py-2 text-center border rounded-sm transition-all duration-200 text-sm font-medium ${
                      !info.available
                        ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed bg-gray-50'
                        : selectedSize === size
                        ? 'bg-brand-accent text-white border-brand-accent'
                        : 'border-gray-300 text-brand-primary hover:border-brand-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex items-stretch gap-2">
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 text-brand-secondary hover:text-brand-primary"><Minus size={16} /></button>
                  <span className="px-3 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 text-brand-secondary hover:text-brand-primary"><Plus size={16} /></button>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !isInStock || addedToCart}
                    className={`flex-1 py-3 text-sm font-bold rounded-sm flex items-center justify-center ${
                        addedToCart 
                        ? 'bg-emerald-500 text-white'
                        : (selectedSize && isInStock)
                        ? 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {addedToCart ? <><CheckCircle className="mr-2" size={16} /> Agregado</> : 'Agregar al Carrito'}
                </button>
            </div>
             <button
                onClick={handleBuyNow}
                disabled={!selectedSize || !isInStock}
                className={`w-full mt-3 py-3 text-sm font-bold rounded-sm flex items-center justify-center ${
                    (selectedSize && isInStock) ? 'bg-brand-pink hover:opacity-90 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Comprar
            </button>
            
            <div className="mt-4 p-3 bg-brand-light rounded-sm flex items-start gap-3 text-xs text-brand-secondary">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <span>El pedido se despacha de 4 a 7 días HÁBILES luego de haber realizado el pago ❤️</span>
            </div>

            <div className="mt-6">
                <p className="text-sm font-bold text-brand-primary mb-2">Calcular Costo De Envío:</p>
                <form onSubmit={handleCalculateShipping} className="flex gap-2">
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Tu código postal"
                        className="flex-1 p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-brand-primary text-sm"
                    />
                    <button type="submit" disabled={isCalculating} className="px-6 bg-brand-accent text-white text-sm font-bold rounded-sm hover:bg-brand-accent-hover disabled:opacity-50">
                        {isCalculating ? '...' : 'Calcular'}
                    </button>
                </form>
                
                {shippingCost !== null && (
                    <div className="mt-4 border border-brand-outline rounded-sm text-sm">
                        <div className="p-3 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-brand-primary">Retiro por sucursal</p>
                                <p className="text-xs text-brand-secondary">3 a 6 días hábiles</p>
                            </div>
                            <span className="font-bold text-brand-primary">${shippingCost.toLocaleString('es-AR')}</span>
                        </div>
                         <div className="p-3 flex justify-between items-center border-t border-brand-outline">
                            <div>
                                <p className="font-bold text-brand-primary">Envío a domicilio</p>
                                <p className="text-xs text-brand-secondary">3 a 6 días hábiles</p>
                            </div>
                            <span className="font-bold text-brand-primary">${(shippingCost + 1344).toLocaleString('es-AR')}</span>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
