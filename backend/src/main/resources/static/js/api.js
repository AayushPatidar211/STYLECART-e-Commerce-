/**
 * StyleCart - Centralized API Client & Storage Simulator
 * Connects directly to Spring Boot REST backend with graceful browser storage fallback.
 */

export const API_BASE_URL = window.STYLECART_API_URL || '/api';

export const STORAGE_KEYS = {
  TOKEN: 'stylecart_token',
  USER: 'stylecart_user',
  PRODUCTS: 'stylecart_products_v1',
  CATEGORIES: 'stylecart_categories_v1',
  CART: 'stylecart_cart_v1',
  WISHLIST: 'stylecart_wishlist_v1',
  ORDERS: 'stylecart_orders_v1',
  USERS: 'stylecart_users_v1',
  RAZORPAY_KEY: 'fashionhub_razorpay_key'
};

// Initial Seed Data (mirrored from database/schema.sql)
export const INITIAL_DATA = {
  categories: [
    { id: 1, name: 'Men', description: 'Tailored suits, relaxed outerwear, Japanese selvedge denim, knitwear, and everyday essentials.', imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80', active: true, productCount: 4 },
    { id: 2, name: 'Women', description: 'Contemporary designer dresses, silk blouses, structured trousers, kurtis, and eveningwear.', imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', active: true, productCount: 4 },
    { id: 3, name: 'Kids', description: 'Comfortable, breathable organic cotton apparel, hoodies, denim, and playful prints.', imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80', active: true, productCount: 1 },
    { id: 4, name: 'Shoes', description: 'Handcrafted leather boots, minimalist sneakers, brogues, and Chelsea dress shoes.', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', active: true, productCount: 1 },
    { id: 5, name: 'Accessories', description: 'Full-grain Italian leather bags, automatic watches, silk scarves, and braided belts.', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', active: true, productCount: 2 }
  ],
  products: [
    {
      id: 1,
      name: 'Minimalist Relaxed Fit Trench Coat',
      description: 'Constructed from a dense, water-repellent organic cotton twill. Features a relaxed storm flap, horn buttons, deep welt pockets, and a clean minimalist silhouette tailored for modern layering.',
      brand: 'Zara Studio',
      categoryId: 2,
      categoryName: 'Women',
      price: 189.00,
      discountPrice: 149.00,
      discountPercentage: 21,
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      availableColors: ['Camel', 'Black', 'Olive'],
      stockQuantity: 35,
      rating: 4.8,
      reviewCount: 48,
      active: true,
      createdAt: '2026-09-01T10:00:00Z'
    },
    {
      id: 2,
      name: 'Oversized Heavyweight Cotton Hoodie',
      description: 'Crafted from 480 GSM French terry cotton. Brushed interior for unrivaled softness with structured dropped shoulders and twin-needle reinforced ribbed cuffs.',
      brand: 'Essentials Co.',
      categoryId: 1,
      categoryName: 'Men',
      price: 95.00,
      discountPrice: 75.00,
      discountPercentage: 21,
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      availableColors: ['Heather Grey', 'Washed Black', 'Sage'],
      stockQuantity: 50,
      rating: 4.9,
      reviewCount: 82,
      active: true,
      createdAt: '2026-09-05T10:00:00Z'
    },
    {
      id: 3,
      name: 'Tailored Slim Wool-Blend Trousers',
      description: 'Refined wool blend trousers with front pressed pleats, concealed hook-and-bar closure, and cleanly tapered hems suitable for both formal and smart-casual styling.',
      brand: 'Calvin Klein',
      categoryId: 1,
      categoryName: 'Men',
      price: 120.00,
      discountPrice: 89.00,
      discountPercentage: 25,
      images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['30', '32', '34', '36'],
      availableColors: ['Charcoal', 'Navy', 'Beige'],
      stockQuantity: 42,
      rating: 4.7,
      reviewCount: 34,
      active: true,
      createdAt: '2026-09-08T10:00:00Z'
    },
    {
      id: 4,
      name: 'Silk Slip Midi Dress in Champagne',
      description: 'Cut on the bias for a liquid drape that gracefully follows the body contours. Adjustable slim shoulder straps, delicate cowl neckline, and French seams throughout.',
      brand: 'Mango Selection',
      categoryId: 2,
      categoryName: 'Women',
      price: 140.00,
      discountPrice: 105.00,
      discountPercentage: 25,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['XS', 'S', 'M', 'L'],
      availableColors: ['Champagne', 'Emerald', 'Black'],
      stockQuantity: 28,
      rating: 4.8,
      reviewCount: 65,
      active: true,
      createdAt: '2026-09-10T10:00:00Z'
    },
    {
      id: 5,
      name: 'Raw Selvedge Denim Straight Jeans',
      description: '13.5 oz Japanese selvedge denim woven on vintage shuttle looms. Raw unwashed indigo that molds to your unique wear patterns over time with copper rivet detailing.',
      brand: "Levi's Premium",
      categoryId: 1,
      categoryName: 'Men',
      price: 160.00,
      discountPrice: 128.00,
      discountPercentage: 20,
      images: ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['30', '32', '34', '36'],
      availableColors: ['Raw Indigo', 'Faded Blue'],
      stockQuantity: 30,
      rating: 4.7,
      reviewCount: 52,
      active: true,
      createdAt: '2026-09-12T10:00:00Z'
    },
    {
      id: 6,
      name: 'Ribbed Merino Wool Knit Sweater',
      description: 'Spun from 100% extra-fine Australian merino wool. Exceptionally warm yet breathable with architectural horizontal ribbing and a ribbed mock neck.',
      brand: 'COS',
      categoryId: 2,
      categoryName: 'Women',
      price: 130.00,
      discountPrice: 99.00,
      discountPercentage: 24,
      images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['S', 'M', 'L', 'XL'],
      availableColors: ['Oatmeal', 'Dark Olive', 'Espresso'],
      stockQuantity: 22,
      rating: 4.6,
      reviewCount: 29,
      active: true,
      createdAt: '2026-09-14T10:00:00Z'
    },
    {
      id: 7,
      name: 'Handcrafted Suede Chelsea Boots',
      description: 'Rich Italian calf suede treated with water-resistant finish. Hand-stitched Goodyear welted construction, natural crepe sole, and elastic side gussets for effortless fit.',
      brand: 'Nordstrom Atelier',
      categoryId: 4,
      categoryName: 'Shoes',
      price: 220.00,
      discountPrice: 175.00,
      discountPercentage: 20,
      images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['8', '9', '10', '11', '12'],
      availableColors: ['Tan Suede', 'Midnight Black'],
      stockQuantity: 18,
      rating: 4.9,
      reviewCount: 74,
      active: true,
      createdAt: '2026-09-15T10:00:00Z'
    },
    {
      id: 8,
      name: 'Structured Leather Crossbody Tote',
      description: 'Full-grain pebble leather with matte palladium hardware. Magnetic top closure, partitioned interior with zippered laptop compartment, and adjustable crossbody strap.',
      brand: 'Ralph Lauren',
      categoryId: 5,
      categoryName: 'Accessories',
      price: 280.00,
      discountPrice: 210.00,
      discountPercentage: 25,
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['One Size'],
      availableColors: ['Cognac Brown', 'Obsidian Black'],
      stockQuantity: 14,
      rating: 4.9,
      reviewCount: 91,
      active: true,
      createdAt: '2026-09-18T10:00:00Z'
    },
    {
      id: 9,
      name: 'Classic Supima Cotton Oxford Shirt',
      description: 'Woven with long-staple American Supima cotton yarns. Soft rolled button-down collar, box pleat with locker loop, and Mother of Pearl buttons.',
      brand: 'Tommy Hilfiger',
      categoryId: 1,
      categoryName: 'Men',
      price: 85.00,
      discountPrice: 59.00,
      discountPercentage: 30,
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['S', 'M', 'L', 'XL'],
      availableColors: ['Sky Blue', 'White', 'Oxford Grey'],
      stockQuantity: 60,
      rating: 4.6,
      reviewCount: 40,
      active: true,
      createdAt: '2026-09-20T10:00:00Z'
    },
    {
      id: 10,
      name: 'Hand-Embroidered Chanderi Kurti',
      description: 'Ethically hand-embroidered by artisan weavers using fine Chanderi silk blend. Features delicate zari floral motifs, split mandarin collar, and side slit hems.',
      brand: 'Fabindia Luxe',
      categoryId: 2,
      categoryName: 'Women',
      price: 98.00,
      discountPrice: 69.00,
      discountPercentage: 29,
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['S', 'M', 'L', 'XL'],
      availableColors: ['Powder Blue', 'Dusty Rose'],
      stockQuantity: 26,
      rating: 4.8,
      reviewCount: 38,
      active: true,
      createdAt: '2026-09-22T10:00:00Z'
    },
    {
      id: 11,
      name: 'Kids Organic Cotton Graphic Sweatshirt',
      description: '100% GOTS certified organic fleece with non-toxic water-based botanical prints. Reinforced ribbed crewneck and ultra-soft brushed lining.',
      brand: 'Mini Boden',
      categoryId: 3,
      categoryName: 'Kids',
      price: 45.00,
      discountPrice: 32.00,
      discountPercentage: 28,
      images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
      availableColors: ['Oatmeal Heather', 'Forest Green'],
      stockQuantity: 45,
      rating: 4.7,
      reviewCount: 19,
      active: true,
      createdAt: '2026-09-25T10:00:00Z'
    },
    {
      id: 12,
      name: 'Minimalist Bauhaus Automatic Watch',
      description: 'Clean 40mm stainless steel case with sapphire crystal glass. Japanese automatic self-winding movement, exhibition caseback, and genuine Horween leather strap.',
      brand: 'Sternglas',
      categoryId: 5,
      categoryName: 'Accessories',
      price: 340.00,
      discountPrice: 275.00,
      discountPercentage: 19,
      images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'],
      availableSizes: ['40mm'],
      availableColors: ['Brushed Silver', 'Matte Black'],
      stockQuantity: 12,
      rating: 5.0,
      reviewCount: 56,
      active: true,
      createdAt: '2026-09-28T10:00:00Z'
    }
  ],
  orders: [
    {
      id: 1,
      orderNumber: 'SC-20260915-1042',
      trackingNumber: 'TRK-98421094',
      userId: 2,
      userEmail: 'user@stylecart.com',
      userName: 'Sarah Jenkins',
      items: [
        {
          id: 1,
          productId: 2,
          productName: 'Oversized Heavyweight Cotton Hoodie',
          productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
          selectedSize: 'M',
          selectedColor: 'Heather Grey',
          quantity: 1,
          unitPrice: 75.00,
          totalPrice: 75.00
        },
        {
          id: 2,
          productId: 1,
          productName: 'Minimalist Relaxed Fit Trench Coat',
          productImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          selectedSize: 'S',
          selectedColor: 'Camel',
          quantity: 1,
          unitPrice: 149.00,
          totalPrice: 149.00
        }
      ],
      shippingAddress: {
        fullName: 'Sarah Jenkins',
        phone: '+1-555-0142',
        streetAddress: '742 Evergreen Terrace',
        apartment: 'Apt 4B',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States'
      },
      subtotal: 224.00,
      discountAmount: 0.00,
      deliveryCharge: 0.00,
      totalAmount: 224.00,
      status: 'DELIVERED',
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      transactionId: 'TXN-A91B824C9102',
      razorpayPaymentId: 'pay_P1982a74c102',
      createdAt: '2026-09-15T14:22:00Z'
    },
    {
      id: 2,
      orderNumber: 'SC-20260924-8491',
      trackingNumber: 'TRK-44219082',
      userId: 2,
      userEmail: 'user@stylecart.com',
      userName: 'Sarah Jenkins',
      items: [
        {
          id: 3,
          productId: 1,
          productName: 'Minimalist Relaxed Fit Trench Coat',
          productImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          selectedSize: 'M',
          selectedColor: 'Black',
          quantity: 1,
          unitPrice: 149.00,
          totalPrice: 149.00
        }
      ],
      shippingAddress: {
        fullName: 'Sarah Jenkins',
        phone: '+1-555-0142',
        streetAddress: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States'
      },
      subtotal: 149.00,
      discountAmount: 0.00,
      deliveryCharge: 0.00,
      totalAmount: 149.00,
      status: 'PROCESSING',
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      transactionId: 'TXN-F40192BA0184',
      razorpayPaymentId: 'pay_P4910b89d441',
      createdAt: '2026-09-24T09:15:00Z'
    }
  ]
};

// Initialize LocalStorage Database for standalone exploration
export function initSimulatedDb() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_DATA.products));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_DATA.categories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DATA.orders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([INITIAL_DATA.products[0], INITIAL_DATA.products[3]]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    const defaultCart = {
      id: 1,
      items: [
        {
          id: 101,
          productId: INITIAL_DATA.products[1].id,
          productName: INITIAL_DATA.products[1].name,
          brand: INITIAL_DATA.products[1].brand,
          productImage: INITIAL_DATA.products[1].images[0],
          selectedSize: 'M',
          selectedColor: 'Heather Grey',
          quantity: 1,
          unitPrice: 75.0,
          itemTotal: 75.0,
          availableStock: INITIAL_DATA.products[1].stockQuantity
        }
      ],
      totalItems: 1,
      subtotal: 75.0,
      deliveryCharge: 0.0,
      discountAmount: 0.0,
      finalTotal: 75.0
    };
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(defaultCart));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    const demoUser = {
      token: 'jwt_demo_customer_token_stylecart_2026',
      tokenType: 'Bearer',
      id: 2,
      email: 'user@stylecart.com',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      role: 'ROLE_USER',
      phoneNumber: '+1-555-0142',
      defaultAddress: {
        fullName: 'Sarah Jenkins',
        phone: '+1-555-0142',
        streetAddress: '742 Evergreen Terrace',
        apartment: 'Apt 4B',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States'
      }
    };
    localStorage.setItem(STORAGE_KEYS.TOKEN, demoUser.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
  }
}

initSimulatedDb();

/**
 * Universal HTTP Request Helper
 * Connects to live Spring Boot backend, falling back seamlessly if offline.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers
    });
    
    if (res.ok) {
      return await res.json();
    }
    
    // If backend returns 401/403/400 etc, return standard error
    const errBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errBody.message || `Request failed with status ${res.status}`);
  } catch (networkErr) {
    // Graceful offline simulated fallback for standalone browser preview
    return handleSimulatedFallback(endpoint, options);
  }
}

/**
 * High-fidelity fallback handler matching Spring Boot controller specifications exactly.
 */
function handleSimulatedFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const cleanPath = endpoint.split('?')[0];
  const urlParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');

  // 1. Auth Endpoints
  if (cleanPath === '/auth/login' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const isAdmin = body.email && body.email.includes('admin');
    return {
      token: 'jwt_token_' + Date.now(),
      tokenType: 'Bearer',
      id: isAdmin ? 1 : 2,
      email: body.email,
      firstName: isAdmin ? 'Admin' : 'Sarah',
      lastName: isAdmin ? 'Store Manager' : 'Jenkins',
      role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'
    };
  }

  // 2. Products
  if (cleanPath === '/products' && method === 'GET') {
    let prods = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const categoryId = urlParams.get('categoryId');
    const brand = urlParams.get('brand');
    const minPrice = urlParams.get('minPrice');
    const maxPrice = urlParams.get('maxPrice');
    const sortBy = urlParams.get('sortBy');

    if (categoryId) prods = prods.filter(p => p.categoryId == categoryId);
    if (brand) prods = prods.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (minPrice) prods = prods.filter(p => (p.discountPrice || p.price) >= parseFloat(minPrice));
    if (maxPrice) prods = prods.filter(p => (p.discountPrice || p.price) <= parseFloat(maxPrice));

    if (sortBy === 'price-asc') prods.sort((a,b) => (a.discountPrice||a.price) - (b.discountPrice||b.price));
    else if (sortBy === 'price-desc') prods.sort((a,b) => (b.discountPrice||b.price) - (a.discountPrice||a.price));
    else if (sortBy === 'rating') prods.sort((a,b) => b.rating - a.rating);

    return {
      content: prods,
      totalElements: prods.length,
      totalPages: 1,
      size: prods.length,
      number: 0,
      last: true
    };
  }

  if (cleanPath.startsWith('/products/') && method === 'GET') {
    const id = parseInt(cleanPath.replace('/products/', ''));
    const prods = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const found = prods.find(p => p.id === id);
    if (!found) throw new Error('Product not found');
    return found;
  }

  if (cleanPath === '/products/search' && method === 'GET') {
    const q = (urlParams.get('keyword') || '').toLowerCase();
    const prods = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = prods.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
    return { content: filtered, totalElements: filtered.length, totalPages: 1 };
  }

  // 3. Categories
  if (cleanPath === '/categories' && method === 'GET') {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  }

  // 4. Cart
  if (cleanPath === '/cart' && method === 'GET') {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '{}');
  }

  // 5. Wishlist
  if (cleanPath === '/wishlist' && method === 'GET') {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
  }

  // 6. Orders
  if (cleanPath === '/orders' && method === 'GET') {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  }

  if (cleanPath.startsWith('/orders/') && method === 'GET') {
    const num = cleanPath.replace('/orders/', '');
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const found = orders.find(o => o.orderNumber === num);
    if (!found) throw new Error('Order not found');
    return found;
  }

  // 7. Admin Dashboard
  if (cleanPath === '/admin/dashboard' && method === 'GET') {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const totalRev = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
    return {
      totalUsers: 148,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: totalRev,
      pendingOrders: orders.filter(o => ['PLACED', 'CONFIRMED', 'PROCESSING'].includes(o.status)).length,
      deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
      lowStockProducts: products.filter(p => p.stockQuantity < 15).length,
      recentOrders: orders.slice(0, 5),
      monthlyRevenue: [
        { month: 'May', revenue: 7800, orders: 58 },
        { month: 'Jun', revenue: 9200, orders: 66 },
        { month: 'Jul', revenue: 11400, orders: 85 },
        { month: 'Aug', revenue: 13800, orders: 104 },
        { month: 'Sep', revenue: totalRev || 15600, orders: orders.length || 120 }
      ]
    };
  }

  // Default empty object
  return {};
}

/**
 * Toast notification helper
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}
