import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Clock, Copy, ArrowRight } from "lucide-react";

const TransferPendingPage: React.FC = () => {
  const location = useLocation();
  const { orderId } = useParams();
  const { order } = location.state || {};

  const [expirationTime, setExpirationTime] = useState("");
  const [cbuCopied, setCbuCopied] = useState(false);
  const [aliasCopied, setAliasCopied] = useState(false);

  // Reemplazar con tus datos reales
  const CBU = "0000003100000000000000";
  const ALIAS = "denim.rosario.mp";
  const WHATSAPP_NUMBER = "5493411234567";

  useEffect(() => {
    const calculateExpiration = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 60);
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setExpirationTime(`${hours}:${minutes} hs`);
    };
    calculateExpiration();
  }, []);

  const handleCopy = (text: string, type: "cbu" | "alias") => {
    navigator.clipboard.writeText(text);
    if (type === "cbu") {
      setCbuCopied(true);
      setTimeout(() => setCbuCopied(false), 2000);
    } else {
      setAliasCopied(true);
      setTimeout(() => setAliasCopied(false), 2000);
    }
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola! Te envío el comprobante de pago para mi orden #${orderId}.`;

  return (
    <div className="min-h-screen bg-blanco-hueso py-12 flex items-center">
      <div className="container mx-auto max-w-xl px-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-arena text-center">
          <Clock className="mx-auto text-caramelo mb-4" size={48} />
          <h1 className="text-2xl font-bold mb-2 text-caramelo">
            ¡ACCIÓN REQUERIDA!
          </h1>
          <h2 className="text-xl font-semibold mb-4 text-gris-oscuro">
            TU RESERVA ESTÁ PENDIENTE
          </h2>

          <p className="text-gris-oscuro/80 mb-6">
            Para confirmar tu compra, realizá la transferencia y enviá el
            comprobante a nuestro WhatsApp{" "}
            <strong>antes de las {expirationTime}</strong>. Pasado ese tiempo,
            tu orden se cancelará automáticamente.
          </p>

          <div className="bg-blanco-hueso border border-arena rounded-lg p-6 space-y-4 text-left mb-6">
            <h3 className="font-bold text-lg text-center text-gris-oscuro">
              DATOS DE TRANSFERENCIA
            </h3>
            <div>
              <p className="text-sm font-semibold text-gris-oscuro/70">CBU</p>
              <div className="flex justify-between items-center bg-white p-3 rounded-md border border-arena">
                <span className="font-mono text-gris-oscuro">{CBU}</span>
                <button
                  onClick={() => handleCopy(CBU, "cbu")}
                  className="text-sm font-semibold text-caramelo hover:underline"
                >
                  {cbuCopied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gris-oscuro/70">Alias</p>
              <div className="flex justify-between items-center bg-white p-3 rounded-md border border-arena">
                <span className="font-mono text-gris-oscuro">{ALIAS}</span>
                <button
                  onClick={() => handleCopy(ALIAS, "alias")}
                  className="text-sm font-semibold text-caramelo hover:underline"
                >
                  {aliasCopied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-black text-white py-4 rounded-lg text-lg font-bold transition-opacity hover:opacity-90 flex items-center justify-center gap-2 group"
          >
            Enviar Comprobante por WhatsApp
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TransferPendingPage;
