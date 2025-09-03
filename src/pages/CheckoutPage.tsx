import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

declare global {
    interface Window { MercadoPago: any; }
}

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems, selectedShipping, total, shippingInfo } = location.state || {};
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const paymentBrickController = useRef<any>(null);

    // 1. Crear la preferencia de pago cuando el componente se carga
    useEffect(() => {
        if (!total || !shippingInfo) {
            navigate('/carrito');
            return;
        }

        const createPreference = async () => {
            try {
                const response = await fetch('/api/payments/create-mercadopago-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cartItems,
                        shippingCost: selectedShipping.cost,
                        payerInfo: shippingInfo,
                    }),
                });
                const data = await response.json();
                if (data.preferenceId) {
                    setPreferenceId(data.preferenceId);
                } else {
                    throw new Error("No se pudo crear la preferencia de pago.");
                }
            } catch (err) {
                console.error("Error al crear preferencia:", err);
                setError("Hubo un error al iniciar el proceso de pago. Intenta de nuevo más tarde.");
                setIsLoading(false);
            }
        };

        createPreference();
    }, [cartItems, selectedShipping, total, shippingInfo, navigate]);

    // 2. Renderizar el Brick de Mercado Pago una vez que tenemos el preferenceId
    useEffect(() => {
        if (!preferenceId) return;

        let isMounted = true;
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.async = true;

        script.onload = async () => {
            if (!isMounted) return;

            const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, { locale: 'es-AR' });
            const bricksBuilder = mp.bricks();

            paymentBrickController.current = await bricksBuilder.create("payment", "paymentBrick_container", {
                initialization: {
                    amount: total,
                    preferenceId: preferenceId,
                },
                customization: { visual: { style: { theme: 'default' } } },
                // --- INICIO DE LA CORRECCIÓN ---
                // Restauramos los callbacks obligatorios y la lógica de onSubmit
                callbacks: {
                    onReady: () => {
                        /* El brick de pago está listo para ser utilizado. */
                        setIsLoading(false);
                    },
                    onSubmit: async (formData: any) => {
                        // Esta función se ejecuta cuando el usuario hace clic en "Pagar"
                        try {
                            const response = await fetch('/api/payments/process-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...formData,
                                    order: {
                                        items: cartItems,
                                        shippingCost: selectedShipping.cost
                                    }
                                }),
                            });

                            const paymentResult = await response.json();

                            if (!response.ok) {
                                throw new Error(paymentResult.message || 'El pago fue rechazado.');
                            }

                            if (paymentResult.status === 'approved') {
                                navigate('/payment-success', {
                                    state: {
                                        paymentId: paymentResult.paymentId,
                                        items: cartItems,
                                        shippingCost: selectedShipping.cost,
                                        total: total
                                    }
                                });
                            } else {
                                alert(`El estado de tu pago es: ${paymentResult.status}. Te notificaremos por email.`);
                                navigate('/tienda');
                            }
                        } catch (err: any) {
                            console.error("Error al procesar el pago:", err);
                            setError(err.message || "No se pudo procesar el pago. Por favor, verifica tus datos e intenta de nuevo.");
                        }
                    },
                    onError: (error: any) => {
                        console.error("Error en el Brick de Mercado Pago:", error);
                        setError("Ocurrió un error inesperado al mostrar el formulario de pago. Refresca la página para intentarlo de nuevo.");
                    },
                },
                // --- FIN DE LA CORRECCIÓN ---
            });
        };

        document.body.appendChild(script);

        return () => {
            isMounted = false;
            if (paymentBrickController.current?.unmount) {
                paymentBrickController.current.unmount();
            }
        };
    }, [preferenceId, total, cartItems, selectedShipping, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-lg px-4">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Completa tu pago</h1>
                    {isLoading && <div className="text-center p-8">Cargando formulario de pago...</div>}
                    <div id="paymentBrick_container"></div>
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