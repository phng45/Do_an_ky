import React from 'react';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Order } from '../types';
import { formatVND } from '../utils/format';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Cảm ơn bạn đã đặt hàng tại HoopZone
        </span>

        <h2 className="text-2xl font-black text-white font-display mt-1 mb-2">
          ĐẶT HÀNG THÀNH CÔNG!
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
          Mã đơn hàng của bạn là <strong className="text-amber-400 font-mono text-sm">#{order.id}</strong>.
          Nhân viên kho mẫu đã nhận thông tin và đang tiến hành đóng gói kiểm tra sản phẩm.
        </p>

        {/* Order Details Brief Box */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between py-1 border-b border-zinc-800/80">
            <span className="text-zinc-500">Người nhận:</span>
            <span className="font-semibold text-zinc-200">{order.customerName} ({order.customerPhone})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-800/80">
            <span className="text-zinc-500">Địa chỉ giao:</span>
            <span className="font-semibold text-zinc-200 text-right truncate max-w-[240px]">
              {order.shippingAddress}, {order.city}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-800/80">
            <span className="text-zinc-500">Hình thức:</span>
            <span className="font-semibold text-zinc-200 uppercase">
              {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR'}
            </span>
          </div>
          <div className="flex justify-between py-1 pt-2 text-sm font-bold">
            <span className="text-zinc-300">Tổng thanh toán:</span>
            <span className="text-amber-400 tabular-nums">{formatVND(order.total)}</span>
          </div>
        </div>

        {/* Stock note */}
        <div className="text-[11px] text-zinc-400 bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800/60 mb-6 flex items-center justify-center gap-2">
          <Package className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Số lượng trong kho mẫu đã được tự động giảm trừ thành công!</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Theo Dõi Đơn Hàng</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Tiếp Tục Mua Sắm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
