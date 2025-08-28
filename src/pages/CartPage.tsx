import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '../hooks/useCart.tsx';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getTotalPrice();

  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode) return;
    setIsCalculating(true);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postalCode }),
      });
      const data = await response.json();
      setShippingCost(data.cost);
    } catch (error) {
      console.error("Error al calcular envío:", error);
      alert("No se pudo calcular el costo de envío.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCheckout = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/payments/create-mercadopago-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, shippingCost: shippingCost || 0 }),
      });
      const data = await response.json();

      if (data.preferenceId) {
        // Redirigir a nuestra página de checkout con el ID de la preferencia
        navigate('/checkout', { state: { preferenceId: data.preferenceId } });
      } else {
        throw new Error("No se recibió el ID de la preferencia de pago.");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un problema al iniciar el proceso de pago.");
    } finally {
        setIsProcessingPayment(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
          <p className="text-xl text-gray-600 mb-8">Tu carrito está vacío</p>
          <Link
            to="/tienda"
            className="inline-block bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/tienda"
          className="inline-flex items-center text-gray-600 hover:text-[#D8A7B1] mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Continuar comprando
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del Carrito */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tu Carrito</h1>
                <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                Vaciar carrito
                </button>
            </div>
            <div className="space-y-6">
                {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 py-4 border-b border-gray-200">
                    <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                        <h3 className="font-medium text-lg">{item.product.name}</h3>
                        <p className="text-gray-600">Talle: {item.size}</p>
                        </div>
                        <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border rounded-lg">
                        <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:text-[#D8A7B1] transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 border-x">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:text-[#D8A7B1] transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                        </div>
                        <div className="text-right">
                        <p className="font-bold text-lg">
                            ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Resumen</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${total.toLocaleString('es-AR')}</span>
                    </div>

                    {/* Calculador de Envío */}
                    <div className="border-t pt-4">
                        <form onSubmit={handleCalculateShipping} className="flex gap-2">
                            <input
                                type="text"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                placeholder="Código Postal"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
                            />
                            <button type="submit" disabled={isCalculating} className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                                {isCalculating ? '...' : <Truck size={20} />}
                            </button>
                        </form>
                        {shippingCost !== null && (
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-600">Costo de Envío</span>
                                <span className="font-medium">${shippingCost.toLocaleString('es-AR')}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                        <span>Total</span>
                        <span className="text-2xl text-[#D8A7B1]">
                           ${(total + (shippingCost || 0)).toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={handleCheckout}
                    disabled={isProcessingPayment}
                    className="w-full mt-6 bg-[#D8A7B1] hover:bg-[#c69ba5] text-white py-3 rounded-lg text-lg font-medium transition-colors disabled:opacity-50"
                >
                    {isProcessingPayment ? 'Procesando...' : 'Pagar con Mercado Pago'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;