import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

declare global {
  interface Window { MercadoPago: any; }
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, selectedShipping, total, shippingInfo } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentBrickController = useRef<any>(null);

  useEffect(() => {
    if (!total || !shippingInfo) {
      navigate('/carrito');
    }
  }, [total, shippingInfo, navigate]);

  useEffect(() => {
    if (total == null) return;

    let isMounted = true;
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;

    script.onload = async () => {
      if (!isMounted) return;

      try {
        const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, { locale: 'es-AR' });
        const bricksBuilder = mp.bricks();

        paymentBrickController.current = await bricksBuilder.create('payment', 'paymentBrick_container', {
          initialization: {
            amount: Number(total),
          },
          customization: {
            visual: { style: { theme: 'default' } },
            paymentMethods: {
              ticket: "all",
              bankTransfer: "all",
              creditCard: "all",
              debitCard: "all",
              mercadoPago: "all",
            },
          },
          callbacks: {
            onReady: () => setIsLoading(false),
            onSubmit: async (formData: any) => {
              setIsProcessing(true);
              setError(null);
              try {
                const response = await fetch('/api/payments/process-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...formData,
                    order: {
                      items: cartItems,
                      shippingCost: selectedShipping?.cost,
                      shippingInfo: shippingInfo,
                      total: total
                    },
                  }),
                });

                const paymentResult = await response.json();
                if (!response.ok) {
                  throw new Error(paymentResult.error || 'El pago fue rechazado.');
                }

                if (paymentResult.status === 'approved') {
                  navigate('/payment-success', {
                    state: {
                      paymentId: paymentResult.paymentId,
                      items: cartItems,
                      shippingCost: selectedShipping?.cost,
                      total,
                    },
                  });
                } else {
                  alert(`El estado de tu pago es: ${paymentResult.status}. Te notificaremos por email.`);
                  navigate('/tienda');
                }
              } catch (err: any) {
                setError(err.message || 'No se pudo procesar el pago. Por favor, verifica tus datos e intenta de nuevo.');
              } finally {
                setIsProcessing(false);
              }
            },
            onError: (error: any) => {
              console.error('Error en el Brick de Mercado Pago:', error);
              setError('Ocurrió un error inesperado al mostrar el formulario de pago. Refresca la página para intentarlo de nuevo.');
            },
          },
        });
      } catch (brickError) {
        console.error('Error al inicializar el Payment Brick:', brickError);
        setError('No se pudo cargar el componente de pago. Por favor, recarga la página.');
        setIsLoading(false);
      }
    };

    document.body.appendChild(script);

    return () => {
      isMounted = false;
      if (paymentBrickController.current?.unmount) {
        paymentBrickController.current.unmount();
      }
    };
  }, [total, cartItems, selectedShipping, shippingInfo, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-lg px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Completa tu pago</h1>
          {isLoading && <div className="text-center p-8">Cargando formulario de pago...</div>}
          <div id="paymentBrick_container" className={`${isProcessing ? 'opacity-50' : ''}`}></div>
          {isProcessing && <div className="text-center p-8">Procesando pago...</div>}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

