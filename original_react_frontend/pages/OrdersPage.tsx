import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, Clock, Eye, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';
import { OrderStatusBadge } from '../components/order/OrderStatusBadge';

interface OrdersPageProps {
  onSelectOrder: (order: Order) => void;
  onContinueShopping: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onSelectOrder,
  onContinueShopping,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    orderService.getMyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ACTIVE') {
      return ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status);
    }
    if (statusFilter === 'DELIVERED') return o.status === 'DELIVERED';
    if (statusFilter === 'CANCELLED') return o.status === 'CANCELLED';
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-neutral-500 font-mono">
        Loading orders from Spring Boot database...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">Order History</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track fulfillment, download receipts, and manage your fashion purchases.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-medium">
          {(['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === tab ? 'bg-white text-neutral-900 shadow-sm font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Package className="w-7 h-7 stroke-1" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">No Orders Found</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
              You do not have any orders under the "{statusFilter.toLowerCase()}" filter.
            </p>
          </div>
          <button
            onClick={onContinueShopping}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 hover:border-neutral-300 transition-all space-y-4"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                      Order Number
                    </span>
                    <h3 className="font-mono font-bold text-sm text-neutral-900">{order.orderNumber}</h3>
                  </div>
                  {order.trackingNumber && (
                    <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded">
                      {order.trackingNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-xs font-mono text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200"
                      title={`${item.productName} (Qty ${item.quantity})`}
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ))}
                  <div className="text-xs text-neutral-500 pl-2">
                    <p className="font-semibold text-neutral-900">{order.items.length} apparel piece(s)</p>
                    <p className="text-[11px] text-neutral-400">Delivered to {order.shippingAddress.city}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-mono uppercase text-neutral-400">Total</span>
                    <p className="font-mono font-bold text-sm text-neutral-900 tabular-nums">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectOrder(order)}
                    className="py-2 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded transition-colors flex items-center gap-1.5"
                  >
                    <span>View Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
