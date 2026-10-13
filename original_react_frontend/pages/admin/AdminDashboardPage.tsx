import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { DashboardStats, Order } from '../../types';
import { adminService } from '../../services/adminService';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';

interface AdminDashboardPageProps {
  onNavigate: (view: string, payload?: any) => void;
  onSelectOrder: (order: Order) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onSelectOrder,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 text-center text-xs font-mono text-neutral-500">
        Loading analytics metrics from Spring Boot server...
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: '+18.4% vs last mo',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      change: `${stats.pendingOrders} pending fulfillment`,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      label: 'Catalog Items',
      value: stats.totalProducts.toString(),
      icon: Package,
      change: 'Active in catalog',
      color: 'text-neutral-900 bg-neutral-100 border-neutral-200',
    },
    {
      label: 'Low Stock Alerts',
      value: stats.lowStockProducts.toString(),
      icon: AlertTriangle,
      change: '< 15 units remaining',
      color: stats.lowStockProducts > 0 ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-neutral-700 bg-neutral-50 border-neutral-200',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Executive Analytics & Store KPIs
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time business performance queried via Spring Data JPA & MySQL aggregation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin-product-add')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Add New Product</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">{kpi.value}</h3>
                <p className="text-[11px] text-neutral-500 mt-1">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Status Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Trend Visualizer: 8 Cols */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Monthly Revenue Progression (USD)</span>
              </h2>
              <p className="text-xs text-neutral-500">6-Month historical billing aggregation</p>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-4">
            {stats.monthlyRevenue.map((pt) => {
              const maxRev = 18000;
              const heightPct = Math.min(100, Math.round((pt.revenue / maxRev) * 100));
              return (
                <div key={pt.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${pt.revenue}
                  </div>
                  <div
                    className="w-full bg-neutral-900 group-hover:bg-neutral-700 rounded-t transition-all duration-300 relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                      {pt.orders} orders
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-neutral-500 mt-1">{pt.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown: 4 Cols */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
          <h2 className="font-serif text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
            Fulfillment Queue
          </h2>

          <div className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([statusKey, count]) => (
              <div key={statusKey} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-900" />
                  <span className="text-neutral-700 capitalize font-medium">
                    {statusKey.replace(/_/g, ' ').toLowerCase()}
                  </span>
                </div>
                <span className="font-mono font-bold text-neutral-900 tabular-nums bg-neutral-100 px-2 py-0.5 rounded">
                  {count}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <button
              onClick={() => onNavigate('admin-orders')}
              className="w-full py-2 px-3 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage Order Fulfillment</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="font-serif text-base font-bold text-neutral-900">Recent Customer Purchases</h2>
            <p className="text-xs text-neutral-500">Latest orders placed on StyleCart platform</p>
          </div>
          <button
            onClick={() => onNavigate('admin-orders')}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 font-mono uppercase text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Order #</th>
                <th className="py-2.5 px-4 font-semibold">Customer</th>
                <th className="py-2.5 px-4 font-semibold">Items</th>
                <th className="py-2.5 px-4 font-semibold">Total</th>
                <th className="py-2.5 px-4 font-semibold">Payment</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-900">{order.orderNumber}</td>
                  <td className="py-3 px-4 text-neutral-700">
                    <div>{order.userName}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{order.userEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{order.items.length} items</td>
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="text-xs font-semibold text-neutral-900 hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
