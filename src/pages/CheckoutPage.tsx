import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
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
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!total || !shippingInfo || !cartItems) {
      navigate("/carrito");
      return;
    }

    const createPreference = async () => {
      setIsLoading(true);
      setError(null);
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al crear la preferencia de pago."
          );
        }

        const data = await response.json();
        setPreferenceId(data.preferenceId);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    createPreference();
  }, [cartItems, selectedShipping, total, shippingInfo, navigate]);

  useEffect(() => {
    if (preferenceId && window.MercadoPago) {
      const mp = new window.MercadoPago(
        import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
        { locale: "es-AR" }
      );

      const container = document.querySelector(".cho-container");
      if (container) {
        container.innerHTML = "";
      }

      mp.checkout({
        preference: { id: preferenceId },
        render: {
          container: ".cho-container",
          label: "Pagar ahora",
        },
      });
    }
  }, [preferenceId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-lg px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <Lock className="mx-auto text-gray-400 mb-4" size={32} />
            <h1 className="text-2xl font-bold mb-2">Ya casi es tuyo</h1>
            <p className="text-gray-600 mb-8">
              Estás en un entorno seguro. Revisa tu pedido y continúa a Mercado
              Pago.
            </p>
          </div>

          <div className="mb-8 border rounded-lg p-4 space-y-3 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">Resumen de tu compra</h2>
            {cartItems?.map((item: CartItem) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-800">
                  {item.product.name}{" "}
                  <span className="text-gray-500">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  $
                  {(item.product.price * item.quantity).toLocaleString("es-AR")}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm pt-2 border-t">
              <span className="text-gray-800">
                Envío: {selectedShipping?.name}
              </span>
              <span className="font-medium">
                ${selectedShipping?.cost.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
              <span className="text-gray-900">Total</span>
              <span className="text-brand-primary">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {isLoading && (
            <div className="text-center p-8">
              Generando link de pago seguro...
            </div>
          )}

          {error && (
            <div className="my-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div
            className={`cho-container flex justify-center transition-opacity duration-300 ${
              isLoading || error ? "opacity-0 h-0" : "opacity-100 h-auto"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
