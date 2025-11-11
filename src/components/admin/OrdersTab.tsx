import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { ChevronDown, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { OrderDetailModal } from './OrderDetailModal';

export const OrdersTab: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
            alert('Error al cargar los pedidos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Error al actualizar estado');
            
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
            alert('Estado del pedido actualizado.');
        } catch (err) {
            console.error(err);
            alert('Error al actualizar el estado del pedido.');
        }
    };

    const statusOptions = [
        { value: 'pending_payment', label: 'Pendiente de Pago', icon: Package, color: 'yellow' },
        { value: 'paid', label: 'Pagado', icon: CheckCircle, color: 'green' },
        { value: 'shipped', label: 'Enviado', icon: Truck, color: 'blue' },
        { value: 'delivered', label: 'Entregado', icon: CheckCircle, color: 'green' },
        { value: 'cancelled', label: 'Cancelado', icon: XCircle, color: 'red' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Pedidos</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Pedido ID</th>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Cliente</th>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Fecha</th>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Total</th>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Cargando pedidos...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay pedidos para mostrar.</td></tr>
                        ) : orders.map((order) => {
                            const currentStatus = statusOptions.find(s => s.value === order.status) || statusOptions[0];
                            return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-sm text-gray-700">
                                      <button onClick={() => setSelectedOrder(order)} className="text-blue-500 hover:underline font-medium">#{order.id}</button>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{order.customerName}</div>
                                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                                    <td className="p-4 font-medium text-gray-800">${order.total.toLocaleString('es-AR')}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`w-full p-2 border rounded-lg bg-${currentStatus.color}-50 text-${currentStatus.color}-700 border-${currentStatus.color}-200`}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </div>
    );
};