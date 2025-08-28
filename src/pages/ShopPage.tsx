import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

const ShopPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const sizes = Array.from(new Set(products.flatMap(p => Object.keys(p.sizes))));
  
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      
      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some(size => product.sizes[size]?.available);
        if (!hasSize) return false;
      }
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      return true;
    });
    
    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }
    
    return filtered;
  }, [selectedCategories, selectedSizes, priceRange, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6 lg:mb-4">
                <h2 className="text-xl font-bold">Filtros</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-600"
                >
                  <Filter size={20} />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h3 className="font-medium mb-3">ESTILO</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="mr-3 rounded border-gray-300 text-[#D8A7B1] focus:ring-[#D8A7B1]"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h3 className="font-medium mb-3">TALLE</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.sort().map(size => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`p-2 text-sm border rounded transition-colors ${
                          selectedSizes.includes(size)
                            ? 'border-[#D8A7B1] bg-[#D8A7B1] text-white'
                            : 'border-gray-300 text-gray-700 hover:border-[#D8A7B1]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">RANGO DE PRECIO</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-[#D8A7B1]"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Tienda ({filteredAndSortedProducts.length} productos)
              </h1>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D8A7B1]"
              >
                <option value="newest">Novedades</option>
                <option value="popular">Más Populares</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">No se encontraron productos</p>
                <p className="text-gray-500">Intenta ajustar los filtros</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;