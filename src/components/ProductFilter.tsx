import React from 'react';
import { ProductCategory } from '../types';
import { Filter, ArrowUpDown, Check, AlertTriangle } from 'lucide-react';

interface ProductFilterProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  stockFilter: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  onSelectStockFilter: (filter: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock') => void;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'stock';
  onSelectSortBy: (sort: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'stock') => void;
  totalCount: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  activeCategory,
  onSelectCategory,
  stockFilter,
  onSelectStockFilter,
  sortBy,
  onSelectSortBy,
  totalCount,
}) => {
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả mẫu' },
    { id: 'shoes', label: 'Giày bóng rổ' },
    { id: 'apparel', label: 'Áo đấu & Đồ tập' },
    { id: 'balls', label: 'Bóng thi đấu' },
    { id: 'accessories', label: 'Bảo hộ & Phụ kiện' },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Category Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Secondary filter & sorting bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        {/* Stock Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            Lọc kho:
          </span>
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
            <button
              onClick={() => onSelectStockFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onSelectStockFilter('in_stock')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                stockFilter === 'in_stock'
                  ? 'bg-zinc-800 text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Còn hàng
            </button>
            <button
              onClick={() => onSelectStockFilter('low_stock')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                stockFilter === 'low_stock'
                  ? 'bg-zinc-800 text-amber-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sắp hết (≤ 3)
            </button>
            <button
              onClick={() => onSelectStockFilter('out_of_stock')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                stockFilter === 'out_of_stock'
                  ? 'bg-zinc-800 text-red-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hết hàng
            </button>
          </div>
        </div>

        {/* Count & Sort */}
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 tabular-nums hidden sm:inline">
            Tìm thấy <strong className="text-white">{totalCount}</strong> mẫu sản phẩm
          </span>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">Nổi bật nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="stock">Tồn kho nhiều nhất</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
