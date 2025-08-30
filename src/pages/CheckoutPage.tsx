import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.tsx';

// Para que TypeScript reconozca el objeto `MercadoPago` y los Bricks
declare global {
    interface Window {
        MercadoPago: any;
    }
}

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getTotalPrice } = useCart();
    const { preferenceId } = location.state || {};
    const [isLoading, setIsLoading] = useState(true);
    
    // Usamos una referencia para mantener la instancia del Brick entre renders
    const cardPaymentBrickController = useRef<any>(null);

    useEffect(() => {
        if (!preferenceId) {
            navigate('/carrito');
            return;
        }

        let isMounted = true; // Para evitar actualizaciones en un componente desmontado

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

            cardPaymentBrickController.current = await bricksBuilder.create("cardPayment", "cardPaymentBrick_container", {
                initialization: {
                    amount: getTotalPrice(),
                    preferenceId: preferenceId,
                },
                customization: {
                    visual: { style: { theme: 'default' } }
                },
                callbacks: {
                    onReady: () => { /* El Brick está listo */ },
                    onSubmit: async (cardFormData: any) => {
                        try {
                            const response = await fetch('/api/payments/process-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(cardFormData),
                            });

                            const paymentResult = await response.json();

                            if (!response.ok) {
                                throw new Error(paymentResult.message || 'Error en el pago');
                            }
                            
                            // --- ¡ESTA ES LA LÍNEA CLAVE! ---
                            // Si todo salió bien, redirigimos a la página de éxito.
                            navigate('/payment-success');

                        } catch (error) {
                            console.error("Error al procesar el pago:", error);
                            alert("Hubo un error al procesar tu pago. Por favor, revisa los datos e intenta de nuevo.");
                        }
                    },
                    onError: (error: any) => {
                        console.error("Error en el Brick de pago:", error);
                        alert("Hubo un error al procesar el pago. Por favor, intenta de nuevo.");
                    },
                },
            });
        };
        
        script.onerror = () => {
            if (isMounted) {
                console.error("No se pudo cargar el script de Mercado Pago.");
                setIsLoading(false);
            }
        };

        document.body.appendChild(script);

        return () => {
            isMounted = false;
            if (cardPaymentBrickController.current) {
                cardPaymentBrickController.current.unmount();
            }
            const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        }
    }, [preferenceId, navigate, getTotalPrice]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-lg px-4">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-2">Completa tu pago</h1>
                    <p className="text-center text-gray-500 mb-6">Todos tus datos están protegidos.</p>
                    
                    {isLoading && <div className="text-center p-8">Cargando formulario de pago...</div>}
                    
                    <div id="cardPaymentBrick_container"></div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;