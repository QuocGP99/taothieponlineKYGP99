'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Heart } from 'lucide-react';

interface EnvelopeOpenerProps {
  classNameStr: string;
  schoolName: string;
  senderName: string;
  guestName?: string;
  templateId?: string;
  onOpen: () => void;
  isOpen: boolean;
}

export default function EnvelopeOpener({
  classNameStr,
  schoolName,
  senderName,
  guestName,
  templateId,
  onOpen,
  isOpen
}: EnvelopeOpenerProps) {
  const [opening, setOpening] = useState(false);

  const isNotebookStyle = templateId === 'green-student';
  const isFilmRollStyle = templateId === 'vintage-film-roll' || templateId === 'film-roll';

  const handleOpenClick = () => {
    setOpening(true);

    if (isNotebookStyle) {
      // Pastel confetti in lavender, pink, yellow, mint
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D6BCFA', '#F472B6', '#FDE047', '#A7F3D0', '#C4B5FD', '#F43F5E']
      });
    } else if (isFilmRollStyle) {
      // Warm golden cinema confetti
      confetti({
        particleCount: 95,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#D97706', '#B45309', '#FDE68A', '#78350F']
      });
    } else {
      // Crimson fireworks confetti
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#890F0D', '#720000', '#D97706', '#F59E0B', '#E11D48']
      });
    }

    setTimeout(() => {
      onOpen();
    }, 700);
  };

  if (isOpen) return null;

  // ==============================================================
  // 1. MẪU SỔ LƯU BÚT KỶ YẾU (SCRAPBOOK NOTEBOOK OPENER)
  // Chuẩn theo reference image: "Ê Bạn ơi, có cuốn sổ gửi cậu nè!"
  // ==============================================================
  if (isNotebookStyle) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FFF5F7] via-[#FAF5FF] to-[#F5F3FF] backdrop-blur-md overflow-hidden select-none font-quicksand">

        {/* Floating background graduation caps & hearts */}
        <div className="absolute top-12 left-10 text-3xl opacity-40 animate-bounce pointer-events-none" style={{ animationDuration: '4s' }}>
          🎓
        </div>
        <div className="absolute top-24 right-16 text-2xl opacity-40 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }}>
          🎓
        </div>
        <div className="absolute bottom-20 left-16 text-2xl opacity-35 animate-pulse pointer-events-none" style={{ animationDuration: '5s' }}>
          💕
        </div>
        <div className="absolute bottom-16 right-12 text-3xl opacity-40 animate-bounce pointer-events-none" style={{ animationDuration: '6s' }}>
          🤍
        </div>

        <div className={`flex flex-col items-center justify-center max-w-sm w-full transition-all duration-700 ${opening ? 'scale-125 opacity-0 rotate-6' : 'scale-100 opacity-100'}`}>

          {/* Heading prompt */}
          <div className="text-center mb-6 space-y-1">
            <p className="text-sm sm:text-base font-semibold text-stone-700">
              Ê <span className="text-[#EC4899] font-bold">{guestName || 'Bạn'}</span> ơi,
            </p>
            <p className="text-sm sm:text-base font-semibold text-stone-700">
              có cuốn sổ gửi cậu nè!
            </p>
          </div>

          {/* Notebook Cover 3D Card */}
          <div className="relative w-64 sm:w-72 h-84 sm:h-92 rounded-2xl bg-[#D6BCFA] shadow-2xl shadow-purple-900/20 border-4 border-[#C4B5FD] flex items-center justify-center p-4 transition-all duration-500 hover:scale-102 bg-polka-dot group">

            {/* Left Notebook Spine Binding */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-[#B794F4] rounded-l-xl border-r border-[#9F7AEA]/40 flex flex-col justify-around py-5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9D8FD] shadow-xs" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9D8FD] shadow-xs" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9D8FD] shadow-xs" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9D8FD] shadow-xs" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9D8FD] shadow-xs" />
            </div>

            {/* Right Elastic Bookmark Band */}
            <div className="absolute right-4 top-0 bottom-0 w-2.5 bg-[#F472B6] shadow-md z-10 rounded-full" />

            {/* Floating Cap Sticker on Notebook */}
            <div className="absolute -top-3.5 -right-2 text-3xl transform rotate-12 drop-shadow-md z-20">
              🎓
            </div>

            {/* Floating Pink Heart Sticker on Notebook */}
            <div className="absolute -bottom-3 left-4 text-2xl transform -rotate-12 drop-shadow-md z-20">
              💖
            </div>

            {/* White Center Label */}
            <div className="bg-white/95 backdrop-blur-xs rounded-xl p-5 w-48 sm:w-52 text-center shadow-md border border-purple-100 z-10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono block">
                SỔ LƯU BÚT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-800 font-cute">
                Kỷ yếu
              </h3>
              <p className="text-xs font-bold text-stone-500">
                Lớp {classNameStr || '12A1'}
              </p>
            </div>
          </div>

          {/* Pill Button below notebook */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleOpenClick}
              className="px-6 py-2.5 rounded-full border-2 border-dashed border-stone-600 hover:border-purple-600 bg-white/90 hover:bg-white text-stone-800 hover:text-purple-700 font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <span>chạm để lật sổ</span>
              <span className="text-base font-normal">→</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==============================================================
  // 2. MẪU CUỘN PHIM THANH XUÂN (VINTAGE CINEMA CLAPPER OPENER)
  // ==============================================================
  if (isFilmRollStyle) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1C1410] via-[#2A1D17] to-[#120D0A] backdrop-blur-md overflow-hidden select-none font-cormorant">

        {/* Floating background cinema film icons */}
        <div className="absolute top-12 left-10 text-3xl opacity-35 animate-bounce pointer-events-none" style={{ animationDuration: '4s' }}>
          🎬
        </div>
        <div className="absolute top-24 right-16 text-2xl opacity-35 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }}>
          🎞️
        </div>
        <div className="absolute bottom-20 left-16 text-2xl opacity-30 animate-pulse pointer-events-none" style={{ animationDuration: '5s' }}>
          ✨
        </div>
        <div className="absolute bottom-16 right-12 text-3xl opacity-35 animate-bounce pointer-events-none" style={{ animationDuration: '6s' }}>
          ⭐
        </div>

        <div className={`flex flex-col items-center justify-center max-w-sm w-full transition-all duration-700 ${opening ? 'scale-125 opacity-0 rotate-3' : 'scale-100 opacity-100'}`}>

          {/* Heading prompt */}
          <div className="text-center mb-6 space-y-1">
            <span className="text-[10px] sm:text-[11px] font-courier uppercase tracking-[0.25em] text-amber-400/80 block">
              PREMIERE INVITATION
            </span>
            <p className="text-base sm:text-lg font-bold text-[#F7F2EA]">
              Cuộn phim thanh xuân của <span className="text-amber-400">{guestName || 'Cậu'}</span>
            </p>
            <p className="text-xs sm:text-sm text-stone-300 font-caveat text-lg">
              đã sẵn sàng bấm máy!
            </p>
          </div>

          {/* Cinema Clapperboard / Golden Ticket 3D Card */}
          <div className="relative w-68 sm:w-76 h-88 sm:h-96 rounded-2xl bg-gradient-to-b from-[#382113] via-[#2A170B] to-[#1F1108] shadow-2xl shadow-black/70 border-2 border-amber-500/40 p-5 flex flex-col justify-between text-center transition-all duration-500 hover:scale-102 group overflow-hidden">
            
            {/* Clapperboard Top Chevrons */}
            <div className="w-full h-8 bg-amber-400/10 rounded-lg border border-amber-400/30 flex items-center justify-around overflow-hidden px-1">
              <span className="w-4 h-full bg-amber-400/20 transform -skew-x-20" />
              <span className="w-4 h-full bg-amber-400/20 transform -skew-x-20" />
              <span className="w-4 h-full bg-amber-400/20 transform -skew-x-20" />
              <span className="w-4 h-full bg-amber-400/20 transform -skew-x-20" />
              <span className="w-4 h-full bg-amber-400/20 transform -skew-x-20" />
              <span className="w-4 h-full bg-amber-400/20 transform -skew-x-20" />
            </div>

            {/* Title & Details */}
            <div className="space-y-2 py-4">
              <span className="text-[9px] font-courier uppercase tracking-widest text-amber-300/80 block">
                SPECIAL CINEMA ROLL
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold font-cormorant text-white tracking-tight leading-none">
                Thanh Xuân
              </h3>
              <span className="text-xl font-caveat text-amber-400 block font-semibold">
                cuộn phim cuối cấp
              </span>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full border border-amber-400/40 text-[10px] font-courier text-amber-300 tracking-wider uppercase bg-amber-950/40">
                  LỚP {classNameStr || '12A1'}
                </span>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="pt-2 border-t border-amber-500/20 text-[10px] font-courier text-stone-400 flex items-center justify-between">
              <span>ROLL #01</span>
              <span className="text-amber-400 font-bold">35MM FILM</span>
              <span>ISO 400</span>
            </div>
          </div>

          {/* Pill Button below ticket */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleOpenClick}
              className="px-6 py-2.5 rounded-full border-2 border-dashed border-amber-500/70 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 font-courier font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <span>chạm để phát phim</span>
              <span className="text-sm font-normal">▶</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==============================================================
  // 3. MẪU BÌ THƯ SƠN HOÀNG GIA CRIMSON SPOTLIGHT (MẶC ĐỊNH)
  // ==============================================================
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
