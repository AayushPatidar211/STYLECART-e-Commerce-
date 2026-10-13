import { apiClient, simDb, delay } from './api';
import { Order, OrderStatus, Address } from '../types';
import { cartService } from './cartService';

export const orderService = {
  async placeOrder(orderData: {
    shippingAddress: Address;
    paymentMethod: string;
    orderNotes?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }): Promise<Order> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.post<Order>('/orders', orderData);
        await cartService.clearCart();
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(300);

    const cart = simDb.getCart();
    if (!cart.items.length) {
      throw new Error('Shopping bag is empty');
    }

    const products = simDb.getProducts();

    // Deduct stock
    cart.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      }
    });
    simDb.saveProducts(products);

    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SC-${datePrefix}-${randomSuffix}`;
    const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const newOrder: Order = {
      id: Date.now(),
      orderNumber,
      trackingNumber,
      userId: 2,
      userEmail: 'user@stylecart.com',
      userName: orderData.shippingAddress.fullName,
      items: cart.items.map((i) => ({
        id: Date.now() + Math.floor(Math.random() * 1000),
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        selectedSize: i.selectedSize,
        selectedColor: i.selectedColor,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.itemTotal,
      })),
      shippingAddress: orderData.shippingAddress,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount || 0,
      deliveryCharge: cart.deliveryCharge,
      totalAmount: cart.finalTotal,
      status: 'PLACED',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      transactionId:
        orderData.paymentMethod === 'COD'
          ? undefined
          : orderData.razorpayPaymentId || `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      razorpayOrderId: orderData.razorpayOrderId,
      razorpayPaymentId: orderData.razorpayPaymentId,
      razorpaySignature: orderData.razorpaySignature,
      orderNotes: orderData.orderNotes,
      createdAt: new Date().toISOString(),
    };

    const orders = simDb.getOrders();
    orders.unshift(newOrder);
    simDb.saveOrders(orders);

    // Empty cart
    await cartService.clearCart();

    return newOrder;
  },

  async getMyOrders(): Promise<Order[]> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<Order[]>('/orders');
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(120);
    return simDb.getOrders();
  },

  async getOrderDetails(orderNumber: string): Promise<Order> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<Order>(`/orders/${orderNumber}`);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(100);
    const order = simDb.getOrders().find((o) => o.orderNumber === orderNumber);
    if (!order) {
      throw new Error(`Order ${orderNumber} not found`);
    }
    return order;
  },

  async cancelOrder(orderNumber: string): Promise<Order> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.put<Order>(`/orders/${orderNumber}/cancel`);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(200);
    const orders = simDb.getOrders();
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) throw new Error('Order not found');

    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
      throw new Error(`Order cannot be cancelled because it is already ${order.status}`);
    }

    order.status = 'CANCELLED';
    order.updatedAt = new Date().toISOString();

    // Restock items
    const products = simDb.getProducts();
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQuantity += item.quantity;
      }
    });
    simDb.saveProducts(products);
    simDb.saveOrders(orders);

    return order;
  },

  async getAllOrders(): Promise<Order[]> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<{ content: Order[] }>('/orders/admin/all');
        return res.data.content;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(120);
    return simDb.getOrders();
  },

  async updateOrderStatus(orderId: number, status: OrderStatus, trackingNumber?: string): Promise<Order> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.put<Order>(`/orders/${orderId}/status`, { status, trackingNumber });
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(150);
    const orders = simDb.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();

    if (status === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }

    simDb.saveOrders(orders);
    return order;
  },
};
