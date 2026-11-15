'use client';

import React, { useState, useEffect } from 'react';
import { InvitationData } from '@/types/invitation';
import PosterHeroSection from './PosterHeroSection';
import TimelineSection from './TimelineSection';
import PhotoGallerySection from './PhotoGallerySection';
import GuestbookSection from './GuestbookSection';
import { 
  Calendar, Clock, MapPin, Navigation, Shirt, 
  Share2, ExternalLink, Heart, Sparkles, Check, Copy,
  Gift, Phone, Tag
} from 'lucide-react';
import { generateGoogleMapsUrl } from '@/lib/maps';

interface InvitationCardProps {
  data: InvitationData;
  isInteractive?: boolean;
  onRSVPClick?: () => void;
  onUpdate?: (partial: Partial<InvitationData>) => void;
  guestName?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  onEditPrompt?: () => void;
}

export default function InvitationCard({ 
  data, 
  isInteractive = false, 
  onRSVPClick,
  onUpdate,
  guestName,
  cardRef,
  onEditPrompt
}: InvitationCardProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [copied, setCopied] = useState(false);

  // Tính toán đếm ngược đến ngày chụp kỷ yếu
  useEffect(() => {
    if (!data.date) return;
    
    const calculateTime = () => {
      const target = new Date(`${data.date}T${data.startTime || '13:00'}:00`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [data.date, data.startTime]);

  const mapsUrl = data.googleMapsUrl || generateGoogleMapsUrl(data.schoolName || data.shootLocation);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div ref={cardRef} className="max-w-xl mx-auto w-full relative transition-all space-y-6 pb-12">
      
      {/* ============================================================== */}
      {/* 1. HERO POSTER SECTION (Chuẩn phong cách ảnh tham khảo)          */}
      {/* ============================================================== */}
      <PosterHeroSection
        data={data}
        isEditable={isInteractive}
        onUpdate={onUpdate}
        guestName={guestName}
        onEditPrompt={onEditPrompt}
      />

      {/* ============================================================== */}
      {/* 2. SỐ NGÀY CÒN LẠI (COUNTDOWN TIMER)                           */}
      {/* ============================================================== */}
      {data.componentsVisible?.showCountdown !== false && (
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-[#890F0D]/15 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#890F0D] mb-3 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#890F0D] animate-spin" />
            <span>ĐẾM NGƯỢC ĐẾN NGÀY CHỤP KỶ YẾU</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#FFF5F5] p-2.5 rounded-2xl border border-[#890F0D]/10">
              <span className="block text-2xl sm:text-3xl font-black text-[#720000]">{timeLeft.days}</span>
              <span className="text-[10px] uppercase font-bold text-stone-500">Ngày</span>
            </div>
            <div className="bg-[#FFF5F5] p-2.5 rounded-2xl border border-[#890F0D]/10">
              <span className="block text-2xl sm:text-3xl font-black text-[#720000]">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase font-bold text-stone-500">Giờ</span>
            </div>
            <div className="bg-[#FFF5F5] p-2.5 rounded-2xl border border-[#890F0D]/10">
              <span className="block text-2xl sm:text-3xl font-black text-[#720000]">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase font-bold text-stone-500">Phút</span>
            </div>
            <div className="bg-[#FFF5F5] p-2.5 rounded-2xl border border-[#890F0D]/10">
              <span className="block text-2xl sm:text-3xl font-black text-[#890F0D]">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase font-bold text-stone-500">Giây</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. LỜI CHÀO ĐẦU & THÔNG ĐIỆP GỬI BẠN BÈ                        */}
      {/* ============================================================== */}
      {data.inviteMessage && (
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-xl border border-[#890F0D]/15 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#B91C1C]" />
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#890F0D] mb-3">
            💌 LỜI CHÀO ĐẦU TỪ {data.studentName || 'HOÀNG NGỌC'}
          </h3>
          <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium italic">
            "{data.inviteMessage}"
          </p>
          {data.wishMessage && (
            <p className="mt-3 pt-3 border-t border-[#890F0D]/10 text-xs font-bold text-[#890F0D]">
              💖 {data.wishMessage}
            </p>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. LỊCH TRÌNH BUỔI CHỤP (TIMELINE)                              */}
      {/* ============================================================== */}
      {data.componentsVisible?.showSchedule !== false && (
        <TimelineSection 
          items={data.timeline} 
          friendPhotoTime={data.friendPhotoTime} 
        />
      )}

      {/* ============================================================== */}
      {/* 5. TRANG PHỤC GỢI Ý (DRESS CODE)                                */}
      {/* ============================================================== */}
      {data.componentsVisible?.showDressCode !== false && data.dressCode && (
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-[#890F0D]/15 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D] shrink-0 mt-0.5">
            <Shirt className="w-5 h-5 text-[#890F0D]" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#720000] text-sm uppercase tracking-wider">
              TRANG PHỤC GỢI Ý
            </h4>
            <p className="text-xs text-stone-700 font-medium mt-1 leading-relaxed">
              {data.dressCode}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. BỘ SƯU TẬP ẢNH & NÚT "THÊM ẢNH CỦA BẠN"                      */}
      {/* ============================================================== */}
      <PhotoGallerySection
        photos={data.gallery}
        studentName={data.studentName}
        isEditable={isInteractive}
        onAddPhoto={isInteractive && onUpdate ? (newUrl) => {
          if (onUpdate) {
            onUpdate({ gallery: [newUrl, ...(data.gallery || [])] });
          }
        } : undefined}
        onEditPrompt={onEditPrompt}
      />

      {/* ============================================================== */}
      {/* 7. ĐỊA ĐIỂM & BẢN ĐỒ GOOGLE MAPS                                */}
      {/* ============================================================== */}
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-xl border border-[#890F0D]/15">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D] shrink-0">
            <MapPin className="w-5 h-5 text-[#890F0D]" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#720000] text-sm uppercase tracking-wider">
              ĐỊA ĐIỂM CHỤP & GẶP NHAU
            </h4>
            <p className="text-xs font-bold text-stone-800 mt-0.5">{data.schoolName}</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-4 bg-[#FFF8F8] p-3 rounded-xl border border-[#890F0D]/10">
          📍 <strong>Địa chỉ:</strong> {data.shootLocation || data.detailedAddress}
        </p>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#890F0D]/30 hover:border-[#890F0D] text-[#720000] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all group"
          >
            <Navigation className="w-4 h-4 text-[#890F0D] group-hover:scale-110 transition-transform" />
            <span>Mở chỉ đường trên Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#890F0D]" />
          </a>
        )}
      </div>

      {/* ============================================================== */}
      {/* 8. SỔ LƯU BÚT / GỬI LỜI CHÚC TƯƠNG TÁC                         */}
      {/* ============================================================== */}
      {data.componentsVisible?.showWishes !== false && (
        <GuestbookSection
          wishes={data.wishes}
          studentName={data.studentName}
          onSendWish={(wish) => {
            if (onUpdate) {
              const newWishItem = {
                id: `wish-${Date.now()}`,
                ...wish,
                createdAt: new Date().toISOString()
              };
              onUpdate({ wishes: [newWishItem, ...(data.wishes || [])] });
            }
          }}
        />
      )}

      {/* ============================================================== */}
      {/* 9. NÚT XÁC NHẬN THAM GIA (RSVP) NẾU CÓ                           */}
      {/* ============================================================== */}
      {onRSVPClick && (
        <div className="max-w-md mx-auto text-center px-4">
          <button
            type="button"
            onClick={onRSVPClick}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#890F0D] via-[#720000] to-[#890F0D] text-white font-extrabold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Xác nhận tham gia & Tặng quà tinh thần</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. CHIA SẺ THIỆP QUA ĐƯỜNG LINK & ZALO                         */}
      {/* ============================================================== */}
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-[#890F0D]/15 text-center">
        <h4 className="font-extrabold text-[#720000] text-sm uppercase tracking-wider mb-2">
          CHIA SẺ THIỆP MỜI
        </h4>
        <p className="text-xs text-stone-500 mb-4">
          Gửi đường link thiệp này đến bạn bè và người thân để cùng lưu giữ thanh xuân!
        </p>

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFF8F8] hover:bg-[#FEE2E2] text-[#890F0D] border border-[#890F0D]/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép link!' : 'Sao chép link thiệp'}</span>
          </button>

          <a
            href={`https://zalo.me/share?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-4 rounded-xl bg-[#0068FF] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ Zalo</span>
          </a>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 11. FOOTER: CREATED BY GP STUDIO99                              */}
      {/* ============================================================== */}
      <div className="max-w-md mx-auto text-center pt-4 pb-2 border-t border-[#890F0D]/15">
        <p className="text-xs font-extrabold text-[#890F0D] tracking-wider uppercase">
          Create by GP Studio99
        </p>
        <p className="text-[11px] text-stone-500 mt-1">
          Hệ sinh thái chụp ảnh kỷ yếu chuyên nghiệp •{' '}
          <a
            href="https://chupanhdanang.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#890F0D] hover:underline font-bold"
          >
            chupanhdanang.com
          </a>
        </p>
        <p className="text-[10px] text-stone-400 mt-0.5">Hotline: 0899.236.001</p>
      </div>

    </div>
  );
}
