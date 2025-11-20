import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, AlertTriangle, RefreshCw } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ReturnsPolicyPage: React.FC = () => {
  const contentRef = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div ref={contentRef} className="container mx-auto max-w-4xl px-4 scroll-animate">

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="text-center mb-12">
            <Package className="mx-auto text-gray-800 mb-4" size={48} />
            <h1 className="text-4xl md:text-5xl font-black text-brand-primary-text tracking-tighter">
              Envíos y Devoluciones
            </h1>
            <p className="mt-4 text-lg text-brand-secondary-text">
              Información clara para que compres con total confianza.
            </p>
          </div>

          <div className="space-y-8 mt-12">
            {/* Card Cambios */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-center mb-4">
                <RefreshCw className="text-gray-800 mr-3 flex-shrink-0" size={24} />
                <h2 className="text-xl md:text-2xl font-bold">Cambios por Talle</h2>
              </div>
              <p className="text-brand-secondary-text mb-4 text-sm md:text-base">
                ¿El talle no fue el correcto? ¡No te preocupes, lo solucionamos!
              </p>
              <ul className="list-disc list-inside space-y-2 text-brand-primary-text text-sm md:text-base">
                <li>Podés solicitar un cambio de talle hasta <strong>30 días</strong> después de recibir tu compra.</li>
                <li>El producto debe estar sin uso, sin lavar y con sus etiquetas originales.</li>
                <li>El costo de ambos envíos (ida y vuelta) corre por cuenta del cliente.</li>
                <li>Para iniciar el proceso, contactate con nosotros por WhatsApp indicando tu número de orden y el nuevo talle que necesitás.</li>
              </ul>
            </div>

            {/* Card Devoluciones */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={24} />
                <h2 className="text-xl md:text-2xl font-bold">Devoluciones por Falla</h2>
              </div>
              <p className="text-brand-secondary-text mb-4 text-sm md:text-base">
                Priorizamos la calidad, pero si tu jean presenta una falla de fábrica, gestionaremos la devolución del dinero.
              </p>
              <ul className="list-disc list-inside space-y-2 text-brand-primary-text text-sm md:text-base">
                <li>El reclamo debe realizarse dentro de los <strong>7 días</strong> de haber recibido el producto.</li>
                <li>La falla será evaluada por nuestro equipo de calidad.</li>
                <li>Una vez aprobada, el reembolso se procesará al mismo medio de pago utilizado en la compra.</li>
                <li>Nosotros nos hacemos cargo del costo de envío para la devolución del producto fallado.</li>
              </ul>
            </div>

            {/* Card Envíos */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-center mb-4">
                <Truck className="text-blue-500 mr-3 flex-shrink-0" size={24} />
                <h2 className="text-xl md:text-2xl font-bold">Envíos</h2>
              </div>
              <p className="text-brand-secondary-text mb-4 text-sm md:text-base">
                Llegamos a cada rincón de Argentina.
              </p>
              <ul className="list-disc list-inside space-y-2 text-brand-primary-text text-sm md:text-base">
                <li>Despachamos los pedidos de <strong>4 a 7 días hábiles</strong> luego de acreditado el pago.</li>
                <li>El costo de envío se calcula automáticamente en el checkout con tu código postal.</li>
                <li>Una vez despachado, recibirás un código de seguimiento por mail para ver el estado de tu pedido.</li>
                <li>Los envíos se realizan a través de Correo Argentino.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicyPage;