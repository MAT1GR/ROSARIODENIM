import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react';
import { useCart } from '../hooks/useCart.tsx';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: '/tienda', label: 'Tienda' },
    { href: '/nuestra-mision', label: 'Nuestra Misión' },
    { href: '/preguntas-frecuentes', label: 'Preguntas' },
    { href: '/tallas', label: 'Guía de Talles' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
             {/* Icono de Menú para Móvil (Izquierda) */}
            <div className="md:hidden">
                <button className="p-2 text-brand-primary-text" onClick={() => setIsMenuOpen(true)}>
                    <Menu size={22} />
                </button>
            </div>

            {/* Navegación Izquierda (Desktop) */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.slice(0, 2).map(link => (
                <Link key={link.href} to={link.href} className={`font-poppins text-sm font-medium text-brand-primary-text hover:text-black relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-4px] after:left-0 after:bg-black after:transition-transform after:duration-300 ${
                    location.pathname === link.href ? 'text-black after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo Centrado */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link to="/" className="text-3xl font-black text-brand-primary-text tracking-tighter">
                  ROSARIO<span className="text-gray-400">DENIM</span>
                </Link>
            </div>
            
            <div className="flex items-center justify-end">
                {/* Navegación Derecha (Desktop) */}
                <nav className="hidden md:flex items-center space-x-8">
                {navLinks.slice(2, 4).map(link => (
                    <Link key={link.href} to={link.href} className={`font-poppins text-sm font-medium text-brand-primary-text hover:text-black relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-4px] after:left-0 after:bg-black after:transition-transform after:duration-300 ${
                        location.pathname === link.href ? 'text-black after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-50'
                    }`}>
                    {link.label}
                    </Link>
                ))}
                </nav>

                {/* Iconos Derecha */}
                <div className="flex items-center space-x-2 ml-4">
                  <button className="hidden md:block p-2 text-brand-primary-text hover:text-black">
                    <Search size={20} />
                  </button>
                  <button className="hidden md:block p-2 text-brand-primary-text hover:text-black">
                    <User size={20} />
                  </button>
                  <button onClick={onCartClick} className="relative p-2 text-brand-primary-text hover:text-black">
                    <ShoppingBag size={20} />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Menú Móvil */}
      <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl p-6 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex justify-end items-center mb-12">
            <button onClick={() => setIsMenuOpen(false)} className="p-2"><X/></button>
          </div>
          <nav className="flex flex-col space-y-8">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} className={`text-2xl font-bold font-poppins ${location.pathname === link.href ? 'text-black' : 'text-brand-primary-text'}`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;