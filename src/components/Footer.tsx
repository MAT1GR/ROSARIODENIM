import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  const navLinks = [
    { href: "/tienda", label: "Tienda" },
    { href: "/nuestra-mision", label: "Nuestra Misión" },
    { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
    { href: "/tallas", label: "Guía de Talles" },
    { href: "/politica-de-devoluciones", label: "Política de Devoluciones" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo y Descripción */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="font-poppins text-xl font-bold tracking-widest uppercase"
            >
              <span className="font-semibold text-white">denim</span>
              <span className="font-light text-gray-400">rosario</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Redefiniendo el denim con un calce perfecto y un estilo que
              perdura.
            </p>
          </div>

          {/* Links de Navegación */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase text-gray-200">
              Menú
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase text-gray-200">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:contacto@denimrosario.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  contacto@denimrosario.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5493411234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  +54 9 341 123-4567
                </a>
              </li>
              <li className="text-sm text-gray-400">Rosario, Argentina</li>
            </ul>
          </div>

          {/* Redes Sociales y Newsletter */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase text-gray-200">
              Sé parte
            </h3>
            <p className="mt-4 text-sm text-gray-400">
              Suscribite para recibir novedades y ofertas exclusivas.
            </p>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Tu email"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <button className="bg-white text-black px-4 py-2 rounded-r-md font-semibold text-sm hover:bg-gray-200 transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} denimrosario. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
