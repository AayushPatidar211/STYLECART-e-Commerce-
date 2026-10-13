import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  ArrowLeft,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onReturnToStore: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onNavigate,
  onReturnToStore,
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'admin-dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'admin-products', label: 'Product Catalog', icon: Package },
    { id: 'admin-product-add', label: 'Add New Product', icon: PlusCircle },
    { id: 'admin-inventory', label: 'Inventory Control', icon: Boxes },
    { id: 'admin-categories', label: 'Categories', icon: FolderTree },
    { id: 'admin-orders', label: 'Order Fulfillment', icon: ShoppingBag },
    { id: 'admin-users', label: 'Customer Accounts', icon: Users },
  ];

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 min-h-screen flex flex-col border-r border-neutral-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-tight">FashionHub</h1>
            <p className="text-[11px] font-mono text-neutral-400">Admin Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-white text-neutral-900 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <button
          onClick={onReturnToStore}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Online Store</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>

        <div className="pt-2 text-[10px] font-mono text-neutral-500 text-center">
          Connected to MySQL 8.0 & Spring Boot
        </div>
      </div>
    </aside>
  );
};
