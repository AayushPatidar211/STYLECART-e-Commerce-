import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Product, Category, ProductFilterState } from '../types';
import { productService, PaginatedResponse } from '../services/productService';
import { adminService } from '../services/adminService';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterSidebar } from '../components/product/FilterSidebar';

interface ProductsPageProps {
  initialCategory?: string;
  initialSort?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';
  initialMaxPrice?: number;
  initialKeyword?: string;
  onSelectProduct: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialCategory,
  initialSort = 'newest',
  initialMaxPrice,
  initialKeyword,
  onSelectProduct,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Product>>({
    content: [],
    totalElements: 0,
    totalPages: 1,
    size: 12,
    number: 0,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<ProductFilterState>({
    categoryName: initialCategory,
    sortBy: initialSort,
    maxPrice: initialMaxPrice,
    keyword: initialKeyword,
    page: 0,
    sizePerPage: 12,
  });

  // Sync initial props if changed
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryName: initialCategory,
      sortBy: initialSort || prev.sortBy,
      maxPrice: initialMaxPrice ?? prev.maxPrice,
      keyword: initialKeyword ?? prev.keyword,
      page: 0,
    }));
  }, [initialCategory, initialSort, initialMaxPrice, initialKeyword]);

  useEffect(() => {
    const fetchMetadata = async () => {
      const [cats, bList] = await Promise.all([
        adminService.getCategories(),
        productService.getBrands(),
      ]);
      setCategories(cats);
      setBrands(bList);
    };
    fetchMetadata();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(filters);
      setPaginatedData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 0,
      sizePerPage: 12,
      sortBy: 'newest',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Sort Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            {filters.categoryName ? `${filters.categoryName}'s Apparel` : filters.keyword ? `Search: "${filters.keyword}"` : 'All Apparel & Footwear'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Showing <strong className="text-neutral-900 font-mono tabular-nums">{paginatedData.totalElements}</strong> crafted pieces
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 text-neutral-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-500 hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) =>
                handleFilterChange({
                  sortBy: e.target.value as any,
                  page: 0,
                })
              }
              className="bg-white border border-neutral-300 rounded-lg py-2 px-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <div
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col p-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <span className="font-semibold text-sm">Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <FilterSidebar
                categories={categories}
                brands={brands}
                filters={filters}
                onFilterChange={(newF) => {
                  handleFilterChange(newF);
                }}
                onReset={handleResetFilters}
              />
              <div className="pt-4 border-t border-neutral-200 mt-4">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Apply Filters ({paginatedData.totalElements})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid & Pagination */}
        <div className="flex-1 space-y-8">
          <ProductGrid
            products={paginatedData.content}
            isLoading={loading}
            onSelectProduct={onSelectProduct}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Controls */}
          {paginatedData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-neutral-200 text-xs">
              <button
                disabled={filters.page === 0}
                onClick={() => handleFilterChange({ page: Math.max(0, (filters.page || 0) - 1) })}
                className="p-2 border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: paginatedData.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleFilterChange({ page: i })}
                  className={`w-8 h-8 rounded font-mono font-medium transition-colors ${
                    filters.page === i
                      ? 'bg-neutral-900 text-white font-bold'
                      : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={paginatedData.last}
                onClick={() => handleFilterChange({ page: (filters.page || 0) + 1 })}
                className="p-2 border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
