import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SkeletonProductCard = () => (
    <div className="bg-white rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-[3/4] bg-gray-200"></div>
        <div className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-6 bg-gray-200 rounded w-1/2"></div></div>
    </div>
);

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const productsRef = useScrollAnimation<HTMLElement>();

  useEffect(() => {
    const fetchHomeProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products?sortBy=newest&limit=4');
            const data = await res.json();
            setProducts(data.products);
        } catch (error) { console.error("Error fetching homepage products:", error); } 
        finally { setIsLoading(false); }
    };
    fetchHomeProducts();
  }, []);

  return (
    <div className="bg-brand-bg">
      {/* Hero Section */}
      <section 
        className="h-[60vh] md:h-[85vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://ar.todomoda.com/media/wysiwyg/TM_AR_GLAMDAYS-JUEVES_DESK.png" }}
      >
        <div className="text-center bg-black bg-opacity-20 p-8 rounded-lg fade-in-up">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
              NUEVA TEMPORADA
            </h1>
            <p className="mt-4 text-lg max-w-md mx-auto">
              Descubrí los últimos ingresos y encontrá tu calce perfecto.
            </p>
            <Link
              to="/tienda"
              className="mt-8 inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-sm text-sm font-bold group transition-colors"
            >
              COMPRAR AHORA
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section ref={productsRef} className="py-20 px-4 scroll-animate">
        <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 tracking-wider">NUEVOS INGRESOS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {isLoading 
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonProductCard key={i} />)
                : products.map(product => <ProductCard key={product.id} product={product} />)
                }
            </div>
             <div className="text-center mt-16">
                <Link to="/tienda" className="font-bold text-black border border-black px-10 py-4 hover:bg-black hover:text-white transition-colors text-sm tracking-widest">
                    VER TODOS LOS PRODUCTOS
                </Link>
             </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;