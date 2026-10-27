import React from 'react';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle, MapPin, Phone, User, Calendar } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND, formatDate } from '../utils/format';
import { Order } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus } = useShop();

  if (!isOpen) return null;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xác nhận',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          icon: Clock,
        };
      case 'processing':
        return {
          label: 'Đang đóng gói kho',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          icon: Package,
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          icon: Truck,
        };
      case 'delivered':
        return {
          label: 'Đã giao thành công',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          icon: CheckCircle2,
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'text-red-400 bg-red-500/10 border-red-500/20',
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Quản Lý Đơn Hàng & Vận Chuyển
              </h2>
              <p className="text-xs text-zinc-400">
                Danh sách các đơn hàng đã đặt thành công và trạng thái xử lý
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

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Package className="w-12 h-12 stroke-[1.5] mx-auto mb-3 text-zinc-600" />
              <p className="text-sm font-semibold text-zinc-300">Chưa có đơn hàng nào</p>
              <p className="text-xs text-zinc-500 mt-1">
                Các đơn đặt hàng mới sẽ xuất hiện tại đây sau khi bạn xác nhận giỏ hàng.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-amber-400 font-display">
                        #{order.id}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </span>

                      {/* Status switcher for simulation */}
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as Order['status'])
                        }
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] rounded px-2 py-1 focus:outline-none cursor-pointer"
                        title="Đổi trạng thái mô phỏng"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="processing">Đang đóng gói</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Hủy đơn</option>
                      </select>
                    </div>
                  </div>

                  {/* Recipient info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-lg">
                    <div>
                      <p className="flex items-center gap-1.5 text-zinc-200 font-semibold mb-1">
                        <User className="w-3.5 h-3.5 text-amber-500" />
                        {order.customerName}
                      </p>
                      <p className="flex items-center gap-1.5 text-zinc-400">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        {order.customerPhone}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-start gap-1.5 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{order.shippingAddress}, {order.city}</span>
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Thanh toán: <strong className="text-zinc-300 uppercase">{order.paymentMethod === 'cod' ? 'COD (Tiền mặt)' : 'VietQR Chuyển khoản'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-900 last:border-0"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <img
                            src={item.image}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 object-cover rounded bg-zinc-900 shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-medium text-zinc-200 block truncate">
                              {item.productName}
                            </span>
                            <span className="text-zinc-500 text-[11px]">
                              Size: {item.selectedSize} · SL: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-semibold text-zinc-200 tabular-nums shrink-0">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                    <span className="text-zinc-400">
                      Tổng thanh toán ({order.items.reduce((a, b) => a + b.quantity, 0)} sản phẩm):
                    </span>
                    <span className="text-base font-extrabold text-amber-400 tabular-nums">
                      {formatVND(order.total)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
