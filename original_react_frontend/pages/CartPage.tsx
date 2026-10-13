import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigateToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateToCheckout,
  onContinueShopping,
}) => {
  const { cart, updateQuantity, removeItem, clearCart, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ msg: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponStatus({ msg: res.message, isError: !res.valid });
  };

  const freeThreshold = 50.0;
  const remaining = Math.max(0, freeThreshold - cart.subtotal);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-neutral-900">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          Explore our seasonal curation and discover timeless tailored pieces for your wardrobe.
        </p>
        <div className="pt-2">
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors"
          >
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">Shopping Bag</h1>
          <p className="text-xs text-neutral-500 mt-1">
            <strong className="text-neutral-900 font-mono">{cart.totalItems}</strong> items selected
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Shopping Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Item List: 8 Cols */}
        <div className="lg:col-span-8 divide-y divide-neutral-200">
          {cart.items.map((item) => (
            <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-5">
              <div className="w-24 sm:w-28 aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                      {item.brand}
                    </span>
                    <span className="font-mono font-bold text-base text-neutral-900 tabular-nums">
                      ${item.itemTotal.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900">{item.productName}</h3>
                  <div className="text-xs text-neutral-500 flex items-center gap-3 pt-1">
                    <span>Size: <strong className="text-neutral-800">{item.selectedSize}</strong></span>
                    <span>·</span>
                    <span>Color: <strong className="text-neutral-800">{item.selectedColor}</strong></span>
                    <span>·</span>
                    <span>Price: <strong className="font-mono">${item.unitPrice.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center border border-neutral-300 rounded overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-neutral-100 text-neutral-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-neutral-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="p-1.5 hover:bg-neutral-100 text-neutral-600 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary: 4 Cols */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Order Summary
            </h2>

            {/* Delivery Alert */}
            <div className="bg-neutral-50 p-3 rounded-lg text-xs flex items-center gap-2 text-neutral-700">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              {remaining > 0 ? (
                <span>Add <strong className="font-mono">${remaining.toFixed(2)}</strong> more for free delivery</span>
              ) : (
                <span className="text-emerald-700 font-semibold">Free delivery unlocked</span>
              )}
            </div>

            {/* Coupon Code */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code (STYLE40)"
                  className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded uppercase font-mono tracking-wider focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponStatus && (
                <p className={`text-[11px] ${couponStatus.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {couponStatus.msg}
                </p>
              )}
            </form>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900 font-medium">${cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Special Discount</span>
                  <span className="font-mono tabular-nums">-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span className="font-mono tabular-nums text-neutral-900 font-medium">
                  {cart.deliveryCharge === 0 ? 'FREE' : `$${cart.deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums">${cart.finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToCheckout}
              className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
