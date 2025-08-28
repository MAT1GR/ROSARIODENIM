import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart.tsx';

const PaymentSuccessPage: React.FC = () => {
    const { clearCart } = useCart();

    // Limpia el carrito una vez que el pago es exitoso
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="container mx-auto max-w-md px-4 text-center">
                <div className="bg-white p-10 rounded-lg shadow-md">
                    <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-4">¡Pago exitoso!</h1>
                    <p className="text-gray-600 mb-8">
                        Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando.
                    </p>
                    <Link
                        to="/tienda"
                        className="inline-block bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                        Seguir Comprando
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;