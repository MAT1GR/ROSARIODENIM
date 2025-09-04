import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Info, CheckCircle, HelpCircle, Feather, Move, TrendingUp, Ruler } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart.tsx';
import ProductCarousel from '../components/ProductCarousel';
import ProductMediaGallery from '../components/ProductMediaGallery';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Breadcrumbs: React.FC<{ product: Product }> = ({ product }) => (
    <nav className="text-sm text-brand-secondary-text mb-4">
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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const galleryRef = useScrollAnimation<HTMLDivElement>();
  const detailsRef = useScrollAnimation<HTMLDivElement>();
  const relatedRef = useScrollAnimation<HTMLElement>();

  const STANDARD_SIZES = ['34', '36', '38', '40', '42'];

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setIsLoading(true);
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

  useEffect(() => {
    if (product && selectedSize) {
      const selectedSizeInfo = product.sizes[selectedSize];
      if (selectedSizeInfo && selectedSizeInfo.stock > 0) {
        setQuantity(1);
      } else {
        setQuantity(0);
      }
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
      navigate('/carrito');
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
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Icon className="text-brand-pink" size={24} />
            <div>
                <p className="text-xs text-brand-secondary-text">{label}</p>
                <p className="text-sm font-semibold text-brand-primary-text">{value}</p>
            </div>
        </div>
    ) : null
  );

  return (
    <div className="bg-brand-bg">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 max-w-7xl mx-auto lg:px-8 lg:py-12">
        <div ref={galleryRef} className="lg:col-span-1 scroll-animate">
          <ProductMediaGallery images={product.images} />
        </div>
        <div ref={detailsRef} className="w-full lg:col-span-1 lg:sticky lg:top-24 h-fit scroll-animate" style={{ animationDelay: '200ms' }}> 
          <div className="px-4 sm:px-6 lg:px-0 py-8 lg:py-0">
            <Breadcrumbs product={product} />
            <h1 className="text-3xl font-black text-brand-primary-text tracking-wide uppercase">{product.name}</h1>
            <p className="text-2xl font-bold text-brand-primary-text mt-2">${product.price.toLocaleString('es-AR')}</p>
            {selectedSize && <p className="text-md font-medium text-brand-secondary-text mt-2">Talle: {selectedSize}</p>}

            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-brand-primary-text">Elegí tu talle:</p>
                <Link to="/tallas" className="flex items-center gap-1 text-sm text-[#D8A7B1] hover:underline font-semibold">
                  <HelpCircle size={16} />
                  Guía de talles completa
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {STANDARD_SIZES.map((size) => {
                  const sizeInfo = product.sizes[size];
                  const isAvailable = sizeInfo?.available && sizeInfo?.stock > 0;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 text-center border rounded-sm transition-all duration-200 text-sm font-medium ${
                        !isAvailable
                          ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                          : selectedSize === size
                          ? 'bg-brand-button-bg text-white border-brand-button-bg'
                          : 'border-brand-border text-brand-primary-text hover:border-brand-primary-text'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="mt-8 flex items-end gap-4">
                <div>
                  <p className="text-sm font-medium text-brand-primary-text mb-2">Cantidad:</p>
                  <div className="flex items-center border border-brand-border rounded-sm w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 text-brand-secondary-text hover:text-brand-primary-text"><Minus size={16} /></button>
                    <span className="px-4 text-center font-bold text-lg text-brand-primary-text">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} disabled={quantity >= maxStock} className="px-3 py-3 text-brand-secondary-text hover:text-brand-primary-text disabled:text-gray-300"><Plus size={16} /></button>
                  </div>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !isInStock || addedToCart}
                    className={`flex-1 py-3 text-sm font-bold rounded-sm flex items-center justify-center transition-colors ${
                        addedToCart 
                        ? 'bg-emerald-500 text-white'
                        : (selectedSize && isInStock)
                        ? 'bg-brand-button-bg hover:bg-brand-button-bg-hover text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {addedToCart ? <><CheckCircle className="mr-2" size={16} /> Agregado</> : 'Agregar al Carrito'}
                </button>
            </div>

            <div className="mt-3">
                 <button
                    onClick={handleBuyNow}
                    disabled={!selectedSize || !isInStock}
                    className={`w-full py-4 text-base font-bold rounded-sm flex items-center justify-center transition-opacity ${
                        (selectedSize && isInStock) ? 'bg-brand-pink hover:opacity-90 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Comprar Ahora
                </button>
            </div>

            {/* --- INICIO DE LA MEJORA: TABLA DE MEDIDAS VISIBLE --- */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-lg text-brand-primary-text mb-4">Guía de Tallas (en cm)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Talle</th>
                      <th scope="col" className="px-4 py-3">Medidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(product.sizes).map(([size, details]) => (
                       details.available && details.stock > 0 && (
                        <tr key={size} className="border-b">
                          <th scope="row" className="px-4 py-3 font-medium text-gray-900">{size}</th>
                          <td className="px-4 py-3">{details.measurements || 'No especificado'}</td>
                        </tr>
                       )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* --- FIN DE LA MEJORA --- */}

            {/* --- INICIO DE LA MEJORA: CARACTERÍSTICAS ESPECIALIZADAS --- */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-lg text-brand-primary-text mb-4">Características</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Feature icon={Feather} label="Tela" value={`Denim rígido de 14 onzas`} />
                  <Feature icon={Move} label="Calce" value={`Mom fit con pierna cónica`} />
                  <Feature icon={TrendingUp} label="Tiro" value={`Alto, 28cm desde la entrepierna`} />
                  {selectedSizeInfo && <Feature icon={Ruler} label={`Medidas Talle ${selectedSize}`} value={selectedSizeInfo.measurements} />}
              </div>
            </div>
             {/* --- FIN DE LA MEJORA --- */}
            
            <div className="mt-6 p-3 bg-brand-light rounded-sm items-start gap-3 text-xs text-brand-secondary-text flex">
                <Info size={20} className="flex-shrink-0 mt-0.5" />
                <span>El pedido se despacha de 4 a 7 días HÁBILES luego de haber realizado el pago ❤️</span>
            </div>
          </div>
        </div>
      </div>

      <section ref={relatedRef} className="py-16 scroll-animate">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">También te puede interesar</h2>
          <ProductCarousel products={relatedProducts} />
        </div>
      </section>
    </div>
  );
};

export default ProductPage;