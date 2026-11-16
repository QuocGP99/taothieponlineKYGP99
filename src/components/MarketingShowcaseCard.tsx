'use client';

import React from 'react';
import {
  Sparkles, CheckCircle2, Phone, MessageCircle,
  ExternalLink, ArrowDownCircle, Heart, Tag
} from 'lucide-react';

interface MarketingShowcaseCardProps {
  className?: string;
  isCompact?: boolean;
}

export default function MarketingShowcaseCard({
  className = '',
  isCompact = false
}: MarketingShowcaseCardProps) {

  return (
    <div className={`relative overflow-hidden rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#240303] via-[#480505] to-[#1A0202] text-white border border-[#890F0D]/40 shadow-2xl ${className}`}>

      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#890F0D]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* ============================================================== */}
          {/* LEFT CONTENT                                                   */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 space-y-5">

            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-black uppercase tracking-wider text-rose-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>KỶ YẾU GP STUDIO99</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
              Chụp ảnh kỷ yếu{' '}
              <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 bg-clip-text text-transparent underline decoration-[#FF758F]/60 decoration-wavy underline-offset-4">
                có tâm
              </span>{' '}
              cho cả lớp bạn
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
              Thiệp đẹp rồi, giờ đến bộ ảnh thanh xuân thật chất. GP Studio99 lo trọn từ concept, trang phục, đạo cụ tới ekip chụp và hậu kỳ tận tâm.
            </p>

            {/* Bullets with checkmarks */}
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-200">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF758F] shrink-0 mt-0.5" />
                <span>Hàng chục concept: thanh xuân, áo dài, vest, Thái Lan, Cổ phục, Party đêm...</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF758F] shrink-0 mt-0.5" />
                <span>Nhận chụp THPT, THCS, đại học, tiểu học trọn gói tại Đà Nẵng và miền Trung</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF758F] shrink-0 mt-0.5" />
                <span>Đội ngũ nhiệt tình, báo giá minh bạch, hỗ trợ tạo dáng và xem trước demo ảnh</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">

              {/* Xem báo giá */}
              <a
                href="https://chupanhdanang.com/bang-gia-ky-yeu/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D81B60] to-[#E91E63] hover:from-[#C2185B] hover:to-[#D81B60] text-white shadow-lg shadow-pink-600/30 hover:shadow-xl transition-all flex items-center gap-1.5"
              >
                <span>💰 Xem báo giá</span>
                <ExternalLink className="w-3 h-3 text-pink-100" />
              </a>

              {/* Giảm 10% */}
              <a
                href="https://zalo.me/0899236001"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
                title="Nhận mã giảm 10% qua Zalo GP Studio99"
              >
                <span>🎁 Giảm 10%</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Xem concept */}
              <a
                href="https://chupanhdanang.com/thue-trang-phuc-ky-yeu-da-nang/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur transition-all flex items-center gap-1.5"
              >
                <span>✨ Xem concept</span>
                <ExternalLink className="w-3 h-3 text-stone-300" />
              </a>

              {/* Xem sản phẩm */}
              <a
                href="https://chupanhdanang.com/sanphamkyyeudanang/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur transition-all flex items-center gap-1.5"
              >
                <span>🖼️ Xem sản phẩm</span>
                <ExternalLink className="w-3 h-3 text-stone-300" />
              </a>

            </div>

            {/* Direct Contact Row */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
              <a
                href="tel:0899236001"
                className="px-4 py-2 rounded-xl bg-white text-stone-900 font-extrabold text-xs hover:bg-stone-100 shadow flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Phone className="w-3.5 h-3.5 text-[#890F0D] fill-[#890F0D]" />
                <span>0899 236 001</span>
              </a>

              <a
                href="https://zalo.me/0899236001"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Zalo</span>
              </a>

              <span className="text-[11px] text-stone-400">
                • Hỗ trợ tư vấn concept & báo giá 24/7
              </span>
            </div>

          </div>

          {/* ============================================================== */}
          {/* RIGHT 3-PHOTO COLLAGE (Chuẩn mẫu ảnh tham khảo)                 */}
          {/* ============================================================== */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-12 gap-3 items-stretch">

              {/* Left tall photo (Col 7) */}
              <div className="col-span-7 relative rounded-2xl overflow-hidden shadow-xl border border-white/15 group aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src="/showcase/tap-the-lop.webp"
                  alt="Kỷ yếu tập thể GP Studio99"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Tập thể lớp thanh xuân
                </span>
              </div>

              {/* Right 2 stacked photos (Col 5) */}
              <div className="col-span-5 flex flex-col gap-3">

                {/* Top couple */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/15 group flex-1 aspect-square sm:aspect-auto">
                  <img
                    src="/showcase/doi-ban-than.webp"
                    alt="Concept đôi bạn thân kỷ yếu"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    Đôi bạn thân
                  </span>
                </div>

                {/* Bottom portrait */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/15 group flex-1 aspect-square sm:aspect-auto">
                  <img
                    src="/showcase/nang-thanh-xuan.webp"
                    alt="Chân dung thanh xuân học đường"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    Nắng thanh xuân
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
