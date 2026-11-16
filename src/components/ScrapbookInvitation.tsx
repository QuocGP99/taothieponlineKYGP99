'use client';

import React, { useState, useEffect } from 'react';
import { InvitationData, RSVP } from '@/types/invitation';
import { generateGoogleMapsUrl } from '@/lib/maps';
import {
  Calendar, Clock, MapPin, Navigation, Share2, Check, Copy,
  Sparkles, Heart, Send, CheckSquare, Square, Download, ExternalLink, ArrowRight
} from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';

interface ScrapbookInvitationProps {
  data: InvitationData;
  isInteractive?: boolean;
  onUpdate?: (partial: Partial<InvitationData>) => void;
  guestName?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  onEditPrompt?: () => void;
  onRSVPSubmit?: (rsvp: Omit<RSVP, 'id' | 'createdAt'>) => Promise<void> | void;
}

export default function ScrapbookInvitation({
  data,
  isInteractive = false,
  onUpdate,
  guestName,
  cardRef,
  onEditPrompt,
  onRSVPSubmit
}: ScrapbookInvitationProps) {
  // Đếm ngược đến ngày chụp
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Interactive Checklist
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    item0: true,
    item1: true,
    item2: true,
    item3: true
  });

  // RSVP Guestbook form state
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined'>('confirmed');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Default images for scrapbook if none provided
  const defaultGallery = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
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

  const handleToggleCheck = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCalendar = () => {
    const title = encodeURIComponent(`Chụp Kỷ Yếu - Lớp ${data.className || '12A1'} (${data.studentName || 'Kỷ yếu'})`);
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#EC4899', '#A855F7', '#F59E0B', '#10B981']
      });

      setRsvpSubmitted(true);
      setRsvpMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Checklist items
  const checklistItems = [
    { time: '06:30', task: 'Trang điểm & thay trang phục' },
    { time: '07:30', task: 'Chụp ảnh tập thể cả lớp' },
    { time: '09:00', task: 'Chụp concept, nhóm bạn thân' },
    { time: '10:30', task: 'Ảnh cá nhân, tặng hoa & lưu bút' }
  ];

  const washiColors = [
    'bg-[#FDA4AF]/75 border-y border-[#FB7185]/40', // rose
    'bg-[#FDE047]/75 border-y border-[#FACC15]/40', // yellow
    'bg-[#93C5FD]/75 border-y border-[#60A5FA]/40', // blue
    'bg-[#A7F3D0]/75 border-y border-[#34D399]/40', // mint
    'bg-[#DDD6FE]/75 border-y border-[#C4B5FD]/40', // lilac
    'bg-[#FED7AA]/75 border-y border-[#FB923C]/40', // orange
  ];

  return (
    <div
      ref={cardRef}
      className="max-w-md sm:max-w-lg mx-auto w-full bg-[#FEFDF9] rounded-2xl sm:rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden relative font-quicksand text-stone-800 transition-all select-text pb-8"
      style={{
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, #E5E7EB 28px)',
        backgroundSize: '100% 28px'
      }}
    >
      {/* Red vertical notebook margin line on left */}
      <div className="absolute top-0 bottom-0 left-6 sm:left-8 w-0.5 bg-rose-200/80 pointer-events-none" />

      {/* Notebook Content Container with Left Indent for Ruled Margin */}
      <div className="pl-9 sm:pl-12 pr-4 sm:pr-6 pt-6 sm:pt-8 space-y-8">

        {/* ============================================================== */}
        {/* HEADER: NIÊN KHOÁ, LỚP & TIÊU ĐỀ                              */}
        {/* ============================================================== */}
        <div className="relative pt-2">
          {/* Top Bar with School Year and Class Badge */}
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-500 mb-2">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs">
              <span>Niên khoá {data.schoolYear || '2024 — 2027'}</span>
              <span className="text-amber-500">⭐</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
              LỚP {data.className || '12A1'} KỶ YẾU
            </div>
          </div>

          {/* Title */}
          <div className="relative mt-2">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-cute leading-tight">
              {data.title && data.title !== 'mùa phượng cuối' ? data.title : 'Kỷ yếu của tụi mình!'}
            </h1>

            {/* Little Doodles floating */}
            <div className="absolute top-0 right-2 text-stone-400 text-lg opacity-75 pointer-events-none">
              ✈️
            </div>
            <div className="absolute -bottom-5 left-1 text-purple-400 text-base opacity-75 pointer-events-none">
              🎓
            </div>
          </div>

          {/* ============================================================== */}
          {/* MAIN PHOTO (POLAROID FRAME WITH WASHI TAPE & STICKY NOTE)     */}
          {/* ============================================================== */}
          <div className="mt-6 flex flex-col items-center">
            {/* Polaroid Photo Frame */}
            <div className="relative bg-white p-2.5 sm:p-3 pb-4 rounded shadow-md border border-stone-200/70 transform -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-[240px] sm:max-w-[270px] w-full">
              {/* Top-Left Pink Washi Tape */}
              <div className="absolute -top-3 -left-3 w-16 h-6 bg-[#FDA4AF]/80 border-y border-[#FB7185]/40 transform -rotate-25 shadow-xs z-10" />

              {/* Bottom-Right Amber Washi Tape */}
              <div className="absolute -bottom-3 -right-3 w-16 h-6 bg-[#FDE047]/80 border-y border-[#FACC15]/40 transform rotate-20 shadow-xs z-10" />

              <div className="aspect-[3/4] w-full overflow-hidden rounded bg-stone-100">
                <img
                  src={data.avatarPhoto || galleryImages[0]}
                  alt={data.studentName || 'Ảnh kỷ yếu'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Pinned Yellow Sticky Note (Chủ nhân cuốn sổ) */}
            <div className="mt-3 bg-[#FEF08A] rounded-lg p-3 sm:px-5 sm:py-3.5 shadow-md border border-yellow-300/80 text-center transform rotate-1 max-w-[260px] sm:max-w-[280px] w-full relative">
              {/* Cute pin badge on sticky note */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-400 shadow-xs border border-white" />
              <p className="text-[10px] uppercase font-bold text-yellow-900/70 tracking-wider">
                Chủ nhân cuốn sổ
              </p>
              <h2 className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
                {data.studentName || 'Họ và tên của bạn'}
              </h2>
              <p className="text-xs text-stone-600 font-medium">
                Lớp {data.className || '12A1'} — {data.schoolName || 'Tên trường của bạn'}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: THƯ MỜI NÈ                                         */}
        {/* ============================================================== */}
        <div className="space-y-3 pt-2">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-xs font-black shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#BE123C] text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Thư mời nè</span>
          </div>

          {/* Letter Body on Ruled Lines */}
          <div className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed font-cute text-[15px] sm:text-[16px] pl-1">
            <p>
              Gửi <strong className="text-stone-900">{guestName || data.guestName || 'Bạn'}</strong> thân mến,
            </p>
            <p className="indent-4 leading-loose">
              {data.inviteMessage ||
                'Ba năm cấp ba trôi nhanh như một cái chớp mắt. Ngày chụp kỷ yếu sắp đến rồi — mình mong có cậu ở đó, cùng lưu lại khoảnh khắc thanh xuân rực rỡ nhất của chúng mình!'}
            </p>
            <div className="text-right pt-2 font-bold text-stone-800">
              Thương, {data.senderName || data.studentName || 'Tên gọi'} ♡
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: BUỔI CHỤP ẢNH KỶ YẾU                                */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA] text-xs font-black shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#C2410C] text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Buổi chụp ảnh kỷ yếu</span>
          </div>

          {/* Top 2 Cards: Ngày Chụp & Thời Gian */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ngày chụp (Pastel Yellow) */}
            <div className="bg-[#FEF9C3] rounded-2xl p-3.5 border border-yellow-200/90 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Ngày chụp
              </span>
              <p className="text-base sm:text-lg font-black text-stone-900 mt-1">
                {formattedDate}
              </p>
              <p className="text-[11px] font-semibold text-stone-600 mt-0.5">
                {data.dayOfWeek || 'Thứ Năm'}
              </p>
            </div>

            {/* Thời gian (Pastel Peach) */}
            <div className="bg-[#FFEDD5] rounded-2xl p-3.5 border border-orange-200/90 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
                Thời gian
              </span>
              <p className="text-base sm:text-lg font-black text-stone-900 mt-1">
                {data.startTime || '07:00'}
              </p>
              <p className="text-[11px] font-semibold text-stone-600 mt-0.5">
                Nhớ đúng giờ nha!
              </p>
            </div>
          </div>

          {/* Location Card (Pastel Mint) */}
          <div className="bg-[#DCFCE7] rounded-2xl p-4 border border-emerald-200/90 text-center shadow-xs space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Địa điểm
              </span>
              <p className="text-sm sm:text-base font-black text-stone-900 mt-0.5">
                {data.gatheringLocation || data.shootLocation || 'Sân trường'}
              </p>
              <p className="text-xs text-stone-600 mt-0.5">
                {data.detailedAddress || data.schoolName || 'Địa chỉ trường của bạn'}
              </p>
            </div>

            {/* Action Buttons: Chỉ đường & Lưu lịch */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 border border-emerald-300 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chỉ đường</span>
              </a>

              <button
                type="button"
                onClick={handleCalendar}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 border border-emerald-300 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lưu lịch</span>
              </button>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="pt-2 text-center space-y-2">
            <p className="text-xs font-semibold text-stone-600">
              Đếm ngược tới ngày chúng mình chụp kỷ yếu:
            </p>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#FEF9C3] border border-yellow-200/80 rounded-xl p-2 text-center shadow-xs">
                <span className="text-lg sm:text-xl font-black text-stone-900 block font-mono">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] text-stone-600 font-semibold">ngày</span>
              </div>

              <div className="bg-[#FFEDD5] border border-orange-200/80 rounded-xl p-2 text-center shadow-xs">
                <span className="text-lg sm:text-xl font-black text-stone-900 block font-mono">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] text-stone-600 font-semibold">giờ</span>
              </div>

              <div className="bg-[#DCFCE7] border border-emerald-200/80 rounded-xl p-2 text-center shadow-xs">
                <span className="text-lg sm:text-xl font-black text-stone-900 block font-mono">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] text-stone-600 font-semibold">phút</span>
              </div>

              <div className="bg-[#EDE9FE] border border-purple-200/80 rounded-xl p-2 text-center shadow-xs">
                <span className="text-lg sm:text-xl font-black text-stone-900 block font-mono">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] text-stone-600 font-semibold">giây</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: VIỆC CẦN LÀM HÔM ĐÓ (CHECKLIST)                    */}
        {/* ============================================================== */}
        <div className="space-y-3 pt-2">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA] text-xs font-black shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#C2410C] text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Việc cần làm hôm đó</span>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2 pt-1">
            {checklistItems.map((item, idx) => {
              const key = `item${idx}`;
              const isChecked = checkedItems[key] ?? true;

              return (
                <div
                  key={key}
                  onClick={() => handleToggleCheck(key)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors group"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isChecked ? 'bg-rose-400 text-white' : 'border-2 border-stone-300 text-transparent'}`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="flex items-baseline gap-2 text-xs sm:text-sm">
                    <span className="font-mono font-bold text-rose-600">{item.time}</span>
                    <span className={`font-medium ${isChecked ? 'text-stone-800' : 'text-stone-400 line-through'}`}>
                      {item.task}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dresscode Reminder */}
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 text-xs text-stone-700 flex items-start gap-2 shadow-xs">
            <span className="text-base">🎒</span>
            <p className="leading-relaxed">
              <strong>Nhắc nhở:</strong> {data.dressCode || 'Áo dài trắng hoặc đồng phục trường của bạn nhé!'}
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 4: GÓC ẢNH DÁN (PHOTO COLLAGE WITH WASHI TAPE)        */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0E7FF] text-[#4338CA] border border-[#C7D2FE] text-xs font-black shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#4338CA] text-white flex items-center justify-center text-[10px] font-bold">4</span>
            <span>Góc ảnh dán</span>
          </div>

          {/* 6 Polaroid Photos Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {galleryImages.map((imgSrc, idx) => {
              const rot = idx % 2 === 0 ? '-rotate-1' : 'rotate-1';
              const washi = washiColors[idx % washiColors.length];

              return (
                <div
                  key={idx}
                  className={`relative bg-white p-2 pb-3 rounded shadow-md border border-stone-200/70 transform ${rot} hover:rotate-0 hover:scale-105 transition-all duration-300`}
                >
                  {/* Top Centered Washi Tape */}
                  <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-5 ${washi} transform -rotate-2 shadow-xs z-10`} />

                  <div className="aspect-[3/4] w-full overflow-hidden rounded bg-stone-100">
                    <img
                      src={imgSrc}
                      alt={`Ảnh dán #${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-[10px] font-mono text-center text-stone-400 mt-1.5 font-bold">
                    #{String(idx + 1).padStart(2, '0')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Youth Quote Banner */}
          <div className="bg-[#EDE9FE] border border-purple-200/90 rounded-2xl p-4 text-center shadow-xs">
            <p className="text-xs sm:text-sm font-semibold text-purple-900 italic font-cute text-[16px] leading-relaxed">
              "Thanh xuân không có nếu như — chỉ có những ngày ta đã sống hết mình."
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 5: KÝ VÀO SỔ NHÉ (GUESTBOOK & RSVP ON RULED PAPER)    */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-xs font-black shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#BE123C] text-white flex items-center justify-center text-[10px] font-bold">5</span>
            <span>Ký vào sổ nhé</span>
          </div>

          {rsvpSubmitted ? (
            <div className="bg-[#DCFCE7] border border-emerald-300 rounded-2xl p-4 text-center space-y-2">
              <span className="text-2xl">✨</span>
              <p className="text-xs sm:text-sm font-bold text-emerald-900">
                Lời chúc của bạn đã được ghi vào sổ lưu bút!
              </p>
              <p className="text-[11px] text-emerald-700">
                Hẹn gặp bạn trong ngày kỷ yếu đáng nhớ nhé!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitWish} className="space-y-3 font-cute text-[16px]">
              {/* Name input on ruled line */}
              <div className="flex items-baseline gap-2">
                <label className="text-xs sm:text-sm font-bold text-stone-700 whitespace-nowrap">
                  Tên cậu là:
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="flex-1 bg-transparent border-b border-dashed border-stone-400 focus:border-rose-500 focus:outline-hidden px-1 py-0.5 text-xs sm:text-sm text-stone-900 font-bold"
                />
              </div>

              {/* Message ruled textarea */}
              <div className="space-y-1">
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Viết gì đó vào sổ lưu bút nha..."
                  className="w-full bg-transparent border-b border-dashed border-stone-400 focus:border-rose-500 focus:outline-hidden p-1 text-xs sm:text-sm text-stone-800 resize-none leading-[28px]"
                />
              </div>

              {/* Attendance options */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-quicksand font-bold pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    checked={rsvpStatus === 'confirmed'}
                    onChange={() => setRsvpStatus('confirmed')}
                    className="accent-rose-500"
                  />
                  <span>Sẽ có mặt!</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    checked={rsvpStatus === 'declined'}
                    onChange={() => setRsvpStatus('declined')}
                    className="accent-rose-500"
                  />
                  <span>Tiếc quá, bận mất rồi!</span>
                </label>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-quicksand font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingRsvp ? 'Đang gửi...' : 'Gửi vào sổ ✎'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Existing Wishes / RSVP list if any */}
          {data.rsvps && data.rsvps.length > 0 && (
            <div className="pt-3 border-t border-dashed border-stone-300 space-y-2.5">
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Lời nhắn từ bạn bè ({data.rsvps.length})
              </p>
              <div className="space-y-2">
                {data.rsvps.slice(0, 5).map((r, i) => (
                  <div key={r.id || i} className="bg-white/80 p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-800">{r.guestName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {r.status === 'confirmed' ? '🌸 Sẽ đến' : '💌 Đã gửi lời chúc'}
                      </span>
                    </div>
                    {r.message && (
                      <p className="text-xs text-stone-600 mt-1 font-cute text-[14px]">
                        "{r.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 6: HẸN GẶP NHA!                                       */}
        {/* ============================================================== */}
        <div className="pt-6 border-t border-dashed border-stone-300 text-center space-y-3 pb-4">
          <div className="text-3xl animate-bounce">
            🎓
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-cute">
              Hẹn gặp nha!
            </h3>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Hẹn gặp bạn • Lớp {data.className || '12A1'}
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleCopy}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Đã sao chép link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ thiệp</span>
                </>
              )}
            </button>
          </div>

          {/* Link to create invitation */}
          <div className="pt-3">
            <a
              href="/builder"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline"
            >
              <span>Tạo thiệp kỷ yếu miễn phí như thế này</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Branding GP Studio99 */}
          <p className="text-[10px] text-stone-400 font-medium pt-2">
            Đồng hành bởi GP Studio99 • Kỷ Yếu Đà Nẵng (chupanhdanang.com)
          </p>
        </div>

      </div>
    </div>
  );
}
