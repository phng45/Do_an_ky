import React, { useState } from 'react';
import { X, Boxes, RotateCcw, Plus, Minus, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';

interface InventoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryManagerModal: React.FC<InventoryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { products, updateProductStock, resetStockToDefault } = useShop();
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;

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
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Bảng Quản Lý Số Lượng Tồn Kho Mẫu
              </h2>
              <p className="text-xs text-zinc-400">
                Theo dõi số lượng hàng mẫu, tự động giảm khi khách đặt hàng hoặc tùy chỉnh trực tiếp
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

        {/* Metric Badges */}
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 grid grid-cols-3 gap-3">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-[11px] text-zinc-400 block mb-0.5">Tổng sản phẩm trong kho</span>
            <span className="text-lg font-bold text-white tabular-nums">{totalStockCount} cái</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-[11px] text-amber-400 block mb-0.5">Sắp hết hàng (≤ 3)</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">{lowStockCount} mẫu</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-[11px] text-red-400 block mb-0.5">Tạm hết hàng</span>
            <span className="text-lg font-bold text-red-400 tabular-nums">{outOfStockCount} mẫu</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Lọc mẫu sản phẩm..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={resetStockToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Khôi Phục Tồn Kho Mặc Định</span>
          </button>
        </div>

        {/* Inventory Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase text-[11px]">
                  <th className="pb-3 pl-2">Sản phẩm mẫu</th>
                  <th className="pb-3">Phân loại</th>
                  <th className="pb-3 text-right">Giá niêm yết</th>
                  <th className="pb-3 text-center">Tồn kho hiện tại</th>
                  <th className="pb-3 text-right pr-2">Điều chỉnh nhanh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredProducts.map((p) => {
                  const isOut = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= 3;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg bg-zinc-950 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-zinc-100 block">{p.name}</span>
                            <span className="text-[11px] text-zinc-500">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-zinc-400">{p.categoryLabel}</td>

                      <td className="py-3 text-right font-medium text-zinc-200 tabular-nums">
                        {formatVND(p.price)}
                      </td>

                      <td className="py-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-bold tabular-nums text-sm ${
                              isOut
                                ? 'text-red-400'
                                : isLow
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {p.stock} cái
                          </span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            {isOut ? (
                              <>
                                <AlertTriangle className="w-3 h-3 text-red-400" />
                                Hết hàng
                              </>
                            ) : isLow ? (
                              <>
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                Sắp hết
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Sẵn kho
                              </>
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 text-right pr-2">
                        <div className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                          <button
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                            disabled={p.stock === 0}
                            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded disabled:opacity-30 cursor-pointer"
                            title="Giảm 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={(e) =>
                              updateProductStock(p.id, parseInt(e.target.value) || 0)
                            }
                            className="w-12 text-center bg-transparent text-xs font-bold text-white tabular-nums focus:outline-none"
                          />
                          <button
                            onClick={() => updateProductStock(p.id, p.stock + 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer"
                            title="Tăng 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
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

        {/* Footer info */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
          <span>* Khi bạn đặt hàng thành công ở trang checkout, số lượng tại đây sẽ tự động giảm trừ tương ứng.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg cursor-pointer"
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
};
