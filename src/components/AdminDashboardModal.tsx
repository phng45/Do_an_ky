import React, { useState } from 'react';
import { X, TrendingUp, Ticket, Clock, CheckCircle2, Award, Plus, Trash2, Calendar, DollarSign, BarChart3, AlertCircle, UserCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Voucher {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  description: string;
  active: boolean;
}

interface AttendanceRecord {
  id: string;
  staffName: string;
  role: string;
  checkInTime: string;
  checkOutTime?: string;
  shift: 'Ca Sáng (08:00 - 12:00)' | 'Ca Chiều (13:00 - 17:00)' | 'Ca Tối (17:30 - 21:30)';
  status: 'Đang làm việc' | 'Hoàn thành ca';
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, orders, products, showToast, attendances, checkInAttendance, checkOutAttendance } = useShop();

  const [activeTab, setActiveTab] = useState<'revenue' | 'vouchers' | 'attendance'>(() => {
    const p = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') : null;
    return p === 'vouchers' || p === 'attendance' ? p : 'revenue';
  });

  // Vouchers state
  const [vouchers, setVouchers] = useState<Voucher[]>([
    { id: 'vc-1', code: 'DUNK10', discountPercent: 10, minOrder: 500000, description: 'Giảm 10% cho đơn từ 500.000₫', active: true },
    { id: 'vc-2', code: 'HOOPVIP', discountPercent: 15, minOrder: 1500000, description: 'Ưu đãi Baller VIP giảm 15%', active: true },
    { id: 'vc-3', code: 'FREESHIP', discountPercent: 5, minOrder: 0, description: 'Hỗ trợ phí vận chuyển', active: true },
    { id: 'vc-4', code: 'PLAYOFF2026', discountPercent: 20, minOrder: 2000000, description: 'Mùa giải Playoff giảm 20%', active: false },
  ]);

  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState('10');
  const [newMinOrder, setNewMinOrder] = useState('500000');

  if (!isOpen) return null;

  // Revenue calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total ?? (o as any).totalAmount ?? 0), 0);
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const deliveredRevenue = deliveredOrders.reduce((acc, o) => acc + (o.total ?? (o as any).totalAmount ?? 0), 0);

  // Top products calculation from orders
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number; image: string }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          qty: 0,
          revenue: 0,
          image: item.image,
        };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      showToast('Vui lòng nhập mã Voucher!', 'error');
      return;
    }
    const percent = parseInt(newPercent) || 10;
    const min = parseInt(newMinOrder) || 0;
    const item: Voucher = {
      id: `vc-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountPercent: percent,
      minOrder: min,
      description: `Giảm ${percent}% cho đơn từ ${formatVND(min)}`,
      active: true,
    };
    setVouchers((prev) => [item, ...prev]);
    setNewCode('');
    showToast(`Đã tạo thành công voucher: ${item.code}`, 'success');
  };

  const handleToggleVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
    showToast('Đã cập nhật trạng thái voucher!', 'info');
  };

  const handleDeleteVoucher = (id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
    showToast('Đã xóa voucher.', 'info');
  };

  // Staff check-in action
  const handleStaffCheckIn = () => {
    const now = new Date();
    const shift = now.getHours() < 12 ? 'Ca Sáng (08:00 - 12:00)' : now.getHours() < 17 ? 'Ca Chiều (13:00 - 17:00)' : 'Ca Tối (17:30 - 21:30)';
    checkInAttendance(shift as any);
  };

  const handleStaffCheckOut = (id: string) => {
    checkOutAttendance();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-white">
                  Trung Tâm Quản Trị & Vận Hành HoopZone
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                  currentUser?.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : currentUser?.role === 'staff'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {currentUser?.role === 'admin' ? '👑 Admin Toàn Quyền' : currentUser?.role === 'staff' ? '👨‍💼 Nhân Viên Vận Hành' : 'Khách Hàng'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Thống kê doanh thu, quản lý mã voucher và theo dõi ca làm việc nhân sự
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 text-xs font-semibold px-4 pt-1">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'revenue'
                ? 'border-amber-500 text-amber-400 font-bold bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Doanh Thu & KPI</span>
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'vouchers'
                ? 'border-amber-500 text-amber-400 font-bold bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Mã Giảm Giá Voucher ({vouchers.filter(v => v.active).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'attendance'
                ? 'border-amber-500 text-amber-400 font-bold bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Chấm Công & Phân Ca</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: REVENUE & KPI */}
          {activeTab === 'revenue' && (
            <div className="space-y-5">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Tổng Doanh Thu</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums">
                    {formatVND(totalRevenue)}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Tất cả đơn hàng phát sinh</span>
                </div>

                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Đã Giao Thành Công</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-bold text-blue-400 tabular-nums">
                    {formatVND(deliveredRevenue)}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">{deliveredOrders.length} đơn hoàn tất</span>
                </div>

                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Tổng Số Đơn Hàng</span>
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold text-amber-400 tabular-nums">
                    {orders.length} đơn
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Tỷ lệ xử lý: 100%</span>
                </div>

                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Số Sản Phẩm Kinh Doanh</span>
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-purple-400 tabular-nums">
                    {products.length} mã
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">4 Danh mục bóng rổ</span>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Top Sản Phẩm Bán Chạy Nhất (Theo số lượng thực tế)
                  </h3>
                  <span className="text-[11px] text-zinc-400">Dữ liệu đơn hàng mẫu</span>
                </div>

                {topProducts.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Chưa có dữ liệu bán hàng.</p>
                ) : (
                  <div className="divide-y divide-zinc-900">
                    {topProducts.map((p, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-amber-400 text-[11px]">
                            {idx + 1}
                          </span>
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded bg-zinc-900"
                          />
                          <div>
                            <span className="font-semibold text-white block">{p.name}</span>
                            <span className="text-[11px] text-zinc-500">Đã bán: <strong className="text-amber-400">{p.qty}</strong> sản phẩm</span>
                          </div>
                        </div>
                        <span className="font-bold text-zinc-200 tabular-nums">
                          {formatVND(p.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VOUCHERS */}
          {activeTab === 'vouchers' && (
            <div className="space-y-4">
              {currentUser?.role === 'admin' && (
                <form onSubmit={handleAddVoucher} className="p-4 bg-zinc-950 border border-amber-500/20 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-400 block">Tạo Mã Voucher Khuyến Mãi Mới (Quyền Admin)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">Mã Voucher</label>
                      <input
                        type="text"
                        placeholder="VD: DUNK20"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Tỷ lệ giảm (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={newPercent}
                        onChange={(e) => setNewPercent(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Đơn tối thiểu (VNĐ)</label>
                      <input
                        type="number"
                        step="50000"
                        value={newMinOrder}
                        onChange={(e) => setNewMinOrder(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Mã Khuyến Mãi</span>
                  </button>
                </form>
              )}

              {/* Vouchers list */}
              <div className="space-y-2">
                {vouchers.map((vc) => (
                  <div
                    key={vc.id}
                    className={`p-3 border rounded-xl flex items-center justify-between text-xs transition-colors ${
                      vc.active
                        ? 'bg-zinc-950 border-zinc-800'
                        : 'bg-zinc-950/40 border-zinc-800/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300 text-sm">{vc.code}</span>
                          <span className="bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            GIẢM {vc.discountPercent}%
                          </span>
                          {!vc.active && (
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                              Tạm ngưng
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{vc.description}</p>
                      </div>
                    </div>

                    {currentUser?.role === 'admin' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleVoucher(vc.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer border ${
                            vc.active
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                              : 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
                          }`}
                        >
                          {vc.active ? 'Tắt' : 'Kích hoạt'}
                        </button>
                        <button
                          onClick={() => handleDeleteVoucher(vc.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                          title="Xóa voucher"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE & SHIFTS */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              {/* Check in action for Staff / Admin */}
              <div className="p-4 bg-zinc-950 border border-blue-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Chấm Công Điểm Danh Ca Trực (Staff & Admin)
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Nhân viên bấm Check-in khi vào ca và Check-out khi bàn giao ca làm việc tại cửa hàng.
                  </p>
                </div>
                <button
                  onClick={handleStaffCheckIn}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-blue-600/20"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Điểm danh Check-in Ca Hiện Tại</span>
                </button>
              </div>

              {/* Attendance Log Table */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-zinc-200 block uppercase tracking-wider">
                  Nhật Ký Chấm Công & Ca Làm Việc Trong Ngày
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="py-2 px-3">Nhân sự</th>
                        <th className="py-2 px-3">Ca làm việc</th>
                        <th className="py-2 px-3">Giờ Check-in</th>
                        <th className="py-2 px-3">Giờ Check-out</th>
                        <th className="py-2 px-3">Trạng thái</th>
                        <th className="py-2 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {attendances.map((att) => (
                        <tr key={att.id} className="hover:bg-zinc-900/40">
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-white block">{att.staffName}</span>
                            <span className="text-[10px] text-zinc-500">{att.role}</span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-amber-300">{att.shift}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{att.checkInTime}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">
                            {att.checkOutTime || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              att.status === 'Hoàn thành ca'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse'
                            }`}>
                              {att.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {att.status === 'Đang làm việc' ? (
                              <button
                                onClick={() => handleStaffCheckOut(att.id)}
                                className="py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-medium cursor-pointer"
                              >
                                Check-out ca
                              </button>
                            ) : (
                              <span className="text-[11px] text-zinc-600 font-medium">Đã chốt ca</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
