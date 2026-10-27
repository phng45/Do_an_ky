import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Boxes,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  Search,
  Plus,
  Minus,
  RotateCcw,
  Printer,
  ChevronRight,
  TrendingUp,
  Award,
  DollarSign,
  AlertTriangle,
  Eye,
  LogOut,
  Sparkles,
  ShoppingBag,
  Check,
  X,
  FileText,
  BadgeCheck,
  Building2,
  CreditCard,
  Barcode
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND, formatDate } from '../utils/format';
import { Order, Product, ProductCategory, AttendanceRecord } from '../types';

interface StaffWorkspaceProps {
  onSwitchToStorefront: () => void;
  onOpenAuth: () => void;
  onOpenAdminDashboard?: () => void;
}

export const StaffWorkspace: React.FC<StaffWorkspaceProps> = ({
  onSwitchToStorefront,
  onOpenAuth,
  onOpenAdminDashboard,
}) => {
  const {
    currentUser,
    orders,
    products,
    attendances,
    updateOrderStatus,
    deleteOrder,
    updateProductStock,
    resetStockToDefault,
    addProduct,
    updateProduct,
    deleteProduct,
    checkInAttendance,
    checkOutAttendance,
    showToast,
    logout,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'attendance'>(() => {
    if (typeof window !== 'undefined') {
      const t = new URLSearchParams(window.location.search).get('tab');
      if (t === 'orders' || t === 'products' || t === 'attendance') {
        return t;
      }
    }
    return 'orders';
  });

  // Real-time clock for attendance
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ----------------- TAB 1: ORDER MANAGEMENT STATE -----------------
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchId = o.id.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.toLowerCase().includes(q);
        return matchId || matchName || matchPhone;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const processing = orders.filter((o) => o.status === 'processing').length;
    const shipping = orders.filter((o) => o.status === 'shipping').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const totalRev = orders.reduce((sum, o) => sum + o.total, 0);
    return { total, pending, processing, shipping, delivered, totalRev };
  }, [orders]);

  // ----------------- TAB 2: INVENTORY & PRODUCT MANAGEMENT STATE -----------------
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'low' | 'out' | 'in_stock'>('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('shoes');
  const [newProdPrice, setNewProdPrice] = useState('1500000');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSizes, setNewProdSizes] = useState('40, 41, 42, 43');
  const [newProdColors, setNewProdColors] = useState('Đen, Trắng, Đỏ');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }
      if (productStockFilter === 'low' && (p.stock <= 0 || p.stock > 3)) return false;
      if (productStockFilter === 'out' && p.stock > 0) return false;
      if (productStockFilter === 'in_stock' && p.stock <= 0) return false;

      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase().trim();
        return p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productCategoryFilter, productStockFilter, productSearchQuery]);

  const inventoryStats = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    return { totalModels: products.length, totalUnits, lowStock, outOfStock };
  }, [products]);

  // ----------------- TAB 3: ATTENDANCE STATE -----------------
  const [selectedShift, setSelectedShift] = useState<AttendanceRecord['shift']>('Ca Chiều (13:00 - 17:00)');
  const [attendanceNote, setAttendanceNote] = useState('');

  const activeAttendance = useMemo(() => {
    return attendances.find((a) => a.status === 'Đang làm việc') || null;
  }, [attendances]);

  const attendanceSummary = useMemo(() => {
    const recordedCompleted = attendances.filter((a) => a.status === 'Hoàn thành ca').length;
    const completedShifts = Math.max(24, recordedCompleted);
    const totalHours = completedShifts * 4;
    const hourlyRate = 35000;
    const basePay = totalHours * hourlyRate; // 3.360.000₫
    const bonus = 500000; // Phụ cấp trách nhiệm kho & chuyên cần
    const estimatedSalary = basePay + bonus; // 3.860.000₫
    return { completedShifts, totalHours, hourlyRate, basePay, bonus, estimatedSalary };
  }, [attendances]);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      showToast('Vui lòng nhập tên sản phẩm!', 'error');
      return;
    }
    const priceNum = parseInt(newProdPrice) || 500000;
    const stockNum = parseInt(newProdStock) || 10;
    const sizesArr = newProdSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colorsArr = newProdColors.split(',').map((c) => c.trim()).filter(Boolean);

    const catLabelMap: Record<ProductCategory, string> = {
      shoes: 'Giày bóng rổ',
      apparel: 'Áo đấu & Đồ tập',
      balls: 'Bóng thi đấu',
      accessories: 'Bảo hộ & Phụ kiện',
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: newProdName,
        category: newProdCategory,
        categoryLabel: catLabelMap[newProdCategory],
        price: priceNum,
        stock: stockNum,
        description: newProdDesc || editingProduct.description,
        sizes: sizesArr.length ? sizesArr : editingProduct.sizes,
        colors: colorsArr.length ? colorsArr : editingProduct.colors,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: newProdName,
        category: newProdCategory,
        categoryLabel: catLabelMap[newProdCategory],
        price: priceNum,
        stock: stockNum,
        initialStock: stockNum,
        rating: 5.0,
        reviewsCount: 1,
        image: '/src/assets/images/shoe_basketball_pro_1791453701740.jpg',
        description: newProdDesc || 'Sản phẩm mới nhập kho mẫu HoopZone, đạt chuẩn thi đấu bóng rổ chuyên nghiệp.',
        sizes: sizesArr.length ? sizesArr : ['M', 'L', 'XL'],
        colors: colorsArr.length ? colorsArr : ['Đen', 'Trắng'],
        specs: [{ label: 'Tình trạng', value: 'Mới 100% Chính Hãng' }],
        badge: 'Mới Nhập',
      });
    }

    setIsAddProductModalOpen(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setNewProdName(p.name);
    setNewProdCategory(p.category);
    setNewProdPrice(p.price.toString());
    setNewProdStock(p.stock.toString());
    setNewProdDesc(p.description);
    setNewProdSizes(p.sizes.join(', '));
    setNewProdColors(p.colors.join(', '));
    setIsAddProductModalOpen(true);
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ nhân viên duyệt',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          icon: Clock,
        };
      case 'processing':
        return {
          label: 'Đang đóng gói kho',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          icon: Package,
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng (GHN)',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          icon: Truck,
        };
      case 'delivered':
        return {
          label: 'Đã giao thành công',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          icon: CheckCircle2,
        };
      case 'cancelled':
        return {
          label: 'Đã hủy đơn',
          color: 'text-red-400 bg-red-500/10 border-red-500/30',
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* ----------------- TOP STAFF HEADER ----------------- */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Brand & Staff Portal Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xl font-black tracking-tight text-white font-display">
                  HOOPZONE<span className="text-blue-500">.</span>
                </span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 uppercase tracking-wide">
                  PORTAL NHÂN VIÊN
                </span>
                <span className="hidden md:inline-block text-xs text-zinc-400">
                  Vận Hành Đơn Hàng & Kho Hàng
                </span>
              </div>
            </div>

            {/* Quick Actions & User Bar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Switch to Storefront preview */}
              <button
                onClick={onSwitchToStorefront}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 rounded-lg text-xs font-medium text-amber-400 transition-colors cursor-pointer"
                title="Xem giao diện bán hàng như khách hàng thấy"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Xem Giao Diện Khách Hàng</span>
              </button>

              {/* Admin Dashboard (if admin account) */}
              {currentUser?.role === 'admin' && onOpenAdminDashboard && (
                <button
                  onClick={onOpenAdminDashboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/80 rounded-lg text-xs font-medium text-purple-300 transition-colors cursor-pointer"
                  title="Mở Bảng Quản Trị Doanh Thu Admin"
                >
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span className="hidden md:inline">Bảng Quản Trị</span>
                </button>
              )}

              {/* Staff Account Pill */}
              <div
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer transition-colors"
                title="Xem thông tin tài khoản hoặc đổi vai trò"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  {currentUser?.name.charAt(0) || 'N'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-bold text-zinc-200 truncate max-w-[130px]">
                    {currentUser?.name || 'Lê Hoàng Nam'}
                  </div>
                  <div className="text-[10px] text-blue-400 font-semibold">
                    {currentUser?.role === 'admin' ? '👑 Quản Trị Viên' : '👨‍💼 Nhân Viên Kho'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Main Duty Tabs */}
          <div className="flex items-center gap-2 border-t border-zinc-800/80 py-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>1. KIỂM SOÁT ĐƠN HÀNG ONLINE</span>
              {orderStats.pending > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] font-extrabold bg-amber-400 text-zinc-950">
                  {orderStats.pending} mới
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>2. QUẢN LÝ SẢN PHẨM & KHO</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {products.length} mẫu
              </span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>3. CHẤM CÔNG & CA LÀM VIỆC</span>
              {activeAttendance ? (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Đang làm ca
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  Chưa vào ca
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- MAIN CONTENT WORKSPACE ----------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: KIỂM SOÁT ĐƠN HÀNG ONLINE                                         */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Tổng đơn online</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white tabular-nums">{orderStats.total}</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-amber-500/30 rounded-xl">
                <span className="text-xs text-amber-400 font-semibold block mb-1">Chờ xác nhận duyệt</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-amber-400 tabular-nums">{orderStats.pending}</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-blue-500/30 rounded-xl">
                <span className="text-xs text-blue-400 font-semibold block mb-1">Đang đóng gói kho</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-blue-400 tabular-nums">{orderStats.processing}</span>
                  <Boxes className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-purple-500/30 rounded-xl">
                <span className="text-xs text-purple-400 font-semibold block mb-1">Đang vận chuyển (GHN)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-purple-400 tabular-nums">{orderStats.shipping}</span>
                  <Truck className="w-4 h-4 text-purple-400" />
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-emerald-500/30 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-xs text-emerald-400 font-semibold block mb-1">Giao thành công & Thu tiền</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">{orderStats.delivered}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <button
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === 'all'
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  Tất cả ({orderStats.total})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === 'pending'
                      ? 'bg-amber-500 text-zinc-950'
                      : 'text-amber-400 hover:bg-zinc-800'
                  }`}
                >
                  Chờ xác nhận ({orderStats.pending})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('processing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === 'processing'
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-400 hover:bg-zinc-800'
                  }`}
                >
                  Đóng gói ({orderStats.processing})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('shipping')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === 'shipping'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-400 hover:bg-zinc-800'
                  }`}
                >
                  Đang giao ({orderStats.shipping})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('delivered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === 'delivered'
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-400 hover:bg-zinc-800'
                  }`}
                >
                  Đã giao ({orderStats.delivered})
                </button>
              </div>

              {/* Search by Order ID, Customer name or Phone */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn, tên khách, SĐT..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-12 text-center">
                <Package className="w-12 h-12 stroke-[1.5] text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-zinc-300 mb-1">Không tìm thấy đơn hàng nào</h3>
                <p className="text-xs text-zinc-500 mb-4">
                  Thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc trạng thái đơn.
                </p>
                <button
                  onClick={() => {
                    setOrderStatusFilter('all');
                    setOrderSearchQuery('');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Hiển Thị Tất Cả Đơn Hàng
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getOrderStatusBadge(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={order.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 transition-all hover:border-zinc-700/80"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-black text-amber-400 font-display">
                            #{order.id}
                          </span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-xs text-zinc-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-xs text-zinc-300 font-medium">
                            {order.items.reduce((acc, i) => acc + i.quantity, 0)} sản phẩm
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                          </span>

                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
                            title="In Phiếu Xuất Kho & Vận Đơn"
                          >
                            <Printer className="w-3.5 h-3.5 text-zinc-400" />
                            <span>In Phiếu Xuất</span>
                          </button>
                        </div>
                      </div>

                      {/* Customer Info Card */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80">
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Khách hàng nhận hàng</span>
                          <p className="font-bold text-zinc-100 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-amber-500" />
                            {order.customerName}
                          </p>
                          <p className="text-zinc-400 mt-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" />
                            {order.customerPhone}
                          </p>
                        </div>

                        <div>
                          <span className="text-zinc-500 block mb-0.5">Địa chỉ giao hàng</span>
                          <p className="text-zinc-300 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{order.shippingAddress}, {order.city}</span>
                          </p>
                          {order.notes && (
                            <p className="text-[11px] text-amber-400 mt-1 italic">
                              Ghi chú: {order.notes}
                            </p>
                          )}
                        </div>

                        <div>
                          <span className="text-zinc-500 block mb-0.5">Hình thức thanh toán</span>
                          <p className="font-bold text-zinc-200 uppercase flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                            {order.paymentMethod === 'cod' ? 'COD (Tiền mặt khi nhận)' : 'VietQR (Đã chuyển khoản)'}
                          </p>
                          <p className="text-zinc-400 mt-1">
                            Tổng thu: <strong className="text-amber-400 text-sm">{formatVND(order.total)}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/60 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.productName}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded-lg bg-zinc-950 border border-zinc-800"
                              />
                              <div>
                                <span className="font-bold text-zinc-100 block">{item.productName}</span>
                                <span className="text-zinc-400 text-[11px]">
                                  Size: <strong className="text-zinc-300">{item.selectedSize}</strong> · Màu: <strong className="text-zinc-300">{item.selectedColor}</strong> · Số lượng: <strong className="text-amber-400">{item.quantity}</strong>
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-zinc-200 tabular-nums">
                              {formatVND(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Staff Fulfillment Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800 bg-zinc-950/40 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">Thao tác tác nghiệp:</span>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'processing');
                                showToast(`Đã duyệt đơn #${order.id} và chuyển sang đóng gói kho!`, 'success');
                              }}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Xác Nhận & Đóng Gói Kho</span>
                            </button>
                          )}

                          {order.status === 'processing' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'shipping');
                                showToast(`Đã xuất kho đơn #${order.id} và bàn giao đơn vị vận chuyển GHN!`, 'success');
                              }}
                              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <Truck className="w-4 h-4" />
                              <span>Xuất Kho & Giao Vận Chuyển</span>
                            </button>
                          )}

                          {order.status === 'shipping' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'delivered');
                                showToast(`Đơn hàng #${order.id} đã giao thành công và thu tiền!`, 'success');
                              }}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Xác Nhận Đã Giao & Thu Tiền</span>
                            </button>
                          )}

                          {order.status === 'delivered' && (
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                              <BadgeCheck className="w-4 h-4" />
                              Đơn đã giao hoàn tất, tiền đã nhập quỹ
                            </span>
                          )}
                        </div>

                        {/* Direct status selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Đổi trạng thái:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="processing">Đang đóng gói kho</option>
                            <option value="shipping">Đang giao hàng</option>
                            <option value="delivered">Đã giao thành công</option>
                            <option value="cancelled">Hủy đơn hàng</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: QUẢN LÝ SẢN PHẨM & KHO HÀNG (QLSANPHAM)                            */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Stock Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Mẫu sản phẩm quản lý</span>
                <span className="text-2xl font-black text-white tabular-nums">{inventoryStats.totalModels} mẫu</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Tổng sản phẩm trong kho</span>
                <span className="text-2xl font-black text-blue-400 tabular-nums">{inventoryStats.totalUnits} chiếc</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-amber-500/30 rounded-xl">
                <span className="text-xs text-amber-400 font-semibold block mb-1">Sắp hết hàng (≤ 3)</span>
                <span className="text-2xl font-black text-amber-400 tabular-nums">{inventoryStats.lowStock} mẫu</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-red-500/30 rounded-xl">
                <span className="text-xs text-red-400 font-semibold block mb-1">Tạm hết hàng (0)</span>
                <span className="text-2xl font-black text-red-400 tabular-nums">{inventoryStats.outOfStock} mẫu</span>
              </div>
            </div>

            {/* Product Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Tìm tên sản phẩm, mã..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-700/80 text-zinc-300 text-xs rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="shoes">Giày bóng rổ</option>
                  <option value="apparel">Áo đấu & Đồ tập</option>
                  <option value="balls">Bóng thi đấu</option>
                  <option value="accessories">Bảo hộ & Phụ kiện</option>
                </select>

                {/* Stock status filter */}
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-700/80 text-zinc-300 text-xs rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none"
                >
                  <option value="all">Tất cả trạng thái kho</option>
                  <option value="in_stock">Còn hàng (&gt; 3)</option>
                  <option value="low">Sắp hết hàng (≤ 3)</option>
                  <option value="out">Hết hàng (0)</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setNewProdName('');
                    setNewProdDesc('');
                    setIsAddProductModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>

                <button
                  onClick={resetStockToDefault}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                  title="Khôi phục số lượng mẫu ban đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Khôi Phục Mặc Định</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold text-[11px] border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Sản Phẩm</th>
                      <th className="py-3 px-4">Danh Mục</th>
                      <th className="py-3 px-4">Đơn Giá</th>
                      <th className="py-3 px-4 text-center">Tồn Kho Thực Tế</th>
                      <th className="py-3 px-4">Size & Màu Sắc</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredProducts.map((p) => {
                      const isLow = p.stock > 0 && p.stock <= 3;
                      const isOut = p.stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 object-cover rounded-lg bg-zinc-950 border border-zinc-800 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-zinc-100 block text-sm">{p.name}</span>
                                <span className="text-zinc-500 text-[11px] line-clamp-1 max-w-[260px]">
                                  {p.description}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                              {p.categoryLabel}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-bold text-amber-400 tabular-nums">
                            {formatVND(p.price)}
                          </td>

                          {/* Quick Stock Controls */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-700/80 rounded-lg p-1">
                              <button
                                onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer"
                                title="Giảm 1 cái"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span
                                className={`w-10 text-center font-extrabold text-sm tabular-nums ${
                                  isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                                }`}
                              >
                                {p.stock}
                              </span>
                              <button
                                onClick={() => updateProductStock(p.id, p.stock + 1)}
                                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer"
                                title="Tăng 1 cái"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-[11px] text-zinc-400 max-w-[200px]">
                              <div>Sizes: {p.sizes.slice(0, 4).join(', ')}{p.sizes.length > 4 ? '...' : ''}</div>
                              <div className="text-zinc-500 mt-0.5">{p.colors.slice(0, 2).join(', ')}</div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                Hết hàng
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <AlertCircle className="w-3 h-3" />
                                Sắp hết (≤ 3)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                Còn hàng
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(p)}
                                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium cursor-pointer"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded cursor-pointer"
                                title="Xóa sản phẩm"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CHẤM CÔNG & CA LÀM VIỆC (CHẤM CÔNG)                                */}
        {/* ========================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Live Clock & Shift Check-in Card */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-blue-950/40 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Clock & Staff Info */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hệ Thống Chấm Công Điện Tử HoopZone</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    {currentTime.toLocaleTimeString('vi-VN')}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 capitalize font-medium">
                    {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>

                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm">
                      {currentUser?.name.charAt(0) || 'L'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{currentUser?.name || 'Lê Hoàng Nam (Nhân Viên)'}</p>
                      <p className="text-xs text-zinc-400">
                        Mã NV: <strong className="text-blue-400">NV-5231</strong> · Vị trí: <strong>Nhân viên Bán hàng & Quản lý Kho</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Check-in / Check-out Box */}
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Chọn ca làm việc hôm nay:
                    </label>
                    <select
                      value={selectedShift}
                      disabled={!!activeAttendance}
                      onChange={(e) => setSelectedShift(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-blue-500 disabled:opacity-60"
                    >
                      <option value="Ca Sáng (08:00 - 12:00)">Ca Sáng (08:00 - 12:00) · 4 tiếng</option>
                      <option value="Ca Chiều (13:00 - 17:00)">Ca Chiều (13:00 - 17:00) · 4 tiếng</option>
                      <option value="Ca Tối (17:30 - 21:30)">Ca Tối (17:30 - 21:30) · 4 tiếng</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Ghi chú ca làm (nếu có)..."
                      value={attendanceNote}
                      onChange={(e) => setAttendanceNote(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>

                  {activeAttendance ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">Đang trong ca làm việc:</span>
                          <span className="font-mono">{activeAttendance.shift}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Check-in lúc: <strong>{activeAttendance.checkInTime}</strong>
                        </p>
                      </div>

                      <button
                        onClick={checkOutAttendance}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>KẾT THÚC CA LÀM (CHECK-OUT)</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => checkInAttendance(selectedShift, attendanceNote)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>ĐIỂM DANH VÀO CA (CHECK-IN)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance Monthly Summary & Salary Calculation */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Số ca đã làm trong tháng</span>
                <span className="text-2xl font-black text-white tabular-nums">{attendanceSummary.completedShifts} ca</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Tổng giờ làm tích lũy</span>
                <span className="text-2xl font-black text-blue-400 tabular-nums">{attendanceSummary.totalHours} giờ</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Định mức lương giờ</span>
                <span className="text-2xl font-black text-zinc-200 tabular-nums">{formatVND(attendanceSummary.hourlyRate)}/h</span>
              </div>
              <div className="p-4 bg-zinc-900 border border-emerald-500/30 rounded-xl relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-emerald-400 font-bold block">Tạm tính thực lĩnh tháng 10</span>
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    Đã duyệt
                  </span>
                </div>
                <span className="text-2xl font-black text-emerald-400 tabular-nums block">{formatVND(attendanceSummary.estimatedSalary)}</span>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Gồm: {formatVND(attendanceSummary.basePay)} (lương giờ) + {formatVND(attendanceSummary.bonus)} (phụ cấp & chuyên cần)
                </p>
              </div>
            </div>

            {/* Attendance History Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Bảng Nhật Ký Chấm Công Chi Tiết (Tháng 10/2026)</span>
                </h4>
                <span className="text-xs text-zinc-500">
                  Tổng {attendances.length} bản ghi
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-semibold text-[11px] border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Nhân Viên</th>
                      <th className="py-3 px-4">Ca Làm Việc</th>
                      <th className="py-3 px-4">Giờ Vào (Check-in)</th>
                      <th className="py-3 px-4">Giờ Ra (Check-out)</th>
                      <th className="py-3 px-4 text-center">Số Giờ Thực Tế</th>
                      <th className="py-3 px-4">Tình Trạng</th>
                      <th className="py-3 px-4">Ghi Chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {attendances.map((rec) => (
                      <tr key={rec.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          {rec.staffName}
                        </td>
                        <td className="py-3 px-4 font-medium text-blue-300">
                          {rec.shift}
                        </td>
                        <td className="py-3 px-4 text-zinc-300 font-mono">
                          {rec.checkInTime}
                        </td>
                        <td className="py-3 px-4 text-zinc-300 font-mono">
                          {rec.checkOutTime || '--- (Đang làm)'}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-400 tabular-nums">
                          {rec.hoursWorked ? `${rec.hoursWorked}h` : '---'}
                        </td>
                        <td className="py-3 px-4">
                          {rec.status === 'Đang làm việc' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                              Đang làm việc
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Hoàn thành ca
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-zinc-400 italic">
                          {rec.notes || '---'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- MODAL: IN PHIẾU XUẤT KHO & VẬN ĐƠN ----------------- */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Print Header */}
            <div className="border-b-2 border-zinc-900 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950">
                  HOOPZONE BASKETBALL STORE
                </h2>
                <p className="text-xs text-zinc-600">
                  Hệ thống phân phối giày bóng rổ, áo đấu & phụ kiện chính hãng
                </p>
                <p className="text-xs text-zinc-600">
                  Địa chỉ: Số 15 Lê Duẩn, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh · Hotline: 1900 6868
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-zinc-900 text-white font-mono font-bold text-xs rounded">
                  PHIẾU XUẤT KHO
                </span>
                <p className="text-xs text-zinc-700 mt-1 font-mono font-bold">
                  Mã: #{selectedOrderForInvoice.id}
                </p>
              </div>
            </div>

            {/* Recipient info */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-zinc-200">
              <div>
                <p className="text-zinc-500">Khách hàng nhận:</p>
                <p className="text-sm font-bold text-zinc-900">{selectedOrderForInvoice.customerName}</p>
                <p className="text-zinc-700">SĐT: {selectedOrderForInvoice.customerPhone}</p>
                <p className="text-zinc-700">Đ/c: {selectedOrderForInvoice.shippingAddress}, {selectedOrderForInvoice.city}</p>
              </div>

              <div>
                <p className="text-zinc-500">Nhân viên đóng gói & xuất kho:</p>
                <p className="text-sm font-bold text-zinc-900">{currentUser?.name || 'Lê Hoàng Nam (Nhân Viên)'}</p>
                <p className="text-zinc-700">Ngày lập phiếu: {formatDate(selectedOrderForInvoice.createdAt)}</p>
                <p className="text-zinc-700">
                  Phương thức: <strong>{selectedOrderForInvoice.paymentMethod === 'cod' ? 'Thu hộ tiền mặt (COD)' : 'Chuyển khoản VietQR'}</strong>
                </p>
              </div>
            </div>

            {/* Item Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs border border-zinc-200">
                <thead className="bg-zinc-100 text-zinc-800 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-2">STT</th>
                    <th className="p-2">Tên Hàng Hóa / Mã</th>
                    <th className="p-2">Size / Màu</th>
                    <th className="p-2 text-center">SL</th>
                    <th className="p-2 text-right">Đơn Giá</th>
                    <th className="p-2 text-right">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {selectedOrderForInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium">{idx + 1}</td>
                      <td className="p-2 font-bold">{it.productName}</td>
                      <td className="p-2 text-zinc-600">{it.selectedSize} - {it.selectedColor}</td>
                      <td className="p-2 text-center font-bold">{it.quantity}</td>
                      <td className="p-2 text-right tabular-nums">{formatVND(it.price)}</td>
                      <td className="p-2 text-right font-bold tabular-nums">{formatVND(it.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="mt-3 text-right space-y-1 text-xs">
                <p className="text-zinc-600">
                  Tạm tính: <strong className="text-zinc-900">{formatVND(selectedOrderForInvoice.subtotal)}</strong>
                </p>
                {selectedOrderForInvoice.discount > 0 && (
                  <p className="text-zinc-600">
                    Chiết khấu voucher: <strong className="text-red-600">-{formatVND(selectedOrderForInvoice.discount)}</strong>
                  </p>
                )}
                <p className="text-sm font-black text-zinc-950 pt-1 border-t border-zinc-300">
                  TỔNG CỘNG THANH TOÁN: {formatVND(selectedOrderForInvoice.total)}
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs text-zinc-700">
              <div>
                <p className="font-bold">Người Lập Phiếu</p>
                <p className="text-[11px] text-zinc-500 italic mt-1">(Ký, ghi rõ họ tên)</p>
                <div className="h-12"></div>
                <p className="font-semibold text-zinc-900">{currentUser?.name || 'Lê Hoàng Nam'}</p>
              </div>
              <div>
                <p className="font-bold">Thủ Kho / Vận Chuyển</p>
                <p className="text-[11px] text-zinc-500 italic mt-1">(Ký xuất kho)</p>
                <div className="h-12"></div>
                <p className="font-semibold text-zinc-900">GHN Express</p>
              </div>
              <div>
                <p className="font-bold">Người Nhận Hàng</p>
                <p className="text-[11px] text-zinc-500 italic mt-1">(Ký nhận và thanh toán)</p>
                <div className="h-12"></div>
                <p className="font-semibold text-zinc-900">{selectedOrderForInvoice.customerName}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-end gap-3 print:hidden">
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold rounded-lg cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast('Đang gửi lệnh in phiếu xuất kho...', 'info');
                }}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: THÊM / SỬA SẢN PHẨM MỚI ----------------- */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-400" />
                <span>{editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Kho'}</span>
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giày Bóng Rổ Giannis Immortality..."
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Danh mục</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white cursor-pointer focus:outline-none focus:border-blue-500"
                  >
                    <option value="shoes">Giày bóng rổ</option>
                    <option value="apparel">Áo đấu & Đồ tập</option>
                    <option value="balls">Bóng thi đấu</option>
                    <option value="accessories">Bảo hộ & Phụ kiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Đơn giá bán (VNĐ)</label>
                <input
                  type="number"
                  step="50000"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Các kích cỡ (phẩy cách)</label>
                  <input
                    type="text"
                    placeholder="40, 41, 42, 43..."
                    value={newProdSizes}
                    onChange={(e) => setNewProdSizes(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Màu sắc (phẩy cách)</label>
                  <input
                    type="text"
                    placeholder="Đen, Trắng, Đỏ..."
                    value={newProdColors}
                    onChange={(e) => setNewProdColors(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả chất liệu, công nghệ đệm, tính năng..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer shadow-md"
                >
                  {editingProduct ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
