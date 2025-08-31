import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Award, Ruler, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const SkeletonProductCard = () => (
    <div className="bg-white rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-[3/4] bg-gray-200"></div>
        <div className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-6 bg-gray-200 rounded w-1/2"></div></div>
    </div>
);

const HomePage: React.FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
        setIsLoading(true);
        try {
            const [newRes, bestRes] = await Promise.all([ fetch('/api/products/newest'), fetch('/api/products/bestsellers') ]);
            setNewProducts(await newRes.json());
            setBestSellers(await bestRes.json());
        } catch (error) { console.error("Error fetching homepage products:", error); } 
        finally { setIsLoading(false); }
    };
    fetchHomeProducts();
  }, []);

  return (
    <div className="bg-brand-bg">
      {/* --- HERO SECTION REDISEÑADO --- */}
      <section className="container mx-auto px-4 pt-24 pb-16 md:min-h-screen md:flex md:items-center md:py-0">
        <div className="w-full text-center">
          <div className="fade-in-up">
            <h1 className="text-5xl lg:text-7xl font-black text-brand-primary-text leading-tight tracking-tighter">
              El calce perfecto <br/> <span className="text-brand-pink">existe.</span>
            </h1>
            {/* Descripción visible solo en md y pantallas más grandes */}
            <p className="mt-6 text-lg text-brand-secondary-text max-w-md mx-auto hidden md:block">
              Descubrí jeans diseñados para durar y adaptarse a vos, no al revés. Calidad premium y estilo atemporal en cada prenda.
            </p>
            <Link
              to="/tienda"
              className="mt-8 inline-flex items-center gap-2 bg-brand-pink hover:bg-opacity-90 text-white px-8 py-4 rounded-full text-base font-bold group"
            >
              Explorar Colección
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-brand-pink to-brand-pink-dark text-white">
        <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Los Más Vendidos</h2>
              <p className="text-white/80">Los favoritos de nuestra comunidad.</p>
            </div>
            <Link to="/tienda" className="font-bold hover:underline">Ver todo</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonProductCard key={i} />)
              : bestSellers.map(product => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-brand-light">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Novedades</h2>
              <p className="text-brand-secondary-text">Lo último en llegar a nuestra tienda.</p>
            </div>
            <Link to="/tienda" className="text-brand-pink font-bold hover:underline">Ver todo</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading 
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonProductCard key={i} />)
              : newProducts.map(product => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </section>
      
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-brand-pink/20 p-4 rounded-full mb-4"><Award className="text-brand-pink" size={32} /></div>
              <h3 className="text-xl font-bold mb-2">Denim de Calidad</h3>
              <p className="text-brand-secondary-text">Seleccionamos los mejores materiales para prendas que duran.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-pink/20 p-4 rounded-full mb-4"><Ruler className="text-brand-pink" size={32} /></div>
              <h3 className="text-xl font-bold mb-2">Guía de Talles Real</h3>
              <p className="text-brand-secondary-text">Medidas precisas para que encuentres tu calce perfecto sin errores.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-pink/20 p-4 rounded-full mb-4"><Truck className="text-brand-pink" size={32} /></div>
              <h3 className="text-xl font-bold mb-2">Envíos a todo el País</h3>
              <p className="text-brand-secondary-text">Llegamos a cualquier rincón de Argentina con envíos seguros.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;