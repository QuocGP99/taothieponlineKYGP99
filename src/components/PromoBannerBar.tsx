'use client';

import React, { useState } from 'react';
import { Camera, Gift, ExternalLink, X, ArrowRight } from 'lucide-react';

export default function PromoBannerBar() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  const handleScrollToDiscount = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('lead-discount-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#lead-discount-form';
    }
  };

  return (
    <div className="relative bg-[#FFF0F3] border-b border-[#F8BBD0] text-stone-800 text-xs py-2 px-3 sm:px-6 transition-all z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left announcement text */}
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <span className="text-base">📸</span>
          <p className="text-[11px] sm:text-xs text-stone-700 font-medium leading-tight">
            <strong className="text-[#890F0D] font-bold">Lớp bạn chưa chụp kỷ yếu?</strong>{' '}
            <span>
              GP Studio99 nhận chụp kỷ yếu trọn gói cho THPT, THCS, đại học tại Đà Nẵng & miền Trung.
            </span>
          </p>
        </div>

        {/* Right CTA action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://chupanhdanang.com/bang-gia-ky-yeu/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-xs transition-colors flex items-center gap-1"
          >
            <span>Xem báo giá</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <button
            type="button"
            onClick={handleScrollToDiscount}
            className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white hover:bg-rose-50 text-[#890F0D] border border-[#F8BBD0] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>🎁 Nhận ưu đãi 10%</span>
          </button>

          <button
            type="button"
            onClick={() => setClosed(true)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-full transition-colors ml-1"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
