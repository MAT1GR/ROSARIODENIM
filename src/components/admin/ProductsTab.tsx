import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ProductForm } from './ProductForm';

export const ProductsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
      setProducts(await res.json());
    } catch (err) {
      console.error(err);
      alert('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (data: any) => {
    setIsSaving(true);
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al guardar el producto');
      
      await fetchProducts(); // Recarga la lista de productos
      handleCloseForm();
      alert(`Producto ${editingProduct ? 'actualizado' : 'creado'} con éxito.`);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar el producto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) return;
    try {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      
      await fetchProducts(); // Recarga la lista
      alert('Producto eliminado con éxito.');
    } catch (err) {
      console.error(err);
      alert('Hubo un error al eliminar el producto.');
    }
  };

  const handleOpenForm = (product: Product | null = null) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Productos</h2>
        <button onClick={() => handleOpenForm()} className="bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-sm text-gray-600 uppercase tracking-wider">Producto</th>
              <th className="text-left p-4 font-medium text-sm text-gray-600 uppercase tracking-wider">Precio</th>
              <th className="text-left p-4 font-medium text-sm text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="text-left p-4 font-medium text-sm text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center p-8 text-gray-500">Cargando productos...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-8 text-gray-500">No hay productos para mostrar.</td></tr>
            ) : products.map((product) => {
              const totalStock = Object.values(product.sizes).reduce((acc, size) => acc + (size.stock || 0), 0);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <span className="font-medium text-gray-800">{product.name}</span>
                  </td>
                  <td className="p-4 text-gray-700">${product.price.toLocaleString('es-AR')}</td>
                  <td className="p-4 text-gray-700">{totalStock} unidades</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenForm(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm 
          product={editingProduct}
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};