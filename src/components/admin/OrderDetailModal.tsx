import React from 'react';
import { Order } from '../../types';
import { X, Calendar, DollarSign, Package, User, MapPin } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Detalles del Pedido #{order.id}</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2"><User size={18} /> Cliente</div>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2"><Calendar size={18} /> Fecha</div>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2"><MapPin size={18} /> Dirección de Envío</div>
            <p className="font-medium">{order.shipping_address || 'No disponible'}</p>
            <p className="text-sm text-gray-500">
              {order.shipping_city || 'No disponible'} ({order.shipping_postal_code || 'N/A'})
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Costo de envío: <strong>${(order.shipping_cost || 0).toLocaleString('es-AR')}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2"><DollarSign size={18} /> Total</div>
              <p className="font-medium">${order.total.toLocaleString('es-AR')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2"><Package size={18} /> Estado</div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Productos</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img src={`${import.meta.env.VITE_API_BASE_URL || ''}${item.product.images[0]}`} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Talle: {item.size} &middot; Cantidad: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">${(item.product.price * item.quantity).toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};