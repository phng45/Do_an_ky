import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Star, ShieldCheck, Truck, RefreshCw, AlertTriangle, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../utils/format';
import { useShop } from '../context/ShopContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number, size: string, color: string) => void;
}

interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const { addToCart, products, currentUser, showToast } = useShop();

  if (!product) return null;

  // Retrieve freshest stock from context
  const currentProduct = products.find((p) => p.id === product.id) || product;
  const isOutOfStock = currentProduct.stock <= 0;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Tiêu chuẩn');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Mặc định');
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([
    {
      id: 'rev-1',
      author: 'Nguyễn Văn Đạt (Baller)',
      rating: 5,
      date: '2026-10-10',
      comment: 'Chất liệu siêu thoáng khí, form ôm chân cực kỳ vừa vặn khi bật nhảy thi đấu!',
    },
    {
      id: 'rev-2',
      author: 'Trần Minh Đức (Khách VIP)',
      rating: 5,
      date: '2026-10-12',
      comment: 'Hàng chính hãng chuẩn chỉ, giao hỏa tốc đóng gói cẩn thận 10/10.',
    },
  ]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá!', 'error');
      return;
    }
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: currentUser?.name || 'Khách hàng ẩn danh',
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      comment: userComment.trim(),
    };
    setReviews([newRev, ...reviews]);
    setUserComment('');
    showToast('Đã gửi đánh giá sản phẩm thành công!', 'success');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const ok = addToCart(currentProduct, quantity, selectedSize, selectedColor);
    if (ok) {
      onClose();
    }
  };

  const handleTriggerBuyNow = () => {
    if (isOutOfStock) return;
    onBuyNow(currentProduct, quantity, selectedSize, selectedColor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col md:flex-row text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-zinc-950/70 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image showcase */}
        <div className="w-full md:w-1/2 bg-zinc-950 p-6 flex flex-col items-center justify-center relative">
          <div className="relative aspect-[4/3] md:aspect-square w-full rounded-xl overflow-hidden bg-zinc-900">
            {!imgError ? (
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center ${
                  isOutOfStock ? 'grayscale opacity-60' : ''
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                {currentProduct.name}
              </div>
            )}

            {currentProduct.badge && (
              <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-700/80 px-2.5 py-1 text-xs font-semibold text-amber-400 rounded">
                {currentProduct.badge}
              </div>
            )}
          </div>

          {/* Quick guarantees */}
          <div className="w-full mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-4">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Chính hãng 100%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-amber-500" />
              <span>Đổi size 7 ngày</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Ship hỏa tốc</span>
            </div>
          </div>
        </div>

        {/* Right Column: PDP Purchase Module */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-amber-500">
              {currentProduct.categoryLabel}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white tabular-nums">{currentProduct.rating}</span>
              <span>· {currentProduct.reviewsCount} đánh giá từ vận động viên</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white font-display leading-tight mb-3">
            {currentProduct.name}
          </h2>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
              {formatVND(currentProduct.price)}
            </span>
            {currentProduct.originalPrice && (
              <span className="text-sm text-zinc-500 line-through tabular-nums">
                {formatVND(currentProduct.originalPrice)}
              </span>
            )}
            {currentProduct.originalPrice && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Tiết kiệm {Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Live Stock Level Status */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 mb-5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">Tình trạng tồn kho mẫu:</span>
              {isOutOfStock ? (
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Hết hàng trong kho
                </span>
              ) : currentProduct.stock <= 3 ? (
                <span className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Chỉ còn {currentProduct.stock} cái duy nhất!
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold tabular-nums">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sẵn sàng giao (Còn {currentProduct.stock} cái)
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  isOutOfStock
                    ? 'w-0'
                    : currentProduct.stock <= 3
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (currentProduct.stock / Math.max(1, currentProduct.initialStock)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
            {currentProduct.description}
          </p>

          {/* Size Selector */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-zinc-200">Kích cỡ / Size:</span>
              <span className="text-zinc-500">Chuẩn form thể thao</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mb-5">
            <span className="block text-xs font-semibold text-zinc-200 mb-2">
              Màu sắc: <span className="font-normal text-zinc-400">{selectedColor}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {currentProduct.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    selectedColor === color
                      ? 'bg-zinc-100 text-zinc-950 border-white'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-semibold text-zinc-200">Số lượng:</span>
            <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-800">
              <button
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                -
              </button>
              <span className="px-3 py-1 text-xs font-bold tabular-nums min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                disabled={quantity >= currentProduct.stock || isOutOfStock}
                onClick={() => setQuantity((q) => Math.min(currentProduct.stock, q + 1))}
                className="px-3 py-1 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-xs text-zinc-500">
              (Tối đa {currentProduct.stock} cái trong kho)
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-zinc-800">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                isOutOfStock
                  ? 'bg-zinc-800 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm Giỏ Hàng</span>
            </button>

            <button
              onClick={handleTriggerBuyNow}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Mua Ngay</span>
            </button>
          </div>

          {/* Specifications Accordion / List */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Thông số kỹ thuật
            </p>
            <div className="space-y-1.5 text-xs">
              {currentProduct.specs.map((spec, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">{spec.label}</span>
                  <span className="text-zinc-200 font-medium text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews & Ratings Section (UC05) */}
          <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Đánh giá từ khách hàng ({reviews.length})
              </p>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">5.0 / 5.0</span>
              </div>
            </div>

            {/* Submit new review form */}
            <form onSubmit={handleAddReview} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 block">Viết cảm nhận của bạn:</span>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-zinc-400">Số sao:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          userRating >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhận xét độ êm, form dáng, độ bám sân..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Gửi</span>
                </button>
              </div>
            </form>

            {/* List of reviews */}
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-2.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">{rev.author}</span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
