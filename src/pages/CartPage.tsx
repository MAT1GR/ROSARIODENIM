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
      <div className="min-h-screen bg-blanco-hueso py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-8 text-gris-oscuro">
            Tu Carrito
          </h1>
          <p className="text-xl text-gris-oscuro/80 mb-8">
            Tu carrito está vacío
          </p>
          <Link
            to="/tienda"
            className="inline-block bg-caramelo hover:opacity-90 text-blanco-hueso px-8 py-3 rounded-lg font-medium transition-colors"
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
    <div className="min-h-screen bg-blanco-hueso py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/tienda"
          className="inline-flex items-center text-gris-oscuro/80 hover:text-gris-oscuro mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Continuar comprando
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-blanco-hueso rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gris-oscuro">
                Tu Carrito
              </h1>
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
                  className="flex gap-4 py-4 border-b border-arena"
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
                        <h3 className="font-medium text-lg text-gris-oscuro">
                          {item.product.name}
                        </h3>
                        <p className="text-gris-oscuro/80">
                          Talle: {item.size}
                        </p>
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
                      <div className="flex items-center border border-arena rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="p-2 text-gris-oscuro/80 hover:text-gris-oscuro transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 border-x border-arena">
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
                          className="p-2 text-gris-oscuro/80 hover:text-gris-oscuro transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gris-oscuro">
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
            <div className="bg-blanco-hueso rounded-lg shadow-sm p-6 sticky top-28 border border-arena">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gris-oscuro">
                Resumen del Pedido
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-gris-oscuro">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ${total.toLocaleString("es-AR")}
                  </span>
                </div>

                <div className="flex flex-col space-y-2 border-t border-arena pt-4">
                  <form
                    onSubmit={handleCalculateShipping}
                    className="flex gap-2 items-stretch"
                  >
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Código Postal"
                      className="flex-1 p-3 border border-arena rounded-lg text-sm placeholder-gris-oscuro/50 focus:outline-none focus:ring-2 focus:ring-caramelo focus:border-transparent bg-blanco-hueso"
                    />
                    <button
                      type="submit"
                      disabled={isCalculating || !postalCode}
                      className="px-4 py-3 bg-arena text-gris-oscuro rounded-lg font-medium hover:bg-arena/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm whitespace-nowrap"
                    >
                      {isCalculating ? "Calculando..." : "Calcular Envío"}
                    </button>
                  </form>
                  {shippingOptions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer has-[:checked]:bg-arena/30 has-[:checked]:border-caramelo"
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="shippingOption"
                              value={option.id}
                              checked={selectedShipping?.id === option.id}
                              onChange={() => setSelectedShipping(option)}
                              className="h-4 w-4 text-caramelo focus:ring-caramelo"
                            />
                            <span className="ml-3 text-sm text-gris-oscuro">
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

                <div className="flex justify-between items-center text-xl font-bold border-t border-arena pt-4">
                  <span className="text-gris-oscuro">Total</span>
                  <span className="text-2xl text-caramelo">
                    ${(total + shippingCost).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={!isCheckoutEnabled}
                className="w-full mt-6 bg-caramelo text-blanco-hueso py-3 rounded-lg text-lg font-bold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
