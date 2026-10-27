import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../utils/format';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useShop();
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes[0] || 'Tiêu chuẩn';
    const defaultColor = product.colors[0] || 'Mặc định';
    addToCart(product, 1, defaultSize, defaultColor);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/70 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
              isOutOfStock ? 'grayscale opacity-60' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-4">
            <span className="text-sm font-medium">{product.name}</span>
          </div>
        )}

        {/* Subtle badge kicker */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-amber-400 uppercase rounded">
            {product.badge}
          </div>
        )}

        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-white rounded-lg shadow-md border border-zinc-700 transition-transform hover:scale-105 cursor-pointer"
            title="Xem chi tiết & chọn size"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer"
              title="Thêm nhanh vào giỏ (Size mặc định)"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span>{product.categoryLabel}</span>
          <div className="flex items-center gap-1 text-zinc-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold tabular-nums">{product.rating}</span>
            <span className="text-zinc-500 tabular-nums">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Stock Level Indicator (Per user prompt: số lượng hàng mẫu) */}
        <div className="mt-auto pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400">Kho mẫu:</span>
            {isOutOfStock ? (
              <span className="flex items-center gap-1 text-red-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Hết hàng
              </span>
            ) : isLowStock ? (
              <span className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
                <AlertTriangle className="w-3.5 h-3.5" />
                Chỉ còn {product.stock} cái!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-medium tabular-nums">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Còn {product.stock} cái
              </span>
            )}
          </div>

          {/* Stock inventory mini progress bar */}
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 ${
                isOutOfStock
                  ? 'bg-red-500/50 w-0'
                  : isLowStock
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (product.stock / Math.max(1, product.initialStock)) * 100)}%`,
              }}
            />
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-extrabold text-white tabular-nums tracking-tight">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && (
                <span className="block text-xs text-zinc-500 line-through tabular-nums">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isOutOfStock
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200'
              }`}
            >
              {isOutOfStock ? 'Tạm hết' : 'Thêm giỏ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
