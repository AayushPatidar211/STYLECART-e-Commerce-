import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images?.[0] || '';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const size = product.availableSizes[0] || 'M';
    const color = product.availableColors[0] || 'Standard';
    await addItem(product, size, color, 1);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-neutral-200/80 hover:border-neutral-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image Container: 70% height */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {/* Discount or Stock Tag - Text label, not candy pill badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 text-[11px] font-mono tracking-wider">
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="bg-neutral-900 text-white px-2 py-0.5 font-medium rounded-sm">
              -{product.discountPercentage}%
            </span>
          ) : null}
          {product.stockQuantity > 0 && product.stockQuantity <= 5 ? (
            <span className="bg-amber-600 text-white px-2 py-0.5 font-medium rounded-sm">
              Only {product.stockQuantity} Left
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 shadow'
              : 'bg-white/80 backdrop-blur-sm text-neutral-700 hover:bg-white hover:text-neutral-900 shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Product Image with Fallback */}
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
            <ShoppingBag className="w-10 h-10 mb-2 stroke-1" />
            <span className="text-xs font-serif text-neutral-600 text-center">{product.name}</span>
          </div>
        ) : (
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 text-xs font-medium text-neutral-900 bg-white hover:bg-neutral-100 rounded shadow-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-2 text-white hover:text-neutral-200 bg-neutral-900/80 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          {/* Brand & Category in muted text */}
          <div className="flex items-center justify-between text-xs text-neutral-500 tracking-wider">
            <span className="uppercase text-[11px] font-semibold text-neutral-500">{product.brand}</span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-600">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* Price Baseline */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-neutral-100">
          <span className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
            ${(product.discountPrice || product.price).toFixed(2)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
