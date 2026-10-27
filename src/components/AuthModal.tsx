import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, CheckCircle, LogOut, ArrowRight, ShieldCheck, Sparkles, Shield } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEMO_ACCOUNTS } from '../data/mockProducts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onViewOrders }) => {
  const { currentUser, login, register, logout, quickLoginDemo, orders } = useShop();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    currentUser ? 'login' : 'login'
  );

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại');
      return;
    }
    const success = login(loginEmail, loginPassword);
    if (success) {
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Vui lòng nhập email');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại');
      return;
    }
    const success = register(regName, regEmail, regPhone, regPassword, regAddress);
    if (success) {
      onClose();
    }
  };

  const userOrders = currentUser
    ? orders.filter((o) => o.userId === currentUser.id || o.customerEmail === currentUser.email)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              {currentUser ? 'Tài Khoản Thành Viên' : 'Tài Khoản HoopZone'}
            </h2>
            <p className="text-xs text-zinc-400">
              {currentUser
                ? 'Quản lý thông tin và theo dõi tiến độ đơn hàng'
                : 'Đăng nhập hoặc đăng ký để tích điểm & nhận ưu đãi'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logged in state */}
        {currentUser ? (
          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-display ${
                currentUser.role === 'admin'
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                  : currentUser.role === 'staff'
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              }`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : currentUser.role === 'staff'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {currentUser.role === 'admin' ? '👑 Quản trị viên (Admin)' : currentUser.role === 'staff' ? '👨‍💼 Nhân viên (Staff)' : '🛒 Khách hàng VIP'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{currentUser.email}</p>
                <p className="text-xs text-zinc-500">{currentUser.phone}</p>
              </div>
            </div>

            {/* Quick Role Switcher for Testing/Grading */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Chuyển nhanh vai trò kiểm thử:
                </span>
                <span className="text-[10px] text-zinc-500">1 chạm</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => quickLoginDemo('admin')}
                  className={`py-1.5 px-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400'
                  }`}
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => quickLoginDemo('staff')}
                  className={`py-1.5 px-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    currentUser.role === 'staff'
                      ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-blue-500/50 hover:text-blue-400'
                  }`}
                >
                  👨‍💼 Nhân Viên
                </button>
                <button
                  type="button"
                  onClick={() => quickLoginDemo('user')}
                  className={`py-1.5 px-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    currentUser.role === 'user'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-emerald-500/50 hover:text-emerald-400'
                  }`}
                >
                  🛒 Khách Hàng
                </button>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Đơn hàng đã đặt</span>
                <span className="text-xl font-bold text-amber-400 tabular-nums">
                  {userOrders.length}
                </span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 block mb-1">Điểm tích lũy</span>
                <span className="text-xl font-bold text-emerald-400 tabular-nums">
                  {userOrders.length * 50} pts
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onViewOrders();
                }}
                className="w-full flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>Xem lịch sử đơn hàng & vận chuyển</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 rounded-xl text-xs font-semibold text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tab switch */}
            <div className="flex border-b border-zinc-800 bg-zinc-950/60 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'login'
                    ? 'border-amber-500 text-amber-400 font-bold bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'register'
                    ? 'border-amber-500 text-amber-400 font-bold bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Đăng Ký Tài Khoản
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-2.5 bg-red-950/50 border border-red-900 text-red-300 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Login Tab Content */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="thaiphong261205@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-zinc-300">Mật khẩu</label>
                    <span className="text-[11px] text-amber-400 hover:underline cursor-pointer">
                      Quên mật khẩu?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  Đăng Nhập
                </button>

                {/* Quick Demo Accounts Selection */}
                <div className="pt-3 border-t border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Tài khoản gợi ý trải nghiệm (3 Vai trò):
                    </span>
                    <span className="text-[10px] text-zinc-500">1 chạm hoặc điền</span>
                  </div>

                  <div className="space-y-2">
                    {/* Admin Account Card */}
                    <div className="p-2.5 bg-zinc-950/80 border border-amber-500/30 hover:border-amber-500/60 rounded-xl transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span className="text-xs font-bold text-white">👑 Admin (Quản trị viên)</span>
                        </div>
                        <span className="text-[10px] bg-amber-500/15 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                          {DEMO_ACCOUNTS.admin.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                        <span>MK: <strong className="font-mono text-amber-300">{DEMO_ACCOUNTS.admin.passwordHint}</strong></span>
                        <span className="text-zinc-500 text-[10px]">Toàn quyền hệ thống</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            quickLoginDemo('admin');
                            onClose();
                          }}
                          className="flex-1 py-1 px-2 bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/40 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center"
                        >
                          ⚡ Đăng nhập 1-chạm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginEmail(DEMO_ACCOUNTS.admin.email);
                            setLoginPassword(DEMO_ACCOUNTS.admin.passwordHint);
                          }}
                          className="py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Điền form
                        </button>
                      </div>
                    </div>

                    {/* Staff Account Card */}
                    <div className="p-2.5 bg-zinc-950/80 border border-blue-500/30 hover:border-blue-500/60 rounded-xl transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span className="text-xs font-bold text-white">👨‍💼 Nhân Viên (Staff)</span>
                        </div>
                        <span className="text-[10px] bg-blue-500/15 text-blue-300 font-mono px-1.5 py-0.5 rounded">
                          {DEMO_ACCOUNTS.staff.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                        <span>MK: <strong className="font-mono text-blue-300">{DEMO_ACCOUNTS.staff.passwordHint}</strong></span>
                        <span className="text-zinc-500 text-[10px]">Đóng gói & Kho</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            quickLoginDemo('staff');
                            onClose();
                          }}
                          className="flex-1 py-1 px-2 bg-blue-500/15 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/40 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center"
                        >
                          ⚡ Đăng nhập 1-chạm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginEmail(DEMO_ACCOUNTS.staff.email);
                            setLoginPassword(DEMO_ACCOUNTS.staff.passwordHint);
                          }}
                          className="py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Điền form
                        </button>
                      </div>
                    </div>

                    {/* Customer Account Card */}
                    <div className="p-2.5 bg-zinc-950/80 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span className="text-xs font-bold text-white">🛒 Khách Hàng (Customer)</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-300 font-mono px-1.5 py-0.5 rounded">
                          {DEMO_ACCOUNTS.user.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                        <span>MK: <strong className="font-mono text-emerald-300">{DEMO_ACCOUNTS.user.passwordHint}</strong></span>
                        <span className="text-zinc-500 text-[10px]">Mua sắm & Đơn hàng</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            quickLoginDemo('user');
                            onClose();
                          }}
                          className="flex-1 py-1 px-2 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/40 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center"
                        >
                          ⚡ Đăng nhập 1-chạm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginEmail(DEMO_ACCOUNTS.user.email);
                            setLoginPassword(DEMO_ACCOUNTS.user.passwordHint);
                          }}
                          className="py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Điền form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              /* Register Tab Content */
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Họ và tên <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Địa chỉ Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="email"
                      placeholder="baller@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Số điện thoại <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="tel"
                      placeholder="0912345678"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Địa chỉ nhận hàng (Mặc định)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Số nhà, tên đường, phường xã..."
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Mật khẩu tạo mới
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                >
                  Tạo Tài Khoản & Đăng Nhập
                </button>
              </form>
            )}
          </div>
        )}

        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Bảo mật chuẩn mã hóa SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
};
