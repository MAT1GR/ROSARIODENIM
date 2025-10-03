import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { ChevronDown, ArrowRight } from "lucide-react";

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
}

type CheckoutStep = "initial" | "shipping_options" | "address_details";

const CheckoutInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();
  const subtotal = getTotalPrice();

  const [step, setStep] = useState<CheckoutStep>("initial");

  const [formData, setFormData] = useState({
    email: "",
    postalCode: "",
    firstName: "",
    lastName: "",
    phone: "",
    streetName: "",
    streetNumber: "",
    apartment: "",
    neighborhood: "",
    city: "Rosario",
    province: "Santa Fe",
    billingIsSameAsShipping: true,
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinueToShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode: formData.postalCode }),
      });
      const data = await response.json();
      if (data.options && data.options.length > 0) {
        setShippingOptions(data.options);
        setStep("shipping_options");
      } else {
        alert("No se encontraron opciones de envío para este código postal.");
      }
    } catch (error) {
      console.error("Error al calcular envío:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleShippingSelection = (option: ShippingOption) => {
    setSelectedShipping(option);
    setStep("address_details");
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipping) return;

    const finalTotal = subtotal + selectedShipping.cost;

    navigate("/checkout", {
      state: {
        cartItems,
        selectedShipping,
        total: finalTotal,
        shippingInfo: formData,
      },
    });
  };

  const total = subtotal + (selectedShipping?.cost || 0);

  return (
    <div className="min-h-screen bg-blanco-hueso py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-blanco-hueso p-8 rounded-lg">
          <details className="border-b border-arena pb-4 mb-8" open>
            <summary className="font-medium cursor-pointer flex justify-between items-center text-lg text-gris-oscuro">
              <span className="flex items-center gap-2">
                <ChevronDown size={20} /> Ver resumen de compra
              </span>
              <span className="font-bold text-xl">
                ${total.toLocaleString("es-AR")}
              </span>
            </summary>
            <div className="mt-4 space-y-3 pt-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || ""}${
                          item.product.images[0]
                        }`}
                        className="w-16 h-16 rounded object-cover"
                        alt={item.product.name}
                      />
                      <span className="absolute -top-2 -right-2 bg-gris-oscuro text-blanco-hueso text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="text-gris-oscuro">
                      {item.product.name} (Talle: {item.size})
                    </span>
                  </div>
                  <span className="font-semibold text-gris-oscuro">
                    $
                    {(item.product.price * item.quantity).toLocaleString(
                      "es-AR"
                    )}
                  </span>
                </div>
              ))}
              {selectedShipping && (
                <div className="flex justify-between text-sm pt-2 border-t border-arena">
                  <span className="text-gris-oscuro">Envío:</span>
                  <span className="font-semibold text-gris-oscuro">
                    ${selectedShipping.cost.toLocaleString("es-AR")}
                  </span>
                </div>
              )}
            </div>
          </details>

          <form onSubmit={handleFinalSubmit} className="space-y-8">
            <fieldset>
              <legend className="text-xl font-bold mb-4 text-gris-oscuro">
                DATOS DE CONTACTO
              </legend>
              <InputField
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
              />
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-xl font-bold mb-4 text-gris-oscuro">
                ENTREGA
              </legend>
              <div className="relative">
                <InputField
                  name="postalCode"
                  placeholder="Código Postal"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
                <a
                  href="#"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gris-oscuro/70 hover:underline"
                >
                  No sé mi CP
                </a>
              </div>

              {step === "initial" && (
                <button
                  type="button"
                  onClick={handleContinueToShipping}
                  disabled={isCalculating || formData.postalCode.length < 4}
                  className="w-full bg-caramelo hover:opacity-90 text-blanco-hueso py-4 rounded-lg text-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {isCalculating ? "Calculando..." : "Continuar"}
                  {!isCalculating && (
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              )}
            </fieldset>

            {step === "shipping_options" && (
              <div className="space-y-2 animate-fade-in">
                <h3 className="font-semibold text-center mb-3 text-gris-oscuro">
                  Elige tu método de envío
                </h3>
                {shippingOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => handleShippingSelection(option)}
                    className="w-full flex items-center justify-between p-4 border border-arena rounded-lg cursor-pointer hover:bg-arena/30 hover:border-caramelo transition-colors"
                  >
                    <span className="text-sm text-gris-oscuro">
                      {option.name}
                    </span>
                    <span className="font-medium text-sm text-gris-oscuro">
                      ${option.cost.toLocaleString("es-AR")}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {step === "address_details" && (
              <div className="animate-fade-in space-y-6">
                <fieldset className="space-y-4">
                  <legend className="text-xl font-bold mb-4 text-gris-oscuro">
                    DATOS DEL DESTINATARIO
                  </legend>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      name="firstName"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      name="lastName"
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <InputField
                    name="phone"
                    placeholder="Teléfono (ej: 3411234567)"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <InputField
                        name="streetName"
                        placeholder="Calle"
                        value={formData.streetName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <InputField
                      name="streetNumber"
                      placeholder="Número"
                      value={formData.streetNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <InputField
                    name="apartment"
                    placeholder="Departamento (opcional)"
                    value={formData.apartment}
                    onChange={handleChange}
                  />
                  <InputField
                    name="neighborhood"
                    placeholder="Barrio (opcional)"
                    value={formData.neighborhood}
                    onChange={handleChange}
                  />
                  <InputField
                    name="city"
                    placeholder="Ciudad"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </fieldset>

                <button
                  type="submit"
                  className="w-full bg-caramelo hover:opacity-90 text-blanco-hueso py-4 rounded-lg text-lg font-bold transition-colors"
                >
                  Continuar para el pago
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full p-3 border border-arena rounded-lg focus:ring-2 focus:ring-caramelo bg-blanco-hueso placeholder:text-gris-oscuro/50 text-gris-oscuro"
  />
);

export default CheckoutInfoPage;
