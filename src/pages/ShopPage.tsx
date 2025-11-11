import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard'; // Importar el nuevo componente
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'newest' as SortOption,
    page: 1,
  });

  const productsRef = useScrollAnimation();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(filters.page),
        sortBy: filters.sortBy,
      });
      if (filters.category) {
        params.append('category', filters.category);
      }

      try {
        // Simular un poco de retraso para ver el skeleton
        await new Promise(res => setTimeout(res, 500)); 
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const categories = ['Mom Jeans', 'Wide Leg', 'Flare', 'Straight'];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filtros</h2>
              </div>
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <h3 className="font-medium mb-3">ESTILO</h3>
                  <div className="space-y-2">
                    <button onClick={() => handleFilterChange('category', '')} className={`w-full text-left text-sm p-2 rounded ${!filters.category ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}>Todos</button>
                    {categories.map(category => (
                      <button key={category} onClick={() => handleFilterChange('category', category)} className={`w-full text-left text-sm p-2 rounded ${filters.category === category ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}>{category}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main ref={productsRef} className="lg:w-3/4 scroll-animate">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2 text-gray-600 border rounded-md flex items-center gap-2">
                  <Filter size={20} />
                  <span>Filtros</span>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold">Tienda ({totalProducts} productos)</h1>
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-auto"
              >
                <option value="newest">Novedades</option>
                <option value="popular">Más Populares</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            ) : (
                <div className="text-center py-16"><p className="text-xl text-gray-600">No se encontraron productos con esos filtros.</p></div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-4">
                    <button onClick={() => handleFilterChange('page', filters.page - 1)} disabled={filters.page <= 1} className="p-2 disabled:opacity-50"><ChevronLeft/></button>
                    <span className="text-sm font-medium">Página {filters.page} de {totalPages}</span>
                    <button onClick={() => handleFilterChange('page', filters.page + 1)} disabled={filters.page >= totalPages} className="p-2 disabled:opacity-50"><ChevronRight/></button>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
