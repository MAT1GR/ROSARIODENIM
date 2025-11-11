import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkle, Box, Eye } from "lucide-react";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import WhatsAppButton from "../components/WhatsAppButton";
import homeImage from '../assets/home.png'; // Import the image

const HomePage: React.FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);

  const lastDropSectionRef = useRef<HTMLElement>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setSubscribeMessage('Por favor, ingresa tu email.');
      return;
    }
    setIsSubscribing(true);
    setSubscribeMessage('');

    try {
      const response = await fetch('/api/notifications/drop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setSubscribeMessage(data.message);
      if (response.ok) {
        setEmail('');
      }
    } catch (err) {
      setSubscribeMessage('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setIsSubscribing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newProductsRes, allProductsRes] = await Promise.all([
          fetch("/api/products/newest?limit=4"),
          fetch("/api/products"), 
        ]);

        if (!newProductsRes.ok || !allProductsRes.ok) {
          throw new Error('Failed to fetch products');
        }

        const newProductsData = await newProductsRes.json();
        const allProductsData = await allProductsRes.json();

        setNewProducts(newProductsData);
        setAllProducts(allProductsData.products);

      } catch (error) {
        setError("Error al cargar los productos. Por favor, intentá de nuevo más tarde.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowWhatsAppButton(true);
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    if (lastDropSectionRef.current) {
      observer.observe(lastDropSectionRef.current);
    }

    return () => {
      if (lastDropSectionRef.current) {
        observer.unobserve(lastDropSectionRef.current);
      }
    };
  }, [lastDropSectionRef]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  const getNextThursday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
    const nextThursday = new Date(today);
    nextThursday.setDate(today.getDate() + daysUntilThursday);
    
    // If it's Thursday but past 9 PM, calculate for the next week's Thursday
    if (dayOfWeek === 4 && today.getHours() >= 21) {
      nextThursday.setDate(today.getDate() + 7);
    }

    const day = nextThursday.getDate();
    const month = nextThursday.toLocaleString('es-ES', { month: 'long' });

    return `JUEVES ${day} DE ${month.toUpperCase()} A LAS 21HS`;
  };

  const handleScrollToLastDrop = () => {
    lastDropSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white">
                    {/* Hero Section */}
                    <section
                      className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 pt-[15vh] pb-[20vh] bg-cover bg-center"
                      style={{ backgroundImage: `url(${homeImage})` }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.45)]" />
                      <div className="z-10 w-full px-4">
            <section className="countdown-section">
              <h3>NUEVO DROP EN:</h3>
              <div className="countdown">
                <div><span id="days">00</span><p>Días</p></div>
                <div><span id="hours">00</span><p>Horas</p></div>
                <div><span id="minutes">00</span><p>Minutos</p></div>
                <div><span id="seconds">00</span><p>Segundos</p></div>
              </div>
            </section>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-2 mt-[-2rem]">
              <button
                onClick={handleScrollToLastDrop}
                className="inline-flex items-center gap-2 bg-[#F5F5DC] text-[#2C3E50] px-4 sm:px-10 py-2 sm:py-3 rounded-sm text-sm font-bold group transition-colors"
              >
                COMPRAR AHORA
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {showEmailInput && (
              <form onSubmit={handleSubscribe} className="mt-6 sm:mt-4 flex flex-col items-center gap-2 max-w-sm mx-auto w-full">
                <div className="flex w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu dirección de email"
                    className="w-full px-4 py-2 rounded-l-sm border-0 text-gray-800 focus:ring-2 focus:ring-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-white text-gray-800 px-6 py-2 rounded-r-sm font-bold hover:bg-gray-200 disabled:opacity-50"
                  >
                    {isSubscribing ? 'Enviando...' : 'Notificarme'}
                  </button>
                </div>
                {subscribeMessage && <p className="text-sm mt-2 h-4">{subscribeMessage}</p>}
              </form>
            )}
          </div>
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-base text-white animate-pulse-slow">
            Deslizá para ver los últimos jeans disponibles ↓
          </p>
        </section>

        <div className="h-1 bg-[#f7f7f7]" />
        {/* Last Drop Section */}
        <section ref={lastDropSectionRef} className="pt-[40px] pb-[60px] bg-white text-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-medium tracking-[1px] uppercase">
                ÚLTIMO DROP
              </h2>
              <p className="mt-2 text-sm text-red-500 font-semibold">
                ¡Solo queda una unidad de cada producto!
              </p>
            </div>
            {loading ? renderSkeletons() : error ? <p className="text-center text-red-500">{error}</p> : newProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                {newProducts.map(p => <ProductCard product={p} key={p.id} theme="light" />)}
              </div>
            ) : (
              <p className="text-center text-gray-500">No hay nuevos productos disponibles.</p>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-white text-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight uppercase">
                Lo que nos hace diferentes
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <Sparkle className="w-10 h-10 mb-4 text-gray-800" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Un solo jean por modelo</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Cada prenda es única y no repetimos stock.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Box className="w-10 h-10 mb-4 text-gray-800" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Drops limitados cada semana</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Colecciones pequeñas, seleccionadas a mano en Rosario.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Eye className="w-10 h-10 mb-4 text-gray-800" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Curaduría real, no catálogo</h3>
                <p className="mt-2 text-gray-600">
                  Priorizamos calidad, textura y calce, sin seguir modas rápidas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All Products Section */}
        <section className="py-16 lg:py-24 bg-neutral-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight uppercase">
                Todos los productos
              </h2>
              <Link to="/tienda" className="mt-2 text-lg text-gray-400 hover:underline">
                Ver colección completa
              </Link>
            </div>
            {/*
            {loading ? renderSkeletons() : error ? <p className="text-center text-red-500">{error}</p> : allProducts.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                  {allProducts.slice(0, 8).map(p => <ProductCard product={p} key={p.id} theme="dark" />)}
               </div>
            ) : (
              <p className="text-center text-gray-500">No se encontraron productos.</p>
            )}
            */}
          </div>
        </section>
        
         {/* Social Media Section */}
        <section className="py-16 lg:py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight uppercase">@ROSARIODENIM</h2>
          <p className="mt-2 text-lg text-gray-400">Seguinos en Instagram</p>
          {/* Placeholder for Instagram Feed */}
          <div className="mt-8 container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="aspect-square bg-neutral-800"></div>
              <div className="aspect-square bg-neutral-800"></div>
              <div className="aspect-square bg-neutral-800"></div>
              <div className="aspect-square bg-neutral-800"></div>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;
