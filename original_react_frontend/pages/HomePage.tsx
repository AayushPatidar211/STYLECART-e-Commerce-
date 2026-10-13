import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { ProductCard } from '../components/product/ProductCard';

interface HomePageProps {
  onNavigate: (view: string, payload?: any) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featured, arrivals, cats] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getNewArrivals(),
          adminService.getCategories(),
        ]);
        setFeaturedProducts(featured.slice(0, 4));
        setNewArrivals(arrivals.slice(0, 4));
        setCategories(cats.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
            alt="Fashion Editorial Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold border-b border-neutral-700 pb-1">
              Spring / Summer 2026 Collection
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Define Your Style
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-xl">
              Discover the latest fashion trends at StyleCart. Meticulously tailored jackets, architectural knitwear, and fluid evening dresses crafted for effortless elegance.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('category', 'Men')}
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-white hover:bg-neutral-100 rounded transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Shop Men</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('category', 'Women')}
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-transparent border border-white hover:bg-white/10 rounded transition-colors flex items-center gap-2"
              >
                <span>Shop Women</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              Explore Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Shop by Department
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1.5"
          >
            <span>Browse Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('category', cat.name)}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-neutral-100 cursor-pointer border border-neutral-200/80 shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-serif text-base font-bold">{cat.name}</h3>
                <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">{cat.description}</p>
                <div className="flex items-center gap-1 text-[11px] font-medium text-white/90 mt-2 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              Top Rated Apparel
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Featured Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products', { sortBy: 'popularity' })}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1.5"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 4. Special Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded-2xl overflow-hidden relative p-8 sm:p-14 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg z-10 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Limited Mid-Season Event</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              Flat 40% OFF on Selected Styles
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Use promo code <strong className="text-white font-mono bg-neutral-800 px-2 py-0.5 rounded">STYLE40</strong> at checkout on premium denim, tailored trousers, and silk dresses.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('products', { maxPrice: 100 })}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-white hover:bg-neutral-100 rounded transition-colors shadow-md"
              >
                Shop Sale Collection
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
              alt="Special Offer Lookbook"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              Fresh Off The Atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products', { sortBy: 'newest' })}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1.5"
          >
            <span>View All New Drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 6. Brand Trust & Customer Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-neutral-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <Truck className="w-5 h-5 stroke-1" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">Complimentary Delivery</h3>
              <p className="text-xs text-neutral-500 mt-1">Free standard shipping on all orders exceeding $50.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <RotateCcw className="w-5 h-5 stroke-1" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">30-Day Easy Returns</h3>
              <p className="text-xs text-neutral-500 mt-1">Hassle-free exchanges or full refunds on unworn garments.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-1" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">Secure Payments</h3>
              <p className="text-xs text-neutral-500 mt-1">Encrypted card payments, UPI & Cash on Delivery options.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <Clock className="w-5 h-5 stroke-1" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">Ethical Sourcing</h3>
              <p className="text-xs text-neutral-500 mt-1">Organic Supima cottons & certified non-mulesed wool.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
