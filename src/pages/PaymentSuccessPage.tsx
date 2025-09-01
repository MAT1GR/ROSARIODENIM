import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Truck } from 'lucide-react';
import { useCart } from '../hooks/useCart.tsx';
import { CartItem } from '../types';

const PaymentSuccessPage: React.FC = () => {
    const { clearCart } = useCart();
    const location = useLocation();
    const { paymentId, items, shippingCost, total } = location.state || {};

    // Limpia el carrito una vez que el pago es exitoso
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    // Lógica para el cálculo de fecha estimada
    const getEstimatedDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7); // Envío en 4 a 7 días hábiles
        // CORRECCIÓN: Se define el tipo de las opciones de forma explícita y correcta
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-2xl px-4">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                        <h1 className="text-3xl font-bold mb-2">¡Pago exitoso!</h1>
                        <p className="text-gray-600">
                            Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando.
                        </p>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-bold mb-4">Resumen de tu pedido</h2>
                        {paymentId && (
                            <div className="flex justify-between mb-4 p-4 bg-gray-50 rounded-md">
                                <span className="text-gray-600 font-medium">Número de Pedido:</span>
                                <span className="font-mono text-[#D8A7B1] font-bold">{paymentId}</span>
                            </div>
                        )}
                        
                        {/* Lista de productos */}
                        <div className="space-y-4 mb-4">
                            {items?.map((item: CartItem) => (
                                <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-4">
                                    <img src={`http://localhost:3001${item.product.images[0]}`} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">Talle: {item.size}, Cantidad: {item.quantity}</p>
                                    </div>
                                    <span className="font-semibold text-gray-900">${(item.product.price * item.quantity).toLocaleString('es-AR')}</span>
                                </div>
                            ))}
                        </div>

                        {/* Resumen de costos */}
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${(total - (shippingCost || 0)).toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Costo de Envío</span>
                                <span>${(shippingCost || 0).toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t mt-4 pt-4">
                                <span>Total</span>
                                <span className="text-[#D8A7B1]">${total.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                        <div className="inline-flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-md">
                            <Truck size={20} />
                            <p className="text-sm">Tu pedido se enviará a tu domicilio antes del <strong className="font-bold">{getEstimatedDeliveryDate()}</strong>.</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            Recibirás un email de confirmación con los detalles del envío y un número de seguimiento.
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            to="/tienda"
                            className="inline-block bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Volver a la tienda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;