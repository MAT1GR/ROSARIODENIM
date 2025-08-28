import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Rosario Denim</h3>
            <p className="text-gray-400 mb-4">
              Jeans anchos que sí te quedan bien. Hechos para durar.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Tienda</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tienda" className="text-gray-400 hover:text-white transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link to="/tallas" className="text-gray-400 hover:text-white transition-colors">
                  Guía de Tallas
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cambios y Devoluciones
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Envíos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} />
                <span>Rosario, Santa Fe, Argentina</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} />
                <span>+54 9 341 XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} />
                <span>hola@rosariodenim.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Rosario Denim. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;