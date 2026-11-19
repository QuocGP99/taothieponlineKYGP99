'use client';

import React, { useRef, useState } from 'react';
import { InvitationData } from '@/types/invitation';
import { Phone, Mail, Camera, Edit3, Navigation, ExternalLink, Calendar, Sparkles } from 'lucide-react';
import { generateGoogleMapsUrl } from '@/lib/maps';

interface PosterHeroSectionProps {
  data: InvitationData;
  isEditable?: boolean;
  onUpdate?: (partial: Partial<InvitationData>) => void;
  guestName?: string;
  onEditPrompt?: () => void;
}

// Hoa phượng trang trí góc dành cho template Green Student / Mùa phượng cuối
const FloralBranchTopLeft = () => (
  <svg className="absolute -top-1 -left-1 w-28 sm:w-32 h-28 sm:h-32 pointer-events-none opacity-90 z-0" viewBox="0 0 120 120" fill="none">
    <path d="M-5 5 Q30 20 48 55 T72 85" stroke="#2D5A27" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M25 22 Q45 15 65 30" stroke="#3E7B35" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 45 Q32 68 22 85" stroke="#3E7B35" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="28" cy="18" rx="6" ry="3" transform="rotate(-30 28 18)" fill="#4CAF50" />
    <ellipse cx="50" cy="22" rx="7" ry="3.5" transform="rotate(20 50 22)" fill="#388E3C" />
    <ellipse cx="32" cy="62" rx="6" ry="3" transform="rotate(-60 32 62)" fill="#4CAF50" />
    <ellipse cx="60" cy="70" rx="7" ry="3.5" transform="rotate(40 60 70)" fill="#2D5A27" />
    <circle cx="68" cy="32" r="7" fill="#DC2626" />
    <circle cx="75" cy="36" r="6" fill="#B91C1C" />
    <circle cx="63" cy="40" r="5.5" fill="#EF4444" />
    <circle cx="70" cy="35" r="2.5" fill="#FDE047" />
    <circle cx="48" cy="58" r="8" fill="#DC2626" />
    <circle cx="56" cy="62" r="6.5" fill="#B91C1C" />
    <circle cx="44" cy="66" r="6" fill="#EF4444" />
    <circle cx="50" cy="61" r="3" fill="#FEF08A" />
    <circle cx="75" cy="88" r="6.5" fill="#DC2626" />
    <circle cx="82" cy="92" r="5.5" fill="#B91C1C" />
    <circle cx="78" cy="90" r="2.5" fill="#FDE047" />
    <circle cx="18" cy="90" r="5" fill="#DC2626" />
    <circle cx="22" cy="94" r="4" fill="#B91C1C" />
  </svg>
);

const FloralBranchTopRight = () => (
  <svg className="absolute -top-1 -right-1 w-28 sm:w-32 h-28 sm:h-32 pointer-events-none opacity-90 z-0 transform -scale-x-100" viewBox="0 0 120 120" fill="none">
    <path d="M-5 5 Q30 20 48 55 T72 85" stroke="#2D5A27" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M25 22 Q45 15 65 30" stroke="#3E7B35" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 45 Q32 68 22 85" stroke="#3E7B35" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="28" cy="18" rx="6" ry="3" transform="rotate(-30 28 18)" fill="#4CAF50" />
    <ellipse cx="50" cy="22" rx="7" ry="3.5" transform="rotate(20 50 22)" fill="#388E3C" />
    <ellipse cx="32" cy="62" rx="6" ry="3" transform="rotate(-60 32 62)" fill="#4CAF50" />
    <ellipse cx="60" cy="70" rx="7" ry="3.5" transform="rotate(40 60 70)" fill="#2D5A27" />
    <circle cx="68" cy="32" r="7" fill="#DC2626" />
    <circle cx="75" cy="36" r="6" fill="#B91C1C" />
    <circle cx="63" cy="40" r="5.5" fill="#EF4444" />
    <circle cx="70" cy="35" r="2.5" fill="#FDE047" />
    <circle cx="48" cy="58" r="8" fill="#DC2626" />
    <circle cx="56" cy="62" r="6.5" fill="#B91C1C" />
    <circle cx="44" cy="66" r="6" fill="#EF4444" />
    <circle cx="50" cy="61" r="3" fill="#FEF08A" />
    <circle cx="75" cy="88" r="6.5" fill="#DC2626" />
    <circle cx="82" cy="92" r="5.5" fill="#B91C1C" />
    <circle cx="78" cy="90" r="2.5" fill="#FDE047" />
  </svg>
);

