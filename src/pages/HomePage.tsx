import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkle, Box, Eye, Target } from "lucide-react";
import { Product, Testimonial } from "../../server/types";
import TestimonialCard from "../components/TestimonialCard";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import WhatsAppButton from "../components/WhatsAppButton";
import homeImage from '../assets/home.webp'; // Import the image
import CountdownTimer from "../components/CountdownTimer"; // Importado

const HomePage: React.FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const lastDropSectionRef = useRef<HTMLElement>(null);



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
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
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

  const handleScrollToLastDrop = () => {
    lastDropSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white">
                    {/* Hero Section */}
                    <section
                      className="min-h-[70vh] lg:min-h-screen relative flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${homeImage})` }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.45)]" />
                      <div className="z-10 w-full px-4">
            <div className="countdown-section">
              {/* Ajuste de margen para acercar */}
              <h3 className="text-xl font-medium tracking-wide">PRÓXIMO DROP EN:</h3> 
              <div className="mt-4 mx-auto">
                <CountdownTimer /> 
              </div>
            </div>
            {/* CORRECCIÓN: Se ajusta mt-4 a mt-2 para subir el botón */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-2 -mt-6"> 
              <button
                onClick={handleScrollToLastDrop}
                className="inline-flex items-center gap-2 bg-[#F5F5DC] text-[#2C3E50] px-4 sm:px-10 py-2 sm:py-3 rounded-sm text-sm font-bold group transition-colors"
              >
                COMPRAR ÚLTIMO DROP
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>


          </div>
          {/* Solo se deja el indicador de flecha */}
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-base text-white animate-pulse-slow">
            ↓
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
              <p className="mt-2 text-sm text-red-500">
                Última unidad de cada prenda
              </p>
            </div>
            {loading ? renderSkeletons() : error ? <p className="text-center text-red-500">{error}</p> : newProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
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
                  Cada prenda es única y no repetimos stock.<br /> <span className="font-bold">Nunca vas a ver otra igual.</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Box className="w-10 h-10 mb-4 text-gray-800" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">Drops limitados</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Colecciones pequeñas, seleccionadas a mano.<br /> <span className="font-bold">Si te gusta, no lo dejes pasar.</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Eye className="w-10 h-10 mb-4 text-gray-800" />
                <h3 className="text-lg font-semibold uppercase tracking-wider">CALIDAD ANTES QUE TENDENCIA</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Priorizamos calidad, textura y calce.<br /> <span className="font-bold">Sin seguir modas rápidas.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 bg-neutral-100 text-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight uppercase">
                Lo que dicen nuestras clientas
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Nuestra Mision Section */}
        <section className="py-16 lg:py-24 bg-white text-black">
          <div className="container mx-auto px-4 text-center">
            <Target className="mx-auto text-gray-800 mb-4" size={40} />
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight uppercase">
              Nuestra Misión
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-sm">
              Comprar jeans online no tendría que ser una lotería. Medimos cada prenda a mano para que recibas en tu casa exactamente el talle que esperas.<br/> <span className="font-bold">Tu calce perfecto, garantizado.</span>
            </p>
          </div>
        </section>

        {/* Size Guide Section */}
        <section className="py-16 lg:py-24 bg-neutral-100 text-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight uppercase">
              Encontrá tu talle en 10 segundos
            </h2>
            <Link to="/tallas" className="mt-6 inline-block bg-black text-white px-10 py-3 rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
              Ver guía
            </Link>
          </div>
        </section>

                
              </div>    </>
  );
};

export default HomePage;