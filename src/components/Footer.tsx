import React from 'react';
import Link from 'next/link';
import { Camera, MapPin, Phone, Mail, Globe, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#240303] text-stone-300 pt-16 pb-12 border-t border-[#890F0D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Intro */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#720000] to-[#890F0D] flex items-center justify-center text-white shadow-md">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">GP STUDIO99</span>
                <p className="text-xs text-[#FCA5A5] font-medium">chupanhdanang.com</p>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Thương hiệu chụp ảnh & quay phim kỷ yếu uy tín thành lập từ năm 2018 tại Đà Nẵng và Miền Trung. Nơi đồng hành cùng bạn lưu giữ những khoảnh khắc thanh xuân rực rỡ nhất!
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#890F0D] text-white flex items-center justify-center transition-colors text-xs font-bold"
              >
                FB
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#890F0D] text-white flex items-center justify-center transition-colors text-xs font-bold"
              >
                TT
              </a>
              <a 
                href="https://zalo.me/0899236001" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#890F0D] text-white flex items-center justify-center transition-colors text-xs font-bold"
              >
                ZL
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Thiệp Mời Cá Nhân</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/builder" className="hover:text-[#FCA5A5] transition-colors flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Tự tạo thiệp mời của bạn</span>
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="hover:text-[#FCA5A5] transition-colors">
                  12 Mẫu thiệp thanh xuân
                </Link>
              </li>
              <li>
                <Link href="/thiep-moi/bao-anh-12a1-phan-chau-trinh" className="hover:text-[#FCA5A5] transition-colors">
                  Thiệp mẫu: Bảo Anh 12A1
                </Link>
              </li>
              <li>
                <Link href="/#guide" className="hover:text-[#FCA5A5] transition-colors">
                  Hướng dẫn gửi bạn bè & người thân
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#FCA5A5] transition-colors">
                  Bảng điều khiển quản trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dịch vụ GP Studio99 */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kỷ Yếu GP Studio99</h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>Chụp ảnh kỷ yếu cấp 2, cấp 3, Đại học trọn gói</li>
              <li>Concept Thanh xuân (Xám, Nâu, Xanh đen, Hàn Quốc)</li>
              <li>Cho thuê trang phục & phụ kiện concept đa dạng</li>
              <li>Quay video MV Kỷ yếu, Vlog & Flycam 4K</li>
              <li>Chính sách xem trước 3-5 bản demo màu ảnh</li>
            </ul>
          </div>

          {/* Col 4: Liên hệ */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Thông Tin Liên Hệ</h3>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FCA5A5] shrink-0 mt-0.5" />
                <span>Trần Cao Vân, TP. Đà Nẵng</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FCA5A5] shrink-0" />
                <a href="tel:0899236001" className="hover:text-white font-semibold">0899.236.001 (Hotline / Zalo)</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FCA5A5] shrink-0" />
                <span>studiogp99@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#FCA5A5] shrink-0" />
                <a href="https://chupanhdanang.com" target="_blank" rel="noreferrer" className="text-[#FCA5A5] hover:underline flex items-center gap-1">
                  chupanhdanang.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} GP Studio99 – Nền tảng thiệp mời kỷ yếu cá nhân • chupanhdanang.com. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-stone-300 cursor-pointer">Điều khoản dịch vụ</span>
            <span className="flex items-center gap-1 text-[#FCA5A5]">
              Thanh xuân của bạn <Heart className="w-3 h-3 text-[#E11D48] fill-[#E11D48]" /> Kỷ niệm của chúng mình
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
