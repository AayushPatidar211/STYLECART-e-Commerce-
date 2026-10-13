import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { wishlistService } from '../services/wishlistService';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<void>;
  moveToCart: (product: Product, size?: string, color?: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshCart, setIsCartDrawerOpen } = useCart();

  const refreshWishlist = async () => {
    try {
      const items = await wishlistService.getWishlist();
      setWishlist(items);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const isInWishlist = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const isAdded = await wishlistService.toggleWishlist(product);
    await refreshWishlist();
    return isAdded;
  };

  const removeFromWishlist = async (productId: number) => {
    await wishlistService.removeFromWishlist(productId);
    await refreshWishlist();
  };

  const moveToCart = async (product: Product, size?: string, color?: string) => {
    await wishlistService.moveToCart(product, size, color);
    await refreshWishlist();
    await refreshCart();
    setIsCartDrawerOpen(true);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
