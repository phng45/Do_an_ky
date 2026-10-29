import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Ticket,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  Menu,
  Star,
  Plus,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Store,
  LogOut,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  Trash2,
  Edit,
  Printer,
  Sparkles,
  BarChart3,
  Boxes,
  Briefcase,
  Lightbulb,
  Wallet,
  Building2,
  Phone,
  Calendar,
  X,
  RefreshCw,
  Sliders,
  FileText
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND, formatDate } from '../utils/format';
import { Order, Product, ProductCategory, AttendanceRecord } from '../types';
//Test case, dữ liệu mẫu, sửa lỗi,
interface AdminPortalProps {
  onSwitchToStorefront: () => void;
  onSwitchToStaffPortal?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onSwitchToStorefront,
  onSwitchToStaffPortal,
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
    quickLoginDemo,
    logout,
    showToast,
  } = useShop();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'vouchers' | 'attendance' | 'revenue'>(() => {
    if (typeof window !== 'undefined') {
      const t = new URLSearchParams(window.location.search).get('tab');
      if (t === 'products' || t === 'orders' || t === 'vouchers' || t === 'attendance' || t === 'revenue') {
        return t;
      }
    }
    return 'analytics';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Search in admin
  const [searchQuery, setSearchQuery] = useState('');

  // Voucher local state
  const [vouchers, setVouchers] = useState([
    { id: 'vc-1', code: 'DUNK10', discountPercent: 10, minOrder: 500000, description: 'Giảm 10% cho đơn từ 500.000₫', active: true },
    { id: 'vc-2', code: 'HOOPVIP', discountPercent: 15, minOrder: 1500000, description: 'Ưu đãi Baller VIP giảm 15%', active: true },
    { id: 'vc-3', code: 'FREESHIP', discountPercent: 5, minOrder: 0, description: 'Hỗ trợ phí vận chuyển', active: true },
    { id: 'vc-4', code: 'PLAYOFF2026', discountPercent: 20, minOrder: 2000000, description: 'Mùa giải Playoff giảm 20%', active: false },
  ]);
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherPercent, setNewVoucherPercent] = useState('10');
  const [newVoucherMinOrder, setNewVoucherMinOrder] = useState('500000');

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'shoes' as ProductCategory,
    price: 1500000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    description: 'Sản phẩm thể thao cao cấp HoopZone',
  });

  // Calculate Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total ?? (o as any).totalAmount ?? 0), 0);
  }, [orders]);

  const deliveredOrders = useMemo(() => orders.filter((o) => o.status === 'delivered'), [orders]);
  const deliveredRevenue = useMemo(() => deliveredOrders.reduce((sum, o) => sum + (o.total ?? 0), 0), [deliveredOrders]);

  // Order stats
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const shippingOrders = orders.filter((o) => o.status === 'shipping' || o.status === 'processing');

  // Customer avatars for table simulation
  const agentAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  ];

  // Helper for progress achievement styling
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'bg-emerald-500';
    if (percent >= 60) return 'bg-blue-500';
    if (percent >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'shipping':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">In Progress</span>;
      case 'processing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">On Hold</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">Pending</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">Canceled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleToggleVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
    showToast('Đã cập nhật trạng thái voucher!', 'info');
  };

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode.trim()) {
      showToast('Vui lòng nhập mã Voucher!', 'error');
      return;
    }
    const percent = parseInt(newVoucherPercent) || 10;
    const min = parseInt(newVoucherMinOrder) || 0;
    const item = {
      id: `vc-${Date.now()}`,
      code: newVoucherCode.trim().toUpperCase(),
      discountPercent: percent,
      minOrder: min,
      description: `Giảm ${percent}% cho đơn từ ${formatVND(min)}`,
      active: true,
    };
    setVouchers((prev) => [item, ...prev]);
    setNewVoucherCode('');
    showToast(`Đã tạo voucher mới: ${item.code}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#f1f4f6] text-[#495057] font-sans flex flex-col">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION BAR (ArchitectUI Style) */}
      {/* ========================================================================= */}
      <header className="h-16 bg-white border-b border-[#e9ecef] shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        {/* Left: Brand & Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors"
            title="Đóng / Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif italic font-bold tracking-tight text-zinc-900 select-none">
              Architect
            </span>
            <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-600 text-white tracking-wider ml-1">
              Admin
            </span>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex items-center relative ml-6">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, mã đơn, khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-72 text-xs bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-zinc-800"
            />
          </div>
        </div>

        {/* Right: Quick Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Create Button */}
          <button
            onClick={() => {
              setActiveTab('products');
              setIsAddProductOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New</span>
          </button>

          {/* Switch to Storefront Button */}
          <button
            onClick={onSwitchToStorefront}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
            title="Xem giao diện người mua hàng (Storefront)"
          >
            <Store className="w-4 h-4" />
            <span className="hidden md:inline">Xem Storefront Khách Hàng</span>
            <span className="md:hidden">Storefront</span>
          </button>

          {/* Role Switcher Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 text-xs font-semibold">
            <span className="text-zinc-500 px-2">Vai trò:</span>
            <button
              onClick={() => quickLoginDemo('admin')}
              className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold shadow-xs cursor-pointer"
            >
              Admin
            </button>
            <button
              onClick={() => {
                quickLoginDemo('staff');
                if (onSwitchToStaffPortal) onSwitchToStaffPortal();
              }}
              className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-zinc-700 rounded cursor-pointer transition-colors"
            >
              Nhân viên
            </button>
            <button
              onClick={() => {
                quickLoginDemo('user');
                onSwitchToStorefront();
              }}
              className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-zinc-700 rounded cursor-pointer transition-colors"
            >
              Khách hàng
            </button>
          </div>

          {/* Profile & Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-xs"
            />
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-bold text-zinc-900">{currentUser?.name || 'Admin Hoàng Long'}</div>
              <div className="text-[11px] text-zinc-500">Quản trị viên tối cao</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CANVAS */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (ArchitectUI Menu Structure) */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
          } lg:translate-x-0 transition-all duration-300 ease-in-out bg-white border-r border-[#e9ecef] shadow-xs flex flex-col flex-shrink-0 z-30 select-none overflow-y-auto`}
        >
          <div className="py-4">
            {/* Section 1: MAIN NAVIGATION */}
            <div className="px-5 py-2 text-[11px] font-black uppercase tracking-wider text-blue-600">
              MAIN NAVIGATION
            </div>
            <nav className="space-y-0.5 px-3">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-blue-600' : 'text-zinc-400'}`} />
                  <span>Analytics Dashboard</span>
                </div>
                {activeTab === 'analytics' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
              </button>
            </nav>

            {/* Section 2: MANAGEMENT */}
            <div className="px-5 pt-5 pb-2 text-[11px] font-black uppercase tracking-wider text-zinc-400">
              MANAGEMENT
            </div>
            <nav className="space-y-0.5 px-3">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-blue-600' : 'text-zinc-400'}`} />
                  <span>Sản Phẩm & Kho Hàng</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className={`w-4 h-4 ${activeTab === 'orders' ? 'text-blue-600' : 'text-zinc-400'}`} />
                  <span>Đơn Hàng & Vận Chuyển</span>
                </div>
                {pendingOrders.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white animate-pulse">
                    {pendingOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('vouchers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'vouchers'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Ticket className={`w-4 h-4 ${activeTab === 'vouchers' ? 'text-blue-600' : 'text-zinc-400'}`} />
                  <span>Mã Giảm Giá Voucher</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                  {vouchers.filter((v) => v.active).length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${activeTab === 'attendance' ? 'text-blue-600' : 'text-zinc-400'}`} />
                  <span>Chấm Công & Nhân Sự</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Live
                </span>
              </button>
            </nav>

            {/* Section 3: CHARTS & REPORTS */}
            <div className="px-5 pt-5 pb-2 text-[11px] font-black uppercase tracking-wider text-zinc-400">
              CHARTS & REPORTS
            </div>
            <nav className="space-y-0.5 px-3">
              <button
                onClick={() => setActiveTab('revenue')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'revenue'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className={`w-4 h-4 ${activeTab === 'revenue' ? 'text-blue-600' : 'text-zinc-400'}`} />
                  <span>Báo Cáo Doanh Thu</span>
                </div>
              </button>
            </nav>

            {/* Portal Switcher Card */}
            <div className="mx-3 mt-8 p-3.5 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl text-white shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HoopZone Back-Office</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed mb-3">
                Chuyển nhanh sang không gian làm việc của nhân viên kiểm kho.
              </p>
              {onSwitchToStaffPortal && (
                <button
                  onClick={onSwitchToStaffPortal}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center block"
                >
                  Mở Portal Nhân Viên &rarr;
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* ========================================================================= */}
          {/* HEADER BANNER: Analytics Dashboard (ArchitectUI Style) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-zinc-200/80 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-2xs">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  Analytics Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Hệ thống phân tích và quản trị dữ liệu tập trung HoopZone Store & Basketball Apparel.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => showToast('Đã lưu bảng điều khiển yêu thích!', 'success')}
                className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg cursor-pointer transition-colors"
                title="Yêu thích"
              >
                <Star className="w-4 h-4 fill-zinc-400 text-zinc-400" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsAddProductOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Mới / Thêm Hàng</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: ANALYTICS DASHBOARD (ArchitectUI Exact Layout) */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* PORTFOLIO PERFORMANCE / 3 KPI CARDS (ArchitectUI Style) */}
              <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
                <div className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-6 pb-2 border-b border-zinc-100">
                  Portfolio Performance
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Card 1: Cash Deposits (Doanh thu) */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/70 border border-zinc-100">
                    <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Cash Deposits
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-0.5">
                        {formatVND(totalRevenue)}
                      </div>
                      <div className="text-xs font-semibold text-orange-600 mt-0.5">
                        +18.4% tăng trưởng kỳ này
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Invested Dividends (Lợi nhuận gộp) */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/70 border border-zinc-100">
                    <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Invested Dividends
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-0.5">
                        {formatVND(Math.round(totalRevenue * 0.42))}
                      </div>
                      <div className="text-xs font-semibold text-rose-600 mt-0.5">
                        Grow Rate: 42.0%
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Capital Gains (Giá trị TB đơn AOV) */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/70 border border-zinc-100">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Capital Gains
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-0.5">
                        {formatVND(orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0)}
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                        Increased by +7.35%
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Complete Report Centered Button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>View Complete Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* COMPANY AGENTS STATUS TABLE (ArchitectUI Exact Layout) */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
                  <div className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                    Company Agents Status
                  </div>
                  <div className="text-xs text-zinc-500">
                    Cập nhật thời gian thực từ cổng VietQR & COD
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        <th className="py-3 px-3">#</th>
                        <th className="py-3 px-3">Avatar</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4 w-44">Target Achievement</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-xs">
                      {orders.map((o, index) => {
                        const avatarUrl = agentAvatars[index % agentAvatars.length];
                        const fakePercent = [71, 54, 97, 89, 65, 82][index % 6];
                        return (
                          <tr key={o.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-zinc-500">
                              #{54 + index}
                            </td>
                            <td className="py-3 px-3">
                              <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full object-cover border border-zinc-200 shadow-2xs"
                              />
                            </td>
                            <td className="py-3 px-4 font-bold text-zinc-900">
                              {o.customerName}
                            </td>
                            <td className="py-3 px-4 text-zinc-600">
                              <span className="font-semibold text-blue-700">
                                {o.paymentMethod === 'banking' ? 'VietQR 24/7' : 'COD Delivery'}
                              </span>
                              <span className="text-zinc-400 text-[11px] block">{o.city || 'Hà Nội'}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {getStatusBadge(o.status)}
                            </td>
                            <td className="py-3 px-4 text-zinc-600 font-mono text-[11px]">
                              {formatDate(o.createdAt).split(' ')[0]}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[11px] text-zinc-700 w-8">
                                  {fakePercent}%
                                </span>
                                <div className="flex-1 bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200">
                                  <div
                                    className={`h-full ${getProgressColor(fakePercent)} rounded-full`}
                                    style={{ width: `${fakePercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    const nextStatus = o.status === 'pending' ? 'shipping' : 'delivered';
                                    updateOrderStatus(o.id, nextStatus as any);
                                  }}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => deleteOrder(o.id)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
                                >
                                  Hủy
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* View Complete Report Centered Button */}
                <div className="text-center pt-6">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>View Complete Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCTS & STOCK MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Quản Lý Sản Phẩm & Kho Hàng Mẫu</h2>
                  <p className="text-xs text-zinc-500">
                    Cập nhật số lượng tồn kho theo từng biến thể kích cỡ (Size 39-45 cho giày, S-XXL cho áo).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetStockToDefault}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Về Mặc Định</span>
                  </button>

                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Sản Phẩm Mới</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Hình ảnh</th>
                      <th className="py-3 px-4">Tên Sản Phẩm</th>
                      <th className="py-3 px-4">Phân Loại</th>
                      <th className="py-3 px-4">Giá Niêm Yết</th>
                      <th className="py-3 px-4">Tồn Kho</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover border border-zinc-200 shadow-2xs"
                          />
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-900">
                          {p.name}
                          <span className="text-[11px] text-zinc-400 block font-normal">
                            Sizes: {p.sizes.join(', ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                            {p.categoryLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-900">
                          {formatVND(p.price)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-zinc-800">{p.stock}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                                className="w-5 h-5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateProductStock(p.id, p.stock + 1)}
                                className="w-5 h-5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {p.stock > 3 ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              Còn Hàng
                            </span>
                          ) : p.stock > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                              Sắp Hết
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
                              Hết Hàng
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => {
                                const newStockStr = prompt(`Nhập số lượng tồn kho mới cho [${p.name}]:`, p.stock.toString());
                                if (newStockStr !== null) {
                                  const val = parseInt(newStockStr);
                                  if (!isNaN(val) && val >= 0) {
                                    updateProductStock(p.id, val);
                                    showToast(`Đã cập nhật tồn kho [${p.name}] = ${val}`, 'success');
                                  }
                                }
                              }}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded cursor-pointer transition-colors"
                            >
                              Sửa Kho
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ORDERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Quản Lý & Kiểm Soát Toàn Bộ Đơn Hàng</h2>
                  <p className="text-xs text-zinc-500">
                    Phê duyệt, đóng gói và theo dõi tiến độ giao hàng cho khách hàng.
                  </p>
                </div>
                <div className="text-xs font-bold text-zinc-600">
                  Tổng cộng: {orders.length} đơn hàng
                </div>
              </div>

              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="border border-zinc-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-blue-700 text-sm">#{o.id}</span>
                        {getStatusBadge(o.status)}
                        <span className="text-xs text-zinc-400">
                          {formatDate(o.createdAt)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-500 mr-2">Tổng tiền:</span>
                        <span className="text-base font-extrabold text-zinc-900">
                          {formatVND(o.total)}
                        </span>
                      </div>
                    </div>

                    <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600">
                      <div>
                        <div><strong>Khách hàng:</strong> {o.customerName} - {o.customerPhone}</div>
                        <div><strong>Địa chỉ:</strong> {o.shippingAddress}, {o.city}</div>
                      </div>
                      <div>
                        <div><strong>Hình thức:</strong> {o.paymentMethod === 'banking' ? 'Chuyển khoản VietQR' : 'Thanh toán tiền mặt (COD)'}</div>
                        <div><strong>Mặt hàng:</strong> {o.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-zinc-500">Chuyển trạng thái:</span>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'processing')}
                          className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded hover:bg-amber-200 cursor-pointer"
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'shipping')}
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded hover:bg-blue-200 cursor-pointer"
                        >
                          Đang giao
                        </button>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'delivered')}
                          className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded hover:bg-emerald-200 cursor-pointer"
                        >
                          Hoàn tất
                        </button>
                      </div>

                      <button
                        onClick={() => deleteOrder(o.id)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-bold cursor-pointer"
                      >
                        Xóa đơn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: VOUCHERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'vouchers' && (
            <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Quản Lý Chương Trình Khuyến Mãi & Voucher</h2>
                  <p className="text-xs text-zinc-500">
                    Phát hành mã giảm giá kích cầu mua sắm bóng rổ theo mùa giải.
                  </p>
                </div>
              </div>

              {/* Add Voucher Form */}
              <form onSubmit={handleAddVoucher} className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-6 flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Mã Voucher</label>
                  <input
                    type="text"
                    placeholder="VD: DUNK20"
                    value={newVoucherCode}
                    onChange={(e) => setNewVoucherCode(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-zinc-300 rounded text-xs font-mono font-bold uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Giảm (%)</label>
                  <input
                    type="number"
                    value={newVoucherPercent}
                    onChange={(e) => setNewVoucherPercent(e.target.value)}
                    className="w-20 px-3 py-1.5 bg-white border border-zinc-300 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">Đơn Tối Thiểu (₫)</label>
                  <input
                    type="number"
                    value={newVoucherMinOrder}
                    onChange={(e) => setNewVoucherMinOrder(e.target.value)}
                    className="w-36 px-3 py-1.5 bg-white border border-zinc-300 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs cursor-pointer"
                >
                  Tạo Voucher Mới
                </button>
              </form>

              {/* Vouchers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vouchers.map((v) => (
                  <div key={v.id} className="border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-blue-700 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {v.code}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          Giảm {v.discountPercent}%
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{v.description}</p>
                      <p className="text-[11px] text-zinc-400">Đơn tối thiểu: {formatVND(v.minOrder)}</p>
                    </div>

                    <button
                      onClick={() => handleToggleVoucher(v.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        v.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                      }`}
                    >
                      {v.active ? 'Kích hoạt' : 'Tạm khóa'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: ATTENDANCE & STAFF MANAGEMENT & PAYROLL */}
          {/* ========================================================================= */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">Quản Lý Nhân Sự, Chấm Công & Bảng Lương</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Theo dõi giờ vào/ra ca trực (timestamp), định mức giờ công và phê duyệt quyết toán lương tháng 10/2026.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Đã xuất báo cáo bảng lương tháng 10 ra file Excel!', 'success')}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-blue-200 flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Xuất Báo Cáo Lương</span>
                    </button>
                    <button
                      onClick={() => showToast('Tất cả bảng lương đã được đối soát và duyệt chi thành công!', 'success')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Duyệt Chi Toàn Bộ</span>
                    </button>
                  </div>
                </div>

                {/* 4 Payroll KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/70">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                      Tổng Quỹ Lương Tháng 10
                    </span>
                    <div className="text-2xl font-black text-zinc-900 tabular-nums">
                      11.570.000 ₫
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                      Đã tối ưu 4.2% chi phí vận hành
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/70">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                      Tổng Giờ Công Toàn Cửa Hàng
                    </span>
                    <div className="text-2xl font-black text-blue-700 tabular-nums">
                      296 Giờ
                    </div>
                    <span className="text-[11px] text-zinc-500 font-medium mt-1 block">
                      Tổng cộng 74 ca trực chuẩn (4h/ca)
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/70">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                      Nhân Sự Vận Hành Kho & Bán Hàng
                    </span>
                    <div className="text-2xl font-black text-purple-700 tabular-nums">
                      3 Nhân Viên
                    </div>
                    <span className="text-[11px] text-zinc-500 font-medium mt-1 block">
                      Phụ trách 3 ca: Sáng, Chiều, Tối
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/70">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                      Tỷ Lệ Đúng Giờ (Chuyên Cần)
                    </span>
                    <div className="text-2xl font-black text-emerald-600 tabular-nums">
                      98.5%
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                      100% ca trực hoàn thành đúng hẹn
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION: BẢNG QUYẾT TOÁN LƯƠNG NHÂN SỰ CHI TIẾT */}
              <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Bảng Quyết Toán Lương Nhân Viên Chi Tiết (Tháng 10/2026)</span>
                  </h3>
                  <span className="text-xs text-zinc-400">Đơn vị: VNĐ</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        <th className="py-3 px-3">Mã NV</th>
                        <th className="py-3 px-3">Họ Tên & Vị Trí</th>
                        <th className="py-3 px-3 text-right">Lương Giờ</th>
                        <th className="py-3 px-3 text-center">Số Ca</th>
                        <th className="py-3 px-3 text-center">Giờ Công</th>
                        <th className="py-3 px-3 text-right">Lương Giờ</th>
                        <th className="py-3 px-3 text-right">Phụ Cấp & Thưởng</th>
                        <th className="py-3 px-3 text-right">Thực Lĩnh</th>
                        <th className="py-3 px-3 text-center">Trạng Thái</th>
                        <th className="py-3 px-3 text-right">Tác Vụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      <tr className="hover:bg-zinc-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-blue-700">NV-5231</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-zinc-900">Lê Hoàng Nam</div>
                          <div className="text-[11px] text-zinc-500">Nhân viên Bán hàng & Quản lý Kho</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-700">35.000 ₫/h</td>
                        <td className="py-3 px-3 text-center font-bold text-zinc-800">24 ca</td>
                        <td className="py-3 px-3 text-center font-bold text-blue-700">96h</td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-700">3.360.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">+500.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-emerald-700 text-sm">3.860.000 ₫</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Đã Duyệt Chi
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast('Đã in phiếu lương cá nhân của Lê Hoàng Nam', 'success')}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-semibold rounded cursor-pointer transition-colors"
                          >
                            In Phiếu
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-blue-700">NV-5232</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-zinc-900">Trần Thị Mai</div>
                          <div className="text-[11px] text-zinc-500">Nhân viên Soạn đơn & Đóng gói</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-700">32.000 ₫/h</td>
                        <td className="py-3 px-3 text-center font-bold text-zinc-800">25 ca</td>
                        <td className="py-3 px-3 text-center font-bold text-blue-700">100h</td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-700">3.200.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">+500.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-emerald-700 text-sm">3.700.000 ₫</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Đã Duyệt Chi
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast('Đã in phiếu lương cá nhân của Trần Thị Mai', 'success')}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-semibold rounded cursor-pointer transition-colors"
                          >
                            In Phiếu
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-zinc-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-blue-700">NV-5233</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-zinc-900">Nguyễn Văn Đức</div>
                          <div className="text-[11px] text-zinc-500">Nhân viên Kiểm đếm & Giao vận kho</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-700">35.000 ₫/h</td>
                        <td className="py-3 px-3 text-center font-bold text-zinc-800">24 ca</td>
                        <td className="py-3 px-3 text-center font-bold text-blue-700">96h</td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-700">3.360.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">+650.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-emerald-700 text-sm">4.010.000 ₫</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Đã Duyệt Chi
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast('Đã in phiếu lương cá nhân của Nguyễn Văn Đức', 'success')}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-semibold rounded cursor-pointer transition-colors"
                          >
                            In Phiếu
                          </button>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-zinc-300 bg-zinc-50 font-bold">
                        <td colSpan={3} className="py-3 px-3 text-zinc-900">
                          TỔNG CỘNG QUỸ LƯƠNG THÁNG 10/2026:
                        </td>
                        <td className="py-3 px-3 text-center text-zinc-900">73 ca</td>
                        <td className="py-3 px-3 text-center text-blue-700">296 giờ</td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-800">9.920.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600">+1.650.000 ₫</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-800 text-base font-black">
                          11.570.000 ₫
                        </td>
                        <td colSpan={2} className="py-3 px-3 text-center text-zinc-500 font-normal">
                          (Đã đối soát 100%)
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* SECTION: BẢNG NHẬT KÝ CHẤM CÔNG CA TRỰC CHI TIẾT */}
              <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Nhật Ký Chấm Công Ca Làm Việc (Ghi Nhận Timestamp Thời Gian Thực)</span>
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-400">Ghi nhận tự động từ Staff Portal</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        <th className="py-3 px-3">Nhân viên</th>
                        <th className="py-3 px-4">Chức vụ</th>
                        <th className="py-3 px-4">Ca làm việc</th>
                        <th className="py-3 px-4">Giờ Check-in</th>
                        <th className="py-3 px-4">Giờ Check-out</th>
                        <th className="py-3 px-4 text-center">Trạng thái</th>
                        <th className="py-3 px-4 text-right">Duyệt ca</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-xs">
                      {attendances.map((att) => (
                        <tr key={att.id} className="hover:bg-zinc-50/80">
                          <td className="py-3 px-3 font-bold text-zinc-900">{att.staffName}</td>
                          <td className="py-3 px-4 text-zinc-600">{att.role}</td>
                          <td className="py-3 px-4 font-semibold text-blue-700">{att.shift}</td>
                          <td className="py-3 px-4 font-mono text-zinc-600">{att.checkInTime}</td>
                          <td className="py-3 px-4 font-mono text-zinc-600">{att.checkOutTime || '—'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              att.status === 'Hoàn thành ca' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {att.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => showToast(`Đã duyệt tính lương ca làm của ${att.staffName}`, 'success')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded cursor-pointer shadow-2xs"
                            >
                              Duyệt Lương
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: REVENUE REPORTS */}
          {/* ========================================================================= */}
          {activeTab === 'revenue' && (
            <div className="bg-white rounded-xl shadow-xs border border-zinc-200/80 p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-2">Báo Cáo Phân Tích Doanh Thu Toàn Diện</h2>
              <p className="text-xs text-zinc-500 mb-6">
                Chỉ số tài chính tổng hợp từ tất cả các đơn hàng hoàn tất trên hệ thống.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-700 uppercase">Tổng Doanh Thu Hệ Thống</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">{formatVND(totalRevenue)}</div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-700 uppercase">Đã Thu Thực Tế (Giao Thành Công)</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">{formatVND(deliveredRevenue)}</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-xs font-bold text-amber-700 uppercase">Đang Vận Chuyển / Chờ Thu</div>
                  <div className="text-2xl font-black text-amber-900 mt-1">{formatVND(totalRevenue - deliveredRevenue)}</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-bold text-zinc-900 text-base">Thêm Sản Phẩm Mới Vào Kho</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Tên Sản Phẩm</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="VD: Giày Nike Sabrina 2 EP"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Danh Mục</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="shoes">Giày Bóng Rổ</option>
                  <option value="apparel">Áo Đấu & Đồ Tập</option>
                  <option value="balls">Bóng Thi Đấu</option>
                  <option value="accessories">Phụ Kiện & Bảo Hộ</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Giá Bán (₫)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Số Lượng Tồn</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">URL Hình Ảnh</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newProduct.name.trim()) {
                      showToast('Vui lòng nhập tên sản phẩm!', 'error');
                      return;
                    }
                    addProduct({
                      name: newProduct.name,
                      category: newProduct.category,
                      categoryLabel: newProduct.category === 'shoes' ? 'Giày bóng rổ' : newProduct.category === 'apparel' ? 'Áo đấu' : 'Bóng',
                      price: newProduct.price,
                      stock: newProduct.stock,
                      initialStock: newProduct.stock,
                      rating: 5.0,
                      reviewsCount: 1,
                      image: newProduct.image,
                      description: newProduct.description,
                      sizes: ['40', '41', '42', '43'],
                      colors: ['Đen', 'Trắng'],
                      specs: [{ label: 'Đệm', value: 'Double Zoom Air' }],
                    });
                    setIsAddProductOpen(false);
                    showToast(`Đã thêm thành công [${newProduct.name}] vào kho!`, 'success');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
