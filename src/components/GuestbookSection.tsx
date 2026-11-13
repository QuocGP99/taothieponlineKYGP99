'use client';

import React, { useState } from 'react';
import { GuestWish } from '@/types/invitation';
import { Heart, Send, MessageSquareHeart, Sparkles } from 'lucide-react';

interface GuestbookSectionProps {
  wishes?: GuestWish[];
  studentName?: string;
  onSendWish?: (wish: { senderName: string; relation: string; message: string }) => void;
}

export default function GuestbookSection({
  wishes = [],
  studentName = 'Hoàng Ngọc',
  onSendWish
}: GuestbookSectionProps) {
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState('Bạn thân');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [localWishes, setLocalWishes] = useState<GuestWish[]>(wishes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      senderName: senderName.trim(),
      relation,
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    setLocalWishes([newWish, ...localWishes]);
    if (onSendWish) {
      onSendWish({ senderName, relation, message });
    }

    setSubmitted(true);
    setSenderName('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 3000);
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
              SỔ LƯU BÚT THANH XUÂN
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">Gửi lời chúc mừng kỷ yếu đến {studentName}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#890F0D]/10 text-[#890F0D]">
          {localWishes.length} lời chúc
        </span>
      </div>

      {/* Form gửi lời chúc */}
      <form onSubmit={handleSubmit} className="mb-6 bg-[#FFF8F8] p-4 rounded-2xl border border-[#890F0D]/15">
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#890F0D] bg-white font-medium"
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

        <div className="mb-3">
          <label className="text-[11px] font-bold text-stone-700 block mb-1">
            Lời chúc của bạn gửi {studentName} <span className="text-[#890F0D]">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Viết lời chúc tốt nghiệp hoặc kỷ niệm thanh xuân của hai bạn tại đây..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#890F0D] bg-white leading-relaxed resize-none font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#890F0D] to-[#720000] hover:from-[#720000] hover:to-[#540000] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Gửi lời chúc ngay</span>
        </button>

        {submitted && (
          <p className="mt-2 text-center text-xs text-emerald-700 font-bold animate-in fade-in">
            🎉 Cảm ơn bạn! Lời chúc đã được gửi thành công đến {studentName}.
          </p>
        )}
      </form>

      {/* Danh sách lời chúc đã gửi */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {localWishes.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs">
            Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc đến {studentName}!
          </div>
        ) : (
          localWishes.map((wish, idx) => (
            <div key={wish.id || idx} className="p-3.5 rounded-2xl bg-[#FFF8F8] border border-[#890F0D]/10 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#720000]">{wish.senderName}</span>
                  {wish.relation && (
                    <span className="px-2 py-0.2 rounded-full bg-[#890F0D]/10 text-[#890F0D] text-[10px] font-bold">
                      {wish.relation}
                    </span>
                  )}
                </div>
                <Heart className="w-3.5 h-3.5 text-[#890F0D] fill-[#890F0D]/20" />
              </div>
              <p className="text-stone-700 leading-relaxed font-medium">
                "{wish.message}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
