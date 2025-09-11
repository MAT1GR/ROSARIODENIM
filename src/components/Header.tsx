import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
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
    { href: '/', label: 'Inicio' },
    { href: '/tienda', label: 'Tienda' },
    { href: '/nuestra-mision', label: 'Nuestra Misión' },
    { href: '/preguntas-frecuentes', label: 'Preguntas' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-extrabold text-brand-dark tracking-tighter">
              <span className="text-brand-pink">DENIM</span> ROSARIO<span className="text-brand-pink">.</span>  
            </Link>

            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`font-poppins text-base font-medium text-brand-gray hover:text-brand-dark relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-brand-pink after:transition-transform after:duration-300 ${
                    location.pathname === link.href ? 'text-brand-dark after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button onClick={onCartClick} className="relative p-2 text-brand-gray hover:text-brand-dark">
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-pink text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <button className="md:hidden p-2 text-brand-gray" onClick={() => setIsMenuOpen(true)}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Menú Móvil */}
      <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`absolute top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-xl p-6 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex justify-end items-center mb-12">
            <button onClick={() => setIsMenuOpen(false)} className="p-2"><X/></button>
          </div>
          <nav className="flex flex-col space-y-8">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} className={`text-2xl font-bold font-poppins ${location.pathname === link.href ? 'text-brand-pink' : 'text-brand-dark'}`}>
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