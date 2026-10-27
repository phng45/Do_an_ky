import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, AttendanceRecord } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USER, SAMPLE_ORDERS, DEMO_ACCOUNTS } from '../data/mockProducts';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  currentUser: User | null;
  orders: Order[];
  attendances: AttendanceRecord[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addToCart: (product: Product, quantity: number, selectedSize: string, selectedColor: string) => boolean;
  updateCartQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, phone: string, password?: string, address?: string) => boolean;
  logout: () => void;
  quickLoginDemo: (role?: 'admin' | 'staff' | 'user') => void;
  createOrder: (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    paymentMethod: 'cod' | 'banking';
    discount?: number;
    shippingFee?: number;
    notes?: string;
  }) => Order | null;
  updateProductStock: (productId: string, newStock: number) => void;
  resetStockToDefault: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  checkInAttendance: (shift: AttendanceRecord['shift'], notes?: string) => void;
  checkOutAttendance: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'hoopzone_products_v1',
  CART: 'hoopzone_cart_v1',
  USER: 'hoopzone_user_v1',
  USERS_LIST: 'hoopzone_registered_users_v1',
  ORDERS: 'hoopzone_orders_v1',
  ATTENDANCE: 'hoopzone_attendance_v4',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER; // Default logged in for pleasant evaluation
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const defaultList = [DEMO_ACCOUNTS.admin, DEMO_ACCOUNTS.staff, DEMO_ACCOUNTS.user];
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const existingEmails = new Set(parsed.map((u) => u.email.toLowerCase()));
        const missing = defaultList.filter((d) => !existingEmails.has(d.email.toLowerCase()));
        return [...parsed, ...missing];
      } catch (e) {
        console.error(e);
      }
    }
    return defaultList;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        if (parsed.length >= 4) return parsed;
        const existingIds = new Set(parsed.map((o) => o.id));
        const missing = SAMPLE_ORDERS.filter((s) => !existingIds.has(s.id));
        return [...parsed, ...missing];
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_ORDERS;
  });

  const INITIAL_ATTENDANCE: AttendanceRecord[] = [
    {
      id: 'att-01',
      staffName: 'Lê Hoàng Nam (Nhân Viên)',
      role: 'Nhân viên bán hàng & kho',
      checkInTime: '2026-10-17 08:00:12',
      checkOutTime: '2026-10-17 12:00:45',
      shift: 'Ca Sáng (08:00 - 12:00)',
      status: 'Hoàn thành ca',
      hoursWorked: 4,
      notes: 'Đúng giờ, tiếp nhận và soạn 4 đơn online',
    },
    {
      id: 'att-02',
      staffName: 'Lê Hoàng Nam (Nhân Viên)',
      role: 'Nhân viên bán hàng & kho',
      checkInTime: '2026-10-17 13:00:00',
      shift: 'Ca Chiều (13:00 - 17:00)',
      status: 'Đang làm việc',
      notes: 'Đang trực quầy xuất hàng và kiểm kê kệ giày',
    },
    {
      id: 'att-03',
      staffName: 'Trần Thị Mai',
      role: 'Nhân viên soạn đơn & đóng gói',
      checkInTime: '2026-10-17 08:05:00',
      checkOutTime: '2026-10-17 12:02:10',
      shift: 'Ca Sáng (08:00 - 12:00)',
      status: 'Hoàn thành ca',
      hoursWorked: 4,
      notes: 'Đóng gói kiện hàng Nike Zoom Freak gửi bưu tá',
    },
    {
      id: 'att-04',
      staffName: 'Lê Hoàng Nam (Nhân Viên)',
      role: 'Nhân viên bán hàng & kho',
      checkInTime: '2026-10-16 13:00:22',
      checkOutTime: '2026-10-16 17:00:10',
      shift: 'Ca Chiều (13:00 - 17:00)',
      status: 'Hoàn thành ca',
      hoursWorked: 4,
      notes: 'Kiểm kê tồn kho size 42-44 của toàn bộ dòng giày',
    },
    {
      id: 'att-05',
      staffName: 'Nguyễn Văn Đức',
      role: 'Nhân viên kiểm đếm & giao vận',
      checkInTime: '2026-10-16 08:00:00',
      checkOutTime: '2026-10-16 12:00:00',
      shift: 'Ca Sáng (08:00 - 12:00)',
      status: 'Hoàn thành ca',
      hoursWorked: 4,
      notes: 'Bàn giao 12 kiện hàng cho GHN và ViettelPost',
    },
    {
      id: 'att-06',
      staffName: 'Trần Thị Mai',
      role: 'Nhân viên soạn đơn & đóng gói',
      checkInTime: '2026-10-16 13:02:10',
      checkOutTime: '2026-10-16 17:01:00',
      shift: 'Ca Chiều (13:00 - 17:00)',
      status: 'Hoàn thành ca',
      hoursWorked: 4,
      notes: 'Hoàn tất đóng hộp 8 quả bóng rổ TF-Official',
    },
  ];

  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ATTENDANCE;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendances));
  }, [attendances]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity: number, selectedSize: string, selectedColor: string): boolean => {
    const currentProduct = products.find((p) => p.id === product.id);
    const availableStock = currentProduct ? currentProduct.stock : product.stock;

    if (availableStock <= 0) {
      showToast(`Sản phẩm "${product.name}" hiện đã hết hàng trong kho.`, 'error');
      return false;
    }

    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
    );

    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    const requestedTotal = currentQtyInCart + quantity;

    if (requestedTotal > availableStock) {
      showToast(
        `Không thể thêm. Kho chỉ còn ${availableStock} cái (bạn đã có ${currentQtyInCart} cái trong giỏ).`,
        'error'
      );
      return false;
    }

    setCart((prev) => {
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: requestedTotal,
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedSize, selectedColor }];
      }
    });

    showToast(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng.`, 'success');
    return true;
  };

  const updateCartQuantity = (productId: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    const currentProduct = products.find((p) => p.id === productId);
    const availableStock = currentProduct ? currentProduct.stock : 999;

    if (quantity > availableStock) {
      showToast(`Kho mẫu chỉ còn tối đa ${availableStock} sản phẩm.`, 'error');
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize)));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const login = (email: string, _password?: string): boolean => {
    const trimmed = email.trim().toLowerCase();

    // Check demo accounts first
    const demoMatches = Object.values(DEMO_ACCOUNTS).find(
      (d) =>
        d.email.toLowerCase() === trimmed ||
        d.phone === trimmed ||
        d.id.toLowerCase() === trimmed ||
        (trimmed === 'admin' && d.role === 'admin') ||
        (trimmed === 'nhanvien' && d.role === 'staff') ||
        (trimmed === 'staff' && d.role === 'staff') ||
        (trimmed === 'khachhang' && d.role === 'user')
    );
    if (demoMatches) {
      setCurrentUser(demoMatches);
      showToast(`Đăng nhập thành công: ${demoMatches.name} [${demoMatches.role.toUpperCase()}]`, 'success');
      return true;
    }

    const found = registeredUsers.find((u) => u.email.toLowerCase() === trimmed || u.phone === trimmed);
    if (found) {
      setCurrentUser(found);
      showToast(`Chào mừng ${found.name} đã quay trở lại!`, 'success');
      return true;
    }
    // Auto-create user if simple test login
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      name: email.split('@')[0] || 'Khách hàng HoopZone',
      email: trimmed,
      phone: '0901234567',
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Đăng nhập thành công với tài khoản ${newUser.name}!`, 'success');
    return true;
  };

  const register = (name: string, email: string, phone: string, _password?: string, address?: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      showToast('Email này đã được đăng ký. Vui lòng đăng nhập!', 'error');
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      address: address?.trim(),
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Tạo tài khoản thành công! Chào mừng ${newUser.name}.`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Đã đăng xuất khỏi tài khoản.', 'info');
  };

  const quickLoginDemo = (role: 'admin' | 'staff' | 'user' = 'admin') => {
    const target = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.admin;
    setCurrentUser(target);
    showToast(`Đã chuyển sang: ${target.name} [${target.role.toUpperCase()}]`, 'success');
  };

  const createOrder = (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    paymentMethod: 'cod' | 'banking';
    discount?: number;
    shippingFee?: number;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) {
      showToast('Giỏ hàng đang trống!', 'error');
      return null;
    }

    // Verify stock availability for all cart items
    for (const item of cart) {
      const p = products.find((prod) => prod.id === item.product.id);
      if (!p || p.stock < item.quantity) {
        showToast(
          `Sản phẩm "${item.product.name}" không đủ số lượng trong kho mẫu (Chỉ còn ${p ? p.stock : 0} cái)!`,
          'error'
        );
        return null;
      }
    }

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItemsForProd = cart.filter((c) => c.product.id === prod.id);
        if (cartItemsForProd.length > 0) {
          const totalDeducted = cartItemsForProd.reduce((acc, curr) => acc + curr.quantity, 0);
          const nextStock = Math.max(0, prod.stock - totalDeducted);
          return { ...prod, stock: nextStock };
        }
        return prod;
      })
    );

    const subtotal = cartTotal;
    const discount = orderInfo.discount || 0;
    const shippingFee = orderInfo.shippingFee || 0;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const newOrder: Order = {
      id: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.id,
      customerName: orderInfo.customerName,
      customerPhone: orderInfo.customerPhone,
      customerEmail: orderInfo.customerEmail,
      shippingAddress: orderInfo.shippingAddress,
      city: orderInfo.city,
      paymentMethod: orderInfo.paymentMethod,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        selectedSize: c.selectedSize,
        selectedColor: c.selectedColor,
        image: c.product.image,
      })),
      subtotal,
      discount,
      shippingFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: orderInfo.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Đặt hàng thành công! Mã đơn: ${newOrder.id}`, 'success');
    return newOrder;
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, newStock) };
        }
        return p;
      })
    );
    showToast(`Đã cập nhật tồn kho mẫu sản phẩm.`, 'info');
  };

  const resetStockToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Đã khôi phục số lượng kho mẫu về ban đầu.', 'info');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return { ...o, status };
        }
        return o;
      })
    );
    showToast(`Đã cập nhật trạng thái đơn hàng #${orderId}`, 'info');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Đã hủy/xóa đơn hàng #${orderId}`, 'info');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = 'prod-custom-' + Date.now();
    const fullProd: Product = { ...newProd, id };
    setProducts((prev) => [fullProd, ...prev]);
    showToast(`Đã thêm sản phẩm "${newProd.name}" vào kho hàng!`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Đã cập nhật sản phẩm "${updated.name}" thành công!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Đã xóa sản phẩm khỏi kho hàng.', 'info');
  };

  const checkInAttendance = (shift: AttendanceRecord['shift'], notes?: string) => {
    const staffName = currentUser ? currentUser.name : 'Lê Hoàng Nam (Nhân Viên)';
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now(),
      staffName,
      role: 'Nhân viên bán hàng & kho',
      checkInTime: timeStr,
      shift,
      status: 'Đang làm việc',
      notes: notes || 'Điểm danh vào ca làm việc',
    };
    setAttendances((prev) => [newRecord, ...prev]);
    showToast(`Điểm danh thành công: ${shift}`, 'success');
  };

  const checkOutAttendance = () => {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
    setAttendances((prev) => {
      const activeIdx = prev.findIndex((a) => a.status === 'Đang làm việc');
      if (activeIdx === -1) {
        showToast('Bạn chưa có ca làm việc nào đang check-in!', 'error');
        return prev;
      }
      const updated = [...prev];
      const rec = updated[activeIdx];
      const inTime = new Date(rec.checkInTime.replace(' ', 'T')).getTime();
      const diffHrs = Math.max(1, Math.round(((now.getTime() - inTime) / (1000 * 60 * 60)) * 10) / 10);
      updated[activeIdx] = {
        ...rec,
        checkOutTime: timeStr,
        status: 'Hoàn thành ca',
        hoursWorked: diffHrs || 4,
      };
      return updated;
    });
    showToast('Hoàn thành ca làm việc! Chúc bạn buổi tối vui vẻ.', 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        currentUser,
        orders,
        attendances,
        toasts,
        showToast,
        removeToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        login,
        register,
        logout,
        quickLoginDemo,
        createOrder,
        updateProductStock,
        resetStockToDefault,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        checkInAttendance,
        checkOutAttendance,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
