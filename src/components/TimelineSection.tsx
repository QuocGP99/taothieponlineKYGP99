'use client';

import React from 'react';
import { TimelineItem } from '@/types/invitation';
import { Clock, MapPin, Sparkles } from 'lucide-react';

interface TimelineSectionProps {
  items?: TimelineItem[];
  friendPhotoTime?: string;
}

export default function TimelineSection({ items, friendPhotoTime }: TimelineSectionProps) {
  const defaultItems: TimelineItem[] = [
    {
      id: '1',
      time: '13:00 - 14:00',
      title: 'Tập trung & Chụp trang phục Cử Nhân',
      location: 'Cổng chính & Giảng đường',
      note: 'Nhận nón cử nhân, hoa và bằng tốt nghiệp'
    },
    {
      id: '2',
      time: '14:00 - 16:30',
      title: 'Khung giờ đón Bạn Bè & Người Thân chụp ảnh tự do',
      location: 'Sân trường & Khuôn viên cây xanh',
      note: 'Khoảnh khắc chụp ảnh giao lưu thoải mái cùng bạn bè và gia đình'
    },
    {
      id: '3',
      time: '16:30 - 18:00',
      title: 'Chụp tập thể lớp & Ném nón tốt nghiệp hoàng hôn',
      location: 'Sân vận động & Đài phun nước',
      note: 'Lưu giữ khoảnh khắc thanh xuân rực rỡ nhất'
    }
  ];

  const timelineList = (items && items.length > 0) ? items : defaultItems;

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#890F0D]/15 shadow-xl">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#890F0D]/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D]">
            <Clock className="w-4 h-4 text-[#890F0D]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#720000] text-sm uppercase tracking-wider">
              LỊCH TRÌNH BUỔI CHỤP
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">Timeline chi tiết các mốc giờ</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#890F0D]/10 text-[#890F0D]">
          {timelineList.length} mốc giờ
        </span>
      </div>

      {/* Thông báo khung giờ đón bạn bè nổi bật nếu có */}
      {friendPhotoTime && (
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF5F5] to-[#FEE2E2] border border-[#890F0D]/20 flex items-start gap-2.5 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#890F0D] shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-[#720000] block">
              📸 KHUNG GIỜ ĐÓN BẠN BÈ & NGƯỜI THÂN:
            </span>
            <p className="text-xs text-[#890F0D] font-extrabold mt-0.5">
              {friendPhotoTime}
            </p>
          </div>
        </div>
      )}

      {/* Danh sách Timeline dọc */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#890F0D] before:via-[#890F0D]/40 before:to-stone-200">
        {timelineList.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Chấm tròn mốc giờ */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-4 border-[#890F0D] shadow group-hover:scale-125 transition-transform" />
            
            <div className="bg-[#FFF8F8] p-3.5 rounded-2xl border border-[#890F0D]/10 hover:border-[#890F0D]/30 transition-colors">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#890F0D] text-white text-[11px] font-extrabold tracking-wide mb-1.5 shadow-xs">
                {item.time}
              </span>
              <h4 className="font-bold text-[#720000] text-sm">
                {item.title}
              </h4>
              {item.location && (
                <p className="flex items-center gap-1 text-[11px] text-stone-600 mt-1 font-medium">
                  <MapPin className="w-3 h-3 text-[#890F0D] shrink-0" />
                  <span>{item.location}</span>
                </p>
              )}
              {item.note && (
                <p className="text-[11px] text-stone-500 italic mt-1 bg-white/70 p-2 rounded-lg border border-[#890F0D]/5">
                  💡 {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
