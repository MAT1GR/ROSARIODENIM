import React, { useState, FormEvent } from 'react';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: any) => void;
  isSaving: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
    description: product?.description || '',
    material: product?.material || '',
    rise: product?.rise || '',
    fit: product?.fit || '',
    images: product?.images.join('\n') || '',
    isNew: product?.isNew || false,
    isBestSeller: product?.isBestSeller || false,
    sizes: JSON.stringify(product?.sizes || { '36': { available: true, stock: 10, measurements: 'Cintura: 70cm' } }, null, 2)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        images: formData.images.split('\n').filter(url => url.trim() !== ''),
        sizes: JSON.parse(formData.sizes)
      };
      onSave(productData);
    } catch (error) {
      alert("Error en el formato JSON de las tallas. Por favor, asegúrate de que sea un JSON válido.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del Producto" className="w-full p-2 border rounded" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Precio" className="w-full p-2 border rounded" required />
                <input name="category" value={formData.category} onChange={handleChange} placeholder="Categoría" className="w-full p-2 border rounded" required />
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="material" value={formData.material} onChange={handleChange} placeholder="Material" className="w-full p-2 border rounded" />
              <input name="rise" value={formData.rise} onChange={handleChange} placeholder="Tiro" className="w-full p-2 border rounded" />
              <input name="fit" value={formData.fit} onChange={handleChange} placeholder="Calce" className="w-full p-2 border rounded" />
            </div>
            <textarea name="images" value={formData.images} onChange={handleChange} placeholder="URLs de Imágenes (una por línea)" className="w-full p-2 border rounded" rows={3} required />
            <div>
                <label className="font-medium text-sm text-gray-700">Tallas y Stock (Formato JSON):</label>
                <textarea name="sizes" value={formData.sizes} onChange={handleChange} className="w-full p-2 border rounded font-mono text-sm mt-1" rows={5} required />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center"><input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="mr-2 h-4 w-4"/> Es Nuevo</label>
              <label className="flex items-center"><input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="mr-2 h-4 w-4"/> Es Más Vendido</label>
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-6 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#D8A7B1] text-white rounded hover:bg-[#c69ba5] disabled:opacity-50">
                  {isSaving ? 'Guardando...' : 'Guardar Producto'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};