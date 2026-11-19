'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { InvitationData, RSVP } from '@/types/invitation';
import { LeadData, LeadStatus } from '@/types/lead';
import {
  Shield, Search, Eye, Trash2, CheckCircle2, Phone,
  Sparkles, ExternalLink, AlertCircle, User,
  Gift, MessageCircle, RefreshCw, LogOut, Database,
  Calendar, Users, HardDrive, Check, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface DbUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: string;
  createdAt: string;
  lastLogin: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'invitations' | 'users' | 'database'>('leads');

  // Leads (Khách có nhu cầu dịch vụ chụp kỷ yếu)
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Invitations (Thiệp kỷ yếu thực tế đã tạo)
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationData | null>(null);
  const [loadingInvitations, setLoadingInvitations] = useState(false);

  // Users trong cơ sở dữ liệu
  const [users, setUsers] = useState<DbUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [expiredOtpCount, setExpiredOtpCount] = useState(0);

  // Load toàn bộ dữ liệu từ Database PostgreSQL thực tế
  useEffect(() => {
    loadLeads();
    loadInvitations();
    loadUsers();
  }, []);

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách khách hàng:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const loadInvitations = async () => {
    setLoadingInvitations(true);
    try {
      const res = await fetch('/api/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Lỗi tải thiệp từ database:', err);
      setInvitations([]);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setExpiredOtpCount(data.expiredOtpCount || 0);
      }
    } catch (err) {
      console.error('Lỗi tải người dùng:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Cập nhật trạng thái chăm sóc khách
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  // Xóa khách hàng để tránh tràn database
  const handleDeleteLead = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này khỏi cơ sở dữ liệu?')) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error('Lỗi xóa khách hàng:', err);
    }
  };

  // Xóa thiệp mời khỏi database
  const handleDeleteInvitation = async (id: string, slug?: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thiệp mời này khỏi cơ sở dữ liệu?')) return;
    try {
      await fetch(`/api/invitations/${slug || id}`, { method: 'DELETE' });
      setInvitations(prev => prev.filter(item => item.id !== id && item.slug !== slug));
      if (selectedInvitation?.id === id) setSelectedInvitation(null);
    } catch (err) {
      console.error('Lỗi xóa thiệp:', err);
    }
  };

  // Xóa tài khoản test
  const handleDeleteUser = async (email: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.email !== email));
      }
    } catch (err) {
      console.error('Lỗi xóa người dùng:', err);
    }
  };

  // Dọn dẹp mã OTP hết hạn
  const handlePurgeOtps = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purge-otps' })
      });
      const data = await res.json();
      alert(data.message || 'Đã dọn dẹp mã OTP thành công!');
      loadUsers();
    } catch (err) {
      console.error('Lỗi dọn OTP:', err);
    }
  };

  // Lọc Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.fullName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      l.schoolClass.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.region.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (l.notes && l.notes.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.discountCode && l.discountCode.toLowerCase().includes(leadSearch.toLowerCase()));

    const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Lọc Invitations
  const filteredInvitations = invitations.filter(inv => {
    const studentName = inv.studentName || inv.senderName || '';
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.creatorEmail && inv.creatorEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Lọc Users
  const filteredUsers = users.filter(u => {
    const term = userSearch.toLowerCase();
    return u.email.toLowerCase().includes(term) || (u.name && u.name.toLowerCase().includes(term));
  });

  // Thống kê Leads
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const contactedLeadsCount = leads.filter(l => l.status === 'contacted').length;
  const closedLeadsCount = leads.filter(l => l.status === 'closed').length;

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Navbar />

      {/* Admin Top Header */}
      <div className="bg-[#240303] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#890F0D] flex items-center justify-center text-white shadow-md">
                <Shield className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                BẢNG QUẢN TRỊ KỶ YẾU GP STUDIO99
              </h1>
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center gap-2">
              <span>Hệ thống quản lý khách hàng có nhu cầu chụp kỷ yếu • chupanhdanang.com</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Postgres Realtime</span>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/builder"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#890F0D] hover:bg-[#720000] shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>+ Tạo thiệp mới</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-3 py-2 rounded-xl text-xs font-bold text-stone-200 hover:text-white bg-white/10 hover:bg-rose-950/60 border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Đăng xuất quyền quản trị"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thẻ Thống Kê Nhu Cầu Chụp Kỷ Yếu Thực Tế (Real Data) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1: Khách mới cần gọi */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-rose-200 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Khách mới chưa gọi
              </span>
              {newLeadsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              )}
            </div>
            <span className="text-2xl sm:text-3xl font-black text-rose-700 mt-1 block">
              {newLeadsCount}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Ưu tiên gọi ngay trong 15p</span>
          </div>

          {/* Card 2: Tổng khách đăng ký ưu đãi 10% */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-[#890F0D]/15">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Tổng nhu cầu chụp kỷ yếu
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#720000] mt-1 block">
              {leads.length}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Khách để lại liên hệ tư vấn</span>
          </div>

          {/* Card 3: Đã chốt hợp đồng */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Đã chốt hợp đồng chụp
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
              {closedLeadsCount}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              {leads.length > 0 ? `${Math.round((closedLeadsCount / leads.length) * 100)}% tỷ lệ chuyển đổi` : 'Chờ chốt lớp đầu tiên'}
            </span>
          </div>

          {/* Card 4: Số thiệp thật đã tạo */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-200">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              Thiệp kỷ yếu thật đã tạo
            </span>
            <span className="text-2xl sm:text-3xl font-black text-blue-900 mt-1 block">
              {invitations.length}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Lưu trữ tối ưu trong Postgres</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        <div className="flex items-center gap-2 border-b border-[#890F0D]/15 pb-3 overflow-x-auto text-xs font-bold">
          {/* Tab 1: Khách Nhu Cầu Chụp Kỷ Yếu */}
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#890F0D] text-white shadow-md'
                : 'bg-white text-stone-700 hover:bg-[#FFF8F8] border border-stone-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Khách Nhu Cầu Chụp Kỷ Yếu ({leads.length})</span>
            {newLeadsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                {newLeadsCount} mới
              </span>
            )}
          </button>

          {/* Tab 2: Quản lý Thiệp Đã Tạo */}
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'invitations'
                ? 'bg-[#890F0D] text-white shadow-md'
                : 'bg-white text-stone-700 hover:bg-[#FFF8F8] border border-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Thiệp Kỷ Yếu Thực Tế ({invitations.length})</span>
          </button>

          {/* Tab 3: Quản lý Tài khoản Users */}
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#890F0D] text-white shadow-md'
                : 'bg-white text-stone-700 hover:bg-[#FFF8F8] border border-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tài Khoản Người Dùng ({users.length})</span>
          </button>

          {/* Tab 4: Tối ưu & Dọn dẹp Database */}
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-[#890F0D] text-white shadow-md'
                : 'bg-white text-stone-700 hover:bg-[#FFF8F8] border border-stone-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tối Ưu Database (Chống Tràn)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">

        {/* ========================================================= */}
        {/* TAB 1: KHÁCH HÀNG CÓ NHU CẦU CHỤP KỶ YẾU (TRỌNG TÂM SỐ 1) */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-5 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#890F0D]/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-[#FFF8F8] px-3 py-2 rounded-xl border border-[#890F0D]/20 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#890F0D] shrink-0" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Tìm theo họ tên, SĐT, trường lớp, khu vực..."
                  className="bg-transparent text-xs text-[#720000] font-medium outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                <span className="text-gray-400">Trạng thái:</span>
                {(['all', 'new', 'contacted', 'closed'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      leadStatusFilter === st
                        ? 'bg-[#890F0D] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'Tất cả'
                      : st === 'new'
                        ? `🔴 Chưa gọi (${newLeadsCount})`
                        : st === 'contacted'
                          ? `🟡 Đang tư vấn (${contactedLeadsCount})`
                          : `🟢 Đã chốt (${closedLeadsCount})`}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={loadLeads}
                  disabled={loadingLeads}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  title="Tải lại từ PostgreSQL"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin text-[#890F0D]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl shadow-md border border-[#890F0D]/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF8F8] border-b border-[#890F0D]/15 text-[#720000] font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Khách hàng / SĐT</th>
                      <th className="p-4">Trường – Lớp</th>
                      <th className="p-4">Sĩ số & Khu vực</th>
                      <th className="p-4">Dự kiến chụp</th>
                      <th className="p-4">Nhu cầu & Concept</th>
                      <th className="p-4">Mã ưu đãi</th>
                      <th className="p-4">Trạng thái tư vấn</th>
                      <th className="p-4 text-right">Gọi / Zalo / Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-10 text-center text-stone-400">
                          {leads.length === 0
                            ? 'Chưa có yêu cầu tư vấn chụp kỷ yếu nào trong database PostgreSQL.'
                            : 'Không tìm thấy khách hàng nào khớp với điều kiện lọc.'}
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-[#FFFDFD] transition-colors">
                          {/* Khách hàng */}
                          <td className="p-4">
                            <span className="font-extrabold text-stone-900 block text-xs sm:text-sm">
                              {lead.fullName}
                            </span>
                            <span className="font-mono text-stone-600 font-semibold text-[11px] block mt-0.5">
                              {lead.phone}
                            </span>
                          </td>

                          {/* Trường – Lớp */}
                          <td className="p-4 font-semibold text-stone-800">
                            {lead.schoolClass}
                          </td>

                          {/* Sĩ số & Khu vực */}
                          <td className="p-4">
                            <span className="font-bold text-stone-800 block">
                              {lead.region || 'Đà Nẵng'}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {lead.studentCount ? `Sĩ số: ${lead.studentCount} bạn` : 'Chưa rõ sĩ số'}
                            </span>
                          </td>

                          {/* Dự kiến chụp */}
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-bold text-[11px]">
                              {lead.expectedMonth || 'Chưa rõ'}
                            </span>
                            <span className="block text-[10px] text-gray-400 mt-1 font-mono">
                              {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </td>

                          {/* Ghi chú concept */}
                          <td className="p-4 max-w-xs">
                            {lead.notes ? (
                              <p className="text-[11px] text-stone-600 line-clamp-2 italic" title={lead.notes}>
                                "{lead.notes}"
                              </p>
                            ) : (
                              <span className="text-gray-300 text-[11px]">Không có</span>
                            )}
                          </td>

                          {/* Mã ưu đãi */}
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-md bg-[#FFF0F3] border border-[#F8BBD0] text-[#890F0D] font-mono text-[10px] font-bold">
                              {lead.discountCode || 'GPKY10-XUAN2026'}
                            </span>
                          </td>

                          {/* Trạng thái dropdown tương tác */}
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={e => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors outline-none cursor-pointer ${
                                lead.status === 'new'
                                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                                  : lead.status === 'contacted'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <option value="new">🔴 Chưa gọi (Mới)</option>
                              <option value="contacted">🟡 Đang tư vấn</option>
                              <option value="closed">🟢 Đã chốt chụp</option>
                            </select>
                          </td>

                          {/* Liên hệ nhanh & Xóa */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                                className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-[#890F0D] shadow-2xs transition-colors"
                                title={`Gọi ngay ${lead.phone}`}
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://zalo.me/${lead.phone.replace(/\s+/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-[#0068FF] hover:bg-blue-700 text-white shadow-2xs transition-colors"
                                title="Nhắn tin Zalo trực tiếp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-colors cursor-pointer"
                                title="Xóa khách hàng này (dọn dẹp database)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: QUẢN LÝ THIỆP KỶ YẾU ĐÃ TẠO (REAL DATA)            */}
        {/* ========================================================= */}
        {activeTab === 'invitations' && (
          <div className="space-y-5 animate-fade-in">
            {/* Filter toolbar */}
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#890F0D]/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-[#FFF8F8] px-3 py-2 rounded-xl border border-[#890F0D]/20 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#890F0D] shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên học sinh, lớp, trường hoặc Gmail..."
                  className="bg-transparent text-xs text-[#720000] font-medium outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-gray-400">Trạng thái:</span>
                {(['all', 'published', 'draft'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg uppercase text-[11px] font-bold cursor-pointer ${
                      statusFilter === st ? 'bg-[#890F0D] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' ? 'Tất cả' : st === 'published' ? 'Công khai' : 'Bản nháp'}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={loadInvitations}
                  disabled={loadingInvitations}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  title="Tải lại từ PostgreSQL"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingInvitations ? 'animate-spin text-[#890F0D]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Invitations Table */}
            <div className="bg-white rounded-3xl shadow-md border border-[#890F0D]/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF8F8] border-b border-[#890F0D]/15 text-[#720000] font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Học sinh / Lớp</th>
                      <th className="p-4">Gmail người tạo</th>
                      <th className="p-4">Ngày & Giờ chụp</th>
                      <th className="p-4">Lượt xem & Chia sẻ</th>
                      <th className="p-4">Bạn bè RSVP</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Xem & Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {filteredInvitations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-stone-400">
                          {invitations.length === 0
                            ? 'Chưa có thiệp kỷ yếu thực tế nào được tạo trên cơ sở dữ liệu PostgreSQL.'
                            : 'Không tìm thấy thiệp mời nào phù hợp.'}
                        </td>
                      </tr>
                    ) : (
                      filteredInvitations.map(inv => {
                        const student = inv.studentName || inv.senderName || 'Học sinh';
                        const confirmed = inv.rsvps?.filter(r => r.status === 'confirmed').length || 0;
                        const total = inv.rsvps?.length || 0;

                        return (
                          <tr key={inv.id} className="hover:bg-[#FFF8F8]/60 transition-colors">
                            <td className="p-4">
                              <span className="font-bold text-sm text-[#720000] block">{student}</span>
                              <span className="text-[11px] text-stone-500">Lớp {inv.className} • {inv.schoolName}</span>
                            </td>

                            <td className="p-4">
                              <span className="text-[11px] text-[#890F0D] font-mono">{inv.creatorEmail || 'Chưa cập nhật'}</span>
                            </td>

                            <td className="p-4">
                              <span className="font-bold">{inv.date}</span>
                              <span className="text-[11px] text-gray-400 block">{inv.startTime}</span>
                            </td>

                            <td className="p-4">
                              <span className="text-blue-700 font-bold">{inv.views || 0} views</span> • <span className="text-pink-600 font-bold">{inv.shares || 0} shares</span>
                            </td>

                            <td className="p-4">
                              <button
                                onClick={() => setSelectedInvitation(inv)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>{confirmed}/{total} bạn</span>
                                <Eye className="w-3 h-3" />
                              </button>
                            </td>

                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                inv.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {inv.status === 'published' ? 'Công khai' : 'Bản nháp'}
                              </span>
                            </td>

                            <td className="p-4 text-right space-x-2">
                              <Link
                                href={`/thiep-moi/${inv.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg bg-[#FFF5F5] text-[#890F0D] hover:bg-[#FEE2E2] inline-block"
                                title="Xem thiệp thực tế"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleDeleteInvitation(inv.id, inv.slug)}
                                className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                                title="Xóa thiệp khỏi PostgreSQL"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RSVP Modal View */}
            {selectedInvitation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#890F0D]/20 max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <div>
                      <h3 className="text-lg font-black text-stone-900">
                        Bạn Bè RSVP: {selectedInvitation.studentName || selectedInvitation.senderName}
                      </h3>
                      <p className="text-xs text-stone-500">Lớp {selectedInvitation.className} • {selectedInvitation.schoolName}</p>
                    </div>
                    <button
                      onClick={() => setSelectedInvitation(null)}
                      className="text-gray-400 hover:text-gray-700 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {(!selectedInvitation.rsvps || selectedInvitation.rsvps.length === 0) ? (
                    <p className="text-xs text-gray-400 text-center py-8">Chưa có bạn bè nào phản hồi cho thiệp này.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedInvitation.rsvps.map(r => (
                        <div key={r.id} className="p-3 bg-[#FFF8F8] rounded-xl border border-[#890F0D]/15 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#720000]">{r.guestName}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              r.status === 'maybe' ? 'bg-amber-100 text-amber-800' :
                              'bg-stone-200 text-stone-700'
                            }`}>
                              {r.status === 'confirmed' ? '✓ Sẽ đến' : r.status === 'maybe' ? '? Có thể' : '✕ Bận'}
                            </span>
                          </div>
                          {r.phone && <p className="text-[11px] text-gray-500 mt-1">SĐT: {r.phone}</p>}
                          {r.message && <p className="text-stone-700 italic mt-1 font-serif">"{r.message}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG TRONG DATABASE        */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#890F0D]/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-[#FFF8F8] px-3 py-2 rounded-xl border border-[#890F0D]/20 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#890F0D] shrink-0" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Tìm theo email người dùng..."
                  className="bg-transparent text-xs text-[#720000] font-medium outline-none w-full"
                />
              </div>

              <button
                type="button"
                onClick={loadUsers}
                disabled={loadingUsers}
                className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin text-[#890F0D]' : ''}`} />
                <span>Tải lại</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-md border border-[#890F0D]/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF8F8] border-b border-[#890F0D]/15 text-[#720000] font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Gmail Người Dùng</th>
                      <th className="p-4">Tên hiển thị</th>
                      <th className="p-4">Phương thức</th>
                      <th className="p-4">Ngày đăng ký</th>
                      <th className="p-4">Đăng nhập gần nhất</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-stone-400">
                          Chưa có tài khoản người dùng nào trong cơ sở dữ liệu.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-[#FFFDFD] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#890F0D]">
                            {u.email}
                          </td>
                          <td className="p-4 font-semibold text-stone-800">
                            {u.name || 'Người dùng GP'}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-bold text-stone-600 uppercase">
                              {u.provider}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-stone-500">
                            {new Date(u.createdAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-stone-700 font-semibold">
                            {new Date(u.lastLogin).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.email)}
                              className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                              title="Xóa tài khoản này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TỐI ƯU & DỌN DẸP DATABASE (CHỐNG TRÀN BỘ NHỚ)       */}
        {/* ========================================================= */}
        {activeTab === 'database' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#890F0D]/15 space-y-6">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Trạng Thái Cơ Sở Dữ Liệu PostgreSQL (Prisma)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Kiểm soát dung lượng và dọn dẹp các dữ liệu rác để bảo đảm hệ thống luôn hoạt động ổn định, không bao giờ bị tràn dung lượng database.
                </p>
              </div>

              {/* Chi tiết dung lượng lưu trữ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-[#FFF8F8] border border-[#890F0D]/15">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Khách hàng Leads</span>
                  <span className="text-xl font-black text-[#720000] mt-1 block">{leads.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF8F8] border border-[#890F0D]/15">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Thiệp kỷ yếu</span>
                  <span className="text-xl font-black text-[#720000] mt-1 block">{invitations.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF8F8] border border-[#890F0D]/15">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Tài khoản Users</span>
                  <span className="text-xl font-black text-[#720000] mt-1 block">{users.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Mã OTP cũ/rác</span>
                  <span className="text-xl font-black text-amber-800 mt-1 block">{expiredOtpCount}</span>
                </div>
              </div>

              {/* Hành động dọn dẹp */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-800 text-xs">Dọn dẹp mã OTP đã hết hạn</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Xóa toàn bộ mã OTP 6 số đã qua sử dụng hoặc đã quá 5 phút để giải phóng bộ nhớ PostgreSQL.
                    </p>
                  </div>
                  <button
                    onClick={handlePurgeOtps}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    Dọn dẹp ngay
                  </button>
                </div>
              </div>

              {/* Chính sách chống tràn */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quy tắc bảo vệ database (Zero Bloat Active):</span>
                </span>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-emerald-950 font-normal">
                  <li>Không lưu chuỗi hình ảnh base64 khổng lồ vượt quá giới hạn vào PostgreSQL.</li>
                  <li>Chỉ lưu các trường dữ liệu thực sự quan trọng phục vụ tư vấn và chốt hợp đồng chụp kỷ yếu.</li>
                  <li>Hỗ trợ xóa triệt để (hard delete) bất kỳ khách hàng hoặc thiệp mời test chỉ với 1 cú click.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
