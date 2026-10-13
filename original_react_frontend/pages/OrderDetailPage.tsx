import React, { useState } from 'react';
import { ArrowLeft, Truck, Package, XCircle, AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import { OrderStatusBadge } from '../components/order/OrderStatusBadge';
import { OrderTimeline } from '../components/order/OrderTimeline';

interface OrderDetailPageProps {
  order: Order;
  onNavigateBack: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  order,
  onNavigateBack,
  onOrderUpdated,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canCancel = ['PLACED', 'CONFIRMED', 'PROCESSING'].includes(currentOrder.status);

  const handleCancelOrder = async () => {
    setCancelling(true);
    setCancelError(null);

    try {
      const updated = await orderService.cancelOrder(currentOrder.orderNumber);
      setCurrentOrder(updated);
      setConfirmCancel(false);
      onOrderUpdated(updated);
    } catch (err: any) {
      setCancelError(err?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(currentOrder.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <button
            onClick={onNavigateBack}
            className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order History</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-mono font-bold text-xl sm:text-2xl text-neutral-900">
              #{currentOrder.orderNumber}
            </h1>
            <button onClick={copyOrderNumber} className="text-neutral-400 hover:text-neutral-700">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Placed on {new Date(currentOrder.createdAt).toLocaleDateString()} at {new Date(currentOrder.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <OrderStatusBadge status={currentOrder.status} />
          {canCancel && !confirmCancel && (
            <button
              onClick={() => setConfirmCancel(true)}
              className="py-1.5 px-3 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded transition-colors"
            >
              Cancel Order
            </button>
          )}
          {confirmCancel && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="py-1.5 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="py-1.5 px-2.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded"
              >
                Keep
              </button>
            </div>
          )}
        </div>
      </div>

      {cancelError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cancelError}</span>
        </div>
      )}

      {/* Timeline tracker */}
      <OrderTimeline
        currentStatus={currentOrder.status}
        createdAt={currentOrder.createdAt}
        trackingNumber={currentOrder.trackingNumber}
      />

      {/* Order Line Items */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
          Purchased Apparel ({currentOrder.items.length})
        </h2>

        <div className="divide-y divide-neutral-100">
          {currentOrder.items.map((item) => (
            <div key={item.id} className="py-4 flex gap-4">
              <div className="w-18 sm:w-20 aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-900">{item.productName}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                    <span>Size: <strong className="text-neutral-800">{item.selectedSize}</strong></span>
                    <span>·</span>
                    <span>Color: <strong className="text-neutral-800">{item.selectedColor}</strong></span>
                    <span>·</span>
                    <span>Qty: <strong className="text-neutral-800">{item.quantity}</strong></span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs font-mono text-neutral-400">${item.unitPrice.toFixed(2)} each</span>
                  <span className="text-xs font-bold font-mono text-neutral-900 tabular-nums">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-neutral-100 text-xs">
          <div>
            <h4 className="font-mono uppercase font-semibold text-neutral-500 text-[11px] mb-2">
              Shipping Address
            </h4>
            <p className="font-semibold text-neutral-900">{currentOrder.shippingAddress.fullName}</p>
            <p className="text-neutral-600 mt-0.5">
              {currentOrder.shippingAddress.streetAddress}{currentOrder.shippingAddress.apartment ? `, ${currentOrder.shippingAddress.apartment}` : ''}
            </p>
            <p className="text-neutral-600">
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}, {currentOrder.shippingAddress.country}
            </p>
            <p className="text-neutral-500 mt-1">Phone: {currentOrder.shippingAddress.phone}</p>
          </div>

          <div className="space-y-2 text-neutral-600 self-end">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-mono tabular-nums text-neutral-900">${currentOrder.subtotal.toFixed(2)}</span>
            </div>
            {currentOrder.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-mono tabular-nums">-${currentOrder.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-mono tabular-nums text-neutral-900">
                {currentOrder.deliveryCharge === 0 ? 'FREE' : `$${currentOrder.deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums">${currentOrder.totalAmount.toFixed(2)}</span>
            </div>
            <div className="pt-1 text-[11px] text-neutral-500 font-mono text-right space-y-0.5">
              <div>Payment: {currentOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay Gateway'} ({currentOrder.paymentStatus})</div>
              {currentOrder.razorpayPaymentId && (
                <div className="text-emerald-700">Razorpay ID: {currentOrder.razorpayPaymentId}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
