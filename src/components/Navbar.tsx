import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Boxes, PackageCheck, Search, Menu, X, BarChart3 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCategory } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenInventory: () => void;
  onOpenOrders: () => void;
  onOpenAdminDashboard: () => void;
  onOpenAdminPortal?: () => void;
  onOpenStaffWorkspace?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenAuth,
  onOpenInventory,
  onOpenOrders,
  onOpenAdminDashboard,
  onOpenAdminPortal,
  onOpenStaffWorkspace,
  searchQuery,
  onSearchChange,
}) => {
  const { cartCount, currentUser, orders } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'shoes', label: 'Giày bóng rổ' },
    { id: 'apparel', label: 'Áo đấu & Đồ tập' },
    { id: 'balls', label: 'Bóng thi đấu' },
    { id: 'accessories', label: 'Bảo hộ & Phụ kiện' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-center text-xs font-medium text-amber-400">
        <span className="font-semibold tracking-wide uppercase mr-2">Ưu đãi mùa giải 2026</span>
        <span>·</span>
        <span className="ml-2">Miễn phí giao hàng toàn quốc cho đơn từ 500.000₫ · Nhập mã </span>
        <span className="font-bold underline decoration-amber-400">DUNK10</span>
        <span> giảm ngay 10%</span>
      </div>

      {/* Main Bar: Strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single clean text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></span>
            <span className="text-xl font-extrabold tracking-tight text-white font-display">
              HOOPZONE<span className="text-amber-500">.</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 nav links, 1-2 word clean labels */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${
                  isActive
                    ? 'text-amber-400 border-amber-500 font-semibold'
                    : 'text-zinc-400 border-transparent hover:text-zinc-100 hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions & utility buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick search button */}
          <div className="relative">
            {showSearchBar ? (
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm giày, áo đấu, bóng..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-40 sm:w-56 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setShowSearchBar(false);
                    onSearchChange('');
                  }}
                  className="p-0.5 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchBar(true)}
                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                title="Tìm kiếm sản phẩm"
                aria-label="Tìm kiếm sản phẩm"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Admin Portal Button (ArchitectUI) */}
          {currentUser?.role === 'admin' && onOpenAdminPortal && (
            <button
              onClick={onOpenAdminPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all cursor-pointer shadow-md shadow-blue-900/40 border border-blue-400/30"
              title="Mở Trang Quản Trị Hệ Thống Admin (Giao diện ArchitectUI)"
            >
              <BarChart3 className="w-4 h-4 text-amber-300" />
              <span className="inline">Admin Portal</span>
            </button>
          )}

          {/* Portal Nhân Viên button (For Staff & Admin) */}
          {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && onOpenStaffWorkspace && (
            <button
              onClick={onOpenStaffWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-900/40"
              title="Mở Không Gian Làm Việc Nhân Viên (Đơn Hàng, Kho, Chấm Công)"
            >
              <PackageCheck className="w-4 h-4 text-white" />
              <span className="inline">Portal Nhân Viên</span>
            </button>
          )}

          {/* Kho hàng mẫu button (Per user prompt: số lượng hàng mẫu) */}
          <button
            onClick={onOpenInventory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Xem và chỉnh sửa số lượng tồn kho mẫu"
          >
            <Boxes className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Kho mẫu</span>
          </button>

          {/* Quản trị & Doanh thu & Chấm công */}
          <button
            onClick={onOpenAdminDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-purple-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Thống kê doanh thu, Quản lý Voucher & Chấm công nhân sự"
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Quản trị</span>
          </button>

          {/* Đơn hàng button */}
          <button
            onClick={onOpenOrders}
            className="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
            title="Đơn hàng đã đặt"
            aria-label="Đơn hàng đã đặt"
          >
            <PackageCheck className="w-5 h-5" />
            {orders.length > 0 && (
              <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {/* User Account / Login */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Đăng nhập / Tài khoản"
          >
            <UserIcon className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline truncate max-w-[100px]">
              {currentUser ? currentUser.name.split(' ').slice(-1)[0] : 'Đăng nhập'}
            </span>
            {currentUser && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                currentUser.role === 'admin'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : currentUser.role === 'staff'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'staff' ? 'Staff' : 'VIP'}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2 text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-lg font-semibold transition-colors cursor-pointer"
            title="Giỏ hàng"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${
                activeCategory === cat.id
                  ? 'bg-amber-500/10 text-amber-400 font-semibold'
                  : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
