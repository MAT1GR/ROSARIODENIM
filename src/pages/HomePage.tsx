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
      <section className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left fade-in-up">
            <h1 className="text-5xl lg:text-7xl font-black text-brand-primary-text leading-tight tracking-tighter">
              El calce perfecto <br/> <span className="text-brand-pink">existe.</span>
            </h1>
            {/* Descripción visible solo en md y pantallas más grandes */}
            <p className="mt-6 text-lg text-brand-secondary-text max-w-md mx-auto md:mx-0 hidden md:block">
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
          <div className="relative fade-in-up hidden md:block" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-[4/5] bg-brand-pink/20 rounded-3xl">
              <img 
                src="https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Modelo usando jeans Rosario Denim con estilo"
                className="absolute inset-5 w-[calc(100%-2.5rem)] h-[calc(100%-2.5rem)] object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Novedades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading 
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonProductCard key={i} />)
              : newProducts.map(product => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-brand-light">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Los Más Vendidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonProductCard key={i} />)
              : bestSellers.map(product => <ProductCard key={product.id} product={product} />)
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