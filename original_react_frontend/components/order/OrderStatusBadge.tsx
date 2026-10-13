import React from 'react';
import { OrderStatus } from '../../types';
import { CheckCircle2, Clock, Package, Truck, XCircle, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, showIcon = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PLACED':
        return {
          label: 'Order Placed',
          className: 'bg-neutral-100 text-neutral-800 border-neutral-300',
          icon: <Clock className="w-3.5 h-3.5 text-neutral-600" />,
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          className: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'PROCESSING':
        return {
          label: 'Processing',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Package className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'SHIPPED':
        return {
          label: 'Shipped',
          className: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: <Truck className="w-3.5 h-3.5 text-purple-600" />,
        };
      case 'OUT_FOR_DELIVERY':
        return {
          label: 'Out for Delivery',
          className: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: <Truck className="w-3.5 h-3.5 text-indigo-600" />,
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
        };
      default:
        return {
          label: status,
          className: 'bg-neutral-100 text-neutral-800 border-neutral-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-neutral-600" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${config.className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
