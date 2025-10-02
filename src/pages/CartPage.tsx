import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "../hooks/useCart.tsx";

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
}

const CartPage: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const total = getTotalPrice();

  const [postalCode, setPostalCode] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode) return;
    setIsCalculating(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode }),
      });
      const data = await response.json();
      if (data.options && data.options.length > 0) {
        setShippingOptions(data.options);

        const cadeteOption = data.options.find(
          (option: ShippingOption) => option.id === "cadete"
        );

        if (cadeteOption) {
          setSelectedShipping(cadeteOption);
        } else {
          const cheapestOption = data.options.reduce(
            (prev: ShippingOption, current: ShippingOption) =>
              prev.cost < current.cost ? prev : current
          );
          setSelectedShipping(cheapestOption);
        }
      }
    } catch (error) {
      console.error("Error al calcular envío:", error);
      alert(
        "No se pudo calcular el costo de envío. Por favor, verifica el código postal e intenta de nuevo."
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCheckout = () => {
    if (!selectedShipping) {
      alert("Por favor, selecciona un método de envío.");
      return;
    }

    const finalTotal = total + selectedShipping.cost;

    navigate("/shipping", {
      state: {
        cartItems: cartItems,
        selectedShipping: selectedShipping,
        total: finalTotal,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
          <p className="text-xl text-gray-600 mb-8">Tu carrito está vacío</p>
          <Link
            to="/tienda"
            className="inline-block bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  const isCheckoutEnabled = selectedShipping !== null;
  const shippingCost = selectedShipping ? selectedShipping.cost : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/tienda"
          className="inline-flex items-center text-gray-600 hover:text-brand-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Continuar comprando
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 py-4 border-b border-gray-200"
                >
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL || ""}${
                      item.product.images[0]
                    }`}
                    alt={item.product.name}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600">Talle: {item.size}</p>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.size)
                        }
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="p-2 text-gray-600 hover:text-brand-primary transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="p-2 text-gray-600 hover:text-brand-primary transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          $
                          {(item.product.price * item.quantity).toLocaleString(
                            "es-AR"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-brand-dark">
                Resumen del Pedido
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ${total.toLocaleString("es-AR")}
                  </span>
                </div>

                <div className="flex flex-col space-y-2 border-t pt-4">
                  <form
                    onSubmit={handleCalculateShipping}
                    className="flex gap-2 items-stretch"
                  >
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Código Postal (ej: 2000)"
                      className="flex-1 p-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={isCalculating || !postalCode}
                      className="px-4 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm whitespace-nowrap"
                    >
                      {isCalculating ? "Calculando..." : "Calcular Envío"}
                    </button>
                  </form>
                  {shippingOptions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer has-[:checked]:bg-gray-50 has-[:checked]:border-brand-primary"
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="shippingOption"
                              value={option.id}
                              checked={selectedShipping?.id === option.id}
                              onChange={() => setSelectedShipping(option)}
                              className="h-4 w-4 text-brand-primary focus:ring-brand-primary"
                            />
                            <span className="ml-3 text-sm text-gray-700">
                              {option.name}
                            </span>
                          </div>
                          <span className="font-medium text-sm">
                            ${option.cost.toLocaleString("es-AR")}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                  <span className="text-brand-dark">Total</span>
                  <span className="text-2xl text-brand-primary">
                    ${(total + shippingCost).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={!isCheckoutEnabled}
                className="w-full mt-6 bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-lg text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
