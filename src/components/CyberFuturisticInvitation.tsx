'use client';

import React, { useState, useEffect } from 'react';
import { InvitationData, RSVP } from '@/types/invitation';
import { generateGoogleMapsUrl } from '@/lib/maps';
import {
  Calendar, Clock, MapPin, Share2, Check, Copy,
  Sparkles, Send, ArrowRight, ExternalLink, Heart, Star
} from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';

interface CyberFuturisticInvitationProps {
  data: InvitationData;
  isInteractive?: boolean;
  onUpdate?: (partial: Partial<InvitationData>) => void;
  guestName?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  onEditPrompt?: () => void;
  onRSVPSubmit?: (rsvp: Omit<RSVP, 'id' | 'createdAt'>) => Promise<void> | void;
}

export default function CyberFuturisticInvitation({
  data,
  isInteractive = false,
  onUpdate,
  guestName,
  cardRef,
  onEditPrompt,
  onRSVPSubmit
}: CyberFuturisticInvitationProps) {
  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined'>('confirmed');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Default gallery images
  const defaultGallery = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80'
  ];

  const galleryImages = (data.gallery && data.gallery.length > 0)
    ? [...data.gallery, ...defaultGallery].slice(0, 6)
    : defaultGallery;

  // Tính toán thời gian đếm ngược
  useEffect(() => {
    if (!data.date) return;

    const calculateTime = () => {
      const target = new Date(`${data.date}T${data.startTime || '07:00'}:00`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [data.date, data.startTime]);

  // Format date: DD.MM.YYYY
  const formattedDate = React.useMemo(() => {
    if (!data.date) return '31.12.2026';
    const parts = data.date.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return data.date;
  }, [data.date]);

  const mapsUrl = data.googleMapsUrl || generateGoogleMapsUrl(data.schoolName || data.shootLocation);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCalendar = () => {
    const title = encodeURIComponent(`Yearbook 2030 - Lớp ${data.className || '12A1'} (${data.studentName || 'Kỷ yếu'})`);
    const details = encodeURIComponent(`Buổi chụp kỷ yếu cùng ${data.studentName || 'tụi mình'}. Địa điểm: ${data.gatheringLocation || data.shootLocation || 'Sân trường'}`);
    const location = encodeURIComponent(data.detailedAddress || data.schoolName || 'Sân trường');
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(calUrl, '_blank');
  };

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setIsSubmittingRsvp(true);
    try {
      if (onRSVPSubmit) {
        await onRSVPSubmit({
          invitationId: data.id,
          guestName: rsvpName.trim(),
          status: rsvpStatus,
          message: rsvpMessage.trim(),
          relation: 'Bạn bè'
        });
      }

      triggerConfetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#FF2E93', '#A3E635', '#38BDF8', '#FACC15', '#000000']
      });

      setRsvpSubmitted(true);
      setRsvpMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Process timeline items with pixel icons
  const processSteps = [
    { icon: '💬', time: '06:30', title: 'Tập trung & Trang phục', label: 'COMMUNICATION' },
    { icon: '💡', time: '07:30', title: 'Chụp ảnh tập thể cả lớp', label: 'IDEATION' },
    { icon: '📁', time: '09:00', title: 'Chụp concept nhóm bạn', label: 'DRAFTS' },
    { icon: '✔️', time: '10:30', title: 'Ảnh cá nhân & lưu bút', label: 'FINAL SUBMISSION' }
  ];

  return (
    <div
      ref={cardRef}
      className="max-w-md sm:max-w-xl mx-auto w-full bg-white rounded-3xl border-4 border-black shadow-pop-lg overflow-hidden relative select-text font-quicksand text-black pb-10"
    >
      {/* Top Neon Lime Bar: GRAPHIC DESIGNER 2030 */}
      <div className="bg-[#A3E635] border-b-4 border-black px-4 py-2 flex items-center justify-between text-xs font-pixel font-bold tracking-wider">
        <span>YEARBOOK 2030</span>
        <span className="text-[10px] bg-black text-[#A3E635] px-2 py-0.5 rounded-sm">
          GP STUDIO99
        </span>
        <span>2030</span>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-6 space-y-10">

        {/* ============================================================== */}
        {/* HERO HEADER: CREATIVE PORTFOLIO / YEARBOOK 2030                */}
        {/* ============================================================== */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#38BDF8] via-[#60A5FA] to-[#4ADE80] p-6 border-4 border-black shadow-pop text-center overflow-hidden bg-halftone">
          
          {/* Pixel Folders & Charms floating */}
          <div className="absolute top-3 left-3 text-2xl animate-bounce pointer-events-none" style={{ animationDuration: '4s' }}>
            📁
          </div>
          <div className="absolute top-4 right-4 text-2xl animate-pulse pointer-events-none" style={{ animationDuration: '3s' }}>
            ⭐
          </div>
          <div className="absolute bottom-3 left-4 text-2xl pointer-events-none">
            ☻
          </div>
          <div className="absolute bottom-4 right-4 text-xl pointer-events-none">
            🖱️
          </div>

          <div className="space-y-3 relative z-10">
            {/* Top Tag */}
            <div className="inline-block bg-[#A3E635] text-black font-pixel font-bold text-[11px] px-3 py-1 border-2 border-black shadow-pop-sm">
              CREATIVE
            </div>

            {/* Extruded Title: YEARBOOK */}
            <h1 className="text-4xl sm:text-5xl font-cyber text-white uppercase tracking-tight leading-none drop-shadow-[4px_4px_0px_#FF2E93] text-stroke-black">
              YEARBOOK
            </h1>

            {/* Pink Tag: LỚP 12A1 GRAPHIC DESIGNER */}
            <div className="pt-1">
              <span className="inline-block bg-[#FF2E93] text-white font-pixel font-bold text-xs sm:text-sm px-4 py-1.5 border-2 border-black shadow-pop-sm tracking-wide">
                LỚP {data.className || '12A1'} • NIÊN KHÓA {data.schoolYear || '2024 — 2027'}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: 3D STUDENT ID BADGE (GET TO KNOW ME)                */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          {/* Header 3D Pink Athletic Display */}
          <div className="flex items-center gap-2">
            <h2 className="text-3xl sm:text-4xl font-cyber text-white drop-shadow-[3px_3px_0px_#FF2E93] text-stroke-black uppercase">
              About Me
            </h2>
            <span className="text-2xl animate-spin" style={{ animationDuration: '10s' }}>
              ☻
            </span>
          </div>

          {/* 3D PLASTIC ID BADGE (Thẻ học sinh cài áo trong suốt có kẹp kim loại) */}
          <div className="relative pt-4">
            
            {/* Metal Lanyard Clip on top */}
            <div className="w-10 h-10 bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 rounded-md border-2 border-black mx-auto -mb-4 z-20 shadow-md relative flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-stone-100" />
            </div>

            {/* Translucent ID Badge Holder */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-black p-5 sm:p-6 shadow-pop-lg relative overflow-hidden">
              
              {/* Badge Header: GET TO KNOW ME */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-3 mb-4">
                <span className="text-xl sm:text-2xl font-cyber text-[#FF2E93] uppercase tracking-wider">
                  GET TO KNOW ME
                </span>
                <span className="text-[11px] font-pixel text-stone-600 font-bold bg-[#A3E635] px-2 py-0.5 border border-black rounded-xs">
                  2030
                </span>
              </div>

              {/* ID Content: Photo + Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Photo in Polaroid Badge Frame */}
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border-3 border-black bg-stone-100 shadow-sm relative group">
                  <img
                    src={data.avatarPhoto || galleryImages[0]}
                    alt={data.studentName || 'Student ID'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white font-pixel text-[9px] px-2 py-0.5 rounded-xs">
                    SENIOR ID
                  </div>
                </div>

                {/* Information Rows */}
                <div className="space-y-3 font-pixel text-xs text-stone-800">
                  <div className="border-b border-stone-200 pb-1.5">
                    <span className="text-[10px] text-[#FF2E93] block font-bold">NAME:</span>
                    <strong className="text-base text-black font-quicksand font-black block">
                      {data.studentName || 'Hoàng Ngọc Bảo Anh'}
                    </strong>
                  </div>

                  <div className="border-b border-stone-200 pb-1.5">
                    <span className="text-[10px] text-[#FF2E93] block font-bold">CLASS:</span>
                    <strong className="text-sm text-black font-quicksand font-bold block">
                      Lớp {data.className || '12A1'}
                    </strong>
                  </div>

                  <div className="border-b border-stone-200 pb-1.5">
                    <span className="text-[10px] text-[#FF2E93] block font-bold">SCHOOL:</span>
                    <strong className="text-xs text-black font-quicksand font-semibold block">
                      {data.schoolName || 'Tên trường của bạn'}
                    </strong>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-[#65A30D] block font-bold">SIGNATURE:</span>
                    <span className="text-xl font-cute font-bold text-[#FF2E93] block">
                      {data.senderName || 'Bảo Anh'} ♡
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Fun Stats below ID badge */}
              <div className="grid grid-cols-2 gap-3 pt-5 mt-4 border-t-2 border-black text-center font-cyber">
                <div className="bg-[#A3E635] border-2 border-black rounded-xl p-2.5 shadow-pop-sm">
                  <span className="text-2xl sm:text-3xl font-black text-black block leading-none">
                    3+
                  </span>
                  <span className="text-[10px] font-pixel text-black font-bold uppercase mt-1 block">
                    NĂM GẮN BÓ
                  </span>
                </div>

                <div className="bg-[#FF2E93] border-2 border-black rounded-xl p-2.5 shadow-pop-sm text-white">
                  <span className="text-2xl sm:text-3xl font-black text-white block leading-none">
                    100+
                  </span>
                  <span className="text-[10px] font-pixel text-white font-bold uppercase mt-1 block">
                    KỶ NIỆM ĐẸP
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: THƯ MỜI NÈ (RETRO OS WINDOW: WHAT I DO)             */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl sm:text-4xl font-cyber text-white drop-shadow-[3px_3px_0px_#FF2E93] text-stroke-black uppercase">
              Thư Mời
            </h2>
            <span className="text-xl">🖱️</span>
          </div>

          {/* Retro OS Window */}
          <div className="rounded-2xl border-4 border-black shadow-pop overflow-hidden bg-white">
            {/* Title Bar in Neon Lime */}
            <div className="bg-[#BEF264] border-b-4 border-black px-4 py-2 flex items-center justify-between font-pixel font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 border border-black inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 border border-black inline-block" />
                <span className="ml-2">LETTER_FOR_YOU.TXT</span>
              </span>
              <span>2030</span>
            </div>

            {/* Window Content */}
            <div className="p-5 sm:p-6 space-y-3 font-quicksand text-xs sm:text-sm text-stone-800 leading-relaxed">
              <p className="font-pixel text-xs text-[#FF2E93] font-bold">
                GỬI: <span className="text-black text-sm">{guestName || data.guestName || 'BẠN THÂN MẾN'}</span>
              </p>
              <p className="text-stone-700 leading-relaxed font-medium">
                {data.inviteMessage ||
                  'Ba năm cấp ba trôi nhanh như một cái chớp mắt. Ngày chụp kỷ yếu sắp đến rồi — mình mong có cậu ở đó, cùng lưu lại khoảnh khắc thanh xuân rực rỡ nhất của chúng mình!'}
              </p>
              <div className="text-right pt-2 font-pixel text-xs font-bold text-[#65A30D]">
                FROM: {data.senderName || data.studentName || 'Bảo Anh'} ♡
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: BUỔI CHỤP ẢNH KỶ YẾU & COUNTDOWN TIMER             */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl sm:text-4xl font-cyber text-white drop-shadow-[3px_3px_0px_#FF2E93] text-stroke-black uppercase">
              Event Time
            </h2>
            <span className="text-xl">⚡</span>
          </div>

          {/* Retro OS Window for Event Info */}
          <div className="rounded-2xl border-4 border-black shadow-pop overflow-hidden bg-white">
            {/* Title Bar in Neon Pink */}
            <div className="bg-[#FF69B4] text-white border-b-4 border-black px-4 py-2 flex items-center justify-between font-pixel font-bold text-xs">
              <span>YEARBOOK_EVENT.EXE</span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className="border border-white px-1">_</span>
                <span className="border border-white px-1">□</span>
                <span className="border border-white px-1">✕</span>
              </div>
            </div>

            {/* Event Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* Ngày chụp (Neon Lime) */}
                <div className="bg-[#A3E635] border-3 border-black rounded-xl p-3 shadow-pop-sm">
                  <span className="text-[10px] font-pixel text-black font-bold uppercase block">
                    NGÀY CHỤP
                  </span>
                  <p className="text-base sm:text-lg font-cyber text-black font-black mt-1">
                    {formattedDate}
                  </p>
                  <p className="text-xs font-pixel text-stone-800 mt-0.5">
                    {data.dayOfWeek || 'Thứ Năm'}
                  </p>
                </div>

                {/* Giờ chụp (Neon Pink) */}
                <div className="bg-[#FF2E93] text-white border-3 border-black rounded-xl p-3 shadow-pop-sm">
                  <span className="text-[10px] font-pixel text-white font-bold uppercase block">
                    GIỜ ĐÓN BẠN
                  </span>
                  <p className="text-base sm:text-lg font-cyber text-white font-black mt-1">
                    {data.startTime || '07:00'}
                  </p>
                  <p className="text-xs font-pixel text-amber-200 mt-0.5">
                    Đúng giờ nha!
                  </p>
                </div>
              </div>

              {/* Location Box (Sky Blue) */}
              <div className="bg-[#38BDF8] border-3 border-black rounded-xl p-4 shadow-pop-sm text-center space-y-3 text-black">
                <div>
                  <span className="text-[10px] font-pixel font-bold uppercase block">
                    ĐỊA ĐIỂM TẬP TRUNG
                  </span>
                  <p className="text-base sm:text-lg font-cyber font-black mt-0.5">
                    {data.gatheringLocation || data.shootLocation || 'Sân trường'}
                  </p>
                  <p className="text-xs font-medium text-stone-900 mt-0.5">
                    {data.detailedAddress || data.schoolName || 'Địa chỉ trường của bạn'}
                  </p>
                </div>

                {/* 2 Buttons: Chỉ đường & Lưu lịch */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-pixel font-bold text-black bg-[#A3E635] hover:bg-[#bef264] border-2 border-black shadow-pop-sm flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>CHỈ ĐƯỜNG</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCalendar}
                    className="px-4 py-2 rounded-xl text-xs font-pixel font-bold text-black bg-white hover:bg-stone-50 border-2 border-black shadow-pop-sm flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>LƯU LỊCH</span>
                  </button>
                </div>
              </div>

              {/* Countdown Timer (4 Cyber Pop Boxes) */}
              <div className="pt-2 text-center space-y-2">
                <p className="text-xs font-pixel font-bold text-stone-700">
                  ĐẾM NGƯỢC TỚI NGÀY CHỤP KỶ YẾU:
                </p>

                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-[#FF2E93] text-white border-2 border-black rounded-xl p-2 text-center shadow-pop-sm">
                    <span className="text-lg sm:text-xl font-cyber font-black block">
                      {timeLeft.days}
                    </span>
                    <span className="text-[9px] font-pixel block">NGÀY</span>
                  </div>

                  <div className="bg-[#A3E635] text-black border-2 border-black rounded-xl p-2 text-center shadow-pop-sm">
                    <span className="text-lg sm:text-xl font-cyber font-black block">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[9px] font-pixel block">GIỜ</span>
                  </div>

                  <div className="bg-[#38BDF8] text-black border-2 border-black rounded-xl p-2 text-center shadow-pop-sm">
                    <span className="text-lg sm:text-xl font-cyber font-black block">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[9px] font-pixel block">PHÚT</span>
                  </div>

                  <div className="bg-[#FACC15] text-black border-2 border-black rounded-xl p-2 text-center shadow-pop-sm">
                    <span className="text-lg sm:text-xl font-cyber font-black block">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[9px] font-pixel block">GIÂY</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 4: PROCESS (LỊCH TRÌNH BUỔI CHỤP VỚI PIXEL ICONS)      */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl sm:text-4xl font-cyber text-white drop-shadow-[3px_3px_0px_#FF2E93] text-stroke-black uppercase">
                Process
              </h2>
              <span className="text-xl">📁</span>
            </div>
            <p className="text-[11px] font-pixel text-stone-600 mt-1">
              LỊCH TRÌNH BUỔI CHỤP CHI TIẾT TỪ A ĐẾN Z.
            </p>
          </div>

          {/* 4 Process Step Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white border-3 border-black rounded-2xl p-3 shadow-pop-sm text-center space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl">{step.icon}</div>
                  <span className="font-pixel text-xs text-[#FF2E93] font-bold block mt-1">
                    {step.time}
                  </span>
                  <p className="text-xs font-quicksand font-bold text-stone-800 leading-tight mt-0.5">
                    {step.title}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-block bg-[#A3E635] text-black text-[9px] font-pixel font-bold px-2 py-0.5 border border-black rounded-xs">
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dresscode Notice */}
          <div className="bg-[#A3E635] border-3 border-black rounded-2xl p-3 shadow-pop-sm text-xs font-bold text-black flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <p className="leading-relaxed">
              <strong>TRANG PHỤC:</strong> {data.dressCode || 'Áo dài trắng hoặc đồng phục trường của bạn nhé!'}
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 5: SIGNATURE WORK (6 RETRO OS WINDOWS PHOTO GALLERY)  */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl sm:text-4xl font-cyber text-white drop-shadow-[3px_3px_0px_#FF2E93] text-stroke-black uppercase">
                Signature
              </h2>
              <span className="inline-block bg-[#A3E635] text-black font-pixel font-bold text-[10px] px-2 py-0.5 border border-black shadow-pop-sm">
                PHOTOS
              </span>
            </div>
            <p className="text-[11px] font-pixel text-stone-600 mt-1">
              BỘ SƯU TẬP ẢNH THANH XUÂN 2030
            </p>
          </div>

          {/* 6 Retro OS Window Frames Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {galleryImages.map((imgSrc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-3 border-black shadow-pop-sm overflow-hidden group hover:translate-y-[-2px] transition-transform duration-300"
              >
                {/* Window Pink Header */}
                <div className="bg-[#FF69B4] border-b-2 border-black px-2 py-1 flex items-center justify-between text-[9px] font-pixel text-white">
                  <span>PHOTO_{String(idx + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-0.5 font-mono text-[8px]">
                    <span>_</span>
                    <span>□</span>
                    <span>✕</span>
                  </div>
                </div>

                {/* Photo Frame */}
                <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100">
                  <img
                    src={imgSrc}
                    alt={`Photo #${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Youth Quote Banner */}
          <div className="bg-[#FF2E93] text-white border-3 border-black rounded-2xl p-4 text-center shadow-pop-sm">
            <p className="font-cyber text-sm sm:text-base leading-relaxed">
              "THANH XUÂN KHÔNG CÓ NẾU NHƯ — CHỈ CÓ NHỮNG NGÀY TA ĐÃ SỐNG HẾT MÌNH."
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 6: TESTIMONIALS (SỔ LƯU BÚT & RSVP RETRO OS FORM)      */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl sm:text-4xl font-cyber text-white drop-shadow-[3px_3px_0px_#FF2E93] text-stroke-black uppercase">
              Guestbook
            </h2>
            <span className="text-xl">✍️</span>
          </div>

          {/* Retro OS Dialog Form */}
          <div className="rounded-2xl border-4 border-black shadow-pop overflow-hidden bg-white">
            <div className="bg-[#BEF264] border-b-4 border-black px-4 py-2 flex items-center justify-between font-pixel font-bold text-xs">
              <span>GUESTBOOK_WISH.EXE</span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className="border border-black px-1">_</span>
                <span className="border border-black px-1">□</span>
                <span className="border border-black px-1">✕</span>
              </div>
            </div>

            <div className="p-5">
              {rsvpSubmitted ? (
                <div className="bg-[#A3E635] border-3 border-black rounded-xl p-4 text-center space-y-2 text-black shadow-pop-sm">
                  <span className="text-3xl">🚀</span>
                  <p className="font-cyber text-base font-bold">
                    LỜI CHÚC CỦA BẠN ĐÃ ĐƯỢC GỬI THÀNH CÔNG!
                  </p>
                  <p className="font-pixel text-xs text-stone-800">
                    Hẹn gặp bạn trong buổi chụp kỷ yếu đáng nhớ nhé!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitWish} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-pixel font-bold text-black block">
                      TÊN CỦA BẠN:
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="Nhập tên của bạn..."
                      className="w-full bg-[#FAF8F8] border-2 border-black rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-black focus:outline-hidden focus:border-[#FF2E93] shadow-inner"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-pixel font-bold text-black block">
                      LỜI NHẮN KỶ YẾU:
                    </label>
                    <textarea
                      rows={3}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder="Viết lời chúc thanh xuân gửi cho bạn ấy nhé..."
                      className="w-full bg-[#FAF8F8] border-2 border-black rounded-xl p-3 text-xs sm:text-sm text-black focus:outline-hidden focus:border-[#FF2E93] resize-none shadow-inner"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-pixel font-bold pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        checked={rsvpStatus === 'confirmed'}
                        onChange={() => setRsvpStatus('confirmed')}
                        className="accent-[#FF2E93]"
                      />
                      <span>SẼ CÓ MẶT!</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        checked={rsvpStatus === 'declined'}
                        onChange={() => setRsvpStatus('declined')}
                        className="accent-[#FF2E93]"
                      />
                      <span>TIẾC QUÁ, BẬN RỒI!</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="w-full py-3 rounded-xl bg-[#FF2E93] hover:bg-[#e11d74] text-white font-pixel font-bold text-xs uppercase tracking-wider shadow-pop border-2 border-black flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingRsvp ? 'ĐANG GỬI...' : 'GỬI LƯU BÚT 🚀'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Submitted Wishes List */}
              {data.rsvps && data.rsvps.length > 0 && (
                <div className="pt-4 border-t-2 border-dashed border-stone-300 mt-4 space-y-2.5">
                  <span className="text-[10px] font-pixel uppercase font-bold text-stone-500 block">
                    LỜI CHÚC TỪ BẠN BÈ ({data.rsvps.length})
                  </span>
                  <div className="space-y-2">
                    {data.rsvps.slice(0, 5).map((r, i) => (
                      <div key={r.id || i} className="bg-[#FAF8F8] p-3 rounded-xl border-2 border-black shadow-pop-sm text-xs">
                        <div className="flex items-center justify-between font-bold text-black">
                          <span className="font-pixel">{r.guestName}</span>
                          <span className="text-[10px] font-pixel text-[#65A30D]">
                            {r.status === 'confirmed' ? '✓ CÓ MẶT' : '💌 LỜI CHÚC'}
                          </span>
                        </div>
                        {r.message && (
                          <p className="text-stone-700 mt-1 font-quicksand font-medium">
                            "{r.message}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 7: OUTRO (LET'S MEET THERE! - IMAGE 10)               */}
        {/* ============================================================== */}
        <div className="bg-[#A3E635] border-4 border-black rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-pop-lg text-black">
          <div>
            <h3 className="text-3xl sm:text-4xl font-cyber uppercase tracking-tight text-white drop-shadow-[3px_3px_0px_#FF2E93] text-stroke-black">
              LET'S MEET THERE!
            </h3>
            <p className="text-xs font-pixel text-stone-800 font-bold mt-1">
              HẸN GẶP BẠN TẠI BUỔI CHỤP KỶ YẾU 2030
            </p>
          </div>

          {/* Quick Info Tags */}
          <div className="space-y-2 max-w-xs mx-auto text-left font-pixel text-xs">
            <div className="bg-white border-2 border-black rounded-lg p-2 shadow-pop-sm">
              <span className="text-[#FF2E93] font-bold block text-[10px]">CLASS:</span>
              <strong className="text-black">{data.className || '12A1'}</strong>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-2 shadow-pop-sm">
              <span className="text-[#FF2E93] font-bold block text-[10px]">LOCATION:</span>
              <strong className="text-black">{data.gatheringLocation || 'Sân trường'}</strong>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleCopy}
              className="px-8 py-3 rounded-xl border-3 border-black bg-white hover:bg-stone-50 text-black font-pixel font-bold text-xs shadow-pop transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>ĐÃ SAO CHÉP LINK!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>CHIA SẺ THIỆP 3D</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2">
            <a
              href="/builder"
              className="inline-flex items-center gap-1 font-pixel text-[11px] font-bold text-black hover:text-[#FF2E93] hover:underline"
            >
              <span>Tạo thiệp kỷ yếu 3D miễn phí như thế này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-[10px] font-pixel text-stone-700 pt-2 border-t border-black/30">
            Đồng hành bởi GP Studio99 • Kỷ Yếu Đà Nẵng (chupanhdanang.com)
          </p>
        </div>

      </div>
    </div>
  );
}
