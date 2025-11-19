import React, { useState, FormEvent, useEffect } from 'react';
import { Product } from '../../types';
import { Plus, Trash2, UploadCloud, Image, Video, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
  isSaving: boolean;
}

interface SizeRow {
  size: string;
  available: boolean;
  stock: number;
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
    waist_flat: (product as any)?.waist_flat || 0,
    hip_flat: (product as any)?.hip_flat || 0,
    length: (product as any)?.length || 0,
    isNew: product?.isNew || false,
    isActive: product?.isActive ?? true,
  });

  const [allImages, setAllImages] = useState<(File | string)[]>(product?.images || []);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const initialSizes = product?.sizes 
    ? Object.entries(product.sizes).map(([size, details]) => ({ size, ...details }))
    : [{ size: '', available: true, stock: 0 }];

  const [sizeRows, setSizeRows] = useState<SizeRow[]>(initialSizes);
  
  useEffect(() => {
    const generatePreviews = () => {
      const urls = allImages.map(img => {
        if (typeof img === 'string') return img;
        return URL.createObjectURL(img);
      });
      setPreviewUrls(urls);
    };
    generatePreviews();

    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [allImages]);
  
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(allImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAllImages(items);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };
  
  const handleSizeChange = (index: number, field: keyof SizeRow, value: string | number | boolean) => {
    const newSizes = [...sizeRows];
    (newSizes[index] as any)[field] = value;
    setSizeRows(newSizes);
  };

  const addSizeRow = () => {
    setSizeRows([...sizeRows, { size: '', available: true, stock: 0 }]);
  };

  const removeSizeRow = (index: number) => {
    setSizeRows(sizeRows.filter((_, i) => i !== index));
  };
  
  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAllImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setAllImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    const sizesAsObject = sizeRows.reduce((acc, row) => {
      if (row.size.trim() !== '') {
        acc[row.size] = {
          available: row.available,
          stock: Number(row.stock),
        };
      }
      return acc;
    }, {} as Omit<Product['sizes'], 'measurements'>);
    data.append('sizes', JSON.stringify(sizesAsObject));

    const existingImagesPaths = allImages.filter(img => typeof img === 'string') as string[];
    const newImageFiles = allImages.filter(img => typeof img !== 'string') as File[];
    
    data.append('existingImages', JSON.stringify(existingImagesPaths));
    newImageFiles.forEach(file => {
      data.append('newImages', file);
    });
    
    onSave(data);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-brand-primary-text">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Sección 1: Información Esencial */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-brand-primary-text mb-4">Información Esencial</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto <span className="text-red-500">*</span></label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Jean Mom Fit Vintage" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción <span className="text-red-500">*</span></label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción detallada del producto." className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" rows={3} required />
              </div>
            </div>
          </div>

          {/* Sección 2: Detalles del Producto */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-brand-primary-text mb-4">Detalles del Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
                  <input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Jeans" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" required />
                </div>
                <div>
                  <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
                  <input id="material" name="material" value={formData.material} onChange={handleChange} placeholder="Ej: Denim Rígido" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" />
                </div>
                <div>
                  <label htmlFor="fit" className="block text-sm font-medium text-gray-700">Calce</label>
                  <input id="fit" name="fit" value={formData.fit} onChange={handleChange} placeholder="Ej: Mom Fit" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" />
                </div>
            </div>
          </div>

          {/* Sección de Medidas */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-brand-primary-text mb-4">Medidas (en cm, de lado a lado)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="waist_flat" className="block text-sm font-medium text-gray-700">Cintura</label>
                <input id="waist_flat" name="waist_flat" type="number" value={formData.waist_flat} onChange={handleChange} placeholder="Ej: 38" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" />
              </div>
              <div>
                <label htmlFor="hip_flat" className="block text-sm font-medium text-gray-700">Cadera</label>
                <input id="hip_flat" name="hip_flat" type="number" value={formData.hip_flat} onChange={handleChange} placeholder="Ej: 50" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" />
              </div>
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700">Largo</label>
                <input id="length" name="length" type="number" value={formData.length} onChange={handleChange} placeholder="Ej: 105" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" />
              </div>
              <div>
                <label htmlFor="rise" className="block text-sm font-medium text-gray-700">Tiro</label>
                <input id="rise" name="rise" value={formData.rise} onChange={handleChange} placeholder="Ej: Alto" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" />
              </div>
            </div>
          </div>

          {/* Sección 3: Precio y Stock */}
          <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-brand-primary-text mb-4">Precio y Stock</h3>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio <span className="text-red-500">*</span></label>
                <input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Ej: 8500" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#D8A7B1] focus:border-[#D8A7B1]" required />
              </div>
              <div className="space-y-2 mt-4 border p-3 rounded-lg bg-white">
                  <h4 className="text-md font-semibold">Tallas Disponibles</h4>
                  {sizeRows.map((row, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center border-b last:border-b-0 pb-2 mb-2">
                          <div className="col-span-4">
                            <label className="sr-only">Talle</label>
                            <input value={row.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} placeholder="Talle (Ej: 40)" className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                          </div>
                          <div className="col-span-4">
                            <label className="sr-only">Stock</label>
                            <input value={row.stock} type="number" onChange={(e) => handleSizeChange(index, 'stock', Number(e.target.value))} placeholder="Stock" className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
                          </div>
                          <label className="col-span-3 flex items-center justify-center text-sm gap-1">
                              <input type="checkbox" checked={row.available} onChange={(e) => handleSizeChange(index, 'available', e.target.checked)} className="h-4 w-4 text-[#D8A7B1] focus:ring-[#D8A7B1] border-gray-300 rounded"/>
                              Disponible
                          </label>
                          <button type="button" onClick={() => removeSizeRow(index)} className="col-span-1 text-red-500 hover:text-red-700 justify-self-end"><Trash2 size={18}/></button>
                      </div>
                  ))}
                  <button type="button" onClick={addSizeRow} className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#D8A7B1] hover:text-[#b98d97] px-3 py-1.5 rounded-md border border-dashed border-[#D8A7B1]/50">
                      <Plus size={16}/> Añadir Talle
                  </button>
              </div>
          </div>

          {/* Sección 4: Multimedia */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-brand-primary-text mb-4">Multimedia</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Image size={16}/> Imágenes <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 border p-3 rounded-lg bg-white">
                <p className="text-xs text-gray-500 mb-2">Arrastra para reordenar. La primera imagen es la principal.</p>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2 mb-4 p-2 border rounded-md min-h-[6rem]">
                        {previewUrls.map((url, index) => (
                          <Draggable key={url} draggableId={url} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative group w-24 h-24">
                                <img src={url} alt={`Previsualización ${index + 1}`} className="w-full h-full object-cover rounded"/>
                                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                <div className="absolute bottom-1 left-1 bg-black/50 text-white rounded-full p-1 cursor-grab active:cursor-grabbing"><GripVertical size={14}/></div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-[#D8A7B1] hover:text-[#b98d97]">
                    <span>Añadir una o más imágenes</span>
                    <input id="file-upload" name="newImages" type="file" multiple className="sr-only" onChange={handleNewImagesChange} />
                  </label>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, WEBP</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sección 5: Visibilidad y Marketing */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-brand-primary-text mb-4">Visibilidad y Marketing</h3>
            <div className="flex flex-col gap-3">
               <label className="flex items-center text-gray-700">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="mr-2 h-4 w-4 text-[#D8A7B1] focus:ring-[#D8A7B1] border-gray-300 rounded"/> 
                Producto Activo (visible en la tienda)
              </label>
              <label className="flex items-center text-gray-700">
                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="mr-2 h-4 w-4 text-[#D8A7B1] focus:ring-[#D8A7B1] border-gray-300 rounded"/> 
                Marcar como "Last Drop" (aparece en Homepage)
              </label>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">Cancelar</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#D8A7B1] text-white rounded-md hover:bg-[#c69ba5] disabled:opacity-50 transition-colors">
                {isSaving ? 'Guardando...' : 'Guardar Producto'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};