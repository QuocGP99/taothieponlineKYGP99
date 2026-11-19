'use client';

import React, { useState } from 'react';
import { InvitationRecipient, GuestGroup } from '@/types/invitation';
import {
  Users, UserPlus, Copy, Check, ExternalLink, Trash2,
  Share2, Sparkles, Plus, ListPlus, Heart, MessageSquare
} from 'lucide-react';

interface RecipientManagerProps {
  invitationSlug: string;
  recipients: InvitationRecipient[];
  onUpdateRecipients: (newRecipients: InvitationRecipient[]) => Promise<void> | void;
  baseUrl?: string;
  studentName?: string;
}

const GROUP_LABELS: Record<GuestGroup, { name: string; color: string; badgeBg: string }> = {
  friend: { name: 'Bạn thân', color: 'text-rose-700', badgeBg: 'bg-rose-50 border-rose-200' },
  classmate: { name: 'Bạn cùng lớp', color: 'text-blue-700', badgeBg: 'bg-blue-50 border-blue-200' },
  family: { name: 'Người thân', color: 'text-purple-700', badgeBg: 'bg-purple-50 border-purple-200' },
  teacher: { name: 'Thầy cô', color: 'text-amber-700', badgeBg: 'bg-amber-50 border-amber-200' },
  other: { name: 'Khách quý', color: 'text-stone-700', badgeBg: 'bg-stone-50 border-stone-200' },
};

