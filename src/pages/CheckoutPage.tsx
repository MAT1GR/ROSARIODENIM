import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.tsx';
import { CartItem } from '../types';

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
    const { preferenceId, items, shippingCost } = location.state || {}; 
    const [isLoading, setIsLoading] = useState(true);
    
    const cardPaymentBrickController = useRef<any>(null);

    useEffect(() => {
        if (!preferenceId) {
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

            cardPaymentBrickController.current = await bricksBuilder.create("cardPayment", "cardPaymentBrick_container", {
                initialization: {
                    amount: getTotalPrice(),
                    preferenceId: preferenceId,
                },
                customization: {
                    visual: { style: { theme: 'default' } }
                },
                callbacks: {
                    onReady: () => {},
                    onSubmit: async (cardFormData: any) => {
                        try {
                            const response = await fetch('/api/payments/process-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...cardFormData,
                                    order: {
                                        items: items,
                                        shippingCost: shippingCost
                                    }
                                }),
                            });

                            if (response.ok) {
                                const paymentResult = await response.json();
                                if (paymentResult.status === 'approved') {
                                    navigate('/payment-success', {
                                        state: {
                                            paymentId: paymentResult.paymentId,
                                            items: items,
                                            shippingCost: shippingCost,
                                            total: getTotalPrice() + (shippingCost || 0)
                                        }
                                    });
                                } else {
                                    alert(`El pago fue ${paymentResult.status}. Por favor, inténtalo de nuevo.`);
                                }
                            } else {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Error en el pago');
                            }
                            
                        } catch (error) {
                            console.error("Error al procesar el pago:", error);
                            alert("Hubo un error al procesar tu pago. Por favor, revisa los datos e intenta de nuevo.");
                        }
                    },
                    onError: (error: any) => {
                        console.error("Error en el Brick de pago:", error);
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
    }, [preferenceId, navigate, getTotalPrice, items, shippingCost]);

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