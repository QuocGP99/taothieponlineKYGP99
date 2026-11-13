'use client';

import React, { useState } from 'react';
import { RSVP, VirtualGift } from '@/types/invitation';
import { CheckCircle2, HelpCircle, XCircle, Send, Heart, Gift, MessageSquareHeart } from 'lucide-react';

interface RSVPSectionProps {
  slug: string;
  studentName?: string;
  rsvps: RSVP[];
  onRSVPSubmit: (rsvp: Omit<RSVP, 'id' | 'createdAt'>) => Promise<void>;
}

export default function RSVPSection({ slug, studentName = 'mình', rsvps = [], onRSVPSubmit }: RSVPSectionProps) {
  const [guestName, setGuestName] = useState('');
  const [relation, setRelation] = useState('Bạn thân');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'maybe' | 'declined'>('confirmed');
  const [virtualGift, setVirtualGift] = useState<VirtualGift>('bouquet');
  const [message, setMessage] = useState('');
  const [companionCount, setCompanionCount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const confirmedCount = rsvps.filter(r => r.status === 'confirmed').length;
  const maybeCount = rsvps.filter(r => r.status === 'maybe').length;
  const declinedCount = rsvps.filter(r => r.status === 'declined').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Vui lòng nhập tên hoặc biệt danh của bạn');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onRSVPSubmit({
        invitationId: slug,
        guestName: guestName.trim(),
        relation,
        phone: phone.trim() || undefined,
        status,
        virtualGift,
        message: message.trim() || undefined,
        companionCount
      });
      setSubmitted(true);
    } catch (err: any) {
      setError('Có lỗi xảy ra khi gửi phản hồi');
    } finally {
      setSubmitting(false);
    }
  };

  const getGiftBadge = (gift?: VirtualGift) => {
    switch (gift) {
      case 'bouquet': return '💐 Bó hoa';
      case 'teddy': return '🧸 Gấu tốt nghiệp';
      case 'sunflower': return '🌻 Hoa hướng dương';
      case 'milktea': return '🧋 Trà sữa';
      case 'letter': return '💌 Thư tay';
      default: return '💐 Bó hoa';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-xl border border-[#890F0D]/15 max-w-xl mx-auto mt-8">
      
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
          XÁC NHẬN THAM GIA & GỬI LỜI CHÚC
        </span>
        <h3 className="text-2xl font-black text-[#720000] mt-2">
          Bạn Sẽ Đến Chụp Ảnh Cùng {studentName} Chứ?
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Hãy phản hồi để {studentName} biết và đón tiếp bạn thật chu đáo trong ngày kỷ yếu nhé!
        </p>
      </div>

      {/* RSVP Stats Bar */}
      <div className="grid grid-cols-3 gap-2.5 mb-6 text-center text-xs">
        <div className="bg-[#FFF5F5] border border-[#890F0D]/20 p-2.5 rounded-2xl">
          <span className="block text-xl font-black text-[#720000]">{confirmedCount}</span>
          <span className="font-bold text-[#890F0D] flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Chắc chắn đến
          </span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl">
          <span className="block text-xl font-black text-amber-700">{maybeCount}</span>
          <span className="font-semibold text-amber-800 flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Có thể ghé
          </span>
        </div>
        <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-2xl">
          <span className="block text-xl font-black text-stone-700">{declinedCount}</span>
          <span className="font-semibold text-stone-600 flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Tiếc quá bận
          </span>
        </div>
      </div>

      {submitted ? (
        <div className="bg-[#FFF8F8] border border-[#890F0D]/30 rounded-2xl p-6 text-center animate-fade-in">
          <div className="w-12 h-12 bg-[#890F0D] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-md">
            ✓
          </div>
          <h4 className="text-lg font-bold text-[#720000]">Cảm ơn bạn rất nhiều!</h4>
          <p className="text-xs text-[#890F0D] mt-1 font-medium">
            Lời chúc và phản hồi của bạn đã được gửi đến {studentName}. Hẹn gặp bạn trong buổi chụp kỷ yếu nhé!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-xs font-bold text-[#720000] hover:underline"
          >
            Chỉnh sửa lại phản hồi
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Status buttons */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Trạng thái tham gia *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('confirmed')}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 ${
                  status === 'confirmed'
                    ? 'bg-[#890F0D] text-white border-[#890F0D] shadow-md scale-102'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-[#FFF8F8]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Chắc chắn đến</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('maybe')}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 ${
                  status === 'maybe'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-102'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Có thể ghé</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('declined')}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 ${
                  status === 'declined'
                    ? 'bg-stone-600 text-white border-stone-600 shadow-md scale-102'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Tiếc quá bận</span>
              </button>
            </div>
          </div>

          {/* Name & Relation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tên của bạn *</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="VD: Phương Linh, Minh Quân..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mối quan hệ</label>
              <select
                value={relation}
                onChange={e => setRelation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none font-medium"
              >
                <option value="Bạn thân">Bạn thân thiết</option>
                <option value="Bạn cùng trường">Bạn cùng trường / Khác lớp</option>
                <option value="Gia đình">Gia đình / Người thân</option>
                <option value="Người thương">Người thương / Crush</option>
                <option value="Thầy cô">Thầy cô giáo</option>
                <option value="Khác">Bạn bè khác</option>
              </select>
            </div>
          </div>

          {/* Virtual Gift / Flowers */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Gửi tặng món quà tượng trưng đến {studentName} 🎁
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {[
                { id: 'bouquet', icon: '💐', label: 'Bó hoa' },
                { id: 'teddy', icon: '🧸', label: 'Gấu bông' },
                { id: 'sunflower', icon: '🌻', label: 'Hướng dương' },
                { id: 'milktea', icon: '🧋', label: 'Trà sữa' },
                { id: 'letter', icon: '💌', label: 'Thư tay' }
              ].map(gift => (
                <button
                  type="button"
                  key={gift.id}
                  onClick={() => setVirtualGift(gift.id as VirtualGift)}
                  className={`p-2 rounded-xl border transition-all ${
                    virtualGift === gift.id
                      ? 'bg-[#FEE2E2] border-[#890F0D] text-[#720000] font-bold shadow-xs scale-105'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xl block">{gift.icon}</span>
                  <span className="text-[10px] mt-1 block truncate">{gift.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phone & Companion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại (tùy chọn)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0905..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Đi cùng</label>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map(num => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setCompanionCount(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                      companionCount === num
                        ? 'bg-[#890F0D] text-white border-[#890F0D]'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {num === 0 ? '1 mình' : `+${num} bạn`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Lời chúc thanh xuân gửi riêng cho {studentName}</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Gửi lời nhắn động viên, hẹn giờ gặp hoặc lời chúc tuổi 18 đến ${studentName}...`}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#720000] to-[#890F0D] hover:from-[#540000] hover:to-[#720000] shadow-lg shadow-[#890F0D]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Đang gửi phản hồi...' : `Gửi xác nhận tham gia đến ${studentName}`}</span>
          </button>
        </form>
      )}

      {/* Guestbook List */}
      {rsvps.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#890F0D]/10">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquareHeart className="w-5 h-5 text-[#890F0D]" />
            <h4 className="font-bold text-sm text-stone-900">Sổ Lưu Bút & Lời Chúc Gửi {studentName} ({rsvps.length})</h4>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {rsvps.map(item => (
              <div key={item.id} className="p-3 bg-[#FFF8F8] rounded-xl border border-[#890F0D]/15 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#720000]">{item.guestName}</span>
                    {item.relation && (
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#890F0D]/20 text-stone-600">
                        {item.relation}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.virtualGift && (
                      <span className="text-[10px] bg-[#FEE2E2] text-[#890F0D] px-2 py-0.5 rounded-full font-bold">
                        {getGiftBadge(item.virtualGift)}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'maybe' ? 'bg-amber-100 text-amber-800' :
                      'bg-stone-200 text-stone-700'
                    }`}>
                      {item.status === 'confirmed' ? '✓ Sẽ đến' : item.status === 'maybe' ? '? Có thể' : '✕ Bận'}
                    </span>
                  </div>
                </div>
                {item.message && <p className="text-stone-700 italic mt-1 font-serif">"{item.message}"</p>}
                <span className="text-[10px] text-gray-400 block mt-1">
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
