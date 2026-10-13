import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, Product } from '../types';
import { cartService } from '../services/cartService';

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, size: string, color: string, qty?: number) => Promise<void>;
  updateQuantity: (itemId: number, qty: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => { valid: boolean; message: string };
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    id: 1,
    items: [],
    totalItems: 0,
    subtotal: 0,
    deliveryCharge: 0,
    discountAmount: 0,
    finalTotal: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const refreshCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addItem = async (product: Product, size: string, color: string, qty = 1) => {
    const updated = await cartService.addItem(product, size, color, qty);
    setCart(updated);
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = async (itemId: number, qty: number) => {
    const updated = await cartService.updateQuantity(itemId, qty);
    setCart(updated);
  };

  const removeItem = async (itemId: number) => {
    const updated = await cartService.removeItem(itemId);
    setCart(updated);
  };

  const clearCart = async () => {
    const updated = await cartService.clearCart();
    setCart(updated);
  };

  const applyCoupon = (code: string) => {
    const result = cartService.applyCoupon(code, { ...cart });
    if (result.valid) {
      setCart(result.cart);
    }
    return { valid: result.valid, message: result.message };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
