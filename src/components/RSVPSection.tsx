'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RSVP } from '@/types/invitation';
import { CheckCircle2, HelpCircle, XCircle, Send, Check, Sparkles } from 'lucide-react';

interface RSVPSectionProps {
  slug: string;
  studentName?: string;
  rsvps?: RSVP[];
  onRSVPSubmit: (rsvp: Omit<RSVP, 'id' | 'createdAt'>) => Promise<void>;
}

export default function RSVPSection({
  slug,
  studentName = 'chủ thiệp',
  onRSVPSubmit
}: RSVPSectionProps) {
  const searchParams = useSearchParams();
  const guestQuery = searchParams?.get('guest') || searchParams?.get('to') || '';
  const groupQuery = searchParams?.get('group') || searchParams?.get('role') || '';
  const relationMapped = groupQuery === 'family' ? 'Người thân' : (groupQuery === 'teacher' ? 'Thầy cô' : (groupQuery === 'classmate' ? 'Bạn cùng lớp' : 'Bạn thân'));

  const [guestName, setGuestName] = useState(guestQuery);
  const [status, setStatus] = useState<'confirmed' | 'maybe' | 'declined'>('confirmed');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Nếu trong URL đã có tên khách (VD: ?to=Mỹ Linh) thì tự động điền sẵn
  useEffect(() => {
    if (guestQuery) {
      setGuestName(decodeURIComponent(guestQuery).trim());
    }
  }, [guestQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await onRSVPSubmit({
        invitationId: slug,
        guestName: guestName.trim(),
        relation: relationMapped,
        status,
        message: message.trim() || undefined
      });
      setSubmitted(true);
    } catch (err: any) {
      setError('Có lỗi xảy ra khi gửi phản hồi, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-[#890F0D]/15 max-w-md mx-auto my-6 text-stone-800">
      
      {/* Tiêu đề tinh gọn */}
      <div className="text-center mb-5 space-y-1">
        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
          XÁC NHẬN THAM GIA
        </span>
        <h3 className="text-lg sm:text-xl font-black text-[#720000]">
          Bạn Sẽ Đến Chung Vui Cùng {studentName} Chứ?
        </h3>
        <p className="text-xs text-stone-500">
          Phản hồi của bạn sẽ được gửi riêng đến {studentName} để chuẩn bị chu đáo nhất.
        </p>
      </div>

      {submitted ? (
        /* Trạng thái xác nhận thành công */
        <div className="bg-[#FFF8F8] border border-[#890F0D]/20 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl shadow-xs">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-[#720000]">
              Cảm ơn {guestName || 'bạn'} rất nhiều!
            </h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Phản hồi <strong className="text-[#890F0D]">
                "{status === 'confirmed' ? 'Chắc chắn đến' : status === 'maybe' ? 'Có thể ghé' : 'Tiếc quá bận'}"
              </strong> đã được gửi riêng đến {studentName}.
            </p>
            {message && (
              <p className="text-[11px] text-stone-500 italic mt-2 bg-white/80 p-2.5 rounded-xl border border-stone-200">
                "{message}"
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-[#890F0D] hover:underline cursor-pointer pt-2 block mx-auto"
          >
            Đổi lại câu trả lời
          </button>
        </div>
      ) : (
        /* Form xác nhận tinh gọn */
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 3 Lựa chọn trạng thái rõ ràng */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Lựa chọn của bạn:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('confirmed')}
                className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 cursor-pointer ${
                  status === 'confirmed'
                    ? 'bg-[#890F0D] text-white border-[#890F0D] shadow-md scale-[1.02]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px]">Chắc chắn đến</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('maybe')}
                className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 cursor-pointer ${
                  status === 'maybe'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-[1.02]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-[11px]">Có thể ghé</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('declined')}
                className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 cursor-pointer ${
                  status === 'declined'
                    ? 'bg-stone-600 text-white border-stone-600 shadow-md scale-[1.02]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span className="text-[11px]">Tiếc quá bận</span>
              </button>
            </div>
          </div>

          {/* Tên của bạn */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Tên của bạn <span className="text-[#890F0D]">*</span>
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              placeholder="VD: Phương Linh, Tuấn Anh, Thảo Vy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#890F0D] focus:border-[#890F0D] outline-none bg-white transition-all"
            />
          </div>

          {/* Lời nhắn / Lời chúc gửi riêng */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Lời chúc / Lời nhắn gửi riêng cho {studentName} <span className="text-stone-400 font-normal">(tùy chọn)</span>
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Gửi lời chúc mừng tốt nghiệp hoặc hẹn giờ gặp đến ${studentName}...`}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#890F0D] focus:border-[#890F0D] outline-none bg-white leading-relaxed resize-none transition-all font-medium"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#B91C1C] hover:opacity-95 shadow-lg shadow-[#890F0D]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Đang gửi xác nhận...' : `Gửi xác nhận đến ${studentName}`}</span>
          </button>
        </form>
      )}

    </div>
  );
}
