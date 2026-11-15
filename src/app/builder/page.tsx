'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InvitationCard from '@/components/InvitationCard';
import ShareModal from '@/components/ShareModal';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION, PREMADE_MESSAGES } from '@/data/templates';
import { InvitationData, TimelineItem } from '@/types/invitation';
import { saveInvitation } from '@/lib/storage';
import {
  Sparkles, Check, ChevronRight, ChevronLeft, Upload,
  Palette, Type, Eye, Send, Save, AlertCircle, Copy, Share2,
  Download, RefreshCw, Smartphone, Monitor, ArrowLeft, User, Clock, Users, Navigation, ExternalLink, Plus, Trash2, Camera, Image as ImageIcon
} from 'lucide-react';
import { generateGoogleMapsUrl } from '@/lib/maps';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';

// Hàm nén ảnh tự động để tránh tràn bộ nhớ LocalStorage và Payload
const compressImage = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(event.target?.result as string);
    };
    reader.onerror = () => resolve('');
  });
};

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 4 bước thiết kế tinh gọn
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'desktop'>('mobile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [formData, setFormData] = useState<InvitationData>(() => {
    const tmplParam = searchParams.get('template');
    const baseTmpl = tmplParam === 'green-student' ? GREEN_STUDENT_INVITATION : SAMPLE_INVITATION;

    return {
      ...baseTmpl,
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      slug: `thiep-${Date.now().toString(36)}`,
      templateId: tmplParam === 'green-student' ? 'green-student' : 'modern-crimson-spotlight',
      status: 'published',
      views: 0,
      shares: 0,
      rsvps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Đăng nhập nhanh bằng Google trực tiếp trong Builder
  const handleGoogleSignIn = () => {
    const mockGoogleUser = {
      email: 'hocsinh.kyeu@gmail.com',
      name: 'Học Sinh GP Studio99',
      provider: 'google',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      token: `gp_google_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      loginAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('gp_auth_user', JSON.stringify(mockGoogleUser));
    }

    setFormData(prev => ({ ...prev, creatorEmail: mockGoogleUser.email }));
    setIsAuthenticated(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#890F0D']
    });
  };

  // Kiểm tra đăng nhập trước khi vào trình tạo thiệp
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gp_auth_user');
      if (!stored) {
        setIsAuthenticated(false);
      } else {
        try {
          const user = JSON.parse(stored);
          if (user?.email) {
            setFormData(prev => ({ ...prev, creatorEmail: user.email }));
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (e) {
          setIsAuthenticated(false);
        }
      }
    }
  }, []);

  // Tải ảnh chân dung (Tự động nén chất lượng cao, tối ưu dung lượng)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Dung lượng ảnh tối đa là 15MB. Vui lòng chọn ảnh nhẹ hơn.');
      return;
    }

    try {
      const optimized = await compressImage(file, 1200, 0.82);
      if (optimized) {
        setFormData(prev => ({
          ...prev,
          avatarPhoto: optimized
        }));
      }
    } catch (err) {
      console.error('Error compressing avatar:', err);
    }
  };

  // Tải thêm ảnh vào album (Tự động nén)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 15 * 1024 * 1024) continue;
      try {
        const optimized = await compressImage(file, 1000, 0.8);
        if (optimized) {
          setFormData(prev => ({
            ...prev,
            gallery: [optimized, ...(prev.gallery || [])]
          }));
        }
      } catch (err) {
        console.error('Error compressing gallery photo:', err);
      }
    }
  };

  // Thêm mốc lịch trình
  const handleAddTimelineItem = () => {
    const newItem: TimelineItem = {
      id: `tl-${Date.now()}`,
      time: '14:00 - 15:00',
      title: 'Chụp ảnh giao lưu cùng bạn bè',
      location: formData.schoolName || 'Sân trường',
      note: 'Mang theo nụ cười rạng rỡ nha!'
    };
    setFormData(prev => ({
      ...prev,
      timeline: [...(prev.timeline || []), newItem]
    }));
  };

  // Xóa mốc lịch trình
  const handleRemoveTimelineItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      timeline: (prev.timeline || []).filter(item => item.id !== id)
    }));
  };

  // Cập nhật mốc lịch trình
  const handleUpdateTimelineItem = (id: string, field: keyof TimelineItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      timeline: (prev.timeline || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  // Tạo URL thân thiện
  const generateSlug = () => {
    const namePart = (formData.studentName || 'hoang-ngoc')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const schoolPart = (formData.schoolName || 'dai-hoc-dong-a')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const randomSuffix = Math.random().toString(36).substr(2, 4);
    return `${namePart}-${schoolPart}-${randomSuffix}`;
  };

  // Xuất bản thiệp NGAY LẬP TỨC - KHÔNG CẦN GMAIL
  const handlePublish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const finalSlug = formData.slug.startsWith('thiep-') ? generateSlug() : formData.slug;
      const fullUrl = `${window.location.origin}/thiep-moi/${finalSlug}`;

      const finalInvitation: InvitationData = {
        ...formData,
        creatorName: formData.studentName,
        senderName: formData.studentName,
        slug: finalSlug,
        status: 'published',
        updatedAt: new Date().toISOString()
      };

      // 1. Lưu cục bộ trình duyệt
      saveInvitation(finalInvitation);

      // 2. Đồng bộ server API nếu có
      try {
        await fetch('/api/invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalInvitation)
        });
      } catch (err) {
        console.warn('Server sync error (using local):', err);
      }

      setPublishedUrl(fullUrl);
      setPublishSuccess(true);
      setCurrentStep(4);

      // Pháo hoa ăn mừng
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#890F0D', '#720000', '#D97706', '#F59E0B', '#E11D48']
      });

    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi xuất bản thiệp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // 1. Đang kiểm tra trạng thái đăng nhập (tránh nhấp nháy màn hình)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF8F8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#890F0D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#720000]">Đang xác thực thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  // 2. Bắt buộc đăng nhập Google mới cho phép chỉnh sửa template
  if (isAuthenticated === false) {
    const tmplParam = searchParams.get('template') || 'modern-crimson-spotlight';
    const tmplDisplayName = tmplParam === 'green-student' ? 'Green Student (Thanh Xuân)' : 'Modern Crimson Spotlight';

    return (
      <div className="min-h-screen bg-[#FAF8F8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#890F0D]/20 text-center space-y-5 animate-fade-in">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#720000] via-[#890F0D] to-[#B91C1C] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#890F0D]/25">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
              YÊU CẦU ĐĂNG NHẬP
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-2">
              Đăng Nhập Để Chỉnh Sửa Template
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-normal">
              Bạn đang chuẩn bị chỉnh sửa mẫu <strong className="text-[#890F0D] font-bold">"{tmplDisplayName}"</strong>. Vui lòng đăng nhập bằng Google để bảo vệ thiết kế và xuất bản link thiệp riêng của bạn.
            </p>
          </div>

          {/* Nút đăng nhập Google 1 chạm */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-5 rounded-2xl border-2 border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-stone-800 font-bold text-sm shadow-md flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>

          {/* Hoặc đăng nhập Gmail OTP (Giữ nguyên tham số template) */}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/builder?template=${tmplParam}`)}`}
              className="text-xs text-[#890F0D] hover:underline font-bold"
            >
              Hoặc đăng nhập bằng mã OTP qua Gmail →
            </Link>
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              ← Quay về trang chủ
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Navbar />

      {/* Builder Breadcrumb & Top Bar */}
      <div className="bg-white border-b border-[#890F0D]/10 py-3.5 px-4 sm:px-8 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-stone-500 hover:text-[#890F0D] p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
              title="Về trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-[#720000] flex items-center gap-2">
                <span>Trình Tạo Thiệp Mời Kỷ Yếu Online</span>
                <span className="text-[10px] font-black text-[#890F0D] bg-[#890F0D]/10 border border-[#890F0D]/20 px-2.5 py-0.5 rounded-full uppercase">
                  GP Studio99
                </span>
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Tạo thiệp kỷ yếu phong cách poster hiện đại & nhận link chia sẻ ngay lập tức
              </p>
            </div>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
            {[
              { num: 1, label: 'Poster & Tên' },
              { num: 2, label: 'Lịch Trình & Maps' },
              { num: 3, label: 'Trang Phục & Ảnh' },
              { num: 4, label: 'Xuất Bản' }
            ].map(step => (
              <button
                key={step.num}
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer ${currentStep === step.num
                    ? 'bg-[#890F0D] text-white shadow-sm'
                    : currentStep > step.num
                      ? 'bg-[#FEE2E2] text-[#720000]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border border-current">
                  {currentStep > step.num ? '✓' : step.num}
                </span>
                <span className="hidden md:inline">{step.label}</span>
              </button>
            ))}
          </div>

          {/* User Auth Badge & Sign Out */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate">{formData.creatorEmail || 'Google User'}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('gp_auth_user');
                }
                setIsAuthenticated(false);
              }}
              className="text-[11px] text-stone-400 hover:text-red-600 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Đăng xuất khỏi trình tạo thiệp"
            >
              Đăng xuất
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ========================================================= */}
          {/* LEFT COLUMN: CONTROLS & FORMS (lg:col-span-6)             */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#890F0D]/15 space-y-6">

            {/* ---------------------------------------------------- */}
            {/* BƯỚC 1: ẢNH CHÂN DUNG & POSTER KỶ YẾU               */}
            {/* ---------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full">
                    BƯỚC 1 / 4
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 mt-2">Ảnh Chân Dung & Tên Trên Poster</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Thiết kế chuẩn phong cách Poster đỏ Crimson: ảnh cử nhân ở giữa, tên nghệ thuật nổi bật hai bên.
                  </p>
                </div>

                {/* Upload Ảnh chân dung trung tâm Poster */}
                <div className="p-4 rounded-2xl bg-[#FFF8F8] border-2 border-dashed border-[#890F0D]/20 space-y-3">
                  <label className="block text-xs font-extrabold text-[#720000] uppercase tracking-wide">
                    📸 1. Ảnh chân dung của bạn trên Poster
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-28 rounded-xl overflow-hidden border-2 border-[#890F0D] bg-stone-200 shrink-0 shadow-md">
                      <img
                        src={formData.avatarPhoto || '/images/poster-reference.jpg'}
                        alt="Chân dung"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#890F0D] hover:bg-[#720000] text-white text-xs font-bold shadow-sm cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Tải ảnh của bạn lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Nên dùng ảnh chụp áo cử nhân, áo dài hoặc ảnh chân dung góc đứng. Dung lượng tối đa 8MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tên chia 2 bên Poster */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-[#720000] uppercase tracking-wide">
                    ✏️ 2. Tên hiển thị hai bên ảnh Poster
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-1 font-bold">Tên bên trái (VD: HOÀNG)</span>
                      <input
                        type="text"
                        value={formData.namePart1 || 'HOÀNG'}
                        onChange={e => {
                          const val = e.target.value.toUpperCase();
                          setFormData(prev => ({
                            ...prev,
                            namePart1: val,
                            studentName: `${val} ${prev.namePart2 || 'NGỌC'}`
                          }));
                        }}
                        placeholder="VD: HOÀNG"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-extrabold text-[#720000] focus:ring-2 focus:ring-[#890F0D] outline-none uppercase"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-600 block mb-1 font-bold">Tên bên phải (VD: NGỌC)</span>
                      <input
                        type="text"
                        value={formData.namePart2 || 'NGỌC'}
                        onChange={e => {
                          const val = e.target.value.toUpperCase();
                          setFormData(prev => ({
                            ...prev,
                            namePart2: val,
                            studentName: `${prev.namePart1 || 'HOÀNG'} ${val}`
                          }));
                        }}
                        placeholder="VD: NGỌC"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-extrabold text-[#720000] focus:ring-2 focus:ring-[#890F0D] outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Lời chào & Tên khách mời */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <label className="block text-xs font-extrabold text-[#720000] uppercase tracking-wide">
                    💌 3. Lời chào & Khách mời trên Poster
                  </label>
                  <div>
                    <span className="text-[11px] text-stone-600 block mb-1 font-bold">Tên người nhận thiệp (hoặc nhóm bạn):</span>
                    <input
                      type="text"
                      value={formData.guestName || 'Mỹ Linh'}
                      onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="VD: Mỹ Linh / Bạn thân mến / Cả nhà mình"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold text-stone-800 focus:ring-2 focus:ring-[#890F0D] outline-none"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Hiển thị theo nét chữ viết tay mềm mại trên đường gạch nét đứt của Poster.
                    </p>
                  </div>
                </div>

                {/* Trường học & Niên khóa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Tên trường *</label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          schoolName: val,
                          googleMapsUrl: generateGoogleMapsUrl(val || prev.shootLocation)
                        }));
                      }}
                      placeholder="VD: TRƯỜNG ĐẠI HỌC ĐÔNG Á"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Niên khóa *</label>
                    <input
                      type="text"
                      value={formData.schoolYear}
                      onChange={e => setFormData({ ...formData, schoolYear: e.target.value })}
                      placeholder="VD: 2023 - 2027"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#890F0D] hover:bg-[#720000] shadow-md flex items-center gap-2"
                  >
                    <span>Tiếp tục: Lịch trình & Địa điểm</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* BƯỚC 2: THỜI GIAN, ĐỊA ĐIỂM & LỊCH TRÌNH (TIMELINE)  */}
            {/* ---------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full">
                    BƯỚC 2 / 4
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 mt-2">Thời Gian & Lịch Trình Buổi Chụp</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Cập nhật ngày giờ, địa điểm Google Maps và các mốc thời gian chi tiết trong ngày chụp.
                  </p>
                </div>

                {/* Ngày & Giờ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Ngày chụp *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-[#720000] focus:ring-2 focus:ring-[#890F0D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Giờ bắt đầu *</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Giờ kết thúc</label>
                    <input
                      type="time"
                      value={formData.endTime || '18:00'}
                      onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Địa điểm & Tự động tạo Link Google Maps */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Địa điểm chụp ảnh / Địa chỉ chi tiết *
                  </label>
                  <input
                    type="text"
                    value={formData.shootLocation}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        shootLocation: val,
                        googleMapsUrl: generateGoogleMapsUrl(prev.schoolName || val)
                      }));
                    }}
                    placeholder="VD: 14 ngõ 23 đường Hồng Bàng, quận 3, thành phố Hồ Chí Minh"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none"
                  />

                  {/* Google Maps Link preview */}
                  <div className="p-3 bg-[#FFF8F8] rounded-xl border border-[#890F0D]/20 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#890F0D] font-bold truncate">
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{formData.googleMapsUrl}</span>
                    </div>
                    {formData.googleMapsUrl && (
                      <a
                        href={formData.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-[#890F0D] underline shrink-0 ml-2"
                      >
                        Mở thử
                      </a>
                    )}
                  </div>
                </div>

                {/* Khung giờ đón bạn bè */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Khung giờ đón bạn bè & người thân chụp ảnh giao lưu:
                  </label>
                  <input
                    type="text"
                    value={formData.friendPhotoTime || ''}
                    onChange={e => setFormData({ ...formData, friendPhotoTime: e.target.value })}
                    placeholder="VD: 14:00 - 16:30 (Đón bạn bè chụp ảnh kỷ niệm)"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-[#720000] focus:ring-2 focus:ring-[#890F0D] outline-none"
                  />
                </div>

                {/* Timeline Lịch trình chi tiết */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold text-[#720000] uppercase tracking-wide flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#890F0D]" />
                        <span>Timeline Lịch trình trong ngày</span>
                      </h3>
                      <p className="text-[11px] text-stone-500">Các mốc giờ hoạt động chụp ảnh</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#890F0D]/10 hover:bg-[#890F0D]/20 text-[#890F0D] text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm mốc giờ</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {(formData.timeline || []).map((item, index) => (
                      <div key={item.id || index} className="p-3 bg-[#FFF8F8] rounded-xl border border-[#890F0D]/15 text-xs space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={item.time}
                            onChange={e => handleUpdateTimelineItem(item.id, 'time', e.target.value)}
                            placeholder="Khung giờ (VD: 13:00 - 14:00)"
                            className="w-36 px-2 py-1 rounded bg-white border border-stone-300 font-bold text-[#890F0D]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTimelineItem(item.id)}
                            className="text-stone-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => handleUpdateTimelineItem(item.id, 'title', e.target.value)}
                          placeholder="Hoạt động (VD: Tập trung & Chụp trang phục cử nhân)"
                          className="w-full px-2 py-1 rounded bg-white border border-stone-300 font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Quay lại Poster</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#890F0D] hover:bg-[#720000] shadow-md flex items-center gap-2"
                  >
                    <span>Tiếp tục: Trang phục & Album ảnh</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* BƯỚC 3: TRANG PHỤC, LỜI MỜI & ALBUM ẢNH             */}
            {/* ---------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full">
                    BƯỚC 3 / 4
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 mt-2">Trang Phục, Lời Mời & Album Ảnh</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Gợi ý trang phục cho bạn bè khi đến chơi, gửi thông điệp thanh xuân và thêm ảnh vào bộ sưu tập.
                  </p>
                </div>

                {/* Trang phục gợi ý */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    👗 Gợi ý trang phục (Dress Code)
                  </label>
                  <input
                    type="text"
                    value={formData.dressCode}
                    onChange={e => setFormData({ ...formData, dressCode: e.target.value })}
                    placeholder="VD: Tone màu trắng, be hoặc trang phục tự do nhẹ nhàng, thanh lịch để chụp ảnh kỷ niệm nhé!"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none"
                  />
                </div>

                {/* Lời mời tham gia */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    💌 Lời chào đầu & Lời mời gửi bạn bè
                  </label>
                  <textarea
                    rows={3}
                    value={formData.inviteMessage}
                    onChange={e => setFormData({ ...formData, inviteMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Thêm ảnh vào Album ảnh kỷ niệm */}
                <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#890F0D]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#720000] uppercase tracking-wide flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#890F0D]" />
                        <span>Album ảnh kỷ niệm ({formData.gallery?.length || 0} ảnh)</span>
                      </h4>
                      <p className="text-[11px] text-stone-500">Thêm ảnh cá nhân hoặc ảnh tập thể lớp</p>
                    </div>

                    <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#890F0D] text-white text-xs font-bold shadow-xs cursor-pointer hover:bg-[#720000] transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryUpload}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(formData.gallery || []).slice(0, 4).map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-[#890F0D]/20 bg-stone-100">
                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bật tắt các tính năng tương tác */}
                <div className="pt-4 border-t border-stone-100">
                  <label className="block text-xs font-extrabold text-[#720000] uppercase tracking-wide mb-2">
                    ⚙️ Bật/Tắt các thành phần trên thiệp
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                      <input
                        type="checkbox"
                        checked={formData.componentsVisible.showCountdown}
                        onChange={e => setFormData({
                          ...formData,
                          componentsVisible: { ...formData.componentsVisible, showCountdown: e.target.checked }
                        })}
                        className="rounded text-[#890F0D] w-4 h-4"
                      />
                      <span>Đồng hồ đếm ngược</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                      <input
                        type="checkbox"
                        checked={formData.componentsVisible.showWishes}
                        onChange={e => setFormData({
                          ...formData,
                          componentsVisible: { ...formData.componentsVisible, showWishes: e.target.checked }
                        })}
                        className="rounded text-[#890F0D] w-4 h-4"
                      />
                      <span>Sổ lưu bút lời chúc</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                      <input
                        type="checkbox"
                        checked={formData.componentsVisible.showRSVP}
                        onChange={e => setFormData({
                          ...formData,
                          componentsVisible: { ...formData.componentsVisible, showRSVP: e.target.checked }
                        })}
                        className="rounded text-[#890F0D] w-4 h-4"
                      />
                      <span>Xác nhận tham gia RSVP</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                      <input
                        type="checkbox"
                        checked={formData.componentsVisible.showMusic}
                        onChange={e => setFormData({
                          ...formData,
                          componentsVisible: { ...formData.componentsVisible, showMusic: e.target.checked }
                        })}
                        className="rounded text-[#890F0D] w-4 h-4"
                      />
                      <span>Nhạc thanh xuân</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Quay lại lịch trình</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#890F0D] hover:bg-[#720000] shadow-md flex items-center gap-2"
                  >
                    <span>Tiếp tục: Xuất bản thiệp</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* BƯỚC 4: XEM TRƯỚC VÀ XUẤT BẢN (KHÔNG CẦN GMAIL)     */}
            {/* ---------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full">
                    BƯỚC 4 / 4 – HOÀN TẤT
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 mt-2">Xuất Bản & Nhận Đường Link Thiệp</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Bấm xuất bản để nhận ngay đường link chia sẻ thiệp cho bạn bè và người thân mà không cần xác nhận email!
                  </p>
                </div>

                {publishSuccess ? (
                  <div className="bg-[#FFF8F8] border-2 border-[#890F0D]/30 rounded-3xl p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#890F0D] text-white flex items-center justify-center mx-auto text-3xl shadow-lg">
                      ✓
                    </div>
                    <h3 className="text-xl font-black text-[#720000]">
                      Xuất Bản Thiệp Mời Kỷ Yếu Thành Công! 🎉
                    </h3>
                    <p className="text-xs text-stone-700">
                      Đường link thiệp kỷ yếu của bạn đã được khởi tạo và sẵn sàng gửi đến bạn bè, thầy cô và người thân:
                    </p>

                    <div className="p-3.5 bg-white rounded-2xl border border-[#890F0D]/20 text-xs font-mono text-[#720000] break-all select-all font-bold flex items-center justify-between gap-2 shadow-xs">
                      <span className="truncate">{publishedUrl}</span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 rounded-lg bg-[#890F0D] text-white text-[11px] font-bold shrink-0 hover:bg-[#720000] transition-colors"
                      >
                        {copiedLink ? 'Đã chép!' : 'Sao chép'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center pt-2">
                      <button
                        type="button"
                        onClick={() => setShareModalOpen(true)}
                        className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#890F0D] hover:bg-[#720000] shadow-md flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Chia sẻ Zalo / Messenger / Facebook</span>
                      </button>

                      <a
                        href={publishedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-xl font-bold text-xs text-[#720000] bg-white border border-[#890F0D]/30 hover:bg-[#FFF5F5] flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-[#890F0D]" />
                        <span>Mở trang thiệp trực tiếp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#890F0D]/15 space-y-2 text-xs">
                      <p className="font-bold text-[#720000]">📋 Tóm tắt thiệp của bạn:</p>
                      <p>• <strong>Học sinh:</strong> {formData.studentName || 'HOÀNG NGỌC'}</p>
                      <p>• <strong>Trường & Lớp:</strong> {formData.schoolName} ({formData.schoolYear})</p>
                      <p>• <strong>Thời gian:</strong> {formData.date} ({formData.startTime} - {formData.endTime || '18:00'})</p>
                      <p>• <strong>Địa điểm:</strong> {formData.shootLocation}</p>
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="px-4 py-3 rounded-xl font-bold text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Chỉnh sửa thêm</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePublish()}
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#720000] hover:opacity-95 shadow-xl shadow-[#890F0D]/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Đang xuất bản...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>XUẤT BẢN & LẤY LINK THIỆP NGAY</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: REAL-TIME PREVIEW PANEL (lg:col-span-6)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 lg:sticky lg:top-36 space-y-4">

            {/* Preview Toolbar */}
            <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#890F0D]/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-800">Xem trước thiệp thời gian thực</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${devicePreview === 'mobile' ? 'bg-[#FEE2E2] text-[#720000]' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  title="Giao diện điện thoại"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${devicePreview === 'desktop' ? 'bg-[#FEE2E2] text-[#720000]' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  title="Giao diện máy tính"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Preview Container */}
            <div className="flex justify-center bg-stone-100/70 p-4 rounded-3xl border border-stone-200 min-h-[620px] max-h-[820px] overflow-y-auto">
              <div
                className={`transition-all duration-300 ${devicePreview === 'mobile'
                    ? 'w-full max-w-[420px] bg-transparent'
                    : 'w-full max-w-[580px] bg-transparent'
                  }`}
              >
                <InvitationCard
                  data={formData}
                  isInteractive={true}
                  onUpdate={(partial) => setFormData(prev => ({ ...prev, ...partial }))}
                  cardRef={cardRef}
                />
              </div>
            </div>

            <p className="text-center text-[11px] text-stone-400">
              💡 Bấm trực tiếp vào ảnh hoặc tên trên Poster ở khung xem trước để chỉnh sửa nhanh.
            </p>

          </div>

        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={publishedUrl}
        title={formData.title}
        className={formData.className}
      />

      <Footer />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#890F0D] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
