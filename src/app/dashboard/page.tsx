'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { InvitationData, InvitationRecipient } from '@/types/invitation';
import { getStoredInvitations, deleteInvitation, saveInvitation } from '@/lib/storage';
import RecipientManager from '@/components/RecipientManager';
import { SAMPLE_INVITATION } from '@/data/templates';
import {
  User, LogOut, PlusCircle, Eye, Share2, Copy, Check,
  Trash2, Edit3, Heart, MessageSquareHeart, Sparkles,
  Calendar, MapPin, Clock, Camera, ExternalLink, ArrowRight
} from 'lucide-react';

export default function UserDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ email: string; token?: string } | null>(null);
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationData | null>(null);

  // Kiểm tra trạng thái đăng nhập và tải đúng danh sách thiệp của người dùng
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gp_auth_user');
      let userEmail = '';
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user?.email) {
            setCurrentUser(user);
            userEmail = user.email.trim().toLowerCase();
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!userEmail) {
        setInvitations([]);
        setSelectedInvitation(null);
        return;
      }

      const fetchUserInvs = async (email: string) => {
        let remoteList: InvitationData[] = [];
        try {
          const res = await fetch(`/api/invitations?email=${encodeURIComponent(email)}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              remoteList = data;
            }
          }
        } catch (err) {
          console.warn('Lỗi tải thiệp từ máy chủ:', err);
        }

        // Lấy từ localStorage và lọc những thiệp thuộc về tài khoản này (hoặc chưa gắn creatorEmail trên cùng máy)
        const localList = getStoredInvitations();
        const userLocal = localList.filter(
          item => item && (!item.creatorEmail || item.creatorEmail.trim().toLowerCase() === email)
        );

        // Hợp nhất dữ liệu tránh trùng lặp
        const map = new Map<string, InvitationData>();
        remoteList.forEach(item => map.set(item.id || item.slug, item));
        userLocal.forEach(item => {
          const key = item.id || item.slug;
          if (!map.has(key)) {
            map.set(key, { ...item, creatorEmail: email });
          }
        });
        const merged = Array.from(map.values());

        setInvitations(merged);
        setSelectedInvitation(merged.length > 0 ? merged[0] : null);
      };

      fetchUserInvs(userEmail);
    }
  }, []);

  // Cập nhật danh sách người nhận thiệp riêng
  const handleUpdateRecipients = async (newRecipients: InvitationRecipient[]) => {
    if (!selectedInvitation) return;
    const updated: InvitationData = {
      ...selectedInvitation,
      recipients: newRecipients,
      updatedAt: new Date().toISOString()
    };
    setSelectedInvitation(updated);
    setInvitations(prev => prev.map(inv => (inv.id === updated.id || inv.slug === updated.slug) ? updated : inv));
    saveInvitation(updated);

    try {
      await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Lỗi đồng bộ danh sách người nhận lên server:', err);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gp_auth_user');
      window.location.href = '/'; // Ép tải lại trang mới
    }
  };

  // Sao chép link thiệp
  const handleCopyLink = (slug: string) => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin || process.env.NEXT_PUBLIC_APP_URL || 'https://taothiepkyyeugp99.io.vn';
      const url = `${baseUrl}/thiep-moi/${slug}`;
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  // Xóa thiệp
  const handleDelete = (id: string, slug: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thiệp mời này không?')) {
      deleteInvitation(id);
      const updated = invitations.filter(inv => inv.id !== id && inv.slug !== slug);
      setInvitations(updated);
      if (selectedInvitation?.id === id) {
        setSelectedInvitation(updated[0] || null);
      }
    }
  };

  // Nếu chưa đăng nhập, hiển thị màn hình yêu cầu đăng nhập
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#890F0D]/15 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF5F5] text-[#890F0D] flex items-center justify-center mx-auto border border-[#890F0D]/20">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900">Vui Lòng Đăng Nhập</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bạn cần xác thực Gmail để truy cập vào Trình Quản Lý Thiệp cá nhân và theo dõi danh sách khách mời.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#720000] to-[#890F0D] shadow-md flex items-center justify-center gap-2"
              >
                <span>Đăng nhập bằng Gmail OTP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Tính toán số liệu thống kê
  const totalViews = invitations.reduce((sum, inv) => sum + (inv.views || 0), 0);
  const totalRsvps = invitations.reduce((sum, inv) => sum + (inv.rsvps?.length || 0), 0);
  const totalWishes = invitations.reduce((sum, inv) => sum + (inv.wishes?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Navbar />

      {/* User Header Bar */}
      <div className="bg-white border-b border-[#890F0D]/10 py-5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-2.5 py-0.5 rounded-full border border-[#890F0D]/20">
                TÀI KHOẢN ĐÃ XÁC THỰC
              </span>
              <span className="text-xs text-stone-400">• GP Studio99</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Trình Quản Lý Thiệp Kỷ Yếu Cá Nhân
            </h1>
            <p className="text-xs text-stone-500">
              Đang quản lý tài khoản: <strong className="text-[#890F0D]">{currentUser.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/builder"
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#720000] to-[#890F0D] hover:opacity-95 shadow-md flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo thiệp mới</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl font-bold text-xs text-stone-600 bg-stone-100 hover:bg-red-50 hover:text-red-600 border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Đăng xuất khỏi tài khoản"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#890F0D]/15 shadow-sm">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block">
              Tổng thiệp đã tạo
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#720000] mt-1 block">
              {invitations.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#890F0D]/15 shadow-sm">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block">
              Lượt xem thiệp
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#890F0D] mt-1 block">
              {totalViews}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#890F0D]/15 shadow-sm">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block">
              Khách xác nhận tham gia
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
              {totalRsvps}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#890F0D]/15 shadow-sm">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block">
              Lời chúc thanh xuân
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
              {totalWishes}
            </span>
          </div>
        </div>

        {/* Content Columns: List of Invitations & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Danh sách thiệp */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span>Thiệp Mời Của Bạn</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#890F0D]/10 text-[#890F0D] font-bold">
                  {invitations.length}
                </span>
              </h2>
            </div>

            <div className="space-y-3">
              {invitations.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-[#890F0D]/15 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] text-[#890F0D] flex items-center justify-center mx-auto border border-[#890F0D]/20">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm">Bạn chưa tạo thiệp kỷ yếu nào</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                      Hãy tạo ngay chiếc thiệp mời cá nhân đầu tiên để gửi cho bạn bè và lưu giữ thanh xuân!
                    </p>
                  </div>
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#720000] to-[#890F0D] hover:opacity-95 shadow-md transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tạo thiệp đầu tiên của bạn</span>
                  </Link>
                </div>
              ) : (
                invitations.map((inv) => {
                  const isSelected = selectedInvitation?.id === inv.id;
                  return (
                    <div
                      key={inv.id}
                      onClick={() => setSelectedInvitation(inv)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${isSelected
                          ? 'border-[#890F0D] bg-[#FFF8F8] shadow-md ring-2 ring-[#890F0D]/15'
                          : 'border-stone-200 bg-white hover:border-[#890F0D]/30 hover:bg-stone-50'
                        }`}
                    >
                      <div className="flex gap-3.5 items-center">
                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-200 border border-[#890F0D]/20 shrink-0 shadow-xs">
                          <img
                            src={inv.avatarPhoto || '/images/poster-reference.jpg'}
                            alt={inv.studentName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#890F0D]/10 text-[#890F0D] uppercase">
                              {inv.className || 'Kỷ yếu'}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {inv.date}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-sm text-[#720000] truncate">
                            {inv.studentName || 'Chưa đặt tên'}
                          </h3>
                          <p className="text-xs text-stone-600 truncate font-medium">
                            {inv.schoolName}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons on card */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/thiep-moi/${inv.slug}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#890F0D] bg-white border border-[#890F0D]/20 hover:bg-[#FFF5F5] flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Xem</span>
                          </Link>

                          <Link
                            href={`/builder?slug=${inv.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Sửa</span>
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(inv.slug);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 flex items-center gap-1"
                          >
                            {copiedSlug === inv.slug ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSlug === inv.slug ? 'Đã chép' : 'Link'}</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(inv.id, inv.slug);
                          }}
                          className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                          title="Xóa thiệp này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chi tiết thiệp được chọn (Khách mời & Lời chúc) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#890F0D]/15 space-y-6">
            {selectedInvitation ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#890F0D]/10">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#890F0D]">
                      CHI TIẾT THIỆP MỜI
                    </span>
                    <h3 className="text-xl font-black text-stone-900 mt-0.5">
                      {selectedInvitation.studentName} – {selectedInvitation.schoolName}
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/builder?slug=${selectedInvitation.slug}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Chỉnh sửa thiệp</span>
                    </Link>
                    <Link
                      href={`/thiep-moi/${selectedInvitation.slug}`}
                      target="_blank"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#890F0D] hover:bg-[#720000] shadow-sm flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở trang thiệp</span>
                    </Link>
                  </div>
                </div>

                {/* 1. QUẢN LÝ DANH SÁCH NGƯỜI NHẬN & LINK MỜI RIÊNG TỪNG NGƯỜI */}
                <RecipientManager
                  invitationSlug={selectedInvitation.slug}
                  recipients={selectedInvitation.recipients || []}
                  onUpdateRecipients={handleUpdateRecipients}
                  studentName={selectedInvitation.studentName}
                />

                {/* 2. Sổ lưu bút Lời chúc từ bạn bè (Riêng tư - chỉ chủ thiệp thấy) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-[#720000] uppercase tracking-wide flex items-center gap-1.5">
                      <MessageSquareHeart className="w-4 h-4 text-[#890F0D]" />
                      <span>Lời chúc từ bạn bè ({selectedInvitation.wishes?.length || 0})</span>
                    </h4>
                  </div>

                  {(!selectedInvitation.wishes || selectedInvitation.wishes.length === 0) ? (
                    <div className="p-6 bg-[#FFF8F8] rounded-2xl border border-[#890F0D]/10 text-center text-xs text-stone-400">
                      Chưa có lời chúc nào được gửi cho thiệp này.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {selectedInvitation.wishes.map((w, i) => (
                        <div key={w.id || i} className="p-3 bg-[#FFF8F8] rounded-xl border border-[#890F0D]/10 text-xs">
                          <div className="flex items-center justify-between font-bold text-[#720000] mb-1">
                            <span>{w.senderName} ({w.relation || 'Bạn bè'})</span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : ''}
                            </span>
                          </div>
                          <p className="text-stone-700 leading-relaxed font-medium">"{w.message}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Danh sách bạn bè xác nhận tham gia (RSVP) */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-[#720000] uppercase tracking-wide flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-[#890F0D]" />
                      <span>Bạn bè xác nhận tham gia RSVP ({selectedInvitation.rsvps?.length || 0})</span>
                    </h4>
                  </div>

                  {(!selectedInvitation.rsvps || selectedInvitation.rsvps.length === 0) ? (
                    <div className="p-6 bg-[#FFF8F8] rounded-2xl border border-[#890F0D]/10 text-center text-xs text-stone-400">
                      Chưa có phản hồi tham dự nào. Hãy gửi link thiệp cho bạn bè nhé!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {selectedInvitation.rsvps.map((r, i) => (
                        <div key={r.id || i} className="p-3 rounded-xl border border-stone-200 bg-white flex items-center justify-between text-xs">
                          <div>
                            <span className="font-extrabold text-stone-900 block">{r.guestName}</span>
                            <span className="text-[11px] text-stone-500">{r.relation} • {r.message}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Chắc chắn đến ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-stone-400 text-sm">
                Chọn một thiệp bên danh sách để xem chi tiết.
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
