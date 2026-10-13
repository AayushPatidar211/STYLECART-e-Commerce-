/**
 * StyleCart - Fashion E-Commerce Platform
 * Full-Stack React 19 Frontend + Spring Boot 3 Backend Integration
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { BackendCodeInspector } from './components/common/BackendCodeInspector';
import { AdminSidebar } from './components/admin/AdminSidebar';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthModal } from './pages/AuthModal';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';

import { Product, Order } from './types';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter params passed when navigating to products page
  const [productPageParams, setProductPageParams] = useState<{
    categoryName?: string;
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';
    maxPrice?: number;
    keyword?: string;
  }>({});

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavigate = (view: string, payload?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'category') {
      setProductPageParams({ categoryName: payload });
      setCurrentView('products');
      return;
    }

    if (view === 'products' && payload) {
      setProductPageParams(payload);
      setCurrentView('products');
      return;
    }

    if (view === 'products' && !payload) {
      setProductPageParams({});
    }

    setCurrentView(view);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('order-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProductFromAdmin = (product: Product) => {
    setEditingProduct(product);
    setCurrentView('admin-product-edit');
  };

  const isAdminView = currentView.startsWith('admin-');

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        onViewAllResults={(query) => handleNavigate('products', { keyword: query })}
      />

      {/* Spring Boot Java Architecture Code Inspector Modal */}
      <BackendCodeInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* Cart Drawer Slide-over */}
      <CartDrawer
        onNavigateToCheckout={() => handleNavigate('checkout')}
        onNavigateToCart={() => handleNavigate('cart')}
        onContinueShopping={() => handleNavigate('products')}
      />

      {/* Auth Modal */}
      <AuthModal />

      {isAdminView ? (
        /* Admin Layout: Sidebar + Main Content */
        <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-neutral-100/60">
          <AdminSidebar
            currentView={currentView}
            onNavigate={(v) => setCurrentView(v)}
            onReturnToStore={() => setCurrentView('home')}
          />
          <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
            {currentView === 'admin-dashboard' && (
              <AdminDashboardPage
                onNavigate={(v) => setCurrentView(v)}
                onSelectOrder={handleSelectOrder}
              />
            )}
            {currentView === 'admin-products' && (
              <AdminProductsPage
                onAddNew={() => setCurrentView('admin-product-add')}
                onEditProduct={handleEditProductFromAdmin}
              />
            )}
            {currentView === 'admin-product-add' && (
              <AdminProductFormPage
                onSaveSuccess={() => setCurrentView('admin-products')}
                onCancel={() => setCurrentView('admin-products')}
              />
            )}
            {currentView === 'admin-product-edit' && (
              <AdminProductFormPage
                initialProduct={editingProduct}
                onSaveSuccess={() => {
                  setEditingProduct(null);
                  setCurrentView('admin-products');
                }}
                onCancel={() => {
                  setEditingProduct(null);
                  setCurrentView('admin-products');
                }}
              />
            )}
            {currentView === 'admin-categories' && <AdminCategoriesPage />}
            {currentView === 'admin-orders' && <AdminOrdersPage />}
            {currentView === 'admin-users' && <AdminUsersPage />}
            {currentView === 'admin-inventory' && <AdminInventoryPage />}
          </main>
        </div>
      ) : (
        /* Storefront Public & Customer Layout */
        <>
          <Navbar
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenInspector={() => setIsInspectorOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          <main className="flex-1">
            {currentView === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentView === 'products' && (
              <ProductsPage
                initialCategory={productPageParams.categoryName}
                initialSort={productPageParams.sortBy}
                initialMaxPrice={productPageParams.maxPrice}
                initialKeyword={productPageParams.keyword}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentView === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                onNavigateBack={() => handleNavigate('products')}
                onSelectProduct={handleSelectProduct}
                onNavigateToCheckout={() => handleNavigate('checkout')}
              />
            )}

            {currentView === 'cart' && (
              <CartPage
                onNavigateToCheckout={() => handleNavigate('checkout')}
                onContinueShopping={() => handleNavigate('products')}
              />
            )}

            {currentView === 'wishlist' && (
              <WishlistPage
                onSelectProduct={handleSelectProduct}
                onContinueShopping={() => handleNavigate('products')}
              />
            )}

            {currentView === 'checkout' && (
              <CheckoutPage
                onOrderSuccess={handleOrderSuccess}
                onNavigateBack={() => handleNavigate('cart')}
              />
            )}

            {currentView === 'order-success' && selectedOrder && (
              <OrderSuccessPage
                order={selectedOrder}
                onNavigateToOrders={() => handleNavigate('orders')}
                onContinueShopping={() => handleNavigate('products')}
              />
            )}

            {currentView === 'orders' && (
              <OrdersPage
                onSelectOrder={handleSelectOrder}
                onContinueShopping={() => handleNavigate('products')}
              />
            )}

            {currentView === 'order-detail' && selectedOrder && (
              <OrderDetailPage
                order={selectedOrder}
                onNavigateBack={() => handleNavigate('orders')}
                onOrderUpdated={(updated) => setSelectedOrder(updated)}
              />
            )}

            {currentView === 'profile' && (
              <ProfilePage onNavigateToOrders={() => handleNavigate('orders')} />
            )}

            {currentView === 'about' && (
              <AboutPage onContinueShopping={() => handleNavigate('products')} />
            )}

            {currentView === 'contact' && <ContactPage />}
          </main>

          <Footer
            onNavigate={handleNavigate}
            onOpenInspector={() => setIsInspectorOpen(true)}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
