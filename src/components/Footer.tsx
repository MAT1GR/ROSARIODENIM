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
        <div className="grid grid-cols-1">
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
            <p className="mt-2 text-sm text-gray-300 font-semibold">
              Stock limitado y renovado cada semana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
