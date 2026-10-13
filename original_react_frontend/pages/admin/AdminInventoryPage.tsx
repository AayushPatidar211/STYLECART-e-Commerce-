import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, CheckCircle2, Plus, ArrowUpRight, Search } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLowOnly, setFilterLowOnly] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await productService.getProducts({ sizePerPage: 100 });
    setProducts(res.content);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRestock = async (productId: number, addQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const newQty = product.stockQuantity + addQuantity;
    await productService.updateStock(productId, newQty);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newQty } : p))
    );
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesLow = filterLowOnly ? p.stockQuantity < 15 : true;
    return matchesSearch && matchesLow;
  });

  const lowStockCount = products.filter((p) => p.stockQuantity < 15).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-neutral-900">Inventory Stock Controller</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor real-time warehouse stock reserves and execute batch restock operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>{lowStockCount} items below threshold (15 units)</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchandise..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer self-start sm:self-auto">
          <input
            type="checkbox"
            checked={filterLowOnly}
            onChange={(e) => setFilterLowOnly(e.target.checked)}
            className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
          />
          <span>Show Low Stock Only (&lt; 15 units)</span>
        </label>
      </div>

      {/* Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prod) => {
          const isLow = prod.stockQuantity < 15;
          const maxTarget = 60;
          const percent = Math.min(100, Math.round((prod.stockQuantity / maxTarget) * 100));

          return (
            <div
              key={prod.id}
              className={`bg-white border rounded-xl p-5 shadow-2xs space-y-4 ${
                isLow ? 'border-amber-300 ring-1 ring-amber-100' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-semibold text-neutral-400">
                      {prod.brand}
                    </span>
                    {isLow && (
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                        LOW STOCK
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold text-neutral-900 truncate">{prod.name}</h3>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    Category: {prod.categoryName}
                  </p>
                </div>
              </div>

              {/* Stock Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-500">Available Reserve:</span>
                  <span className={`font-bold ${isLow ? 'text-amber-700' : 'text-neutral-900'}`}>
                    {prod.stockQuantity} units
                  </span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isLow ? 'bg-amber-500' : 'bg-neutral-900'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Quick Restock Action Buttons */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">Restock +</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRestock(prod.id, 10)}
                    className="px-2.5 py-1 text-xs font-mono font-semibold bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded transition-colors"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => handleRestock(prod.id, 25)}
                    className="px-2.5 py-1 text-xs font-mono font-semibold bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded transition-colors"
                  >
                    +25
                  </button>
                  <button
                    onClick={() => handleRestock(prod.id, 50)}
                    className="px-2.5 py-1 text-xs font-mono font-semibold bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded transition-colors"
                  >
                    +50
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
