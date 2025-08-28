import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Header: React.FC = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Rosario Denim
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-[#D8A7B1] ${
                location.pathname === '/' ? 'text-[#D8A7B1]' : 'text-gray-700'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              className={`text-sm font-medium transition-colors hover:text-[#D8A7B1] ${
                location.pathname === '/tienda' ? 'text-[#D8A7B1]' : 'text-gray-700'
              }`}
            >
              Tienda
            </Link>
            <Link
              to="/tallas"
              className={`text-sm font-medium transition-colors hover:text-[#D8A7B1] ${
                location.pathname === '/tallas' ? 'text-[#D8A7B1]' : 'text-gray-700'
              }`}
            >
              Guía de Tallas
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/carrito"
              className="relative p-2 text-gray-700 hover:text-[#D8A7B1] transition-colors"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D8A7B1] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <Link
              to="/admin"
              className="hidden md:block p-2 text-gray-700 hover:text-[#D8A7B1] transition-colors"
            >
              <User size={24} />
            </Link>

            <button className="md:hidden p-2 text-gray-700">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;