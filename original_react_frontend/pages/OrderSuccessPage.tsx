import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, Home, Printer, Copy, Check } from 'lucide-react';
import { Order } from '../types';
import { OrderTimeline } from '../components/order/OrderTimeline';

interface OrderSuccessPageProps {
  order: Order;
  onNavigateToOrders: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onNavigateToOrders,
  onContinueShopping,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in">
      {/* Success Hero Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-emerald-700 font-semibold">
            Order Confirmed & Preparing Shipment
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 mt-1">
            Thank You For Your Purchase
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-2">
            A confirmation receipt has been sent to <strong className="text-neutral-900">{order.userEmail}</strong>. Your garment order is now in preparation at our fulfillment center.
          </p>
        </div>

        {/* Order Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 bg-neutral-100 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-neutral-800">
            <span>Order #{order.orderNumber}</span>
            <button onClick={copyOrderNumber} className="text-neutral-500 hover:text-neutral-900">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {order.razorpayPaymentId && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay ID: {order.razorpayPaymentId}</span>
            </div>
          )}
          {order.trackingNumber && (
            <div className="inline-flex items-center gap-2 bg-neutral-100 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-neutral-800">
              <Truck className="w-3.5 h-3.5 text-neutral-600" />
              <span>Tracking: {order.trackingNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Step by step timeline */}
      <OrderTimeline
        currentStatus={order.status}
        createdAt={order.createdAt}
        trackingNumber={order.trackingNumber}
      />

      {/* Order Items & Breakdown Receipt */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <h2 className="font-serif text-lg font-bold text-neutral-900">Order Summary & Receipt</h2>
          <span className="text-xs font-mono text-neutral-600">
            Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay Gateway (Captured)'}
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex gap-4">
              <div className="w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900">{item.productName}</h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Size: {item.selectedSize} · Color: {item.selectedColor} · Qty: {item.quantity}
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-mono">${item.unitPrice.toFixed(2)} each</span>
                  <span className="font-mono font-bold text-neutral-900 tabular-nums">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100 text-xs">
          <div>
            <h4 className="font-mono uppercase font-semibold text-neutral-500 text-[11px] mb-1.5">
              Delivery Destination
            </h4>
            <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
            <p className="text-neutral-600 mt-0.5">
              {order.shippingAddress.streetAddress}{order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ''}
            </p>
            <p className="text-neutral-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <p className="text-neutral-500 mt-1">{order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-1.5 text-neutral-600 self-end">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-neutral-900">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-mono tabular-nums">-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-mono tabular-nums text-neutral-900">
                {order.deliveryCharge === 0 ? 'FREE' : `$${order.deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <button
          onClick={onNavigateToOrders}
          className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span>View All My Orders</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
