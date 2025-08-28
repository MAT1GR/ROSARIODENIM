import React, { useState } from 'react';
import { 
  Package, Users, ShoppingCart, Settings, Plus, Edit, Trash2, 
  BarChart3, Tag, Palette, Globe, Mail, CreditCard, Truck,
  FileText, Image, Code, LogOut, Save, Eye, EyeOff
} from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/AdminLogin';

const AdminPage: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [siteSettings, setSiteSettings] = useState({
    site_name: 'Rosario Denim',
    hero_title: 'Jeans anchos que sí te quedan bien',
    hero_subtitle: 'Hechos para durar',
    hero_button_text: 'DESCUBRIR AHORA',
    primary_color: '#D8A7B1',
    secondary_color: '#F5F5F5',
    contact_email: 'hola@rosariodenim.com',
    contact_phone: '+54 9 341 XXX-XXXX',
    shipping_cost: '1500',
    free_shipping_threshold: '25000',
    newsletter_discount: '10'
  });

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'coupons', label: 'Cupones', icon: CreditCard },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'content', label: 'Contenido', icon: FileText },
    { id: 'shipping', label: 'Envíos', icon: Truck },
    { id: 'integrations', label: 'Integraciones', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const ProductForm = ({ product, onClose }: { product?: Product; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              defaultValue={product?.name}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              placeholder="Ej: Mom Jean Vintage Blue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <input
                type="number"
                defaultValue={product?.price}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
                placeholder="18900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                defaultValue={product?.category}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Mom Jeans">Mom Jeans</option>
                <option value="Wide Leg">Wide Leg</option>
                <option value="Flare">Flare</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              defaultValue={product?.description}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <input
                type="text"
                defaultValue={product?.material}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
                placeholder="100% Algodón Denim"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiro
              </label>
              <input
                type="text"
                defaultValue={product?.rise}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
                placeholder="Tiro Alto (28cm)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calce
              </label>
              <input
                type="text"
                defaultValue={product?.fit}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
                placeholder="Calce Mom - Amplio"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URLs de Imágenes (una por línea)
            </label>
            <textarea
              defaultValue={product?.images.join('\n')}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              placeholder="https://example.com/imagen1.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D8A7B1] text-white rounded-lg hover:bg-[#c69ba5]"
            >
              {product ? 'Actualizar' : 'Crear'} Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="text-sm text-gray-600">
          Bienvenido, {user?.username}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="text-[#D8A7B1]" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos Hoy</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <ShoppingCart className="text-[#D8A7B1]" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas del Mes</p>
              <p className="text-2xl font-bold text-gray-900">$0</p>
            </div>
            <BarChart3 className="text-[#D8A7B1]" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Users className="text-[#D8A7B1]" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium mb-4">Productos Más Vendidos</h3>
          <div className="space-y-3">
            {products.filter(p => p.isBestSeller).map(product => (
              <div key={product.id} className="flex items-center gap-3">
                <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-600">${product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium mb-4">Actividad Reciente</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Sistema iniciado correctamente</p>
            <p>• Base de datos SQLite conectada</p>
            <p>• {products.length} productos cargados</p>
            <p>• Panel de administración listo</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categorías</h2>
        <button className="bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium">Nombre</th>
              <th className="text-left p-4 font-medium">Slug</th>
              <th className="text-left p-4 font-medium">Productos</th>
              <th className="text-left p-4 font-medium">Estado</th>
              <th className="text-left p-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {['Mom Jeans', 'Wide Leg', 'Flare', 'Straight'].map((category, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{category}</td>
                <td className="p-4 text-gray-600">{category.toLowerCase().replace(' ', '-')}</td>
                <td className="p-4">{products.filter(p => p.category === category).length}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Activa
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cupones de Descuento</h2>
        <button className="bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Nuevo Cupón
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">Crea tu primer cupón de descuento</p>
            <button className="bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-4 py-2 rounded-lg">
              Crear Cupón
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Personalización de Apariencia</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Colores de la Marca</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Principal
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={siteSettings.primary_color}
                  onChange={(e) => setSiteSettings({...siteSettings, primary_color: e.target.value})}
                  className="w-12 h-12 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={siteSettings.primary_color}
                  onChange={(e) => setSiteSettings({...siteSettings, primary_color: e.target.value})}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Secundario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={siteSettings.secondary_color}
                  onChange={(e) => setSiteSettings({...siteSettings, secondary_color: e.target.value})}
                  className="w-12 h-12 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={siteSettings.secondary_color}
                  onChange={(e) => setSiteSettings({...siteSettings, secondary_color: e.target.value})}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Vista Previa</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div 
              className="w-full h-32 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: siteSettings.primary_color }}
            >
              Botón Principal
            </div>
            <div 
              className="w-full h-16 rounded-lg mt-2 flex items-center justify-center"
              style={{ backgroundColor: siteSettings.secondary_color }}
            >
              Fondo Secundario
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Tipografía</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuente Principal
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]">
              <option>Inter</option>
              <option>Montserrat</option>
              <option>Lato</option>
              <option>Poppins</option>
              <option>Roboto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño Base
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]">
              <option>14px</option>
              <option>16px</option>
              <option>18px</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Contenido</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Página de Inicio</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Principal
            </label>
            <input
              type="text"
              value={siteSettings.hero_title}
              onChange={(e) => setSiteSettings({...siteSettings, hero_title: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtítulo
            </label>
            <input
              type="text"
              value={siteSettings.hero_subtitle}
              onChange={(e) => setSiteSettings({...siteSettings, hero_subtitle: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto del Botón
            </label>
            <input
              type="text"
              value={siteSettings.hero_button_text}
              onChange={(e) => setSiteSettings({...siteSettings, hero_button_text: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Páginas Estáticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Sobre Nosotros',
            'Preguntas Frecuentes',
            'Términos y Condiciones',
            'Política de Privacidad',
            'Cambios y Devoluciones',
            'Guía de Cuidados'
          ].map((page) => (
            <button
              key={page}
              className="p-4 border border-gray-300 rounded-lg text-left hover:border-[#D8A7B1] transition-colors"
            >
              <FileText className="mb-2 text-gray-400" size={24} />
              <p className="font-medium">{page}</p>
              <p className="text-sm text-gray-600">Editar contenido</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShipping = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configuración de Envíos</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Costos de Envío</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo de Envío Estándar
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={siteSettings.shipping_cost}
                onChange={(e) => setSiteSettings({...siteSettings, shipping_cost: e.target.value})}
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Envío Gratis desde
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={siteSettings.free_shipping_threshold}
                onChange={(e) => setSiteSettings({...siteSettings, free_shipping_threshold: e.target.value})}
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Zonas de Envío</h3>
        <div className="space-y-4">
          {[
            { zone: 'CABA', cost: '1200', time: '24-48hs' },
            { zone: 'GBA', cost: '1500', time: '48-72hs' },
            { zone: 'Interior', cost: '2000', time: '3-5 días' }
          ].map((zone, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{zone.zone}</p>
                <p className="text-sm text-gray-600">{zone.time}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">${zone.cost}</span>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Integraciones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Pagos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium">Mercado Pago</p>
                  <p className="text-sm text-gray-600">Configurar credenciales</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#D8A7B1] text-white rounded-lg hover:bg-[#c69ba5]">
                Configurar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Analytics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Pixel ID
              </label>
              <input
                type="text"
                placeholder="123456789012345"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Email Marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descuento Newsletter (%)
            </label>
            <input
              type="number"
              value={siteSettings.newsletter_discount}
              onChange={(e) => setSiteSettings({...siteSettings, newsletter_discount: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor de Email
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]">
              <option>Mailchimp</option>
              <option>ConvertKit</option>
              <option>EmailJS</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics y Reportes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm text-gray-600 mb-2">Visitantes Únicos</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-green-600">+0% vs mes anterior</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm text-gray-600 mb-2">Tasa de Conversión</h3>
          <p className="text-2xl font-bold">0%</p>
          <p className="text-sm text-gray-500">Sin datos</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm text-gray-600 mb-2">Valor Promedio</h3>
          <p className="text-2xl font-bold">$0</p>
          <p className="text-sm text-gray-500">Sin ventas</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm text-gray-600 mb-2">Abandono de Carrito</h3>
          <p className="text-2xl font-bold">0%</p>
          <p className="text-sm text-gray-500">Sin datos</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Productos Más Vistos</h3>
        <div className="space-y-3">
          {products.slice(0, 5).map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">#{index + 1}</span>
                <img src={product.images[0]} alt={product.name} className="w-8 h-8 object-cover rounded" />
                <span className="font-medium">{product.name}</span>
              </div>
              <span className="text-sm text-gray-600">0 vistas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Productos</h2>
        <button
          onClick={() => setShowProductForm(true)}
          className="bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium">Producto</th>
              <th className="text-left p-4 font-medium">Precio</th>
              <th className="text-left p-4 font-medium">Categoría</th>
              <th className="text-left p-4 font-medium">Stock Total</th>
              <th className="text-left p-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const totalStock = Object.values(product.sizes).reduce((acc, size) => acc + size.stock, 0);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex gap-1 mt-1">
                          {product.isNew && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              NUEVO
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              BESTSELLER
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">${product.price.toLocaleString('es-AR')}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      totalStock > 10 ? 'bg-green-100 text-green-800' :
                      totalStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {totalStock} unidades
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pedidos</h2>
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No hay pedidos por el momento</p>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Clientes</h2>
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No hay clientes registrados</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Configuración</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Información de la Tienda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Tienda
            </label>
            <input
              type="text"
              value={siteSettings.site_name}
              onChange={(e) => setSiteSettings({...siteSettings, site_name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Contacto
            </label>
            <input
              type="email"
              value={siteSettings.contact_email}
              onChange={(e) => setSiteSettings({...siteSettings, contact_email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              value={siteSettings.contact_phone}
              onChange={(e) => setSiteSettings({...siteSettings, contact_phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Usuarios Administradores</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">{user?.username}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Super Admin
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Acciones del Sistema</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-[#D8A7B1] text-white rounded-lg hover:bg-[#c69ba5] flex items-center gap-2">
            <Save size={16} />
            Guardar Configuración
          </button>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona tu tienda Rosario Denim</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72">
            <nav className="bg-white rounded-lg shadow-sm p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-[#D8A7B1] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
              
              <div className="border-t mt-4 pt-4">
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">
                  Usuario: {user?.username}
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'customers' && renderCustomers()}
            {activeTab === 'coupons' && renderCoupons()}
            {activeTab === 'appearance' && renderAppearance()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'shipping' && renderShipping()}
            {activeTab === 'integrations' && renderIntegrations()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct || undefined}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;