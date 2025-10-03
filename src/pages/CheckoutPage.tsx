import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, CreditCard, Banknote } from "lucide-react";
import { CartItem } from "../types";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, selectedShipping, total, shippingInfo } =
    location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("mercado-pago");
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalWithDiscount = total * 0.9; // Aplicar 10% de descuento

  useEffect(() => {
    if (!total || !shippingInfo || !cartItems) {
      navigate("/carrito");
    }
  }, [cartItems, selectedShipping, total, shippingInfo, navigate]);

  const handleFinalizeOrder = async () => {
    setIsLoading(true);
    setError(null);

    if (paymentMethod === "mercado-pago") {
      try {
        const response = await fetch("/api/payments/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            shippingCost: selectedShipping.cost,
            shippingInfo: shippingInfo,
          }),
        });
        if (!response.ok)
          throw new Error("Error al crear la preferencia de pago.");
        const data = await response.json();
        setPreferenceId(data.preferenceId);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else if (paymentMethod === "transferencia") {
      try {
        const response = await fetch("/api/orders/create-transfer-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            shippingInfo: shippingInfo,
            shipping: selectedShipping,
            total: totalWithDiscount,
          }),
        });
        if (!response.ok)
          throw new Error("Error al crear la orden de transferencia.");
        const orderData = await response.json();
        navigate(`/pedido-pendiente/${orderData.id}`, {
          state: { order: orderData },
        });
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (preferenceId && window.MercadoPago) {
      const mp = new window.MercadoPago(
        import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
        { locale: "es-AR" }
      );
      const container = document.querySelector(".cho-container");
      if (container) container.innerHTML = "";
      mp.checkout({
        preference: { id: preferenceId },
        render: {
          container: ".cho-container",
          label: "Pagar con Mercado Pago",
        },
      });
    }
  }, [preferenceId]);

  const displayedTotal =
    paymentMethod === "transferencia" ? totalWithDiscount : total;

  return (
    <div className="min-h-screen bg-blanco-hueso py-12">
      <div className="container mx-auto max-w-lg px-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-arena">
          <div className="text-center mb-8">
            <Lock className="mx-auto text-gris-oscuro/50 mb-4" size={32} />
            <h1 className="text-2xl font-bold mb-2 text-gris-oscuro">
              Finalizar Compra
            </h1>
            <p className="text-gris-oscuro/80">
              Estás en un entorno seguro. Revisa tu pedido y elige un método de
              pago.
            </p>
          </div>

          <div className="mb-8 border rounded-lg p-4 space-y-3 bg-blanco-hueso">
            <h2 className="text-lg font-semibold mb-2 text-gris-oscuro">
              Resumen de tu compra
            </h2>
            {cartItems?.map((item: CartItem) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gris-oscuro">
                  {item.product.name}{" "}
                  <span className="text-gris-oscuro/60">x{item.quantity}</span>
                </span>
                <span className="font-medium text-gris-oscuro">
                  $
                  {(item.product.price * item.quantity).toLocaleString("es-AR")}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm pt-2 border-t border-arena">
              <span className="text-gris-oscuro">
                Envío: {selectedShipping?.name}
              </span>
              <span className="font-medium text-gris-oscuro">
                ${selectedShipping?.cost.toLocaleString("es-AR")}
              </span>
            </div>
            {paymentMethod === "transferencia" && (
              <div className="flex justify-between items-center text-sm pt-2 border-t border-arena text-green-600">
                <span>Descuento por transferencia</span>
                <span className="font-medium">
                  - ${(total * 0.1).toLocaleString("es-AR")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-arena">
              <span className="text-gris-oscuro">Total</span>
              <span className="text-black">
                ${displayedTotal.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-gris-oscuro">
              Método de Pago
            </h3>
            <div
              onClick={() => setPaymentMethod("mercado-pago")}
              className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 ${
                paymentMethod === "mercado-pago"
                  ? "border-black bg-blanco-hueso"
                  : "border-arena"
              }`}
            >
              <CreditCard />
              <div>
                <p className="font-semibold">Mercado Pago</p>
                <p className="text-sm text-gris-oscuro/70">
                  Tarjetas de crédito, débito y dinero en cuenta.
                </p>
              </div>
            </div>
            <div
              onClick={() => setPaymentMethod("transferencia")}
              className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 ${
                paymentMethod === "transferencia"
                  ? "border-black bg-blanco-hueso"
                  : "border-arena"
              }`}
            >
              <Banknote />
              <div>
                <p className="font-semibold">
                  Transferencia Bancaria{" "}
                  <span className="text-green-600 font-bold">(-10% OFF)</span>
                </p>
                <p className="text-sm text-gris-oscuro/70 font-bold">
                  (Importante: tenés 60 min. para enviar el comprobante por
                  WhatsApp)
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="my-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {paymentMethod === "mercado-pago" ? (
            <>
              {!preferenceId && (
                <button
                  onClick={handleFinalizeOrder}
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Procesando..." : "Continuar a Mercado Pago"}
                </button>
              )}
              <div
                className={`cho-container transition-opacity duration-500 ${
                  preferenceId ? "opacity-100" : "opacity-0 h-0"
                }`}
              ></div>
            </>
          ) : (
            <button
              onClick={handleFinalizeOrder}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading
                ? "Generando orden..."
                : "Finalizar Pedido y Ver Datos"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
