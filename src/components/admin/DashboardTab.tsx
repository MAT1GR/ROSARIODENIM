import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { Order, Customer } from '../../types';

interface Stats {
  productCount: number;
  orderCount: number;
  customerCount: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentCustomers: Customer[];
}

const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center gap-4">
        <div className={`bg-${color}-100 p-3 rounded-full`}>
            <Icon className={`text-${color}-600`} size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const RecentActivity: React.FC<{ orders: Order[], customers: Customer[] }> = ({ orders, customers }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-4">Últimos Pedidos</h3>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium text-gray-800">{order.customerId.name}</p>
                            <p className="text-gray-500">{order.items.length} producto(s)</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">${order.total.toLocaleString('es-AR')}</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>{order.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-4">Nuevos Clientes</h3>
            <div className="space-y-4">
                {customers.map(customer => (
                    <div key={customer.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium text-gray-800">{customer.name}</p>
                            <p className="text-gray-500">{customer.email}</p>
                        </div>
                        {/* CORRECCIÓN AQUÍ */}
                        <p className="text-gray-600">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('es-AR') : ''}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const DashboardTab: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/dashboard/stats');
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div>Cargando estadísticas...</div>;
    }

    if (!stats) {
        return <div>No se pudieron cargar las estadísticas.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} title="Ingresos Totales" value={`$${stats.totalRevenue.toLocaleString('es-AR')}`} color="green" />
                <StatCard icon={ShoppingCart} title="Pedidos Totales" value={stats.orderCount} color="blue" />
                <StatCard icon={Users} title="Clientes Totales" value={stats.customerCount} color="purple" />
                <StatCard icon={Package} title="Productos Activos" value={stats.productCount} color="orange" />
            </div>
            <RecentActivity orders={stats.recentOrders} customers={stats.recentCustomers} />
        </div>
    );
};