import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onContinueShopping: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onContinueShopping,
}) => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <Heart className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-neutral-900">Your Wishlist is Empty</h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          Save items you love by tapping the heart icon on any product in our collections.
        </p>
        <div className="pt-2">
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors"
          >
            Discover Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">My Wishlist</h1>
        <p className="text-xs text-neutral-500 mt-1">
          <strong className="text-neutral-900 font-mono">{wishlist.length}</strong> pieces saved for later
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div
              onClick={() => onSelectProduct(product)}
              className="aspect-[3/4] bg-neutral-100 overflow-hidden relative cursor-pointer"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(product.id);
                }}
                className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-500 hover:text-rose-600 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-500">
                  {product.brand}
                </span>
                <h3
                  onClick={() => onSelectProduct(product)}
                  className="text-xs font-semibold text-neutral-900 line-clamp-1 hover:underline cursor-pointer"
                >
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs font-bold font-mono text-neutral-900 tabular-nums">
                    ${(product.discountPrice || product.price).toFixed(2)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-[11px] text-neutral-400 line-through font-mono tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Move to Cart */}
              <button
                onClick={() => moveToCart(product)}
                className="w-full py-2 px-3 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
