'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InvitationCard from '@/components/InvitationCard';
import EnvelopeOpener from '@/components/EnvelopeOpener';
import RSVPSection from '@/components/RSVPSection';
import MusicPlayer from '@/components/MusicPlayer';
import PetalsEffect from '@/components/PetalsEffect';
import ShareModal from '@/components/ShareModal';
import GoogleLoginModal from '@/components/GoogleLoginModal';
import { InvitationData, RSVP } from '@/types/invitation';
import { getInvitationBySlug, addRSVP, incrementViewCount, incrementShareCount } from '@/lib/storage';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION, FILM_ROLL_INVITATION, CYBER_FUTURISTIC_INVITATION } from '@/data/templates';
import {
  Share2, Camera, Heart, Download, Calendar,
  MapPin, Phone, Sparkles, AlertCircle, ArrowLeft, Edit3, Eye
} from 'lucide-react';
import Link from 'next/link';

export default function PublicInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const isPresetTemplate = slug.includes('cyber') || slug.includes('2030') || slug.includes('futuristic') || slug.includes('cuon-phim') || slug.includes('film') || slug.includes('green-student') || slug.includes('hoang-ngoc') || slug === 'sample';
  const [invitation, setInvitation] = useState<InvitationData | null>(() => {
    if (slug.includes('cyber') || slug.includes('2030') || slug.includes('futuristic')) return CYBER_FUTURISTIC_INVITATION;
    if (slug.includes('cuon-phim') || slug.includes('film')) return FILM_ROLL_INVITATION;
    if (slug.includes('green-student')) return GREEN_STUDENT_INVITATION;
    if (slug.includes('hoang-ngoc') || slug === 'sample') return SAMPLE_INVITATION;
    return null;
  });
  const [loading, setLoading] = useState(!isPresetTemplate);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
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

      // 2. Also try server API
      try {
        const res = await fetch(`/api/invitations/${slug}`);
        if (res.ok) {
          const remoteItem = await res.json();
          setInvitation(remoteItem);
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
    if (!invitation && !slug.includes('bao-anh') && !slug.includes('12a1')) return;

    // 1. Update local storage
    const newLocalRsvp = addRSVP(slug, rsvpData);
    if (newLocalRsvp) {
      setInvitation(prev => prev ? { ...prev, rsvps: [newLocalRsvp, ...(prev.rsvps || [])] } : prev);
    }

    // 2. Update server API
    try {
      await fetch(`/api/invitations/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rsvp', ...rsvpData })
      });
    } catch (err) {
      console.warn('Server RSVP error:', err);
    }
  };

  // Download Card as image
  const handleDownloadCard = async () => {
    if (!cardRef.current || typeof window === 'undefined') return;
    try {
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Thiep-Moi-${invitation?.studentName || 'GP-Studio99'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert('Không thể tạo ảnh thiệp, bạn có thể chụp ảnh màn hình nhé!');
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

  // Fallback to sample invitation if slug is demo or template
  const activeData = invitation || (
    slug.includes('cyber') || slug.includes('2030') || slug.includes('futuristic')
      ? CYBER_FUTURISTIC_INVITATION
      : (slug.includes('cuon-phim') || slug.includes('film')
        ? FILM_ROLL_INVITATION
        : (slug.includes('green-student')
          ? GREEN_STUDENT_INVITATION
          : (slug.includes('bao-anh') || slug.includes('12a1') || slug.includes('hoang-ngoc') || slug === 'sample' || slug.includes('crimson') || slug.includes('spotlight')
            ? SAMPLE_INVITATION
            : null)))
  );

  const isTemplatePreview =
    slug.includes('cyber') ||
    slug.includes('2030') ||
    slug.includes('futuristic') ||
    slug.includes('cuon-phim') ||
    slug.includes('film') ||
    slug.includes('green-student') ||
    slug.includes('hoang-ngoc') ||
    slug.includes('sample') ||
    slug.includes('crimson') ||
    slug.includes('spotlight');

  const handleEditTemplate = () => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('gp_auth_user') : null;
    const targetTemplateId = activeData?.templateId || (slug.includes('cyber') || slug.includes('2030') ? 'cyber-y2k-futuristic' : (slug.includes('green-student') ? 'green-student' : 'modern-crimson-spotlight'));
    if (user) {
      router.push(`/builder?template=${targetTemplateId}`);
    } else {
      setGoogleModalOpen(true);
    }
  };

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
    ? (window.location.hostname.includes('vercel.app') ? `${defaultBase}/thiep-moi/${slug}` : window.location.href)
    : `${defaultBase}/thiep-moi/${slug}`;
  const studentDisplayName = activeData.studentName || activeData.senderName || 'mình';
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
      <PetalsEffect />

      {/* Floating Navigation: Back to Home (Left) */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-40 p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#890F0D] shadow-md border border-stone-200/60 backdrop-blur transition-all flex items-center gap-1.5 text-xs font-bold"
        title="Trang chủ GP Studio99"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>

      {/* Floating Tools: Share & Download Card (Right) */}
      <div className="fixed top-4 right-16 sm:right-20 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            incrementShareCount(slug);
            setShareModalOpen(true);
          }}
          className="p-2.5 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#890F0D] shadow-md border border-stone-200/60 backdrop-blur transition-all cursor-pointer"
          title="Chia sẻ thiệp"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleDownloadCard}
          className="p-2.5 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#890F0D] shadow-md border border-stone-200/60 backdrop-blur transition-all cursor-pointer"
          title="Tải ảnh thiệp PNG"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Background Youth Music Player (Fixed top-4 right-4) */}
      <MusicPlayer />

      {/* Interactive Envelope / Notebook Opener (Modal/Curtain) */}
      <EnvelopeOpener
        classNameStr={activeData.className}
        schoolName={activeData.schoolName}
        senderName={studentDisplayName}
        guestName={activeData.guestName}
        templateId={activeData.templateId}
        isOpen={envelopeOpen}
        onOpen={() => setEnvelopeOpen(true)}
      />

      {/* Main Content Area: CHỈ GIỮ LẠI THỰC TẾ NGƯỜI NHẬN */}
      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full space-y-8 animate-fade-in pb-28">

        {/* Master Invitation Card (Chế độ Xem Preview Template: Chỉ Đọc) */}
        <div className="animate-fade-in">
          <InvitationCard
            data={activeData}
            isInteractive={false}
            cardRef={cardRef}
            onEditPrompt={handleEditTemplate}
            onRSVPSubmit={handleRSVPSubmit}
          />
        </div>

        {/* RSVP & Guestbook Section (Chỉ hiển thị cho các mẫu khác; mẫu Sổ Lưu Bút, Cuộn Phim và Cyber 2030 đã tích hợp trực tiếp) */}
        {!isNotebookStyle && !isFilmRollStyle && !isCyberStyle && activeData.componentsVisible?.showRSVP !== false && (
          <RSVPSection
            slug={slug}
            studentName={studentDisplayName}
            rsvps={activeData.rsvps || []}
            onRSVPSubmit={handleRSVPSubmit}
          />
        )}

      </main>

      {/* ============================================================== */}
      {/* FLOATING ACTION BAR: 2 CHẾ ĐỘ PREVIEW & CHỈNH SỬA TEMPLATE    */}
      {/* (Chuẩn theo mẫu thieponline.id.vn/invitation/green-student)   */}
      {/* ============================================================== */}
      {isTemplatePreview && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#890F0D]/20 py-3 px-4 sm:px-6 shadow-2xl">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3">

            {/* Mode 1 indicator: Preview Template */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-left">
                <span className="text-[11px] sm:text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>1. Xem Preview Template</span>
                </span>
                <span className="text-[10px] text-stone-500 hidden sm:block">
                  Mẫu: <strong className="text-[#890F0D]">
                    {isCyberStyle 
                      ? 'Cyber 2030 (Neo-Futuristic 3D)' 
                      : (isNotebookStyle 
                        ? 'Sổ Lưu Bút (Scrapbook)' 
                        : (isFilmRollStyle ? 'Cuộn Phim Hoài Niệm' : 'Modern Crimson Spotlight'))}
                  </strong>
                </span>
              </div>
            </div>

            {/* Mode 2 action: Edit template -> Requires Google Login */}
            <button
              type="button"
              onClick={handleEditTemplate}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#B91C1C] hover:from-[#540000] hover:to-[#720000] shadow-lg shadow-[#890F0D]/30 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>2. Chỉnh sửa template này</span>
            </button>

          </div>
        </div>
      )}

      {/* Google Login Modal (Khi click Chỉnh sửa template mà chưa đăng nhập) */}
      <GoogleLoginModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        templateName={activeData.templateId === 'green-student' ? 'Green Student (Mùa Phượng Cuối)' : 'Modern Crimson Spotlight'}
        redirectUrl={`/builder?template=${activeData.templateId || (slug.includes('green-student') ? 'green-student' : 'modern-crimson-spotlight')}`}
        onSuccess={() => {
          setGoogleModalOpen(false);
          const target = activeData.templateId || (slug.includes('green-student') ? 'green-student' : 'modern-crimson-spotlight');
          router.push(`/builder?template=${target}`);
        }}
      />

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={currentUrl}
        title={activeData.title}
        className={activeData.className}
        onDownloadImage={handleDownloadCard}
      />
    </div>
  );
}
