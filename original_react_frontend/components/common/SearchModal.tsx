import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productService.getProducts({ keyword: query, sizePerPage: 6 });
        setResults(res.content);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onViewAllResults(query.trim());
      onClose();
    }
  };

  const trendingQueries = ['Trench Coat', 'Denim', 'Hoodie', 'Merino Wool', 'Leather Boots', 'Silk Dress'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-neutral-200">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-neutral-200 px-4 py-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clothing by name, brand, category, or style..."
            className="w-full pl-3 pr-8 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-700 text-xs font-mono"
            >
              ESC
            </button>
          )}
        </form>

        {/* Results or Trending */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-4 py-2">
              <p className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {trendingQueries.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      onViewAllResults(term);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-colors font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : isSearching ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              Searching Spring Boot catalog...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Matching apparel ({results.length})</span>
                <button
                  onClick={() => {
                    onViewAllResults(query);
                    onClose();
                  }}
                  className="text-neutral-900 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View All in Catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="py-2.5 flex items-center gap-3.5 hover:bg-neutral-50 rounded-lg px-2 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-14 bg-neutral-100 rounded overflow-hidden shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                        {product.brand} · {product.categoryName}
                      </span>
                      <h4 className="text-xs font-semibold text-neutral-900 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-neutral-900 font-mono tabular-nums">
                          ${(product.discountPrice || product.price).toFixed(2)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[11px] text-neutral-400 line-through font-mono tabular-nums">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-mono shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-neutral-500">
              No products found for "{query}". Try checking for spelling or broad categories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
