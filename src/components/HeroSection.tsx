import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenInventory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onOpenInventory }) => {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
      {/* Background Court Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_basketball_court_1791453687112.jpg"
          alt="Sàn thi đấu bóng rổ chuyên nghiệp"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl">
          {/* Natural human editorial kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Mùa Giải Mới 2026</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">Thiết Kế Cho Baller Chuyên Nghiệp</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display uppercase leading-[1.08] text-balance mb-6">
            Thống trị mọi <span className="text-amber-500 underline decoration-amber-500/40 decoration-4">sàn đấu</span> đỉnh cao
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8">
            Hệ thống phân phối giày bóng rổ hiệu năng cao, áo đấu thi đấu chính hãng, quả bóng tiêu chuẩn FIBA và thiết bị bảo hộ khớp gối. Kiểm soát số lượng kho mẫu trực tiếp và đặt hàng nhanh chóng.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Xem Ngay Sản Phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenInventory}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Kiểm Tra Tồn Kho Mẫu</span>
            </button>
          </div>
        </div>

        {/* Adjacency Trust Grid */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">100% Chính Hãng</p>
              <p className="text-xs text-zinc-400">Cam kết nguồn gốc xuất xứ</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">Giao Hàng Siêu Tốc</p>
              <p className="text-xs text-zinc-400">Freeship từ đơn 500k</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">Đổi Trả Trong 7 Ngày</p>
              <p className="text-xs text-zinc-400">Thử size vừa chân tuyệt đối</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">Kho Hàng Trực Quan</p>
              <p className="text-xs text-zinc-400">Cập nhật số lượng liên tục</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
