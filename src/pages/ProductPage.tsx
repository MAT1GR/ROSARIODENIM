import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Info, CheckCircle, HelpCircle, Feather, Move, TrendingUp, Ruler } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart.tsx';
import ProductCard from '../components/ProductCard'; // Asegúrate de que este import sea correcto
import ProductMediaGallery from '../components/ProductMediaGallery';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

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

  const detailsRef = useScrollAnimation<HTMLDivElement>();
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando producto...</p></div>;
  }
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center"><p>Producto no encontrado.</p></div>;
  }

  const selectedSizeInfo = selectedSize ? product.sizes[selectedSize] : null;
  const isInStock = selectedSizeInfo?.available && selectedSizeInfo?.stock > 0;
  const maxStock = selectedSizeInfo?.stock || 0;

  const Feature = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    value ? (
        <div className="flex items-center gap-3 p-3 bg-brand-light rounded-lg border border-brand-border">
            <Icon className="text-gray-600" size={20} />
            <div>
                <p className="text-xs text-brand-secondary-text">{label}</p>
                <p className="text-sm font-semibold text-brand-primary-text">{value}</p>
            </div>
        </div>
    ) : null
  );

  return (
    <div className="bg-brand-bg">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 max-w-7xl mx-auto px-4 lg:px-8 py-12">
        
        <div className="lg:col-span-1">
          <ProductMediaGallery images={product.images} />
        </div>

        <div ref={detailsRef} className="w-full lg:col-span-1 lg:sticky lg:top-24 h-fit scroll-animate" style={{ animationDelay: '200ms' }}> 
          <div className="py-8 lg:py-0">
            <Breadcrumbs product={product} />
            <h1 className="text-3xl font-bold text-black tracking-wide">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-black mt-2">${product.price.toLocaleString('es-AR')}</p>
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-black tracking-wider">TALLE</p>
                <Link to="/tallas" className="flex items-center gap-1 text-sm text-brand-secondary-text hover:underline font-medium">
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
                          ? 'border-gray-200 text-gray-400 bg-gray-50/80 cursor-not-allowed'
                          : selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 text-black hover:border-black'
                      }`}
                    >
                      {size}
                      {!isAvailable && <div className="absolute inset-0 bg-transparent" style={{background: 'linear-gradient(to top right, transparent 49.5%, #d1d5db 49.5%, #d1d5db 50.5%, transparent 50.5%)'}}></div>}
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!isInStock} className="px-3 py-3 text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"><Minus size={16} /></button>
                    <span className="px-4 text-center font-bold text-lg text-black">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} disabled={!isInStock || quantity >= maxStock} className="px-3 py-3 text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"><Plus size={16} /></button>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !isInStock || addedToCart}
                    className={`flex-1 py-3 text-sm font-bold rounded-md flex items-center justify-center transition-colors border ${
                        addedToCart 
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : (selectedSize && isInStock)
                        ? 'text-black bg-white border-black hover:bg-gray-100' // <-- BORDE NEGRO VISIBLE
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

            <div className="mt-10 border-t border-brand-border pt-8">
              <h3 className="font-bold text-lg text-black mb-4">Detalles y Características</h3>
              <p className="text-brand-secondary-text text-sm mb-6">{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Feature icon={Feather} label="Material" value={product.material} />
                  <Feature icon={Move} label="Calce" value={product.fit} />
                  <Feature icon={TrendingUp} label="Tiro" value={product.rise} />
                  {selectedSizeInfo?.measurements && <Feature icon={Ruler} label={`Medidas (Talle ${selectedSize})`} value={selectedSizeInfo.measurements} />}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-brand-light rounded-lg items-start gap-3 text-sm text-brand-secondary-text flex">
                <Info size={20} className="flex-shrink-0 mt-0.5 text-gray-500" />
                <span>El pedido se despacha de 4 a 7 días hábiles luego de haber realizado el pago.</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section ref={relatedRef} className="py-20 bg-brand-light scroll-animate">
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