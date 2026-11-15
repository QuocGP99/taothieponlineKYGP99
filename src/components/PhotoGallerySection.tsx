'use client';

import React, { useRef, useState } from 'react';
import { Camera, Plus, Image as ImageIcon, X } from 'lucide-react';

interface PhotoGallerySectionProps {
  photos?: string[];
  studentName?: string;
  isEditable?: boolean;
  onAddPhoto?: (newPhotoUrl: string) => void;
  onEditPrompt?: () => void;
}

export default function PhotoGallerySection({
  photos = [],
  studentName = 'Hoàng Ngọc',
  isEditable = false,
  onAddPhoto,
  onEditPrompt
}: PhotoGallerySectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const defaultPhotos = [
    '/images/poster-reference.jpg',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  ];

  const photoList = photos.length > 0 ? photos : defaultPhotos;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAddPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onAddPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#890F0D]/15 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#890F0D]/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D]">
            <ImageIcon className="w-4 h-4 text-[#890F0D]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#720000] text-sm uppercase tracking-wider">
              KHOẢNH KHẮC THANH XUÂN
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">Album ảnh kỷ niệm của {studentName}</p>
          </div>
        </div>

        {/* Nút Thêm ảnh của bạn (Chỉ hiển thị khi có onAddPhoto hoặc có onEditPrompt) */}
        {onAddPhoto ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#890F0D] hover:bg-[#720000] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm ảnh của bạn</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        ) : onEditPrompt ? (
          <button
            type="button"
            onClick={onEditPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#890F0D] hover:text-white text-stone-700 text-xs font-bold border border-stone-200 transition-all cursor-pointer"
            title="Đăng nhập để thêm ảnh vào template"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm ảnh (Cần đăng nhập)</span>
          </button>
        ) : null}
      </div>

      {/* Grid danh sách ảnh */}
      <div className="grid grid-cols-2 gap-2.5">
        {photoList.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setActivePhoto(photo)}
            className="group relative aspect-square rounded-2xl overflow-hidden border border-[#890F0D]/15 bg-stone-100 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <img
              src={photo}
              alt={`Kỷ niệm ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              <span>Xem ảnh</span>
            </div>
          </div>
        ))}

        {/* Ô bấm thêm ảnh nhanh dạng thẻ */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-2xl border-2 border-dashed border-[#890F0D]/30 hover:border-[#890F0D] bg-[#FFF8F8] hover:bg-[#FEE2E2]/40 flex flex-col items-center justify-center gap-1.5 text-stone-500 hover:text-[#890F0D] cursor-pointer transition-all p-3 text-center"
        >
          <div className="w-9 h-9 rounded-full bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D]">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">+ Thêm ảnh</span>
          <span className="text-[10px] text-stone-400">Tải ảnh kỷ niệm cùng {studentName}</span>
        </div>
      </div>

      {/* Lightbox xem ảnh lớn */}
      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activePhoto}
            alt="Phóng to ảnh"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/20"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
