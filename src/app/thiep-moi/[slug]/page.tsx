'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InvitationCard from '@/components/InvitationCard';
import EnvelopeOpener from '@/components/EnvelopeOpener';
import RSVPSection from '@/components/RSVPSection';
import MusicPlayer from '@/components/MusicPlayer';
import PetalsEffect from '@/components/PetalsEffect';
import ShareModal from '@/components/ShareModal';
import { InvitationData, RSVP } from '@/types/invitation';
import { getInvitationBySlug, addRSVP, incrementViewCount, incrementShareCount } from '@/lib/storage';
import { SAMPLE_INVITATION } from '@/data/templates';
import {
  Share2, Camera, Heart, Download, Calendar,
  MapPin, Phone, Sparkles, AlertCircle, ArrowLeft
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Fallback to sample invitation if slug is demo
  const activeData = invitation || (slug.includes('bao-anh') || slug.includes('12a1') || slug.includes('hoang-ngoc') || slug === 'sample' ? SAMPLE_INVITATION : null);

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

        {/* Master Invitation Card */}
        <div className="animate-fade-in">
          <InvitationCard
            data={activeData}
            isInteractive={true}
            cardRef={cardRef}
          />
        </div>

        {/* RSVP & Guestbook Section */}
        {activeData.componentsVisible.showRSVP && (
          <RSVPSection
            slug={slug}
            studentName={studentDisplayName}
            rsvps={activeData.rsvps || []}
            onRSVPSubmit={handleRSVPSubmit}
          />
        )}

        {/* GP Studio99 Co-Branded Footer Card */}
        <div className="bg-gradient-to-r from-[#3B0404] via-[#540000] to-[#3B0404] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#890F0D]/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#890F0D] flex items-center justify-center mx-auto text-white shadow-md">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-200 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            KỶ YẾU ĐÀ NẴNG – GP STUDIO99
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Bạn Muốn Có Bộ Ảnh Kỷ Yếu Đẹp Như Thế Này?
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto leading-relaxed">
            GP Studio99 cung cấp trọn gói chụp ảnh & quay phim kỷ yếu tại Đà Nẵng, Huế, Quảng Nam: xem trước 3-5 bản demo màu ảnh, trang phục đa dạng concept, flycam 4K và stylist nhiệt tình.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="tel:0899236001"
              className="px-6 py-3 rounded-2xl font-extrabold text-xs text-[#540000] bg-amber-300 hover:bg-amber-200 shadow-md flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#540000]" />
              <span>Hotline / Zalo: 0899.236.001</span>
            </a>
            <Link
              href="/builder"
              className="px-6 py-3 rounded-2xl font-bold text-xs text-white bg-white/15 hover:bg-white/25 border border-white/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tạo thiệp cho chính bạn</span>
            </Link>
          </div>
        </div>

      </main>

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
