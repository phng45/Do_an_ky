import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, CreditCard, Truck, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount: number;
  discountCode?: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  discount,
  discountCode,
  onOrderSuccess,
}) => {
  const { cart, cartTotal, currentUser, createOrder } = useShop();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: 'TP. Hồ Chí Minh',
    paymentMethod: 'cod' as 'cod' | 'banking',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 500000;
  const shippingFee = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 35000;
  const finalTotal = Math.max(0, cartTotal - discount + shippingFee);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Vui lòng nhập họ và tên';
    if (!formData.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errs.phone = 'Số điện thoại không hợp lệ (9 - 11 chữ số)';
    }
    if (!formData.address.trim()) errs.address = 'Vui lòng nhập địa chỉ nhận hàng';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        customerEmail: formData.email.trim(),
        shippingAddress: formData.address.trim(),
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        discount,
        shippingFee,
        notes: formData.notes.trim(),
      });

      setIsSubmitting(false);

      if (order) {
        onOrderSuccess(order);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-3xl my-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Xác Nhận Đặt Hàng & Giao Hàng
              </h2>
              <p className="text-xs text-zinc-400">
                Kiểm tra thông tin giao nhận và thanh toán an toàn
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Customer & Delivery Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                1. Thông Tin Nhận Hàng
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Họ và tên người nhận <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Số điện thoại <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0987654321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email nhận thông báo
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tỉnh / Thành phố <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Tỉnh/Thành khác">Tỉnh/Thành khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Địa chỉ chi tiết (Số nhà, tên đường, phường/xã) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 123 Đường Nguyễn Trãi, Phường 2, Quận 5"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Ghi chú cho shipper
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Right: Payment Method & Order Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                2. Phương Thức Thanh Toán
              </h3>

              <div className="space-y-2">
                {/* COD Option */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-zinc-100 mb-0.5">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-zinc-400">
                      Kiểm tra hàng mẫu và size giày trước khi trả tiền cho shipper.
                    </p>
                  </div>
                </label>

                {/* Bank Transfer VietQR Option */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'banking'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={formData.paymentMethod === 'banking'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'banking' })}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-zinc-100 mb-0.5">
                      <span>Chuyển khoản VietQR / 247</span>
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-zinc-400">
                      Quét mã QR tự động điền số tiền và mã đơn hàng, xác nhận tức thì.
                    </p>
                    {formData.paymentMethod === 'banking' && (
                      <div className="mt-2.5 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-[11px] text-zinc-300 space-y-1">
                        <p><strong className="text-amber-400">Ngân hàng:</strong> MBBank (Quân Đội)</p>
                        <p><strong className="text-amber-400">Số tài khoản:</strong> 9999.8888.6666</p>
                        <p><strong className="text-amber-400">Chủ tài khoản:</strong> CTY CP THETHAO HOOPZONE</p>
                        <p><strong className="text-amber-400">Cú pháp:</strong> HZ [Số ĐT của bạn]</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Order Items Preview */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <p className="text-xs font-bold text-zinc-300 mb-2">
                  Danh sách sản phẩm ({cart.length} món):
                </p>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/60 last:border-0"
                    >
                      <div className="truncate pr-2">
                        <span className="font-medium text-zinc-200">{item.product.name}</span>
                        <span className="text-zinc-500 block text-[11px]">
                          Size: {item.selectedSize} · SL: {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-zinc-300 tabular-nums shrink-0">
                        {formatVND(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown */}
                <div className="mt-3 pt-3 border-t border-zinc-800 text-xs space-y-1 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span className="text-zinc-200 tabular-nums">{formatVND(cartTotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Giảm giá {discountCode ? `(${discountCode})` : ''}:</span>
                      <span className="tabular-nums">-{formatVND(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-zinc-200 tabular-nums">
                      {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Tổng số tiền:</span>
                    <span className="text-amber-400 tabular-nums text-base">{formatVND(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật thông tin khách hàng tuyệt đối · Cam kết hàng thật 100%</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isSubmitting ? (
                <span>Đang xử lý đặt hàng...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đặt Hàng ({formatVND(finalTotal)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