const FloralBranchBottomLeft = () => (
  <svg className="absolute -bottom-1 -left-1 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none opacity-80 z-0 transform -scale-y-100" viewBox="0 0 120 120" fill="none">
    <path d="M-5 5 Q30 20 48 55 T72 85" stroke="#2D5A27" strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx="28" cy="18" rx="6" ry="3" transform="rotate(-30 28 18)" fill="#4CAF50" />
    <ellipse cx="50" cy="22" rx="7" ry="3.5" transform="rotate(20 50 22)" fill="#388E3C" />
    <circle cx="68" cy="32" r="7" fill="#DC2626" />
    <circle cx="75" cy="36" r="6" fill="#B91C1C" />
    <circle cx="48" cy="58" r="7.5" fill="#DC2626" />
    <circle cx="56" cy="62" r="6" fill="#B91C1C" />
    <circle cx="50" cy="61" r="2.5" fill="#FEF08A" />
  </svg>
);

export default function PosterHeroSection({
  data,
  isEditable = false,
  onUpdate,
  guestName,
  onEditPrompt
}: PosterHeroSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [part1Input, setPart1Input] = useState('');
  const [part2Input, setPart2Input] = useState('');

  // Tách tên người tạo thành 2 bên trái / phải (VD: HOÀNG - NGỌC)
  const getSplitName = () => {
    if (data.namePart1 && data.namePart2) {
      return { part1: data.namePart1, part2: data.namePart2 };
    }
    const raw = (data.studentName || 'HOÀNG NGỌC').trim().toUpperCase();
    const parts = raw.split(/\s+/);
    if (parts.length === 1) {
      return { part1: 'KỶ YẾU', part2: parts[0] };
    }
    const mid = Math.ceil(parts.length / 2);
    return {
      part1: parts.slice(0, mid).join(' '),
      part2: parts.slice(mid).join(' ')
    };
  };

  const { part1, part2 } = getSplitName();

  // Định dạng thứ trong tuần từ ngày (VD: Thứ tư)
  const getDayOfWeek = (dateString?: string) => {
    if (!dateString) return 'Thứ tư';
    try {
      const date = new Date(dateString);
      const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
      return days[date.getDay()] || 'Thứ tư';
    } catch {
      return 'Thứ tư';
    }
  };

  // Định dạng Ngày.Tháng (VD: 22.07)
  const getDayMonthFormatted = (dateString?: string) => {
    if (!dateString) return '22.07';
    try {
      const [year, month, day] = dateString.split('-');
      if (day && month) return `${day.padStart(2, '0')}.${month.padStart(2, '0')}`;
      const d = new Date(dateString);
      return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    } catch {
      return '22.07';
    }
  };

  // Định dạng khung giờ (VD: 13H- 18H)
  const getTimeRangeFormatted = () => {
    const start = data.startTime ? data.startTime.replace(':', 'H') : '13H';
    const end = data.endTime ? data.endTime.replace(':', 'H') : '18H';
    return `${start}- ${end}`;
  };

  // Xử lý đổi ảnh đại diện trực tiếp
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdate) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdate({ avatarPhoto: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Lưu chỉnh sửa tên 2 bên
  const handleSaveName = () => {
    if (onUpdate) {
      const p1 = part1Input.trim().toUpperCase() || part1;
      const p2 = part2Input.trim().toUpperCase() || part2;
      onUpdate({
        namePart1: p1,
        namePart2: p2,
        studentName: `${p1} ${p2}`
      });
    }
    setIsEditingName(false);
  };

  const currentGuest = guestName || data.guestName || 'Bạn thân mến';
  const mapsUrl = data.googleMapsUrl || generateGoogleMapsUrl(data.schoolName || data.shootLocation);
  const avatarSrc = data.avatarPhoto || '/images/poster-reference.jpg';

  // Định dạng ngày cho con dấu đỏ Polaroid (VD: 30.12.2026)
  const getStampDateFormatted = (dateString?: string) => {
    if (!dateString) return '30.12.2026';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[2].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[0]}`;
      }
      const d = new Date(dateString);
      return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    } catch {
      return '30.12.2026';
    }
  };

  const isGreenStudent = data.templateId === 'green-student';

  // 1. GIAO DIỆN PHONG CÁCH GREEN STUDENT / MÙA PHƯỢNG CUỐI POLAROID (Chuẩn Image 1)
  if (isGreenStudent) {
    return (
      <div className="w-full max-w-md mx-auto relative select-none">
        <div 
          className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-amber-900/10 text-stone-900 px-6 sm:px-8 pt-8 pb-10 transition-all select-none"
          style={{
            background: 'linear-gradient(180deg, #FFFDF8 0%, #FAF5EE 50%, #F5EDE0 100%)'
          }}
        >
          {/* Cành hoa phượng vĩ 4 góc */}
          <FloralBranchTopLeft />
          <FloralBranchTopRight />
          <FloralBranchBottomLeft />

          {/* Cánh hoa rơi rải rác */}
          <div className="absolute top-28 left-6 w-3 h-3 bg-red-500/80 rounded-full rotate-45 blur-[0.3px] pointer-events-none" />
          <div className="absolute top-44 right-6 w-3.5 h-2.5 bg-red-600/75 rounded-full rotate-12 blur-[0.3px] pointer-events-none" />
          <div className="absolute bottom-32 left-5 w-2.5 h-2.5 bg-red-400/80 rounded-full -rotate-45 pointer-events-none" />
          <div className="absolute bottom-24 right-7 w-3.5 h-3 bg-red-500/80 rounded-full rotate-30 pointer-events-none" />

          {/* Nút chỉnh sửa nhanh CHỈ hiển thị khi ở chế độ builder (isEditable === true) */}
          {isEditable && (
            <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-amber-300/30">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Bấm vào ảnh & chữ để đổi nhanh</span>
            </div>
          )}

          {/* Nội dung Header */}
          <div className="relative z-10 text-center space-y-1 mb-3">
            {/* KỶ YẾU • 2024 - 2027 */}
            <p className="text-[11px] font-extrabold tracking-[0.25em] text-[#890F0D] uppercase">
              KỶ YẾU • {data.schoolYear || '2024 – 2027'}
            </p>

            {/* 12A1 (Tên lớp to nổi bật) */}
            <h1 
              onClick={() => {
                if (isEditable) {
                  setPart1Input(part1);
                  setPart2Input(part2);
                  setIsEditingName(true);
                }
              }}
              className={`text-5xl sm:text-6xl font-black text-[#890F0D] tracking-tight ${
                isEditable ? 'cursor-pointer hover:opacity-90' : ''
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {data.className || '12A1'}
            </h1>

            {/* mùa phượng cuối (Chữ script đỏ mềm mại) */}
            <h2 
              className="text-2xl sm:text-3xl text-[#991B1B] font-bold -mt-1 sm:-mt-2 transform -rotate-1"
              style={{ fontFamily: "'Dancing Script', 'Alex Brush', cursive" }}
            >
              {data.title || 'mùa phượng cuối'}
            </h2>

            {/* Tên trường của bạn */}
            <p className="text-xs font-semibold text-stone-600 mt-1">
              {data.schoolName || 'Tên trường của bạn'}
            </p>
          </div>

          {/* POLAROID PHOTO CARD (Trung tâm nghệ thuật) */}
          <div className="relative z-10 mx-auto max-w-[270px] sm:max-w-[290px] my-4">
            
            {/* Miếng băng dính washi vàng dán phía trên */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-6 bg-[#FBBF24]/85 rotate-[1.5deg] shadow-xs z-30 pointer-events-none rounded-2xs backdrop-blur-xs border border-amber-300/40" />

            {/* Khung ảnh Polaroid trắng tự nhiên hơi nghiêng */}
            <div 
              onClick={() => {
                if (isEditable) {
                  fileInputRef.current?.click();
                }
              }}
              className={`bg-white p-3.5 pb-6 rounded-2xs shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-stone-200/70 rotate-[-1deg] transition-transform duration-300 ${
                isEditable ? 'cursor-pointer hover:rotate-0 hover:scale-[1.01]' : ''
              }`}
            >
              {/* Vùng ảnh học sinh */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 rounded-2xs">
                <img
                  src={avatarSrc}
                  alt={data.studentName || 'Kỷ yếu học sinh'}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {/* Con dấu đỏ vintage tròn ở góc dưới bên phải ảnh */}
                <div className="absolute -bottom-1 -right-1 translate-x-2 translate-y-2 w-16 h-16 rounded-full border-2 border-dashed border-[#B91C1C] bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-[#B91C1C] rotate-[-12deg] shadow-md z-20 pointer-events-none">
                  <span className="text-[8px] font-bold uppercase tracking-wider leading-none">Ngày</span>
                  <span className="text-[10px] font-extrabold leading-tight my-0.5">{getStampDateFormatted(data.date)}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider leading-none">Kỷ yếu</span>
                </div>
              </div>

              {/* Tên gọi dưới khung polaroid (Chữ viết tay nghệ thuật) */}
              <div className="pt-3 text-center">
                <p 
                  className="text-xl sm:text-2xl font-bold text-stone-800 tracking-wide"
                  style={{ fontFamily: "'Dancing Script', 'Alex Brush', cursive" }}
                >
                  {data.nickname || data.studentName || 'Tên gọi'}
                </p>
                {isEditable && (
                  <span className="inline-block text-[9px] text-[#890F0D] font-bold uppercase tracking-tighter mt-0.5">
                    ✏️ Bấm để đổi ảnh / tên
                  </span>
                )}
              </div>
            </div>

            {/* Hidden file input for photo upload */}
            {isEditable && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            )}
          </div>

          {/* Modal đổi tên nhanh khi click vào tên trong chế độ builder */}
          {isEditingName && (
            <div className="my-2 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-stone-300 text-xs text-left w-full z-40 animate-in fade-in zoom-in-95 shadow-xl">
              <p className="font-bold text-[#890F0D] mb-2">Đổi tên / lớp hiển thị trên thiệp:</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Lớp (12A1)"
                  defaultValue={data.className}
                  onChange={(e) => onUpdate && onUpdate({ className: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-900 font-bold"
                />
                <input
                  type="text"
                  placeholder="Tên gọi"
                  defaultValue={data.nickname || data.studentName}
                  onChange={(e) => onUpdate && onUpdate({ nickname: e.target.value, studentName: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-900 font-bold"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="w-full py-1.5 bg-[#890F0D] text-white font-bold rounded-lg shadow-sm"
              >
                Xong
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // 2. GIAO DIỆN PHONG CÁCH SPOTLIGHT CRIMSON RED (Mặc định)
  return (
    <div className="w-full max-w-md mx-auto relative select-none">
      {/* Cấu trúc Header thông tin sự kiện */}
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-[#890F0D]/10 text-[#890F0D] rounded-full text-xs font-extrabold uppercase tracking-widest border border-[#890F0D]/20 shadow-xs">
          🎓 KỶ YẾU – NIÊN KHÓA {data.schoolYear || '2023 - 2027'}
        </span>
        <h2 className="text-xs uppercase font-bold text-stone-500 mt-1">
          {data.schoolName || 'TRƯỜNG ĐẠI HỌC ĐÔNG Á'} • LỚP {data.className || '12A1'}
        </h2>
      </div>

      {/* ============================================================== */}
      {/* POSTER HERO CARD (Phong cách Spotlight Crimson Red) */}
      {/* ============================================================== */}
      <div 
        className="relative w-full rounded-[26px] overflow-hidden shadow-2xl border-2 border-white/20 text-white"
        style={{
          background: 'radial-gradient(circle at 50% 28%, #890F0D 0%, #720000 40%, #4A0202 75%, #250000 100%)'
        }}
      >
        {/* Hai chùm ánh sáng sân khấu chiếu rọi từ trên (Spotlights) */}
        <div className="absolute inset-0 spotlight-left opacity-90 z-0" />
        <div className="absolute inset-0 spotlight-right opacity-90 z-0" />

        {/* Lớp hạt nhiễu mờ & ánh sáng tâm điểm */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-400/20 blur-3xl pointer-events-none z-0" />

        {/* Nút chỉnh sửa nhanh CHỈ hiển thị khi ở chế độ builder (isEditable === true) */}
        {isEditable && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-amber-300/30">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Bấm vào ảnh & tên để đổi nhanh</span>
          </div>
        )}

        {/* Nội dung Poster */}
        <div className="relative z-10 px-6 pt-7 pb-6 flex flex-col items-center">
          
          {/* 1. Header Typography: HAPPY Yearbook Event */}
          <div className="text-center w-full mb-1">
            <h3 
              className="font-black text-xl sm:text-2xl tracking-[0.25em] text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              HAPPY
            </h3>
            <h1 
              className="text-4xl sm:text-5xl text-white font-script -mt-1 sm:-mt-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-wide transform -rotate-1"
            >
              Yearbook Event
            </h1>
          </div>

          {/* 2. Center Composition: Tên 2 bên + Ảnh Chân Dung Ở Giữa */}
          <div className="w-full relative my-2 flex items-center justify-center">
            
            {/* Tên hiển thị bên trái (VD: HOÀNG) */}
            <div 
              onClick={() => {
                if (isEditable) {
                  setPart1Input(part1);
                  setPart2Input(part2);
                  setIsEditingName(true);
                }
              }}
              className={`w-5/12 text-center pr-1 transition-all ${
                isEditable ? 'cursor-pointer hover:scale-105 hover:text-amber-200' : ''
              }`}
            >
              <h2 
                className="font-display-retro text-2xl sm:text-3xl font-black uppercase text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] break-words tracking-wider"
              >
                {part1}
              </h2>
              {isEditable && (
                <span className="inline-block text-[9px] text-amber-200 opacity-80 uppercase tracking-tighter mt-0.5">
                  ✏️ Đổi tên
                </span>
              )}
            </div>

            {/* Khung ảnh chân dung học sinh ở trung tâm */}
            <div 
              className="relative w-36 h-48 sm:w-44 sm:h-56 shrink-0 z-20 group"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.6)] relative bg-black/30">
                <img
                  src={avatarSrc}
                  alt={data.studentName}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback sang ảnh mẫu nếu link ảnh lỗi
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                
                {/* Lớp gradient nhẹ dưới đáy ảnh */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* Nút bấm đổi ảnh trực tiếp khi hover hoặc isEditable */}
              {isEditable && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/70 hover:bg-[#890F0D] text-white flex items-center justify-center border border-white/50 shadow-lg opacity-80 hover:opacity-100 transition-all hover:scale-110 z-30"
                    title="Bấm để tải ảnh của bạn"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#890F0D] text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/40 shadow">
                    Đổi ảnh
                  </span>
                </>
              )}
            </div>

            {/* Tên hiển thị bên phải (VD: NGỌC) */}
            <div 
              onClick={() => {
                if (isEditable) {
                  setPart1Input(part1);
                  setPart2Input(part2);
                  setIsEditingName(true);
                }
              }}
              className={`w-5/12 text-center pl-1 transition-all ${
                isEditable ? 'cursor-pointer hover:scale-105 hover:text-amber-200' : ''
              }`}
            >
              <h2 
                className="font-display-retro text-2xl sm:text-3xl font-black uppercase text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] break-words tracking-wider"
              >
                {part2}
              </h2>
              {isEditable && (
                <span className="inline-block text-[9px] text-amber-200 opacity-80 uppercase tracking-tighter mt-0.5">
                  ✏️ Đổi tên
                </span>
              )}
            </div>
          </div>

          {/* Modal đổi tên nhanh khi click vào tên */}
          {isEditingName && (
            <div className="my-2 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/30 text-xs text-left w-full z-40 animate-in fade-in zoom-in-95">
              <p className="font-bold text-amber-300 mb-2">Đổi tên hiển thị 2 bên ảnh poster:</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-[10px] text-stone-300 block mb-0.5">Tên bên trái:</label>
                  <input
                    type="text"
                    value={part1Input}
                    onChange={(e) => setPart1Input(e.target.value)}
                    className="w-full px-2 py-1 bg-white/10 rounded border border-white/30 text-white font-bold"
                    placeholder="VD: HOÀNG"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-300 block mb-0.5">Tên bên phải:</label>
                  <input
                    type="text"
                    value={part2Input}
                    onChange={(e) => setPart2Input(e.target.value)}
                    className="w-full px-2 py-1 bg-white/10 rounded border border-white/30 text-white font-bold"
                    placeholder="VD: NGỌC"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2.5 py-1 rounded bg-stone-700 text-stone-300 hover:bg-stone-600"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-3 py-1 rounded bg-[#890F0D] text-white font-bold hover:bg-red-700"
                >
                  Lưu tên
                </button>
              </div>
            </div>
          )}

          {/* 3. Lời chào & Tên khách mời */}
          <div className="text-center mt-3 mb-4 w-full">
            <p className="text-xs sm:text-sm font-medium text-white/90 tracking-wider">
              Trân trọng kính mời
            </p>
            <div className="inline-block relative min-w-[200px] mt-0.5">
              <span className="font-script text-2xl sm:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2">
                {currentGuest}
              </span>
              <div className="w-full border-b border-dotted border-white/70 mt-0.5" />
            </div>
          </div>

          {/* 4. Khung Thông Tin Sự Kiện Bo Viền (Event Box đúng tỷ lệ ảnh mẫu) */}
          <div className="w-full rounded-2xl border-2 border-white bg-black/25 backdrop-blur-xs overflow-hidden shadow-lg mt-1">
            {/* Hàng 1: Thứ/Ngày & Vào lúc/Giờ */}
            <div className="grid grid-cols-2 divide-x-2 divide-white text-center py-2.5">
              <div className="px-3 flex flex-col justify-center">
                <span className="text-xs sm:text-sm font-medium text-white/90">
                  {getDayOfWeek(data.date)}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-0.5">
                  {getDayMonthFormatted(data.date)}
                </span>
              </div>
              <div className="px-3 flex flex-col justify-center">
                <span className="text-xs sm:text-sm font-medium text-white/90">
                  Vào lúc
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-0.5">
                  {getTimeRangeFormatted()}
                </span>
              </div>
            </div>

            {/* Hàng 2: Tên trường & Địa chỉ Google Maps */}
            <div className="border-t-2 border-white px-4 py-3 text-center bg-black/15">
              <h4 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-white">
                {data.schoolName || 'TRƯỜNG ĐẠI HỌC ĐÔNG Á'}
              </h4>
              <p className="text-[11px] sm:text-xs text-white/90 font-normal mt-0.5 leading-relaxed line-clamp-2">
                {data.shootLocation || data.detailedAddress || '14 ngõ 23 đường Hồng Bàng, quận 3, thành phố Hồ Chí Minh'}
              </p>

              {/* Nút chỉ đường Google Maps nhỏ gọn */}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-200 hover:text-white mt-1.5 underline underline-offset-2 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-amber-300" />
                  <span>Mở Google Maps chỉ đường</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* 5. Chân trang Poster: Hotline & Email/Website */}
          <div className="w-full mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] sm:text-xs text-white/90 px-1 font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Phone className="w-3 h-3 text-white" />
              </div>
              <span>{data.creatorPhone || '0899.236.001'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Mail className="w-3 h-3 text-white" />
              </div>
              <span className="truncate max-w-[170px]">
                {data.creatorEmail || 'chupanhdanang.com'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
