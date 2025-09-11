import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ShippingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, selectedShipping, total } = location.state || {};

  // Estado inicial con todos los nuevos campos
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', // Añadido para el flujo nuevo
    phone: '',
    docNumber: '',
    streetName: '',
    streetNumber: '',
    apartment: '',
    description: '',
    city: 'Rosario',
    postalCode: selectedShipping?.id === 'cadete' ? '2000' : '',
    province: 'Santa Fe',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout', {
      state: {
        cartItems,
        selectedShipping,
        total,
        shippingInfo: formData, // Pasamos el objeto completo con todos los datos
      },
    });
  };

  if (!cartItems || !selectedShipping) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-8">Información de Envío</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Datos del Destinatario */}
            <fieldset className="space-y-4 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-lg font-medium">Datos del destinatario</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="firstName" label="Nombre" value={formData.firstName} onChange={handleChange} required />
                <InputField name="lastName" label="Apellido" value={formData.lastName} onChange={handleChange} required />
              </div>
              <InputField name="email" label="Email de contacto" type="email" value={formData.email} onChange={handleChange} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="phone" label="Teléfono" type="tel" value={formData.phone} onChange={handleChange} required />
                <InputField name="docNumber" label="DNI / CUIL / CUIT" value={formData.docNumber} onChange={handleChange} required />
              </div>
            </fieldset>

            {/* Datos de Domicilio */}
            <fieldset className="space-y-4 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-lg font-medium">Datos de domicilio</legend>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <InputField name="streetName" label="Calle" value={formData.streetName} onChange={handleChange} required />
                </div>
                <InputField name="streetNumber" label="Número" value={formData.streetNumber} onChange={handleChange} required />
              </div>
              <InputField name="apartment" label="Departamento (opcional)" value={formData.apartment} onChange={handleChange} />
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej: Entre calles, color de la puerta, etc."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="city" label="Ciudad" value={formData.city} onChange={handleChange} required />
                <InputField name="postalCode" label="Código Postal" value={formData.postalCode} onChange={handleChange} required />
              </div>
              <InputField name="province" label="Provincia" value={formData.province} onChange={handleChange} required />
            </fieldset>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#D8A7B1] hover:bg-[#c69ba5] text-white py-3 rounded-lg text-lg font-bold transition-colors"
              >
                Continuar al Pago
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar reutilizable para los campos de input
const InputField = (props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{props.label}</label>
    <input
      id={props.name}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]"
      {...props}
    />
  </div>
);

export default ShippingPage;