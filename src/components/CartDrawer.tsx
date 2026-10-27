import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (appliedDiscount: number, discountCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, clearCart } = useShop();
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; percent: number } | null>({
    code: 'DUNK10',
    percent: 10,
  });
  const [voucherError, setVoucherError] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 500000;
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const missingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const discountAmount = appliedVoucher ? Math.round((cartTotal * appliedVoucher.percent) / 100) : 0;
  const shippingFee = cartTotal === 0 ? 0 : isFreeShipping ? 0 : 35000;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'DUNK10' || code === 'HOOP2026') {
      setAppliedVoucher({ code, percent: 10 });
      setVoucherInput('');
    } else if (code === 'VIP20') {
      setAppliedVoucher({ code, percent: 20 });
      setVoucherInput('');
    } else {
      setVoucherError('Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
    }
  };

  const handleProceedCheckout = () => {
    onCheckout(discountAmount, appliedVoucher ? appliedVoucher.code : '');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl text-zinc-100">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white font-display">Giỏ Hàng Của Bạn</h2>
              <span className="text-xs text-zinc-400 tabular-nums">({cart.length} món)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-3 bg-zinc-950 border-b border-zinc-800 text-xs">
            {isFreeShipping ? (
              <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Đơn hàng đủ điều kiện MIỄN PHÍ VẬN CHUYỂN toàn quốc!
              </p>
            ) : (
              <div>
                <p className="text-zinc-300 mb-1.5">
                  Mua thêm <span className="font-bold text-amber-400 tabular-nums">{formatVND(missingForFreeShip)}</span> để được <span className="text-emerald-400 font-bold">FREESHIP</span>
                </p>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <ShoppingBag className="w-16 h-16 stroke-[1.5] mb-3 text-zinc-600" />
                <p className="text-base font-semibold text-zinc-300 mb-1">Giỏ hàng đang trống</p>
                <p className="text-xs text-zinc-500 mb-6">
                  Hãy thêm giày bóng rổ, áo đấu hoặc bóng thi đấu vào giỏ để tiếp tục.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Tiếp Tục Mua Sắm
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-3 p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 object-cover rounded-lg bg-zinc-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-100 truncate mb-1">
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-zinc-400 mb-2 flex items-center gap-2">
                      <span>Size: <strong className="text-zinc-200">{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span className="truncate">{item.selectedColor}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-400 tabular-nums">
                        {formatVND(item.product.price)}
                      </span>

                      {/* Stepper bounded by stock */}
                      <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded-lg">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold tabular-nums text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Mã giảm giá (VD: DUNK10)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>

              {appliedVoucher && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  <span>Mã {appliedVoucher.code} đã áp dụng (-{appliedVoucher.percent}%)</span>
                  <button
                    onClick={() => setAppliedVoucher(null)}
                    className="text-zinc-400 hover:text-white text-[11px] underline cursor-pointer"
                  >
                    Bỏ mã
                  </button>
                </div>
              )}

              {voucherError && <p className="text-xs text-red-400">{voucherError}</p>}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.length} món):</span>
                  <span className="text-zinc-200 font-medium tabular-nums">{formatVND(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Ưu đãi voucher:</span>
                    <span className="font-medium tabular-nums">-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="text-zinc-200 font-medium tabular-nums">
                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-zinc-800">
                  <span>Tổng thanh toán:</span>
                  <span className="text-amber-400 tabular-nums">{formatVND(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>Tiến Hành Đặt Hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Thanh toán khi nhận hàng (COD) hoặc Chuyển khoản</span>
                  <button
                    onClick={clearCart}
                    className="hover:text-red-400 underline cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
