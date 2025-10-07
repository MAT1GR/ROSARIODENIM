import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { Order } from "../types";
import { useCart } from "../hooks/useCart"; // 1. IMPORTAR USCART

const TransferPendingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart(); // 2. OBTENER CLEARCART

  const [order, setOrder] = useState<Order | null>(
    location.state?.order || null
  );
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // 3. USEEFFECT PARA LIMPIAR EL CARRITO AL MONTAR
  useEffect(() => {
    clearCart();
  }, []); // El array vacío asegura que se ejecute solo una vez

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/orders/${id}`);
          if (!response.ok) {
            throw new Error("No se pudo encontrar la orden.");
          }
          const data = await response.json();
          setOrder(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  useEffect(() => {
    if (!loading && !order) {
      navigate("/");
    }
  }, [loading, order, navigate]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Cargando...</div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/" className="text-blue-500 hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">Verificando datos de la orden...</div>
    );
  }

  const bankDetails = {
    cbu: "1234567890123456789012",
    alias: "ROSARIO.DENIM.MP",
    titular: "Rosario Denim S.A.",
  };

  const whatsappMessage = `¡Hola! Acabo de hacer el pedido #${order.id} y quiero enviar mi comprobante de pago.`;
  const whatsappLink = `https://wa.me/5493411234567?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-blanco-hueso py-12">
      <div className="container mx-auto max-w-lg px-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md border border-arena">
          <h1 className="text-2xl font-bold mb-4 text-gris-oscuro">¡Falta poco! Tu pedido está casi listo.</h1>
          <p className="text-gris-oscuro/80 mb-6">Para confirmar tu compra, realiza una transferencia con los siguientes datos y envíanos el comprobante por WhatsApp.</p>

          <div className="bg-blanco-hueso border border-arena rounded-lg p-6 text-left space-y-4 mb-6">
            <h2 className="font-bold text-lg text-gris-oscuro text-center">Datos para la Transferencia</h2>
            {Object.entries(bankDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-white p-3 rounded-md">
                <div>
                  <span className="font-semibold uppercase text-sm text-gris-oscuro/60">{key}</span>
                  <p className="font-mono text-gris-oscuro">{value}</p>
                </div>
                <button onClick={() => handleCopy(value, key)} className="p-2 text-gris-oscuro/50 hover:text-black transition-colors" title={`Copiar ${key.toUpperCase()}`}>
                  {copied === key ? <Check className="text-green-500" /> : <Copy />}
                </button>
              </div>
            ))}
            <div className="text-center bg-white p-3 rounded-md">
              <span className="font-semibold uppercase text-sm text-gris-oscuro/60">Importe a Transferir</span>
              <p className="text-2xl font-bold text-black">${order.total.toLocaleString("es-AR")}</p>
            </div>
          </div>

          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
            Enviar Comprobante por WhatsApp
          </a>
          <p className="text-xs text-gris-oscuro/60 mt-4">Tenés 60 minutos para enviar el comprobante o tu orden será cancelada.</p>
        </div>
      </div>
    </div>
  );
};

export default TransferPendingPage;