export default function RecipientManager({
  invitationSlug,
  recipients = [],
  onUpdateRecipients,
  baseUrl = '',
  studentName = 'chủ thiệp'
}: RecipientManagerProps) {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [groupInput, setGroupInput] = useState<GuestGroup>('friend');
  const [bulkTextInput, setBulkTextInput] = useState('');
  const [bulkGroupInput, setBulkGroupInput] = useState<GuestGroup>('friend');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const effectiveBaseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  const getRecipientLink = (recipient: InvitationRecipient) => {
    return `${effectiveBaseUrl}/thiep-moi/${invitationSlug}?to=${encodeURIComponent(recipient.name)}&group=${recipient.group}`;
  };

  // Thêm 1 người nhận
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newRec: InvitationRecipient = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: nameInput.trim(),
      group: groupInput,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newRec, ...recipients];
    setNameInput('');
    setIsSaving(true);
    try {
      await onUpdateRecipients(updated);
    } finally {
      setIsSaving(false);
    }
  };

  // Thêm hàng loạt người nhận từ danh sách text
  const handleAddBulk = async () => {
    if (!bulkTextInput.trim()) return;

    const lines = bulkTextInput
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (lines.length === 0) return;

    const newItems: InvitationRecipient[] = lines.map((name, idx) => ({
      id: `rec-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
      name,
      group: bulkGroupInput,
      status: 'pending',
      createdAt: new Date().toISOString()
    }));

    const updated = [...newItems, ...recipients];
    setBulkTextInput('');
    setIsBulkMode(false);
    setIsSaving(true);
    try {
      await onUpdateRecipients(updated);
    } finally {
      setIsSaving(false);
    }
  };

  // Xóa người nhận
  const handleRemove = async (id: string) => {
    const updated = recipients.filter(r => r.id !== id);
    setIsSaving(true);
    try {
      await onUpdateRecipients(updated);
    } finally {
      setIsSaving(false);
    }
  };

  // Sao chép link cá nhân hóa
  const handleCopyLink = (recipient: InvitationRecipient) => {
    const link = getRecipientLink(recipient);
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(link);
      setCopiedId(recipient.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="bg-[#FFF8F8] border border-[#890F0D]/20 rounded-3xl p-5 sm:p-6 space-y-5 text-stone-800 shadow-xs">
      
      {/* Header Quản lý Người Nhận */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#890F0D]/15">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-2.5 py-0.5 rounded-full border border-[#890F0D]/20">
            CÁ NHÂN HÓA THIỆP MỜI
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#720000] mt-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#890F0D]" />
            <span>Danh Sách Người Nhận Thư Mời ({recipients.length})</span>
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Mỗi người sẽ nhận được một đường link mang đúng tên riêng của họ trên thiệp mời.
          </p>
        </div>

        {/* Nút chuyển đổi giữa Thêm từng người & Thêm hàng loạt */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#890F0D]/20">
          <button
            type="button"
            onClick={() => setIsBulkMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              !isBulkMode ? 'bg-[#890F0D] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm từng người</span>
          </button>
          <button
            type="button"
            onClick={() => setIsBulkMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              isBulkMode ? 'bg-[#890F0D] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Tạo hàng loạt</span>
          </button>
        </div>
      </div>

      {/* FORM 1: Thêm nhanh từng người */}
      {!isBulkMode ? (
        <form onSubmit={handleAddSingle} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Tên người nhận (bạn bè, người thân):
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="VD: Mỹ Linh, Tuấn Khang, Bố Mẹ..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-[#890F0D] outline-none"
              />
            </div>

            <div className="w-40">
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Nhóm quan hệ:
              </label>
              <select
                value={groupInput}
                onChange={e => setGroupInput(e.target.value as GuestGroup)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-[#890F0D] outline-none bg-white"
              >
                <option value="friend">Bạn thân thiết</option>
                <option value="classmate">Bạn cùng lớp</option>
                <option value="family">Người thân / Gia đình</option>
                <option value="teacher">Thầy cô giáo</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="self-end pt-5">
              <button
                type="submit"
                disabled={!nameInput.trim() || isSaving}
                className="px-4 py-2 bg-[#890F0D] hover:bg-[#720000] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm link</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* FORM 2: Tạo hàng loạt từ danh sách text */
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-stone-700">
              📋 Dán danh sách tên (mỗi người 1 dòng hoặc cách nhau bởi dấu phẩy):
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500 font-medium">Áp dụng nhóm:</span>
              <select
                value={bulkGroupInput}
                onChange={e => setBulkGroupInput(e.target.value as GuestGroup)}
                className="px-2 py-1 rounded-lg border border-stone-300 text-xs font-bold text-stone-800 bg-white"
              >
                <option value="friend">Bạn thân thiết</option>
                <option value="classmate">Bạn cùng lớp</option>
                <option value="family">Người thân</option>
                <option value="teacher">Thầy cô</option>
              </select>
            </div>
          </div>

          <textarea
            rows={4}
            value={bulkTextInput}
            onChange={e => setBulkTextInput(e.target.value)}
            placeholder={`Mỹ Linh\nTuấn Khang\nMinh Quân\nPhương Lan\nBố Mẹ...`}
            className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-[#890F0D] outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBulkMode(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAddBulk}
              disabled={!bulkTextInput.trim() || isSaving}
              className="px-4 py-2 bg-gradient-to-r from-[#720000] to-[#890F0D] text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Tạo danh sách link hàng loạt</span>
            </button>
          </div>
        </div>
      )}

      {/* DANH SÁCH LINK MỜI ĐÃ TẠO */}
      <div className="space-y-2">
        {recipients.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-[#890F0D]/20 text-center text-xs text-stone-500 space-y-1">
            <p className="font-bold text-stone-700">Chưa có người nhận nào trong danh sách</p>
            <p className="text-[11px] text-stone-400">
              Hãy nhập tên bạn bè hoặc dán danh sách hàng loạt ở trên để tự động nhận link mời riêng cho từng người.
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {recipients.map(r => {
              const groupInfo = GROUP_LABELS[r.group] || GROUP_LABELS.friend;
              const link = getRecipientLink(r);
              const isCopied = copiedId === r.id;

              return (
                <div
                  key={r.id}
                  className="bg-white p-3 sm:p-3.5 rounded-2xl border border-stone-200 hover:border-[#890F0D]/30 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#890F0D]/10 text-[#890F0D] font-bold text-xs flex items-center justify-center shrink-0">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {r.name}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${groupInfo.badgeBg} ${groupInfo.color}`}>
                          {groupInfo.name}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-stone-400 truncate max-w-xs sm:max-w-md">
                        {link}
                      </p>
                    </div>
                  </div>

                  {/* Nhóm nút thao tác */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Nút Sao chép Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#FFF5F5] hover:bg-[#FEE2E2] text-[#890F0D] border border-[#890F0D]/20'
                      }`}
                      title="Sao chép link mời riêng này"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Đã chép link!' : 'Chép link'}</span>
                    </button>

                    {/* Nút Gửi Zalo */}
                    <a
                      href={`https://zalo.me/share?url=${encodeURIComponent(link)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors"
                      title="Gửi qua Zalo"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>

                    {/* Nút Xem thử (mở đúng link có ?to=...) */}
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200 transition-colors"
                      title="Mở xem thử giao diện thiệp của người này"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Nút Xóa */}
                    <button
                      type="button"
                      onClick={() => handleRemove(r.id)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa khỏi danh sách"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
