import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductFilter } from './components/ProductFilter';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthModal } from './components/AuthModal';
import { InventoryManagerModal } from './components/InventoryManagerModal';
import { OrdersModal } from './components/OrdersModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdminPortal } from './components/AdminPortal';
import { StaffWorkspace } from './components/StaffWorkspace';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { Product, ProductCategory, Order } from './types';
import { Flame, Sparkles, PackageSearch, Boxes, Zap } from 'lucide-react';
//cp2: nghiệp vụ, use case, dữ liệu, ràng buộc
function Storefront() {
  const { products, addToCart, currentUser } = useShop();

  // Modals state with URL parameter support for direct preview and inspection
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialModal = searchParams ? searchParams.get('modal') : null;
  const initialView = searchParams ? searchParams.get('view') : null;

  // View mode: 'storefront' | 'admin' | 'staff'.
  // Dedicated portals for Admin (ArchitectUI style) and Staff (Warehouse/Fulfillment style)!
  const [viewMode, setViewMode] = useState<'storefront' | 'admin' | 'staff'>(() => {
    if (initialView === 'storefront') return 'storefront';
    if (initialView === 'admin' || initialModal === 'admin') return 'admin';
    if (initialView === 'staff' || initialModal === 'staff') return 'staff';
    if (currentUser?.role === 'admin') return 'admin';
    if (currentUser?.role === 'staff') return 'staff';
    return 'storefront';
  });

  const prevRoleRef = useRef(currentUser?.role);
  useEffect(() => {
    if (prevRoleRef.current !== currentUser?.role) {
      prevRoleRef.current = currentUser?.role;
      if (currentUser?.role === 'admin') {
        setViewMode('admin');
      } else if (currentUser?.role === 'staff') {
        setViewMode('staff');
      } else if (currentUser?.role === 'user') {
        setViewMode('storefront');
      }
    }
  }, [currentUser?.role]);

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'stock'>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => (initialModal === 'product' ? products[0] || null : null));
  const [isCartOpen, setIsCartOpen] = useState(() => initialModal === 'cart');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => initialModal === 'checkout');
  const [isAuthOpen, setIsAuthOpen] = useState(() => initialModal === 'auth');
  const [isInventoryOpen, setIsInventoryOpen] = useState(() => initialModal === 'inventory');
  const [isOrdersOpen, setIsOrdersOpen] = useState(() => initialModal === 'orders');
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(() => initialModal === 'admin' || initialModal === 'vouchers' || initialModal === 'attendance');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Discount passed from cart to checkout
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');

  const catalogRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.categoryLabel.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        // Stock status filter
        if (stockFilter === 'in_stock' && p.stock <= 0) return false;
        if (stockFilter === 'low_stock' && (p.stock <= 0 || p.stock > 3)) return false;
        if (stockFilter === 'out_of_stock' && p.stock > 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'stock') return b.stock - a.stock;
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
        }
        return 0;
      });
  }, [products, activeCategory, searchQuery, stockFilter, sortBy]);

  const handleBuyNow = (product: Product, quantity: number, size: string, color: string) => {
    setSelectedProduct(null);
    addToCart(product, quantity, size, color);
    setIsCheckoutOpen(true);
  };

  const handleOpenCheckoutFromCart = (discount: number, code: string) => {
    setAppliedDiscount(discount);
    setAppliedDiscountCode(code);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setCreatedOrder(order);
  };

  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-[#f1f4f6] text-[#495057] flex flex-col font-sans">
        <AdminPortal
          onSwitchToStorefront={() => setViewMode('storefront')}
          onSwitchToStaffPortal={() => setViewMode('staff')}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onViewOrders={() => setIsOrdersOpen(true)}
        />
        <ToastContainer />
      </div>
    );
  }

  if (viewMode === 'staff') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
        <StaffWorkspace
          onSwitchToStorefront={() => setViewMode('storefront')}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAdminDashboard={() => setViewMode('admin')}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onViewOrders={() => setIsOrdersOpen(true)}
        />
        <AdminDashboardModal
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
        />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Admin Storefront Preview Alert Bar */}
      {currentUser?.role === 'admin' && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-md z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>
              🛡️ Bạn đang xem trước giao diện Khách hàng dưới tư cách Quản trị viên: <strong>{currentUser.name}</strong>.
            </span>
          </div>
          <button
            onClick={() => setViewMode('admin')}
            className="px-3 py-1 bg-white text-blue-900 hover:bg-zinc-100 rounded-md font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>Quay Lại Admin Portal (ArchitectUI)</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}

      {/* Staff Storefront Preview Alert Bar */}
      {currentUser?.role === 'staff' && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-md z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            <span>
              👨‍💼 Bạn đang xem trước giao diện Khách hàng dưới tư cách Nhân viên kho: <strong>{currentUser.name}</strong>.
            </span>
          </div>
          <button
            onClick={() => setViewMode('staff')}
            className="px-3 py-1 bg-white text-blue-900 hover:bg-zinc-100 rounded-md font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>Quay Lại Portal Nhân Viên</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenAdminPortal={() => setViewMode('admin')}
        onOpenStaffWorkspace={() => setViewMode('staff')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <HeroSection
        onExplore={scrollToCatalog}
        onOpenInventory={() => setIsInventoryOpen(true)}
      />

      {/* Main Catalog Section */}
      <main ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 flex-1 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Bộ Sưu Tập Chính Thức 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Trang Thiết Bị & Thời Trang Bóng Rổ
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Tất cả sản phẩm mẫu đều hiển thị số lượng tồn kho thực tế, kiểm tra kỹ lưỡng trước khi đóng gói.
            </p>
          </div>

          {/* Quick stock manager trigger */}
          <button
            onClick={() => setIsInventoryOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-xs font-semibold text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-amber-500" />
            <span>Mở Bảng Tồn Kho Mẫu</span>
          </button>
        </div>

        {/* Filter & Sorting Controls */}
        <ProductFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          stockFilter={stockFilter}
          onSelectStockFilter={setStockFilter}
          sortBy={sortBy}
          onSelectSortBy={setSortBy}
          totalCount={filteredProducts.length}
        />

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 p-12 text-center my-8">
            <PackageSearch className="w-12 h-12 stroke-[1.5] text-zinc-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-200 mb-1">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc danh mục và tồn kho.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setStockFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Đặt Lại Bộ Lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Brand Promise Section (Adjacent to products) */}
        <div className="mt-20 border border-zinc-800 rounded-2xl bg-zinc-900/70 p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Tiêu Chuẩn Thi Đấu HoopZone</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display mb-3">
              Chính Sách Kiểm Tra & Đồng Kiểm Số Lượng Kho
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
              Mỗi đơn hàng được nhân viên kiểm tra số lượng tồn kho thực tế, thử độ nảy của bóng, độ bám sân của đế giày và kiểm tra đường may áo đấu trước khi giao đến tay khách hàng. Khách được quyền kiểm tra hàng trước khi thanh toán tiền mặt (COD).
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Đăng Ký Thành Viên Nhận Quà
              </button>
              <button
                onClick={() => setIsOrdersOpen(true)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Kiểm Tra Tiến Độ Đơn Đã Đặt
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleOpenCheckoutFromCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        discount={appliedDiscount}
        discountCode={appliedDiscountCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Confirmation Modal */}
      <OrderSuccessModal
        order={createdOrder}
        onClose={() => setCreatedOrder(null)}
        onViewOrders={() => {
          setCreatedOrder(null);
          setIsOrdersOpen(true);
        }}
      />

      {/* Auth Modal (Login / Register / Profile) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onViewOrders={() => {
          setIsAuthOpen(false);
          setIsOrdersOpen(true);
        }}
      />

      {/* Inventory Manager Modal */}
      <InventoryManagerModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />

      {/* Orders Tracking Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* Admin Dashboard & Management Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <Storefront />
    </ShopProvider>
  );
}
