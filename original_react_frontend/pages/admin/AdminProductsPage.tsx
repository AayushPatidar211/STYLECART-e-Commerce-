import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { Product, Category } from '../../types';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';

interface AdminProductsPageProps {
  onAddNew: () => void;
  onEditProduct: (product: Product) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({
  onAddNew,
  onEditProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [prodRes, catList] = await Promise.all([
        productService.getProducts({ sizePerPage: 100 }),
        adminService.getCategories(),
      ]);
      setProducts(prodRes.content);
      setCategories(catList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this product from the public catalog?')) {
      return;
    }
    await productService.deleteProduct(id);
    await fetchCatalog();
  };

  const handleStockUpdate = async (id: number, currentStock: number, delta: number) => {
    const newQty = Math.max(0, currentStock + delta);
    await productService.updateStock(id, newQty);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQuantity: newQty } : p))
    );
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === 'ALL' ||
      p.categoryName?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-neutral-900">Product Catalog Management</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create, edit, adjust stock, and monitor apparel merchandise.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title or brand..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-neutral-500 font-mono">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-neutral-300 rounded-lg py-1.5 px-3 text-xs font-medium text-neutral-900 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 font-mono uppercase text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Stock Quantity</th>
                <th className="py-3 px-4 font-semibold">Sizes</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-neutral-100 rounded overflow-hidden shrink-0 border border-neutral-200">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <span className="text-[10px] uppercase font-mono font-semibold text-neutral-400">
                          {prod.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-neutral-900 truncate">{prod.name}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">ID: #{prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 font-medium">{prod.categoryName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                    ${(prod.discountPrice || prod.price).toFixed(2)}
                    {prod.discountPrice && (
                      <span className="text-[10px] text-neutral-400 block line-through">
                        ${prod.price.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          prod.stockQuantity < 15
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {prod.stockQuantity}
                      </span>
                      <div className="flex items-center border border-neutral-200 rounded">
                        <button
                          onClick={() => handleStockUpdate(prod.id, prod.stockQuantity, -5)}
                          className="px-1.5 py-0.5 text-neutral-600 hover:bg-neutral-100 text-[10px]"
                          title="Deduct 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockUpdate(prod.id, prod.stockQuantity, 10)}
                          className="px-1.5 py-0.5 text-neutral-600 hover:bg-neutral-100 text-[10px] border-l border-neutral-200"
                          title="Add 10"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                    {prod.availableSizes.join(', ')}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-700">
                    ★ {prod.rating.toFixed(1)} ({prod.reviewCount})
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditProduct(prod)}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Deactivate product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
