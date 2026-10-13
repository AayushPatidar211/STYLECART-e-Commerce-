import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Code2,
  LogOut,
  ShieldCheck,
  Package,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  onOpenInspector: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenInspector,
  onOpenSearch,
}) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, quickLogin } = useAuth();
  const { cart, setIsCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Men', view: 'category', payload: 'Men' },
    { label: 'Women', view: 'category', payload: 'Women' },
    { label: 'Kids', view: 'category', payload: 'Kids' },
    { label: 'New Arrivals', view: 'products', payload: { sortBy: 'newest' } },
    { label: 'Sale', view: 'products', payload: { maxPrice: 100 } },
  ];

  const handleNav = (view: string, payload?: any) => {
    onNavigate(view, payload);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Top Notification Banner */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3">
        <span>Spring/Summer 2026 Drops · Free Worldwide Shipping over $50 · Use Code <strong className="underline underline-offset-2">STYLE40</strong> for 40% OFF</span>
        <button
          onClick={onOpenInspector}
          className="hidden md:inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] px-2.5 py-0.5 rounded transition-colors"
        >
          <Code2 className="w-3 h-3 text-emerald-400" />
          <span>Spring Boot Backend Code</span>
        </button>
      </div>

      {/* Main Navigation: 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="text-left font-serif text-2xl font-bold tracking-tight text-neutral-900 hover:opacity-90 transition-opacity shrink-0"
          >
            FashionHub
          </button>

          {/* Zone 2: 4-6 text links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.view, link.payload)}
                className={`transition-colors py-1 hover:text-neutral-900 cursor-pointer ${
                  currentView === link.view ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions & Affordances */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Search clothing"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNav('wishlist')}
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="View wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-neutral-900 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Open shopping bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-neutral-900 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-xs font-medium text-neutral-800 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:inline-block max-w-[90px] truncate">{user?.firstName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs text-neutral-500">Signed in as</p>
                        <p className="text-sm font-semibold text-neutral-900 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                          {user?.role === 'ROLE_ADMIN' ? 'Store Administrator' : 'Customer Account'}
                        </span>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => handleNav('admin-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleNav('orders')}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-neutral-400" />
                        <span>My Orders</span>
                      </button>

                      <button
                        onClick={() => handleNav('profile')}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-neutral-400" />
                        <span>Profile & Address</span>
                      </button>

                      <button
                        onClick={() => {
                          quickLogin(user?.role === 'ROLE_ADMIN' ? 'user' : 'admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 border-t border-neutral-100"
                      >
                        <Layers className="w-4 h-4 text-neutral-400" />
                        <span>Switch to {user?.role === 'ROLE_ADMIN' ? 'Customer' : 'Admin'} Role</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-neutral-100"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3.5 py-1.5 text-xs font-medium text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-100">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.view, link.payload)}
                  className="text-left text-sm py-2 px-3 rounded hover:bg-neutral-100 text-neutral-800 font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenInspector();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs bg-neutral-900 text-white rounded flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Inspect Spring Boot Backend</span>
                </span>
                <span className="text-[10px] text-neutral-400">REST API</span>
              </button>

              {isAdmin ? (
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className="w-full text-left py-2 px-3 text-xs bg-amber-100 text-amber-900 font-medium rounded flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    quickLogin('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs bg-neutral-100 text-neutral-700 rounded flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-neutral-500" />
                  <span>Switch to Admin Account</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
