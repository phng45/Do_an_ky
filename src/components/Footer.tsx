import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-lg font-extrabold text-white font-display">
                HOOPZONE<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Thương hiệu phân phối trang thiết bị và thời trang bóng rổ chính hãng hàng đầu Việt Nam. Cung cấp giày thi đấu, áo đấu, bóng rổ da và phụ kiện bảo hộ thể thao chuẩn FIBA.
            </p>
            <div className="pt-2 text-[11px] text-zinc-500">
              Mã số doanh nghiệp: 0108924188 do Sở KHĐT TP.HCM cấp.
            </div>
          </div>

          {/* Col 2: Hệ thống cửa hàng */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Hệ Thống Showroom
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200 block">Showroom Quận 1 (TP.HCM)</strong>
                  <span>Số 15 Lê Duẩn, P. Bến Nghé, Quận 1</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200 block">Showroom Cầu Giấy (Hà Nội)</strong>
                  <span>Số 88 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Hỗ trợ khách hàng */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>Hotline: <strong className="text-amber-400 tabular-nums">1900 6868</strong> (8:30 - 21:30)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>Email: support@hoopzone.vn</span>
              </li>
              <li>Chính sách bảo hành đổi trả trong 7 ngày</li>
              <li>Hướng dẫn chọn size giày bóng rổ chuẩn US/EU</li>
              <li>Chính sách giao hàng và đồng kiểm khi nhận</li>
            </ul>
          </div>

          {/* Col 4: Cam kết & Thanh toán */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Cam Kết Vàng
            </h4>
            <div className="space-y-2 text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cam kết 100% hàng chính hãng</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Hoàn tiền 200% nếu phát hiện hàng nhái</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-zinc-500 block mb-1.5">Phương thức thanh toán chấp nhận:</span>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">Tiền mặt COD</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">VietQR 247</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">MoMo</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">Visa / Master</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet copyright baseline */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px] gap-3">
          <p>© 2026 HOOPZONE VIETNAM. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span>Điều khoản sử dụng</span>
            <span>·</span>
            <span>Chính sách bảo mật</span>
            <span>·</span>
            <span>Quản lý kho mẫu</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
