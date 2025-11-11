import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { Mail, Phone, ShoppingBag } from 'lucide-react';
import { CustomerDetailsModal } from './CustomerDetailsModal';

export const CustomersTab: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/customers');
            setCustomers(await res.json());
        } catch (err) {
            console.error(err);
            alert('Error al cargar los clientes.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Clientes</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Nombre</th>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Contacto</th>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Pedidos</th>
                            <th className="p-4 text-left font-medium text-sm text-gray-600">Total Gastado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Cargando clientes...</td></tr>
                        ) : customers.length === 0 ? (
                             <tr><td colSpan={4} className="p-8 text-center text-gray-500">No hay clientes registrados.</td></tr>
                        ) : customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <button 
                                        onClick={() => setSelectedCustomer(customer)} 
                                        className="font-medium text-gray-800 hover:text-blue-500 hover:underline"
                                    >
                                        {customer.name}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} /> {customer.email}
                                    </div>
                                    {customer.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Phone size={14} /> {customer.phone}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-gray-600">{customer.order_count || 0}</td>
                                <td className="p-4 font-medium text-gray-800">${(customer.total_spent || 0).toLocaleString('es-AR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedCustomer && <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
        </div>
    );
};