'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import InvitationCard from '@/components/InvitationCard';
import EnvelopeOpener from '@/components/EnvelopeOpener';
import RSVPSection from '@/components/RSVPSection';
import MusicPlayer from '@/components/MusicPlayer';
import ShareModal from '@/components/ShareModal';
import { InvitationData, RSVP } from '@/types/invitation';
import { getInvitationBySlug, addRSVP, incrementViewCount, incrementShareCount } from '@/lib/storage';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION, FILM_ROLL_INVITATION, CYBER_FUTURISTIC_INVITATION } from '@/data/templates';
import {
  Share2, Camera, Heart, Download, Calendar,
  MapPin, Phone, Sparkles, AlertCircle, ArrowLeft, Eye
} from 'lucide-react';
import Link from 'next/link';

// Danh sách các slug demo tĩnh chính thức
const DEMO_PRESET_MAP: Record<string, InvitationData> = {
  'cyber-2030': CYBER_FUTURISTIC_INVITATION,
  'cuon-phim-thanh-xuan': FILM_ROLL_INVITATION,
  'green-student': GREEN_STUDENT_INVITATION,
  'hoang-ngoc-dai-hoc-dong-a-2027': SAMPLE_INVITATION,
  'sample': SAMPLE_INVITATION,
  'modern-crimson-spotlight': SAMPLE_INVITATION,
};

