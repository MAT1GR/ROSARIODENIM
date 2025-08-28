import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Info, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart.tsx';
import ProductCarousel from '../components/ProductCarousel'; // Importamos el carrusel

// Componente para los breadcrumbs (migas de pan)
const Breadcrumbs: React.FC<{ product: Product }> = ({ product }) => (
    <nav className="text-xs text-brand-secondary-text mb-3">
        <Link to="/" className="hover:text-brand-primary-text">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/tienda" className="hover:text-brand-primary-text uppercase">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="font-bold text-brand-primary-text uppercase">{product.name}</span>
    </nav>
);

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // Estado para productos relacionados
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // Obtenemos el producto actual y todos los demás productos
        const [productRes, allProductsRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/products/all')
        ]);

        if (productRes.ok) {
            const productData = await productRes.json();
            setProduct(productData);
            
            const availableSizes = Object.keys(productData.sizes).filter(size => productData.sizes[size].available);
            if (availableSizes.length > 0) {
                setSelectedSize(availableSizes[0]);
            }

            if (allProductsRes.ok) {
                const allProducts = await allProductsRes.json();
                // Filtramos el producto actual para no mostrarlo en los relacionados
                setRelatedProducts(allProducts.filter((p: Product) => p.id !== productData.id));
            }

        } else {
            setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
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
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Columna de Imágenes (Izquierda) */}
        <div className="w-full space-y-4 lg:col-span-1">
          {product.images.map((image, index) => (
              <div key={index} className="bg-brand-light">
                  <img src={image} alt={`${product.name} - Vista ${index + 1}`} className="w-full h-full object-cover" />
              </div>
          ))}
        </div>

        {/* Columna de Información (Derecha) */}
        <div className="w-full lg:col-span-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumbs product={product} />
            <h1 className="text-3xl font-black text-brand-pink tracking-wide uppercase">{product.name}</h1>
            <p className="text-2xl font-bold text-brand-primary-text mt-2">${product.price.toLocaleString('es-AR')}</p>
            {/* Oculto en móvil (sm y xs), visible en md y superior */}
            <Link to="#" className="text-xs text-brand-secondary-text hover:underline mt-1 hidden md:inline-block">Ver más detalles</Link>

            <div className="mt-8">
              <p className="text-sm font-medium text-brand-primary-text mb-2">Talle: <span className="font-normal text-brand-secondary-text">{selectedSize || 'Selecciona un talle'}</span></p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(product.sizes).map(([size, info]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!info.available}
                    className={`px-4 py-2 text-center border rounded-sm transition-all duration-200 text-sm font-medium ${
                      !info.available
                        ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                        : selectedSize === size
                        ? 'bg-brand-button-bg text-white border-brand-button-bg'
                        : 'border-brand-border text-brand-primary-text hover:border-brand-primary-text'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
                <p className="text-sm font-medium text-brand-primary-text mb-2">Cantidad:</p>
                <div className="flex items-center border border-brand-border rounded-sm w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 text-brand-secondary-text hover:text-brand-primary-text"><Minus size={16} /></button>
                  <span className="px-4 text-center font-bold text-lg text-brand-primary-text">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 text-brand-secondary-text hover:text-brand-primary-text"><Plus size={16} /></button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !isInStock || addedToCart}
                    className={`w-full py-3 text-sm font-bold rounded-sm flex items-center justify-center transition-colors ${
                        addedToCart 
                        ? 'bg-emerald-500 text-white'
                        : (selectedSize && isInStock)
                        ? 'bg-brand-button-bg hover:bg-brand-button-bg-hover text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {addedToCart ? <><CheckCircle className="mr-2" size={16} /> Agregado</> : 'Agregar al Carrito'}
                </button>
                 <button
                    onClick={handleBuyNow}
                    disabled={!selectedSize || !isInStock}
                    className={`w-full py-3 text-sm font-bold rounded-sm flex items-center justify-center ${
                        (selectedSize && isInStock) ? 'bg-brand-pink hover:opacity-90 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Comprar
                </button>
            </div>
            
            {/* Oculto en móvil (sm y xs), visible en md y superior */}
            <div className="mt-6 p-3 bg-brand-light rounded-sm items-start gap-3 text-xs text-brand-secondary-text hidden md:flex">
                <Info size={20} className="flex-shrink-0 mt-0.5" />
                <span>El pedido se despacha de 4 a 7 días HÁBILES luego de haber realizado el pago ❤️</span>
            </div>

            {/* Oculto en móvil (sm y xs), visible en md y superior */}
            <div className="mt-8 hidden md:block">
                <p className="text-sm font-bold text-brand-primary-text mb-2">Calcular Costo De Envío:</p>
                <form onSubmit={handleCalculateShipping} className="flex gap-2">
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Tu código postal"
                        className="flex-1 p-3 border border-brand-border rounded-sm focus:outline-none focus:border-brand-primary-text text-sm"
                    />
                    <button type="submit" disabled={isCalculating} className="px-6 bg-brand-button-bg text-white text-sm font-bold rounded-sm hover:bg-brand-button-bg-hover disabled:opacity-50">
                        {isCalculating ? '...' : 'Calcular'}
                    </button>
                </form>
                
                {shippingCost !== null && (
                    <div className="mt-4 border border-brand-border rounded-sm text-sm">
                        <div className="p-3 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-brand-primary-text">Retiro por sucursal</p>
                                <p className="text-xs text-brand-secondary-text">3 a 6 días hábiles</p>
                            </div>
                            <span className="font-bold text-brand-primary-text">${shippingCost.toLocaleString('es-AR')}</span>
                        </div>
                         <div className="p-3 flex justify-between items-center border-t border-brand-border">
                            <div>
                                <p className="font-bold text-brand-primary-text">Envío a domicilio</p>
                                <p className="text-xs text-brand-secondary-text">3 a 6 días hábiles</p>
                            </div>
                            <span className="font-bold text-brand-primary-text">${(shippingCost + 1344).toLocaleString('es-AR')}</span>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN "TE PUEDE INTERESAR" --- */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Te puede interesar</h2>
          <ProductCarousel products={relatedProducts} />
        </div>
      </section>
    </div>
  );
};

export default ProductPage;