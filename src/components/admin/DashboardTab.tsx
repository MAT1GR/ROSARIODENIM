import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

interface Stats {
  productCount: number;
  orderCount: number;
  customerCount: number;
  totalRevenue: number;
}

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

    // CORRECCIÓN: Se muestra un estado de carga
    if (isLoading) {
        return <div>Cargando estadísticas...</div>;
    }

    // CORRECCIÓN: Se maneja el caso en que las estadísticas no se carguen
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
        </div>
    );
};

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