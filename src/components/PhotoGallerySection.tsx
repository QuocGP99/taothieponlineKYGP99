'use client';

import React, { useRef, useState } from 'react';
import { Camera, Plus, Image as ImageIcon, X, Trash2 } from 'lucide-react';

interface PhotoGallerySectionProps {
  photos?: string[];
  studentName?: string;
  isEditable?: boolean;
  onAddPhoto?: (newPhotoUrl: string) => void;
  onRemovePhoto?: (index: number) => void;
}

export default function PhotoGallerySection({
  photos = [],
  studentName = 'chủ thiệp',
  isEditable = false,
  onAddPhoto,
  onRemovePhoto
}: PhotoGallerySectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const photoList = Array.isArray(photos) ? photos : [];

  // Nếu không có ảnh và đang ở chế độ xem công khai (khách xem link) -> Ẩn toàn bộ để thiệp gọn gàng
  if (photoList.length === 0 && !isEditable) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onAddPhoto) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onAddPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
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

        {/* Nút Thêm ảnh (CHỈ hiển thị cho chủ tạo thiệp khi chỉnh sửa) */}
        {isEditable && onAddPhoto && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#890F0D] hover:bg-[#720000] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm ảnh</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      {/* Grid danh sách ảnh */}
      {photoList.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5">
          {photoList.map((photo, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-[#890F0D]/15 bg-stone-100 shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={photo}
                alt={`Kỷ niệm ${idx + 1}`}
                onClick={() => setActivePhoto(photo)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
              
              {/* Nút Xóa ảnh (Chỉ dành cho chủ thiệp khi chỉnh sửa) */}
              {isEditable && onRemovePhoto && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePhoto(idx);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 hover:bg-red-700 text-white shadow-md transition-all opacity-90 hover:opacity-100 cursor-pointer"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div 
                onClick={() => setActivePhoto(photo)}
                className="absolute inset-x-0 bottom-0 py-1 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-center text-white text-[10px] font-bold cursor-pointer"
              >
                Xem phóng to
              </div>
            </div>
          ))}

          {/* Ô thêm ảnh nhanh (CHỈ hiển thị khi chủ thiệp chỉnh sửa) */}
          {isEditable && onAddPhoto && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-[#890F0D]/30 hover:border-[#890F0D] bg-[#FFF8F8] hover:bg-[#FEE2E2]/40 flex flex-col items-center justify-center gap-1.5 text-stone-500 hover:text-[#890F0D] cursor-pointer transition-all p-3 text-center"
            >
              <div className="w-9 h-9 rounded-full bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D]">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">+ Thêm ảnh</span>
              <span className="text-[10px] text-stone-400">Chọn ảnh từ máy tính</span>
            </div>
          )}
        </div>
      ) : (
        /* Trạng thái rỗng khi chủ thiệp đang tạo thiệp */
        isEditable && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="py-8 px-4 rounded-2xl border-2 border-dashed border-[#890F0D]/30 hover:border-[#890F0D] bg-[#FFF8F8] flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#890F0D]/10 flex items-center justify-center text-[#890F0D]">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-[#720000]">Chưa có ảnh nào trong album</p>
            <span className="text-[11px] text-stone-500 max-w-xs">
              Bấm vào đây để chọn ảnh kỷ yếu / thanh xuân từ máy tính của bạn
            </span>
          </div>
        )
      )}

      {/* Lightbox xem ảnh lớn */}
      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activePhoto}
            alt="Xem ảnh lớn"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
