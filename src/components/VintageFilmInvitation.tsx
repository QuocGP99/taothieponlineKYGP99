'use client';

import React, { useState, useEffect } from 'react';
import { InvitationData, RSVP } from '@/types/invitation';
import { generateGoogleMapsUrl } from '@/lib/maps';
import {
  Calendar, Clock, MapPin, Share2, Check, Copy,
  Sparkles, Send, ArrowRight, Film, Video
} from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';

interface VintageFilmInvitationProps {
  data: InvitationData;
  isInteractive?: boolean;
  onUpdate?: (partial: Partial<InvitationData>) => void;
  guestName?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  onEditPrompt?: () => void;
  onRSVPSubmit?: (rsvp: Omit<RSVP, 'id' | 'createdAt'>) => Promise<void> | void;
}

export default function VintageFilmInvitation({
  data,
  isInteractive = false,
  onUpdate,
  guestName,
  cardRef,
  onEditPrompt,
  onRSVPSubmit
}: VintageFilmInvitationProps) {
  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // RSVP Guestbook form state
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined'>('confirmed');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gallery images
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

  // Get day and month for ticket
  const ticketDateParts = React.useMemo(() => {
    if (!data.date) return { day: '31', month: '12' };
    const parts = data.date.split('-');
    if (parts.length === 3) {
      return { day: parts[2], month: parts[1] };
    }
    return { day: '31', month: '12' };
  }, [data.date]);

  // Camera timestamp for photo stamp ('26 12 31)
  const cameraDateStamp = React.useMemo(() => {
    if (!data.date) return "'26 12 31";
    const parts = data.date.split('-');
    if (parts.length === 3) {
      return `'${parts[0].slice(-2)} ${parts[1]} ${parts[2]}`;
    }
    return "'26 12 31";
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
    const title = encodeURIComponent(`Cuộn Phim Thanh Xuân - Lớp ${data.className || '12A1'} (${data.studentName || 'Kỷ yếu'})`);
    const details = encodeURIComponent(`Buổi chiếu phim kỷ yếu cùng ${data.studentName || 'tụi mình'}. Địa điểm: ${data.gatheringLocation || data.shootLocation || 'Sân trường'}`);
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
        particleCount: 55,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#F59E0B', '#D97706', '#B45309', '#FDE68A', '#78350F']
      });

      setRsvpSubmitted(true);
      setRsvpMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Timeline items
  const timelineSchedule = (data.timeline && data.timeline.length > 0)
    ? data.timeline
    : [
        { time: '06:30', title: 'Trang điểm & thay trang phục' },
        { time: '07:30', title: 'Chụp ảnh tập thể cả lớp' },
        { time: '09:00', title: 'Chụp concept, nhóm bạn thân' },
        { time: '10:30', title: 'Ảnh cá nhân & lưu bút' }
      ];

  return (
    <div
      ref={cardRef}
      className="max-w-md sm:max-w-lg mx-auto w-full bg-[#F7F2EA] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E8DFD1] overflow-hidden relative text-[#231A16] select-text pb-10"
    >
      {/* Container Inner Padding */}
      <div className="px-5 sm:px-8 pt-8 sm:pt-10 space-y-10">

        {/* ============================================================== */}
        {/* HEADER: THANH XUÂN - CUỘN PHIM CUỐI CẤP                       */}
        {/* ============================================================== */}
        <div className="text-center space-y-2">
          {/* Top Subtitle */}
          <span className="text-[10px] sm:text-[11px] font-courier uppercase tracking-[0.25em] text-[#8C7A6B] block">
            KỶ YẾU NIÊN KHÓA {data.schoolYear || '2024 — 2027'}
          </span>

          {/* Main Title: Thanh Xuân & cuộn phim cuối cấp */}
          <div className="pt-1">
            <h1 className="text-4xl sm:text-5xl font-bold font-cormorant text-[#231A16] tracking-tight leading-none">
              Thanh Xuân
            </h1>
            <span className="text-2xl sm:text-3xl font-caveat font-semibold text-[#C27803] block -mt-1">
              cuộn phim cuối cấp
            </span>
          </div>

          {/* Main Polaroid Photo Card with Camera Timestamp Stamp */}
          <div className="pt-6 flex flex-col items-center">
            <div className="bg-white p-2.5 pb-4 rounded-xs shadow-lg border border-[#E5DDD0] max-w-[260px] sm:max-w-[280px] w-full transform hover:scale-102 transition-transform duration-300">
              <div className="aspect-[3/4] w-full overflow-hidden bg-stone-200 relative rounded-2xs">
                <img
                  src={data.avatarPhoto || galleryImages[0]}
                  alt={data.studentName || 'Ảnh kỷ yếu'}
                  className="w-full h-full object-cover"
                />

                {/* Vintage Yellow Date Camera Stamp */}
                <div className="absolute bottom-2 right-2.5 font-courier text-[11px] font-bold text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-widest pointer-events-none">
                  {cameraDateStamp}
                </div>
              </div>

              {/* Sub-label under photo */}
              <div className="pt-3 text-center space-y-0.5">
                <span className="text-sm font-caveat text-[#8C7A6B] block">
                  {data.senderName || 'Tên gọi'}
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-cormorant text-[#231A16]">
                  {data.studentName || 'Họ và tên của bạn'}
                </h2>
                <p className="text-[11px] text-[#8C7A6B] tracking-wide">
                  Lớp {data.className || '12A1'} • {data.schoolName || 'Tên trường của bạn'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: LỜI NHẮN - GỬI BẠN                                 */}
        {/* ============================================================== */}
        <div className="text-center space-y-3 pt-2">
          <div>
            <span className="text-[9px] font-courier uppercase tracking-widest text-[#B58A63] block">
              LỜI NHẮN
            </span>
            <h3 className="text-2xl font-bold font-cormorant text-[#231A16] mt-0.5">
              Gửi {guestName || data.guestName || 'Bạn'}
            </h3>
          </div>

          {/* Parchment Letter Card */}
          <div className="bg-[#FFFDF9] rounded-xl p-5 sm:p-6 border border-[#EFE7DA] shadow-xs text-left relative space-y-2">
            <span className="text-lg font-caveat font-bold text-[#C27803] block">
              Nắm giữ
            </span>
            <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
              {data.inviteMessage ||
                'Ba năm cấp ba trôi nhanh như một cái chớp mắt. Ngày chụp kỷ yếu sắp đến rồi — mình mong có cậu ở đó, cùng lưu lại khoảnh khắc thanh xuân rực rỡ nhất của chúng mình!'}
            </p>
            <div className="text-right pt-2 font-caveat font-bold text-base text-[#C27803]">
              Thương! ♡
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: BUỔI CHỤP ẢNH KỶ YẾU (CINEMA TICKET STUB)          */}
        {/* ============================================================== */}
        <div className="text-center space-y-4 pt-2">
          <div>
            <span className="text-[9px] font-courier uppercase tracking-widest text-[#B58A63] block">
              CÙNG CHÚNG MÌNH GẶP NHAU
            </span>
            <h3 className="text-2xl font-bold font-cormorant text-[#231A16] mt-0.5">
              Buổi chụp ảnh kỷ yếu
            </h3>
          </div>

          {/* VINTAGE MOVIE TICKET (VÉ XEM PHIM THANH XUÂN) */}
          <div className="relative bg-gradient-to-r from-[#382113] via-[#482B19] to-[#341E10] text-[#F7F2EA] rounded-2xl shadow-xl border border-amber-600/30 overflow-hidden flex flex-row items-stretch text-left">
            
            {/* Top Cutout Notch */}
            <div className="absolute -top-3.5 right-20 sm:right-24 w-7 h-7 rounded-full bg-[#F7F2EA] z-20 shadow-inner" />
            
            {/* Bottom Cutout Notch */}
            <div className="absolute -bottom-3.5 right-20 sm:right-24 w-7 h-7 rounded-full bg-[#F7F2EA] z-20 shadow-inner" />
            
            {/* Vertical Perforation Line */}
            <div className="absolute top-3 bottom-3 right-23 sm:right-27 border-r-2 border-dashed border-amber-400/25 z-10" />

            {/* Main Ticket Body (Left) */}
            <div className="flex-1 p-4 sm:p-5 pr-8 space-y-2">
              <span className="text-[8px] sm:text-[9px] font-courier uppercase tracking-[0.2em] text-amber-300/80 block">
                VÉ MỜI ĐẶC BIỆT • SPECIAL TICKET
              </span>

              <h4 className="text-lg sm:text-xl font-bold font-cormorant text-white tracking-wide">
                Thanh Xuân {data.className || '12A1'}
              </h4>

              <div className="inline-block px-2.5 py-0.5 rounded-full border border-amber-400/50 text-[9px] text-amber-300 font-courier tracking-wider uppercase bg-amber-950/40">
                XUẤT CHIẾU DUY NHẤT
              </div>

              <div className="pt-1.5 space-y-0.5 text-xs text-stone-200 font-courier">
                <p>
                  <span className="text-amber-400/80">NGÀY: </span>
                  <strong>{formattedDate}</strong>
                </p>
                <p>
                  <span className="text-amber-400/80">GIỜ: </span>
                  <strong>{data.startTime || '07:00'}</strong>
                </p>
              </div>
            </div>

            {/* Ticket Stub (Right) */}
            <div className="w-20 sm:w-24 p-2 sm:p-3 flex flex-col items-center justify-center text-center bg-[#2B170B]/50 pl-4">
              <span className="font-cormorant font-black text-3xl sm:text-4xl text-amber-300 leading-none">
                {ticketDateParts.day}
              </span>
              <span className="text-[9px] font-courier uppercase tracking-widest text-stone-300 mt-1 block">
                THÁNG {ticketDateParts.month}
              </span>
              <span className="text-[8px] font-courier text-stone-500 tracking-tighter mt-2 block">
                NO. {ticketDateParts.day}{ticketDateParts.month}
              </span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="pt-2 text-center space-y-2.5">
            <p className="text-xs text-[#8C7A6B] font-medium">
              Đếm ngược tới ngày chúng mình chụp kỷ yếu:
            </p>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#231A16] border border-[#3D2D26] rounded-xl p-2.5 text-center text-[#F7F2EA] shadow-md">
                <span className="text-lg sm:text-xl font-bold font-courier text-amber-300 block">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] text-[#A8988B] uppercase font-mono">ngày</span>
              </div>

              <div className="bg-[#231A16] border border-[#3D2D26] rounded-xl p-2.5 text-center text-[#F7F2EA] shadow-md">
                <span className="text-lg sm:text-xl font-bold font-courier text-amber-300 block">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] text-[#A8988B] uppercase font-mono">giờ</span>
              </div>

              <div className="bg-[#231A16] border border-[#3D2D26] rounded-xl p-2.5 text-center text-[#F7F2EA] shadow-md">
                <span className="text-lg sm:text-xl font-bold font-courier text-amber-300 block">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] text-[#A8988B] uppercase font-mono">phút</span>
              </div>

              <div className="bg-[#231A16] border border-[#3D2D26] rounded-xl p-2.5 text-center text-[#F7F2EA] shadow-md">
                <span className="text-lg sm:text-xl font-bold font-courier text-amber-300 block">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] text-[#A8988B] uppercase font-mono">giây</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: LỊCH TRÌNH TRONG NGÀY (35mm HORIZONTAL FILM STRIP) */}
        {/* ============================================================== */}
        <div className="text-center space-y-3 pt-2">
          <div>
            <span className="text-[9px] font-courier uppercase tracking-widest text-[#B58A63] block">
              TIMELINE
            </span>
            <h3 className="text-2xl font-bold font-cormorant text-[#231A16] mt-0.5">
              Lịch trình trong ngày
            </h3>
          </div>

          {/* 35mm Horizontal Film Strip Container */}
          <div className="bg-[#1A1412] rounded-xl py-3 px-2 border border-stone-800 shadow-xl text-[#F7F2EA] space-y-2">
            
            {/* Top Sprocket Holes Row */}
            <div className="flex justify-between px-2 overflow-hidden gap-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-3.5 h-2.5 rounded-2xs bg-[#F7F2EA] opacity-80 shrink-0" />
              ))}
            </div>

            {/* Film Frames Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-1 py-1">
              {timelineSchedule.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-[#261C18] border border-stone-700/80 rounded-sm p-2.5 text-center space-y-1 relative"
                >
                  <span className="text-xs font-bold font-courier text-amber-400 block">
                    {item.time}
                  </span>
                  <p className="text-[11px] text-stone-200 leading-tight font-medium">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Sprocket Holes Row */}
            <div className="flex justify-between px-2 overflow-hidden gap-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-3.5 h-2.5 rounded-2xs bg-[#F7F2EA] opacity-80 shrink-0" />
              ))}
            </div>
          </div>

          {/* Dresscode Subtitle */}
          <p className="font-caveat text-sm text-[#8C7A6B] text-center italic pt-1">
            Trang phục: {data.dressCode || 'Áo dài trắng hoặc đồng phục trường...'}
          </p>
        </div>

        {/* ============================================================== */}
        {/* SECTION 4: NHỮNG THƯỚC PHIM (VERTICAL 35mm FILM ROLL)          */}
        {/* ============================================================== */}
        <div className="text-center space-y-3 pt-2">
          <div>
            <span className="text-[9px] font-courier uppercase tracking-widest text-[#B58A63] block">
              ALBUM PHOTO
            </span>
            <h3 className="text-2xl font-bold font-cormorant text-[#231A16] mt-0.5">
              Những thước phim
            </h3>
          </div>

          {/* AUTHENTIC VERTICAL 35mm FILM ROLL CONTAINER */}
          <div className="bg-[#1A1412] rounded-xl py-4 px-2 sm:px-3 border border-stone-800 shadow-2xl relative overflow-hidden">
            
            <div className="flex">
              {/* Left Sprocket Column & Film Labels */}
              <div className="w-5 sm:w-6 flex flex-col justify-between py-2 items-center gap-6 shrink-0">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-3.5 rounded-2xs bg-[#F7F2EA] opacity-80 shrink-0" />
                ))}
              </div>

              {/* Photos Stack (Vertical Film Strip) */}
              <div className="flex-1 space-y-3 px-1 sm:px-2">
                {galleryImages.map((imgSrc, idx) => (
                  <div key={idx} className="relative bg-black rounded-xs overflow-hidden border border-stone-800 shadow-md group">
                    <div className="aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-stone-900">
                      <img
                        src={imgSrc}
                        alt={`Thước phim #${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>

                    {/* Frame numbering label in amber */}
                    <div className="absolute bottom-2 left-2.5 font-courier text-[10px] text-amber-300 font-bold bg-black/60 px-1.5 py-0.5 rounded-xs">
                      #{String(idx + 1).padStart(2, '0')} • 35MM
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Sprocket Column */}
              <div className="w-5 sm:w-6 flex flex-col justify-between py-2 items-center gap-6 shrink-0">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-3.5 rounded-2xs bg-[#F7F2EA] opacity-80 shrink-0" />
                ))}
              </div>
            </div>

            {/* Film Edge Mono Text */}
            <div className="pt-2 text-center text-[9px] font-courier text-amber-400/60 uppercase tracking-widest">
              KODAK PORTRA 400 • THANH XUÂN {data.className || '12A1'} • FILM NEGATIVE
            </div>
          </div>

          {/* Youth Quote */}
          <div className="pt-3 text-center space-y-1">
            <span className="text-3xl font-cormorant text-[#C27803] block leading-none">“</span>
            <p className="font-cormorant italic text-base sm:text-lg text-[#3E2415] leading-relaxed max-w-sm mx-auto">
              "Thanh xuân không có nếu như — chỉ có những ngày ta đã sống hết mình."
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 5: HẸN Ở ĐÂY NHÉ (LOCATION)                           */}
        {/* ============================================================== */}
        <div className="text-center space-y-3 pt-2">
          <div>
            <span className="text-[9px] font-courier uppercase tracking-widest text-[#B58A63] block">
              ĐỊA ĐIỂM
            </span>
            <h3 className="text-2xl font-bold font-cormorant text-[#231A16] mt-0.5">
              Hẹn ở đây nhé
            </h3>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 border border-[#EFE7DA] shadow-xs text-center space-y-3">
            <div>
              <h4 className="font-cormorant font-bold text-xl sm:text-2xl text-[#231A16]">
                {data.gatheringLocation || data.shootLocation || 'Sân trường'}
              </h4>
              <p className="text-xs text-[#8C7A6B] mt-1">
                {data.detailedAddress || data.schoolName || 'Địa chỉ trường của bạn'}
              </p>
            </div>

            {/* Action Buttons: Chỉ đường & Lưu lịch */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2A1D17] hover:bg-[#3D2D26] shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Chỉ đường</span>
              </a>

              <button
                type="button"
                onClick={handleCalendar}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#4A3B32] bg-transparent border border-[#B58A63] hover:bg-[#F7F2EA] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C27803]" />
                <span>Lưu vào lịch</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 6: ĐỂ LẠI LƯU BÚT (GUESTBOOK & RSVP)                  */}
        {/* ============================================================== */}
        <div className="text-center space-y-3 pt-2">
          <div>
            <span className="text-[9px] font-courier uppercase tracking-widest text-[#B58A63] block">
              LƯU BÚT
            </span>
            <h3 className="text-2xl font-bold font-cormorant text-[#231A16] mt-0.5">
              Để lại lưu bút
            </h3>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 border border-[#EFE7DA] shadow-xs text-left">
            {rsvpSubmitted ? (
              <div className="bg-[#F5EFEB] border border-amber-300/60 rounded-xl p-4 text-center space-y-2">
                <span className="text-2xl">🎬</span>
                <p className="text-sm font-bold font-cormorant text-[#231A16]">
                  Thước phim lưu bút của bạn đã được ghi lại!
                </p>
                <p className="text-xs text-[#8C7A6B]">
                  Hẹn gặp bạn tại ngày kỷ yếu thật rực rỡ nhé!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitWish} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#8C7A6B] block">
                    Tên của bạn:
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full bg-transparent border-b border-[#D5C7B5] focus:border-[#C27803] focus:outline-hidden py-1.5 text-xs sm:text-sm text-[#231A16] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#8C7A6B] block">
                    Lời nhắn gửi:
                  </label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Viết lời nhắn gửi cho bạn ấy nhé..."
                    className="w-full bg-transparent border-b border-[#D5C7B5] focus:border-[#C27803] focus:outline-hidden py-1.5 text-xs sm:text-sm text-[#231A16] resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      checked={rsvpStatus === 'confirmed'}
                      onChange={() => setRsvpStatus('confirmed')}
                      className="accent-[#C27803]"
                    />
                    <span className="font-medium text-[#231A16]">Sẽ có mặt</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="attendance"
                      checked={rsvpStatus === 'declined'}
                      onChange={() => setRsvpStatus('declined')}
                      className="accent-[#C27803]"
                    />
                    <span className="font-medium text-[#8C7A6B]">Không thể tham gia</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3 rounded-xl bg-[#2A1D17] hover:bg-[#3D2D26] text-amber-200 font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingRsvp ? 'ĐANG GỬI...' : 'GỬI LỜI NHẮN'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Wishes list */}
            {data.rsvps && data.rsvps.length > 0 && (
              <div className="pt-4 border-t border-[#E8DFD1] mt-4 space-y-2">
                <span className="text-[10px] font-courier uppercase tracking-widest text-[#B58A63] block">
                  LỜI NHẮN ĐÃ GỬI ({data.rsvps.length})
                </span>
                <div className="space-y-2">
                  {data.rsvps.slice(0, 5).map((r, i) => (
                    <div key={r.id || i} className="bg-[#FAF6F0] p-2.5 rounded-lg border border-[#E8DFD1] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#231A16]">
                        <span>{r.guestName}</span>
                        <span className="text-[10px] text-amber-600 font-mono">
                          {r.status === 'confirmed' ? '✓ Tham gia' : '💌 Lời chúc'}
                        </span>
                      </div>
                      {r.message && (
                        <p className="text-stone-600 mt-1 italic font-cormorant text-sm">
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

        {/* ============================================================== */}
        {/* SECTION 7: THE END (CINEMA OUTRO)                              */}
        {/* ============================================================== */}
        <div className="bg-[#1A1412] text-[#F7F2EA] rounded-2xl p-7 sm:p-8 text-center space-y-3.5 border border-stone-800 shadow-xl">
          <h3 className="font-cormorant italic text-3xl sm:text-4xl text-amber-300 tracking-wider">
            The End
          </h3>
          <p className="text-[10px] font-courier uppercase tracking-widest text-stone-400">
            KỶ YẾU THANH XUÂN NIÊN KHÓA {data.schoolYear || '2024 — 2027'}
          </p>
          <p className="text-xs text-stone-300 font-medium">
            Hẹn gặp lại tại buổi chụp!
          </p>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleCopy}
              className="px-6 py-2.5 rounded-full border border-amber-400/40 hover:border-amber-400 bg-amber-400/10 text-amber-200 text-xs font-courier font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ĐÃ SAO CHÉP LINK</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>CHIA SẺ THIỆP</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-3">
            <a
              href="/builder?template=vintage-film-roll"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/80 hover:text-amber-300 hover:underline"
            >
              <span>Tạo thiệp kỷ yếu miễn phí như thế này</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[9px] text-stone-500 font-courier pt-1">
            Đồng hành bởi GP Studio99 • Kỷ Yếu Đà Nẵng (chupanhdanang.com)
          </p>
        </div>

      </div>
    </div>
  );
}
