import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();

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
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/tienda"
          className="inline-flex items-center text-gray-600 hover:text-[#D8A7B1] mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Continuar comprando
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tu Carrito</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-4 py-6 border-b border-gray-200">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
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
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:text-[#D8A7B1] transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 border-x">{item.quantity}</span>
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
                      <p className="text-sm text-gray-600">
                        ${item.product.price.toLocaleString('es-AR')} c/u
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-medium">Total:</span>
              <span className="text-3xl font-bold text-[#D8A7B1]">
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
            
            <button className="w-full bg-[#D8A7B1] hover:bg-[#c69ba5] text-white py-4 rounded-lg text-lg font-medium transition-colors">
              PROCEDER AL CHECKOUT
            </button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Los costos de envío se calcularán en el checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;