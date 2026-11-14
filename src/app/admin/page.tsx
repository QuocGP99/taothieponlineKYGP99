'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { InvitationData, RSVP } from '@/types/invitation';
import { LeadData, LeadStatus } from '@/types/lead';
import { getStoredInvitations, deleteInvitation, updateInvitationStatus } from '@/lib/storage';
import { TEMPLATES } from '@/data/templates';
import { 
  Shield, Search, Eye, Trash2, CheckCircle2, 
  HelpCircle, XCircle, Share2, Users, Layers, 
  Settings, Key, Phone, Mail, Globe, Sparkles, Filter, 
  ExternalLink, Download, BarChart3, AlertCircle, User,
  Gift, MessageCircle, RefreshCw, Check
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationData | null>(null);
  const [activeTab, setActiveTab] = useState<'invitations' | 'leads' | 'templates' | 'settings'>('invitations');

  // Leads state
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Load invitations & leads
  useEffect(() => {
    const list = getStoredInvitations();
    setInvitations(list);
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

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

  // Filtered invitations
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

  // Filtered leads
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

  // Lead metrics
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const contactedLeadsCount = leads.filter(l => l.status === 'contacted').length;
  const closedLeadsCount = leads.filter(l => l.status === 'closed').length;

  // Calculate metrics
  const totalViews = invitations.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalShares = invitations.reduce((sum, item) => sum + (item.shares || 0), 0);
  const totalRsvps = invitations.reduce((sum, item) => sum + (item.rsvps ? item.rsvps.length : 0), 0);
  const totalConfirmed = invitations.reduce((sum, item) => {
    return sum + (item.rsvps ? item.rsvps.filter(r => r.status === 'confirmed').length : 0);
  }, 0);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thiệp mời này?')) {
      deleteInvitation(id);
      setInvitations(prev => prev.filter(item => item.id !== id));
      if (selectedInvitation?.id === id) setSelectedInvitation(null);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: 'published' | 'draft' | 'archived') => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    updateInvitationStatus(id, nextStatus);
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: nextStatus } : inv));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Navbar />

      {/* Admin Top Header */}
      <div className="bg-[#240303] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#890F0D] flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-black">BẢNG QUẢN TRỊ THIỆP KỶ YẾU GP STUDIO99</h1>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Hệ thống quản lý thiệp kỷ yếu cá nhân • chupanhdanang.com
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/builder"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#890F0D] hover:bg-[#720000] shadow"
            >
              + Tạo thiệp mới
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#890F0D]/15">
            <span className="text-xs font-bold text-gray-500 block uppercase">Tổng thiệp tạo</span>
            <span className="text-2xl sm:text-3xl font-black text-[#720000] mt-1 block">
              {invitations.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#890F0D]/15">
            <span className="text-xs font-bold text-gray-500 block uppercase">Lượt xem thiệp</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-900 mt-1 block">
              {totalViews}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#890F0D]/15">
            <span className="text-xs font-bold text-gray-500 block uppercase">Lượt chia sẻ</span>
            <span className="text-2xl sm:text-3xl font-black text-pink-700 mt-1 block">
              {totalShares}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#890F0D]/15">
            <span className="text-xs font-bold text-gray-500 block uppercase">Bạn bè xác nhận</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
              {totalConfirmed} / {totalRsvps}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-2 border-b border-[#890F0D]/15 pb-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'invitations'
                ? 'bg-[#890F0D] text-white shadow'
                : 'bg-white text-stone-600 hover:bg-[#FFF8F8]'
            }`}
          >
            Quản lý Thiệp mời ({invitations.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('leads');
              loadLeads();
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'leads'
                ? 'bg-[#890F0D] text-white shadow'
                : 'bg-white text-stone-600 hover:bg-[#FFF8F8]'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Khách Nhận Ưu Đãi 10% ({leads.length})</span>
            {leads.filter(l => l.status === 'new').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                {leads.filter(l => l.status === 'new').length} mới
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'templates'
                ? 'bg-[#890F0D] text-white shadow'
                : 'bg-white text-stone-600 hover:bg-[#FFF8F8]'
            }`}
          >
            Thư viện 12 Template
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-[#890F0D] text-white shadow'
                : 'bg-white text-stone-600 hover:bg-[#FFF8F8]'
            }`}
          >
            Cấu hình & Tích hợp Email
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* ========================================================= */}
        {/* TAB 1: INVITATIONS TABLE                                  */}
        {/* ========================================================= */}
        {activeTab === 'invitations' && (
          <div className="space-y-6">
            
            {/* Filter toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#890F0D]/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-[#FFF8F8] px-3 py-2 rounded-xl border border-[#890F0D]/20 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#890F0D] shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên bạn, lớp, trường hoặc Gmail..."
                  className="bg-transparent text-xs text-[#720000] font-medium outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-gray-400">Trạng thái:</span>
                {(['all', 'published', 'draft'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg uppercase text-[11px] font-bold ${
                      statusFilter === st ? 'bg-[#890F0D] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' ? 'Tất cả' : st === 'published' ? 'Công khai' : 'Bản nháp'}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-[#890F0D]/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF8F8] border-b border-[#890F0D]/15 text-[#720000] font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Học sinh / Lớp</th>
                      <th className="p-4">Gmail người tạo</th>
                      <th className="p-4">Ngày chụp</th>
                      <th className="p-4">Lượt xem / Share</th>
                      <th className="p-4">Bạn bè RSVP</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {filteredInvitations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-400">
                          Không tìm thấy thiệp mời nào phù hợp.
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
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                              >
                                <span>{confirmed}/{total} bạn</span>
                                <Eye className="w-3 h-3" />
                              </button>
                            </td>

                            <td className="p-4">
                              <button
                                onClick={() => handleToggleStatus(inv.id, inv.status)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                  inv.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {inv.status === 'published' ? 'Công khai' : 'Bản nháp'}
                              </button>
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
                                onClick={() => handleDelete(inv.id)}
                                className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                                title="Xóa thiệp"
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
                      className="text-gray-400 hover:text-gray-700 font-bold"
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
        {/* TAB: QUẢN LÝ KHÁCH NHẬN ƯU ĐÃI 10% (LEADS)                */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Lead Stats Mini-cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#890F0D]/15">
                <span className="text-[11px] font-bold text-gray-500 uppercase block">Tổng yêu cầu ưu đãi</span>
                <span className="text-2xl font-black text-[#720000] mt-1 block">{leads.length}</span>
              </div>
              <div className="bg-[#FFF5F5] p-4 rounded-2xl shadow-xs border border-rose-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-700 uppercase block">Chưa gọi (Mới)</span>
                  {newLeadsCount > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  )}
                </div>
                <span className="text-2xl font-black text-rose-700 mt-1 block">{newLeadsCount}</span>
              </div>
              <div className="bg-[#FFFBEB] p-4 rounded-2xl shadow-xs border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">Đang tư vấn</span>
                <span className="text-2xl font-black text-amber-800 mt-1 block">{contactedLeadsCount}</span>
              </div>
              <div className="bg-[#F0FDF4] p-4 rounded-2xl shadow-xs border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">Đã chốt hợp đồng</span>
                <span className="text-2xl font-black text-emerald-800 mt-1 block">{closedLeadsCount}</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#890F0D]/15 flex flex-wrap items-center justify-between gap-4">
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

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-gray-400">Trạng thái:</span>
                {(['all', 'new', 'contacted', 'closed'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      leadStatusFilter === st 
                        ? 'bg-[#890F0D] text-white shadow-xs' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' ? 'Tất cả' : st === 'new' ? 'Chưa gọi (Mới)' : st === 'contacted' ? 'Đang tư vấn' : 'Đã chốt'}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={loadLeads}
                  disabled={loadingLeads}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors ml-1"
                  title="Tải lại danh sách"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin text-[#890F0D]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-[#890F0D]/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF8F8] border-b border-[#890F0D]/15 text-[#720000] font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Khách hàng / SĐT</th>
                      <th className="p-4">Trường – Lớp</th>
                      <th className="p-4">Sĩ số & Khu vực</th>
                      <th className="p-4">Dự kiến chụp</th>
                      <th className="p-4">Ghi chú concept</th>
                      <th className="p-4">Mã ưu đãi</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Liên hệ nhanh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-400">
                          {leads.length === 0 
                            ? 'Chưa có khách hàng nào để lại thông tin nhận ưu đãi.' 
                            : 'Không tìm thấy yêu cầu tư vấn nào khớp với bộ lọc.'}
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
                            <span className="font-mono text-stone-500 text-[11px] block mt-0.5">
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
                            <span className="block text-[10px] text-gray-400 mt-1">
                              {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </td>

                          {/* Ghi chú */}
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

                          {/* Trạng thái dropdown */}
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={e => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors outline-none cursor-pointer ${
                                lead.status === 'new' 
                                  ? 'bg-rose-50 text-rose-700 border-rose-300' 
                                  : lead.status === 'contacted'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <option value="new">🔴 Chưa gọi (Mới)</option>
                              <option value="contacted">🟡 Đang tư vấn</option>
                              <option value="closed">🟢 Đã chốt lịch</option>
                            </select>
                          </td>

                          {/* Liên hệ nhanh */}
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
                                title="Mở Zalo nhắn tin trực tiếp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
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
        {/* TAB 2: TEMPLATE GALLERY OVERVIEW                          */}
        {/* ========================================================= */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map(tmpl => (
              <div key={tmpl.id} className="bg-white rounded-3xl p-5 shadow-sm border border-[#890F0D]/15 space-y-3">
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <img src={tmpl.previewImage} alt={tmpl.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#890F0D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tmpl.categoryName}
                  </span>
                </div>
                <h4 className="font-black text-stone-900">{tmpl.name}</h4>
                <p className="text-xs text-stone-500 line-clamp-2">{tmpl.description}</p>
                <div className="flex items-center justify-between pt-2 border-t text-xs">
                  <span className="text-gray-400">Style: {tmpl.styleName}</span>
                  <Link
                    href={`/builder?template=${tmpl.id}`}
                    className="font-bold text-[#890F0D] hover:underline"
                  >
                    Xem tạo thiệp →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SETTINGS & EMAIL INTEGRATION                       */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#890F0D]/15 max-w-2xl mx-auto space-y-6 text-xs sm:text-sm">
            <div>
              <h3 className="text-lg font-black text-stone-900">Cấu Hình Dịch Vụ GP Studio99 & Email</h3>
              <p className="text-xs text-stone-500 mt-1">
                Quản lý gửi email xác nhận thực tế đến Gmail của bạn và thông tin thương hiệu GP Studio99.
              </p>
            </div>

            <div className="p-4 bg-[#FFF8F8] rounded-2xl border border-[#890F0D]/20 space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#890F0D]" />
                <span className="font-bold text-[#720000]">Trạng Thái Dịch Vụ Gửi Email Resend</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hệ thống đã tích hợp API gửi email chuẩn HTML tại <code>/api/send-email</code>.
                Để gửi email thực tế đến bất kỳ hộp thư Gmail nào, vui lòng cấu hình <code>RESEND_API_KEY</code> trong tệp <code>.env.local</code>.
              </p>
              <div className="bg-[#1C0505] text-[#FCA5A5] p-3 rounded-xl font-mono text-[11px] select-all">
                RESEND_API_KEY=re_your_api_key_here<br/>
                RESEND_FROM=GP Studio99 &lt;thiepmoi@chupanhdanang.com&gt;
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-stone-900">Thông tin liên hệ Kỷ Yếu GP Studio99 hiển thị trên thiệp</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hotline / Zalo</label>
                  <input
                    type="text"
                    defaultValue="0899.236.001"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Website chính thức</label>
                  <input
                    type="text"
                    defaultValue="https://chupanhdanang.com"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ studio tại Đà Nẵng</label>
                <input
                  type="text"
                  defaultValue="Trần Cao Vân, TP. Đà Nẵng"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Cấu hình đã được lưu thành công trên phiên làm việc!')}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#890F0D] hover:bg-[#720000] shadow"
            >
              Lưu Cấu Hình
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
