import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Info, CheckCircle, HelpCircle, Feather, Move, TrendingUp, Ruler, Check, Truck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart.tsx';
import ProductCard from '../components/ProductCard';
import ProductMediaGallery from '../components/ProductMediaGallery';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
}

const Breadcrumbs: React.FC<{ product: Product }> = ({ product }) => (
    <nav className="text-sm text-brand-secondary-text mb-4">
        <Link to="/" className="hover:text-black">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/tienda" className="hover:text-black uppercase">{product.category}</Link>
    </nav>
);

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Estados para el calculador de envío
  const [postalCode, setPostalCode] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const relatedRef = useScrollAnimation<HTMLElement>();

  const STANDARD_SIZES = ['34', '36', '38', '40', '42', '44', '46'];

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setIsLoading(true);
      window.scrollTo(0, 0);
      try {
        const productRes = await fetch(`/api/products/${id}`);
        
        if (productRes.ok) {
            const productData = await productRes.json();
            setProduct(productData);
            
            const availableSizes = Object.keys(productData.sizes).filter(size => productData.sizes[size].available && productData.sizes[size].stock > 0);
            if (availableSizes.length > 0) {
                setSelectedSize(availableSizes[0]);
            } else {
                setSelectedSize('');
            }

            const allProductsRes = await fetch('/api/products/all');
            if (allProductsRes.ok) {
                const allProducts = await allProductsRes.json();
                const filteredRelated = allProducts
                  .filter((p: Product) => p.id !== productData.id && p.category === productData.category)
                  .slice(0, 4);
                setRelatedProducts(filteredRelated);
            }

        } else { 
            setProduct(null); 
        }
      } catch (error) { 
        console.error("Error fetching product data:", error);
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (product && selectedSize) {
        setQuantity(1);
    }
  }, [selectedSize, product]);

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
      navigate('/checkout/info');
    }
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode) return;
    setIsCalculatingShipping(true);
    setShippingOptions([]);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postalCode }),
      });
      const data = await response.json();
      if (data.options && data.options.length > 0) {
        setShippingOptions(data.options);
      } else {
        alert("No se encontraron opciones de envío para este código postal.");
      }
    } catch (error) {
      console.error("Error al calcular envío:", error);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando producto...</p></div>;
  }
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center"><p>Producto no encontrado.</p></div>;
  }

  const selectedSizeInfo = selectedSize ? product.sizes[selectedSize] : null;
  const isInStock = selectedSizeInfo?.available && selectedSizeInfo?.stock > 0;
  const maxStock = selectedSizeInfo?.stock || 0;
  const descriptionItems = product.description.split('. ').filter(sentence => sentence.length > 0);

  const Feature = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    value ? (
        <div className="flex items-start gap-3">
            <Icon className="text-gray-500 mt-1 flex-shrink-0" size={18} />
            <div>
                <p className="font-semibold text-brand-primary-text">{label}</p>
                <p className="text-sm text-brand-secondary-text">{value}</p>
            </div>
        </div>
    ) : null
  );

  return (
    <div className="bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:gap-16">
          
          <div className="lg:w-1/2">
            <ProductMediaGallery images={product.images} />
          </div>

          <div className="lg:w-1/2 w-full lg:sticky lg:top-28 h-fit"> 
            <div className="py-8 lg:py-0">
              <Breadcrumbs product={product} />
              <h1 className="text-4xl font-bold text-black tracking-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-black mt-4">${product.price.toLocaleString('es-AR')}</p>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-black tracking-wider">TALLE</p>
                  <Link to="/tallas" className="flex items-center gap-1 text-sm text-gray-500 hover:underline font-medium">
                    <HelpCircle size={16} />
                    Guía de talles
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STANDARD_SIZES.map((size) => {
                    const sizeInfo = product.sizes[size];
                    const isAvailable = sizeInfo?.available && sizeInfo?.stock > 0;
                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`px-4 py-2 text-center border rounded-md transition-all duration-200 text-sm font-medium relative ${
                          !isAvailable
                            ? 'border-gray-200 text-gray-400 bg-gray-50/80 cursor-not-allowed line-through'
                            : selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 text-black hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="flex col-span-1 items-center border border-gray-300 rounded-md justify-between">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!isInStock} className="px-3 py-3 text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"><Minus size={16} /></button>
                      <span className="font-bold text-lg text-black">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} disabled={!isInStock || quantity >= maxStock} className="px-3 py-3 text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"><Plus size={16} /></button>
                  </div>
                  <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize || !isInStock || addedToCart}
                      className={`col-span-2 py-3 text-sm font-bold rounded-md flex items-center justify-center transition-colors border ${
                          addedToCart 
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : (selectedSize && isInStock)
                          ? 'text-black bg-white border-black hover:bg-gray-100'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200'
                      }`}
                  >
                      {addedToCart ? <><CheckCircle className="mr-2" size={16} /> AGREGADO</> : 'AGREGAR AL CARRITO'}
                  </button>
              </div>

              <div className="mt-3">
                   <button
                      onClick={handleBuyNow}
                      disabled={!selectedSize || !isInStock}
                      className={`w-full py-4 text-base font-bold rounded-md flex items-center justify-center transition-opacity ${
                          (selectedSize && isInStock) ? 'bg-black hover:opacity-90 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    COMPRAR AHORA
                  </button>
              </div>

              {/* --- NUEVA SECCIÓN DE ENVÍO --- */}
              <div className="mt-8 border-t border-b py-6">
                <form onSubmit={handleCalculateShipping} className="space-y-3">
                  <label htmlFor="postalCode" className="flex items-center gap-2 text-sm font-bold text-black tracking-wider">
                    <Truck size={18} />
                    CALCULAR ENVÍO
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Tu código postal"
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand-pink"
                    />
                    <button
                      type="submit"
                      disabled={isCalculatingShipping || !postalCode}
                      className="px-4 bg-gray-100 text-black text-sm font-semibold rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                      {isCalculatingShipping ? '...' : 'Calcular'}
                    </button>
                  </div>
                </form>
                {shippingOptions.length > 0 && (
                  <div className="mt-4 space-y-2 text-sm">
                    {shippingOptions.map(opt => (
                      <div key={opt.id} className="flex justify-between items-center">
                        <span className="text-gray-600">{opt.name}</span>
                        <span className="font-semibold">${opt.cost.toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* --- FIN DE LA NUEVA SECCIÓN --- */}

              <div className="mt-8 space-y-8">
                <div>
                  <h3 className="font-bold text-lg text-black mb-4">Detalles</h3>
                  <ul className="space-y-3">
                    {descriptionItems.map((sentence, index) => (
                      <li key={index} className="flex items-start gap-3 text-brand-secondary-text text-sm">
                        <Check size={16} className="flex-shrink-0 text-gray-500 mt-0.5" />
                        <span>{sentence}.</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black mb-4">Características</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                      <Feature icon={Feather} label="Material" value={product.material} />
                      <Feature icon={Move} label="Calce" value={product.fit} />
                      <Feature icon={TrendingUp} label="Tiro" value={product.rise} />
                      {selectedSizeInfo?.measurements && <Feature icon={Ruler} label={`Medidas (Talle ${selectedSize})`} value={selectedSizeInfo.measurements} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section ref={relatedRef} className="py-20 bg-brand-light">
            <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold text-center mb-12 tracking-wider">PRODUCTOS RELACIONADOS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
            </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;