'use client';

import React, { useState } from 'react';
import { GuestWish } from '@/types/invitation';
import { Heart, Send, MessageSquareHeart, Lock, CheckCircle2 } from 'lucide-react';

interface GuestbookSectionProps {
  wishes?: GuestWish[];
  studentName?: string;
  onSendWish?: (wish: { senderName: string; relation: string; message: string }) => void;
}

export default function GuestbookSection({
  studentName = 'chủ thiệp',
  onSendWish
}: GuestbookSectionProps) {
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState('Bạn thân');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    if (onSendWish) {
      onSendWish({ senderName: senderName.trim(), relation, message: message.trim() });
    }

    setSubmitted(true);
    setSenderName('');
    setMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#890F0D]/15 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#890F0D]/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D]">
            <MessageSquareHeart className="w-4 h-4 text-[#890F0D]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#720000] text-sm uppercase tracking-wider">
              GỬI LỜI CHÚC THANH XUÂN
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">Hộp thư lời chúc gửi riêng cho {studentName}</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Gửi riêng tư</span>
        </span>
      </div>

      {submitted ? (
        <div className="bg-[#FFF8F8] border border-[#890F0D]/20 rounded-2xl p-5 text-center space-y-2 animate-in fade-in">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#720000]">Đã gửi lời chúc thành công!</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Lời chúc của bạn đã được chuyển riêng đến hòm thư của <strong className="text-[#890F0D]">{studentName}</strong>.
          </p>
          <p className="text-[11px] text-stone-400 italic">
            (Lời chúc được bảo mật riêng tư, chỉ có {studentName} đọc được trên trang quản lý thiệp)
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-2 text-xs font-bold text-[#890F0D] hover:underline cursor-pointer"
          >
            + Gửi thêm lời chúc khác
          </button>
        </div>
      ) : (
        /* Form gửi lời chúc */
        <form onSubmit={handleSubmit} className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#890F0D]/15 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Tên của bạn <span className="text-[#890F0D]">*</span>
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="VD: Mỹ Linh"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#890F0D] bg-white font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Mối quan hệ
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#890F0D] bg-white font-medium cursor-pointer"
              >
                <option value="Bạn thân">Bạn thân</option>
                <option value="Bạn cùng lớp">Bạn cùng lớp</option>
                <option value="Bạn cùng trường">Bạn cùng trường</option>
                <option value="Gia đình">Gia đình & Người thân</option>
                <option value="Thầy cô">Thầy cô</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Lời chúc thanh xuân gửi {studentName} <span className="text-[#890F0D]">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Viết lời chúc tốt nghiệp hoặc kỷ niệm thanh xuân của hai bạn gửi riêng cho ${studentName}...`}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#890F0D] bg-white leading-relaxed resize-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#890F0D] to-[#720000] hover:from-[#720000] hover:to-[#540000] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi lời chúc riêng tư</span>
          </button>
        </form>
      )}
    </div>
  );
}
