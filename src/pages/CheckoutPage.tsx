import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';

declare global {
    interface Window {
        MercadoPago: any;
    }
}

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { preferenceId, items, shippingCost, total } = location.state || {}; 
    const [isLoading, setIsLoading] = useState(true);
    const [brickError, setBrickError] = useState<string | null>(null); // Estado para mostrar error al usuario
    
    const paymentBrickController = useRef<any>(null);

    useEffect(() => {
        if (!preferenceId || !total) {
            navigate('/carrito');
            return;
        }

        let isMounted = true;
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.async = true;

        script.onload = async () => {
            if (!isMounted) return;
            
            setIsLoading(false);
            
            const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
                locale: 'es-AR'
            });

            const bricksBuilder = mp.bricks();

            paymentBrickController.current = await bricksBuilder.create("payment", "paymentBrick_container", {
                initialization: {
                    amount: total,
                    preferenceId: preferenceId,
                },
                customization: {
                    visual: { style: { theme: 'default' } }
                },
                callbacks: {
                    onReady: () => {},
                    onSubmit: async (formData: any) => {
                        try {
                            const response = await fetch('/api/payments/process-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...formData,
                                    order: { items, shippingCost }
                                }),
                            });

                            const paymentResult = await response.json();
                            if (response.ok && paymentResult.status === 'approved') {
                                navigate('/payment-success', {
                                    state: {
                                        paymentId: paymentResult.paymentId,
                                        items: items,
                                        shippingCost: shippingCost || 0,
                                        total: total
                                    }
                                });
                            } else {
                                throw new Error(paymentResult.message || `El pago fue ${paymentResult.status}.`);
                            }
                        } catch (error: any) {
                            console.error("Error al procesar el pago:", error);
                            alert(`Hubo un error al procesar tu pago: ${error.message}`);
                        }
                    },
                    // --- MODIFICACIÓN CLAVE PARA OBTENER MÁS DETALLES DEL ERROR ---
                    onError: (error: any) => {
                        console.error("Error detallado del Brick de pago:", error);
                        // Convertimos el objeto de error a un string para poder mostrarlo
                        const errorDetails = JSON.stringify(error, null, 2);
                        setBrickError(`No se pudo cargar el formulario de pago. Por favor, intenta de nuevo.\n\nDetalles: ${errorDetails}`);
                    },
                },
            });
        };
        
        script.onerror = () => {
            if (isMounted) {
                const errorMsg = "No se pudo cargar el script de Mercado Pago. Revisa tu conexión a internet o el bloqueador de anuncios.";
                console.error(errorMsg);
                setIsLoading(false);
                setBrickError(errorMsg);
            }
        };

        document.body.appendChild(script);

        return () => {
            isMounted = false;
            if (paymentBrickController.current?.unmount) {
                paymentBrickController.current.unmount();
            }
            const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        }
    }, [preferenceId, navigate, items, shippingCost, total]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-lg px-4">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-2">Completa tu pago</h1>
                    <p className="text-center text-gray-500 mb-6">Todos tus datos están protegidos.</p>
                    
                    {isLoading && <div className="text-center p-8">Cargando formulario de pago...</div>}
                    
                    {/* Contenedor para el Brick */}
                    <div id="paymentBrick_container"></div>

                    {/* Mostramos el error si existe */}
                    {brickError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                            <h3 className="font-bold">Error</h3>
                            <pre className="whitespace-pre-wrap text-sm">{brickError}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;