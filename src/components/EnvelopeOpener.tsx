'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Heart } from 'lucide-react';

interface EnvelopeOpenerProps {
  classNameStr: string;
  schoolName: string;
  senderName: string;
  onOpen: () => void;
  isOpen: boolean;
}

export default function EnvelopeOpener({
  classNameStr,
  schoolName,
  senderName,
  onOpen,
  isOpen
}: EnvelopeOpenerProps) {
  const [opening, setOpening] = useState(false);

  const handleOpenClick = () => {
    setOpening(true);

    // Fire fireworks confetti in crimson, gold, rose and amber
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#890F0D', '#720000', '#D97706', '#F59E0B', '#E11D48']
    });

    setTimeout(() => {
      onOpen();
    }, 700);
  };

  if (isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#240303]/85 backdrop-blur-md">
      <div className={`max-w-md w-full relative transition-all duration-700 ${opening ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Envelope Body */}
        <div className="bg-gradient-to-br from-[#FFF8F8] via-white to-[#FEE2E2] rounded-3xl p-8 shadow-2xl border-4 border-[#890F0D]/30 text-center relative overflow-hidden">
          
          {/* Top Envelope Flap decor */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#890F0D]/15 to-transparent pointer-events-none" />

          {/* Stamp in top-right */}
          <div className="absolute top-5 right-5 border-2 border-dashed border-[#890F0D]/50 p-1.5 rounded-lg rotate-6 bg-white shadow-xs">
            <span className="text-[9px] font-black text-[#720000] block uppercase">GP STUDIO99</span>
            <span className="text-[8px] text-stone-500 font-mono">ĐÀ NẴNG 2027</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#720000] via-[#890F0D] to-[#B91C1C] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#890F0D]/30">
            <Mail className="w-8 h-8 animate-bounce" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3.5 py-1 rounded-full border border-[#890F0D]/20">
            THIỆP MỜI CÁ NHÂN
          </span>

          <h2 className="text-2xl font-black text-[#720000] mt-4">
            Gửi Đến Bạn Bè & Người Thân
          </h2>

          <p className="text-sm font-bold text-stone-700 mt-1">
            Chủ nhân thiệp: <span className="text-[#890F0D]">{senderName || 'Mình'}</span>
          </p>

          <p className="text-xs text-stone-500 mt-0.5">
            Lớp {classNameStr} • {schoolName}
          </p>

          <p className="text-xs text-stone-600 mt-3 px-4 leading-relaxed italic">
            "Có những năm tháng thanh xuân chỉ rực rỡ một lần trong đời. Sự hiện diện và nụ cười của bạn là mảnh ghép hoàn hảo nhất trong ngày kỷ yếu của mình!"
          </p>

          <div className="my-6 border-t border-dashed border-[#890F0D]/20 pt-4">
            <p className="text-xs text-gray-400">Trân trọng gửi lời mời từ:</p>
            <p className="text-lg font-bold text-[#720000] font-handwriting">{senderName || 'Bảo Anh'}</p>
          </div>

          {/* Crimson Wax Seal Open Button */}
          <button
            onClick={handleOpenClick}
            className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#B91C1C] hover:from-[#540000] hover:to-[#720000] shadow-xl shadow-[#890F0D]/35 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform text-amber-200" />
            <span className="text-base tracking-wide">CHẠM ĐỂ MỞ THIỆP MỜI</span>
          </button>

          <p className="text-[10px] text-stone-400 mt-3">
            Đồng hành bởi GP Studio99 • Kỷ Yếu Đà Nẵng (chupanhdanang.com)
          </p>
        </div>

      </div>
    </div>
  );
}
