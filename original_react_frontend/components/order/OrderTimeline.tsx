import React from 'react';
import { OrderStatus } from '../../types';
import { Check, Clock, Package, Truck, Home, XCircle } from 'lucide-react';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  currentStatus,
  createdAt,
  trackingNumber,
}) => {
  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'PLACED', label: 'Order Placed', icon: Clock },
    { status: 'CONFIRMED', label: 'Confirmed', icon: Check },
    { status: 'PROCESSING', label: 'Packaging', icon: Package },
    { status: 'SHIPPED', label: 'Dispatched', icon: Truck },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center gap-3 text-rose-800">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold">Order Cancelled</h4>
          <p className="text-xs text-rose-600 mt-0.5">
            This order has been cancelled and items were restored to store inventory.
          </p>
        </div>
      </div>
    );
  }

  const statusOrder: OrderStatus[] = [
    'PLACED',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-2">
        <div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Estimated Delivery</span>
          <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Within 3-5 Business Days</h4>
        </div>
        {trackingNumber && (
          <div className="text-right">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Tracking Number</span>
            <p className="text-xs font-mono font-semibold text-neutral-900 mt-0.5">{trackingNumber}</p>
          </div>
        )}
      </div>

      {/* Horizontal Steps */}
      <div className="pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-neutral-900 text-white ring-4 ring-neutral-200 scale-110 shadow-sm'
                      : isCompleted
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs mt-2.5 font-medium ${
                    isCurrent ? 'text-neutral-900 font-bold' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </span>
                {idx === 0 && (
                  <span className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
