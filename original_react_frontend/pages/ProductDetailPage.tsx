import React, { useState, useEffect } from 'react';
import {
  Heart,
  Star,
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onNavigateBack: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigateBack,
  onSelectProduct,
  onNavigateToCheckout,
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.availableColors[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'];

  useEffect(() => {
    // Reset state on product change
    setActiveImageIndex(0);
    setSelectedSize(product.availableSizes[0] || 'M');
    setSelectedColor(product.availableColors[0] || 'Standard');
    setQuantity(1);

    // Fetch related products from same category
    productService
      .getProducts({ categoryId: product.categoryId, sizePerPage: 4 })
      .then((res) => {
        setRelatedProducts(res.content.filter((p) => p.id !== product.id).slice(0, 4));
      });
  }, [product]);

  const handleAddToCart = async () => {
    await addItem(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = async () => {
    await addItem(product, selectedSize, selectedColor, quantity);
    onNavigateToCheckout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
        <button onClick={onNavigateBack} className="hover:text-neutral-900 transition-colors">
          Catalog
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-600">{product.categoryName || 'Apparel'}</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Module (PDP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column: 7 Cols */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-neutral-900 ring-2 ring-neutral-200' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Large Primary Viewport */}
          <div className="flex-1 aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200/80 relative">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <span className="absolute top-4 left-4 bg-neutral-900 text-white text-xs font-mono font-medium px-2.5 py-1 rounded">
                -{product.discountPercentage}% OFF
              </span>
            ) : null}
          </div>
        </div>

        {/* Purchase Info Module: 5 Cols */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Reviews */}
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase font-mono font-semibold tracking-wider text-neutral-500">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 text-neutral-600 font-mono">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <span className="font-semibold text-neutral-900">{product.rating.toFixed(1)}</span>
                <span className="text-neutral-400">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                ${(product.discountPrice || product.price).toFixed(2)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-sm font-mono text-neutral-400 line-through tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ${(product.price - product.discountPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Short editorial description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900 uppercase font-mono tracking-wider">
                  Select Size
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 underline underline-offset-2"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 py-2 px-3 text-xs font-mono font-medium rounded border transition-colors ${
                      selectedSize === size
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-neutral-900 uppercase font-mono tracking-wider">
                Color: <strong className="text-neutral-700">{selectedColor}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                      selectedColor === color
                        ? 'border-neutral-900 bg-neutral-100 font-semibold text-neutral-900'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Stock Status */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900 uppercase font-mono tracking-wider">Quantity</span>
                <span className="text-[11px] font-mono text-emerald-600 font-medium">
                  {product.stockQuantity > 10 ? 'In Stock (Ready to Ship)' : `Only ${product.stockQuantity} items left`}
                </span>
              </div>

              <div className="flex items-center border border-neutral-300 rounded w-32 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-neutral-100 text-neutral-600"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center text-xs font-mono font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                  className="p-2 hover:bg-neutral-100 text-neutral-600 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart, Buy Now, Wishlist */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-white rounded transition-colors flex items-center justify-center gap-2 shadow-sm ${
                    addedAnimation ? 'bg-emerald-700' : 'bg-neutral-900 hover:bg-neutral-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedAnimation ? 'Added to Bag!' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded border transition-colors flex items-center justify-center ${
                    inWishlist
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
              >
                Instant Buy Now
              </button>
            </div>
          </div>

          {/* Confidence Assurances */}
          <div className="pt-6 border-t border-neutral-100 space-y-2.5 text-xs text-neutral-500">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span>Free standard delivery on orders over $50</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-neutral-700" />
              <span>30-day effortless returns and exchanges</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>100% Authentic designer apparel guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Shipping & Reviews */}
      <div className="pt-8 border-t border-neutral-200">
        <div className="flex border-b border-neutral-200 gap-8 text-sm">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-medium transition-colors ${
              activeTab === 'desc' ? 'border-b-2 border-neutral-900 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Description & Styling
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-medium transition-colors ${
              activeTab === 'specs' ? 'border-b-2 border-neutral-900 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Fabric & Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 font-medium transition-colors ${
              activeTab === 'shipping' ? 'border-b-2 border-neutral-900 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Shipping & Returns
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-medium transition-colors ${
              activeTab === 'reviews' ? 'border-b-2 border-neutral-900 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Customer Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="py-6 text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
          {activeTab === 'desc' && (
            <div className="space-y-3">
              <p>{product.description}</p>
              <p>
                Engineered with architectural proportions that transition seamlessly from daytime city commutes to evening engagements. Wear relaxed with tapered denim or pair with tailored trousers for an elevated profile.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-2 gap-4 border border-neutral-200 rounded-lg p-4 font-mono text-xs">
              <div><span className="text-neutral-400">Material:</span> 100% Certified Organic Fiber</div>
              <div><span className="text-neutral-400">Weave:</span> Custom Compact Loom</div>
              <div><span className="text-neutral-400">Origin:</span> Responsibly Milled</div>
              <div><span className="text-neutral-400">Care:</span> Machine wash cold, dry flat</div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <p>Standard delivery takes 3 to 5 business days. Express next-day dispatch is available at checkout.</p>
              <p>We gladly accept unworn garments with original designer tags attached within 30 days of arrival.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-xs font-semibold text-neutral-900 ml-2">5.0 / 5.0</span>
                </div>
                <p className="text-xs font-medium text-neutral-900">Exceptional silhouette and fabric drape</p>
                <p className="text-xs text-neutral-500">"The quality exceeded my expectations. The seams and finishing feel like Savile Row craftsmanship." — Elena R., Verified Buyer</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-neutral-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-neutral-900">
              You May Also Appreciate
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categoryName={product.categoryName}
      />
    </div>
  );
};
