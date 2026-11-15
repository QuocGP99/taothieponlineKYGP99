'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InvitationCard from '@/components/InvitationCard';
import EnvelopeOpener from '@/components/EnvelopeOpener';
import RSVPSection from '@/components/RSVPSection';
import MusicPlayer from '@/components/MusicPlayer';
import PetalsEffect from '@/components/PetalsEffect';
import ShareModal from '@/components/ShareModal';
import PromoBannerBar from '@/components/PromoBannerBar';
import MarketingShowcaseCard from '@/components/MarketingShowcaseCard';
import GoogleLoginModal from '@/components/GoogleLoginModal';
import { InvitationData, RSVP } from '@/types/invitation';
import { getInvitationBySlug, addRSVP, incrementViewCount, incrementShareCount } from '@/lib/storage';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION } from '@/data/templates';
import {
  Share2, Camera, Heart, Download, Calendar,
  MapPin, Phone, Sparkles, AlertCircle, ArrowLeft, Edit3, Eye
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

export default function PublicInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const isPresetTemplate = slug.includes('green-student') || slug.includes('hoang-ngoc') || slug === 'sample';
  const [invitation, setInvitation] = useState<InvitationData | null>(() => {
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
    if (!cardRef.current) return;
    try {
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
    slug.includes('green-student')
      ? GREEN_STUDENT_INVITATION
      : (slug.includes('bao-anh') || slug.includes('12a1') || slug.includes('hoang-ngoc') || slug === 'sample' || slug.includes('crimson') || slug.includes('spotlight')
        ? SAMPLE_INVITATION
        : null)
  );

  const isTemplatePreview =
    slug.includes('green-student') ||
    slug.includes('hoang-ngoc') ||
    slug.includes('sample') ||
    slug.includes('crimson') ||
    slug.includes('spotlight');

  const handleEditTemplate = () => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('gp_auth_user') : null;
    const targetTemplateId = activeData?.templateId || (slug.includes('green-student') ? 'green-student' : 'modern-crimson-spotlight');
    if (user) {
      router.push(`/builder?template=${targetTemplateId}`);
    } else {
      setGoogleModalOpen(true);
    }
  };

  if (!activeData) {
    return (
      <div className="min-h-screen bg-[#FAF8F8] flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-auto p-8 text-center space-y-4">
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
        <Footer />
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://chupanhdanang.com/thiep-moi/${slug}`;
  const studentDisplayName = activeData.studentName || activeData.senderName || 'mình';

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <PetalsEffect />
      <PromoBannerBar />
      <Navbar />

      {/* Interactive Envelope Opener (Modal/Curtain) */}
      <EnvelopeOpener
        classNameStr={activeData.className}
        schoolName={activeData.schoolName}
        senderName={studentDisplayName}
        isOpen={envelopeOpen}
        onOpen={() => setEnvelopeOpen(true)}
      />

      {/* Background Youth Music Player */}
      <MusicPlayer />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8 animate-fade-in">

        {/* Top Action Bar */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur p-3.5 rounded-2xl border border-[#890F0D]/15 shadow-xs">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-[#890F0D] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Trang chủ GP Studio99</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                incrementShareCount(slug);
                setShareModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#890F0D] hover:bg-[#720000] shadow-md shadow-[#890F0D]/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ thiệp</span>
            </button>

            <button
              onClick={handleDownloadCard}
              className="p-2 rounded-xl text-xs font-bold text-[#890F0D] bg-[#FFF5F5] hover:bg-[#FEE2E2] border border-[#890F0D]/20 transition-colors cursor-pointer"
              title="Tải ảnh thiệp PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Invitation Card (Chế độ Xem Preview Template: Chỉ Đọc) */}
        <div className="animate-fade-in">
          <InvitationCard
            data={activeData}
            isInteractive={false}
            cardRef={cardRef}
            onEditPrompt={handleEditTemplate}
          />
        </div>

        {/* RSVP & Guestbook Section */}
        {activeData.componentsVisible?.showRSVP !== false && (
          <RSVPSection
            slug={slug}
            studentName={studentDisplayName}
            rsvps={activeData.rsvps || []}
            onRSVPSubmit={handleRSVPSubmit}
          />
        )}

        {/* GP Studio99 Marketing Showcase */}
        <div className="pt-4 pb-16">
          <MarketingShowcaseCard />
        </div>

      </main>

      {/* ============================================================== */}
      {/* FLOATING ACTION BAR: 2 CHẾ ĐỘ PREVIEW & CHỈNH SỬA TEMPLATE    */}
      {/* (Chuẩn theo mẫu thieponline.id.vn/invitation/green-student)   */}
      {/* ============================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#890F0D]/20 py-3 px-4 sm:px-6 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">

          {/* Mode 1 indicator: Preview Template */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="text-left">
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1. Xem Preview Template</span>
              </span>
              <span className="text-[10px] text-stone-500 hidden sm:block">
                Mẫu: <strong className="text-[#890F0D]">{activeData.templateId === 'green-student' ? 'Green Student (Thanh Xuân)' : 'Modern Crimson Spotlight'}</strong>
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

      {/* Google Login Modal (Khi click Chỉnh sửa template mà chưa đăng nhập) */}
      <GoogleLoginModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        templateName={activeData.templateId === 'green-student' ? 'Green Student (Thanh Xuân)' : 'Modern Crimson Spotlight'}
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

      <Footer />
    </div>
  );
}