export default function PublicInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawSlug = (params?.slug as string) || '';
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase();

  // Đọc tên người nhận cá nhân hóa từ query param ?to= hoặc ?guest=
  const toParam = searchParams?.get('to') || searchParams?.get('guest');
  const groupParam = searchParams?.get('group') || searchParams?.get('role');
  const personalizedGuestName = toParam ? decodeURIComponent(toParam).trim() : '';

  const isPresetTemplate = !!DEMO_PRESET_MAP[slug];
  const [invitation, setInvitation] = useState<InvitationData | null>(() => {
    return DEMO_PRESET_MAP[slug] || null;
  });
  const [loading, setLoading] = useState(!isPresetTemplate);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch invitation data from local storage or server API
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);

      // 1. Try local storage first
      const localItem = getInvitationBySlug(slug);
      if (localItem) {
        setInvitation(localItem);
        incrementViewCount(slug);
      }

      // 2. Also try server API PostgreSQL qua Prisma
      try {
        const res = await fetch(`/api/invitations/${slug}`);
        if (res.ok) {
          const remoteItem = await res.json();
          if (remoteItem && remoteItem.slug) {
            setInvitation(remoteItem);
          }
        }
      } catch (err) {
        console.warn('Could not fetch from server API:', err);
      }

      setLoading(false);
    };

    loadData();
  }, [slug]);

  // Handle RSVP submission
  const handleRSVPSubmit = async (rsvpData: Omit<RSVP, 'id' | 'createdAt'>) => {
    if (!activeData) return;

    // 1. Update local storage
    const newLocalRsvp = addRSVP(slug, rsvpData);
    if (newLocalRsvp) {
      setInvitation(prev => prev ? { ...prev, rsvps: [newLocalRsvp, ...(prev.rsvps || [])] } : prev);
    }

    // 2. Update server API PostgreSQL
    try {
      await fetch(`/api/invitations/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rsvp', ...rsvpData })
      });
    } catch (err) {
      console.warn('Error saving RSVP to server:', err);
    }
  };

  // Chia sẻ liên kết thiệp
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeData?.title || 'Thiệp Mời Kỷ Yếu',
        text: `Kỷ yếu của ${studentDisplayName} – Trân trọng mời ${guestDisplayName}!`,
        url: window.location.href,
      }).catch(() => setShareModalOpen(true));
    } else {
      setShareModalOpen(true);
    }
  };

  // Tải thiệp về máy (Lưu kỷ niệm)
  const handleDownloadCard = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#890F0D] text-white flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[#720000]">Đang mở thiệp mời thanh xuân...</p>
        </div>
      </div>
    );
  }

  // Dữ liệu thực tế hoặc fallback NẾU ĐÚNG là slug của demo template
  const activeData = invitation || DEMO_PRESET_MAP[slug] || null;

  if (!activeData) {
    return (
      <div className="min-h-screen bg-[#FAF8F8] flex flex-col items-center justify-center p-4">
        <div className="max-w-md mx-auto p-8 text-center space-y-4 bg-white rounded-3xl shadow-xl border border-stone-200">
          <div className="w-16 h-16 rounded-full bg-[#FEE2E2] text-[#890F0D] flex items-center justify-center mx-auto text-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-stone-900">Không Tìm Thấy Thiệp Mời</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Đường link thiệp mời này có thể chưa được xuất bản hoặc đã hết hạn. Bạn có thể tự tay tạo một chiếc thiệp mời cá nhân cho mình ngay bây giờ!
          </p>
          <Link
            href="/builder"
            className="inline-block px-6 py-3 rounded-2xl font-bold text-xs text-white bg-[#890F0D] hover:bg-[#720000] shadow-md"
          >
            Tự tạo thiệp mời kỷ yếu
          </Link>
        </div>
      </div>
    );
  }

  const defaultBase = process.env.NEXT_PUBLIC_APP_URL || 'https://taothiepkyyeugp99.io.vn';
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href
    : `${defaultBase}/thiep-moi/${slug}`;
  const studentDisplayName = activeData.studentName || activeData.senderName || 'mình';
  
  // Tên người nhận hiển thị: Ưu tiên tên cá nhân hóa từ query param ?to=, nếu không có mới dùng guestName của thiệp
  const guestDisplayName = personalizedGuestName || activeData.guestName || 'Bạn thân mến';

  const isNotebookStyle = activeData.templateId === 'green-student';
  const isFilmRollStyle = activeData.templateId === 'vintage-film-roll' || activeData.templateId === 'film-roll';
  const isCyberStyle = activeData.templateId === 'cyber-y2k-futuristic' || activeData.templateId === 'cyber-2030' || activeData.templateId === 'futuristic-3d';

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-500 ${
      isCyberStyle
        ? 'bg-gradient-to-b from-[#38BDF8] via-[#60A5FA] to-[#4ADE80] bg-halftone text-black selection:bg-[#FF2E93] selection:text-white'
        : (isFilmRollStyle
          ? 'bg-[#1C1512] text-[#F7F2EA] selection:bg-amber-900 selection:text-amber-200'
          : (isNotebookStyle 
            ? 'bg-gradient-to-b from-[#FFF5F8] via-[#FAF5FF] to-[#F3E8FF] selection:bg-[#FCE7F3] selection:text-[#9D174D]' 
            : 'bg-[#FAF8F8] selection:bg-[#FEE2E2] selection:text-[#720000]'))
    }`}>
      {/* Floating Navigation: Back to Home (Left) */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-40 p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#890F0D] shadow-md border border-stone-200/60 backdrop-blur transition-all flex items-center gap-1.5 text-xs font-bold"
        title="Trang chủ GP Studio99"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>

      {/* Floating Action Buttons: Share & Download (Right) */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#890F0D] shadow-md border border-stone-200/60 backdrop-blur transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Chia sẻ thiệp mời"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadCard}
          className="p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#890F0D] shadow-md border border-stone-200/60 backdrop-blur transition-all flex items-center gap-1.5 text-xs font-bold"
          title="In / Tải thiệp về máy"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Lưu ảnh</span>
        </button>
      </div>

      {/* Background Youth Music Player */}
      {activeData.componentsVisible?.showMusic !== false && (
        <MusicPlayer musicTrack={activeData.musicTrack} />
      )}

      {/* Interactive Envelope / Notebook Opener */}
      <EnvelopeOpener
        classNameStr={activeData.className}
        schoolName={activeData.schoolName}
        senderName={studentDisplayName}
        guestName={guestDisplayName}
        templateId={activeData.templateId}
        isOpen={envelopeOpen}
        onOpen={() => setEnvelopeOpen(true)}
      />

      {/* Main Content Area: CHẾ ĐỘ XEM CHỈ ĐỌC DÀNH CHO NGƯỜI NHẬN */}
      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full space-y-8 animate-fade-in pb-16">

        {/* Master Invitation Card (Chế độ xem thiệp mời: Chỉ Đọc, KHÔNG CÓ CÔNG CỤ EDIT) */}
        <div className="animate-fade-in">
          <InvitationCard
            data={activeData}
            isInteractive={false}
            guestName={guestDisplayName}
            cardRef={cardRef}
            onRSVPSubmit={handleRSVPSubmit}
          />
        </div>

        {/* RSVP Section (Đơn giản, tinh gọn, riêng tư) */}
        {!isNotebookStyle && !isFilmRollStyle && !isCyberStyle && activeData.componentsVisible?.showRSVP !== false && (
          <RSVPSection
            slug={slug}
            studentName={studentDisplayName}
            rsvps={activeData.rsvps || []}
            onRSVPSubmit={handleRSVPSubmit}
          />
        )}

      </main>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={currentUrl}
        title={activeData.title}
        className={activeData.className}
        studentName={studentDisplayName}
      />
    </div>
  );
}
