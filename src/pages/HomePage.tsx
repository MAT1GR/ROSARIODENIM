import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Award, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import { products, testimonials } from '../data/products';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';

const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const newProducts = products.filter(p => p.isNew);
  const bestSellers = products.filter(p => p.isBestSeller);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription
    alert(`¡Gracias! Te enviamos un 10% OFF a ${email}`);
    setEmail('');
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/7691840/pexels-photo-7691840.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Jeans anchos que sí te quedan bien
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Hechos para durar
          </p>
          <Link
            to="/tienda"
            className="inline-block bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-12 py-4 rounded-full text-lg font-medium transition-colors duration-300 transform hover:scale-105"
          >
            DESCUBRIR AHORA
          </Link>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Novedades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Los Más Vendidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-[#D8A7B1] p-4 rounded-full mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Curaduría de Denim Vintage</h3>
              <p className="text-gray-600">Seleccionamos los mejores jeans con estilo atemporal y calidad premium</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#D8A7B1] p-4 rounded-full mb-4">
                <Ruler className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Guía de Talles Real</h3>
              <p className="text-gray-600">Medidas precisas para que encuentres tu calce perfecto sin errores</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#D8A7B1] p-4 rounded-full mb-4">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Envíos a todo el País</h3>
              <p className="text-gray-600">Llegamos a cualquier rincón de Argentina con envíos seguros y rápidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestras clientas</h2>
          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={prevTestimonial}
                className="absolute left-0 z-10 p-2 text-gray-600 hover:text-[#D8A7B1] transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              
              <div className="w-full max-w-2xl">
                <TestimonialCard testimonial={testimonials[currentTestimonial]} />
              </div>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 z-10 p-2 text-gray-600 hover:text-[#D8A7B1] transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">ÚNETE AL CLUB DEL DENIM</h2>
          <p className="text-xl text-gray-600 mb-8">10% OFF en tu primera compra</p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email aquí"
              required
              className="flex-1 px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#D8A7B1] focus:ring-2 focus:ring-[#D8A7B1] focus:ring-opacity-20"
            />
            <button
              type="submit"
              className="bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-8 py-3 rounded-full font-medium transition-colors duration-300"
            >
              SUSCRIBIRME
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;