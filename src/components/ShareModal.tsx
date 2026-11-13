'use client';

import React, { useState } from 'react';
import { 
  X, Copy, Check, Share2, Facebook, MessageCircle, 
  Download, QrCode, Sparkles 
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  className: string;
  onDownloadImage?: () => Promise<void>;
}

export default function ShareModal({
  isOpen,
  onClose,
  url,
  title,
  className,
  onDownloadImage
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`🎓 Thiệp mời chụp ảnh kỷ yếu của mình: ${title} - Bạn ghé qua chụp ảnh kỷ niệm cùng mình nhé!`);
  const encodedUrl = encodeURIComponent(url);

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${shareText}`, '_blank');
  };

  const handleMessengerShare = () => {
    window.open(`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`, '_blank');
  };

  const handleZaloShare = () => {
    window.open(`https://sp.zalo.me/share_inline?url=${encodedUrl}`, '_blank');
  };

  const handleDownload = async () => {
    if (!onDownloadImage) return;
    setDownloading(true);
    try {
      await onDownloadImage();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#890F0D]/20 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#720000] to-[#890F0D] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-stone-900">Chia Sẻ Thiệp Mời Đến Bạn Bè</h3>
          <p className="text-xs text-stone-500 mt-1">
            Gửi đường link thiệp riêng để bạn thân, bạn cùng trường và người thân xác nhận đến chụp ảnh cùng bạn!
          </p>
        </div>

        {/* Copy Link input */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Đường dẫn riêng của thiệp:</label>
          <div className="flex items-center gap-2 p-1.5 bg-[#FFF8F8] rounded-2xl border border-[#890F0D]/20">
            <input
              type="text"
              readOnly
              value={url}
              className="bg-transparent text-xs text-[#720000] font-medium px-2.5 flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#890F0D] hover:bg-[#720000] text-white shadow-xs'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2.5">Gửi nhanh qua:</label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={handleZaloShare}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                Z
              </div>
              <span className="text-[11px] font-bold">Zalo</span>
            </button>

            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <Facebook className="w-7 h-7 text-indigo-600 mb-1" />
              <span className="text-[11px] font-bold">Facebook</span>
            </button>

            <button
              onClick={handleMessengerShare}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              <MessageCircle className="w-7 h-7 text-sky-600 mb-1" />
              <span className="text-[11px] font-bold">Messenger</span>
            </button>
          </div>
        </div>

        {/* Extra actions */}
        <div className="space-y-2.5 pt-4 border-t border-gray-100">
          {onDownloadImage && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#720000] bg-[#FFF5F5] hover:bg-[#FEE2E2] border border-[#890F0D]/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#890F0D]" />
              <span>{downloading ? 'Đang tạo ảnh...' : 'Tải ảnh thiệp lưu vào máy (PNG)'}</span>
            </button>
          )}

          <button
            onClick={() => setShowQr(!showQr)}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 transition-colors"
          >
            <QrCode className="w-4 h-4 text-gray-600" />
            <span>{showQr ? 'Ẩn mã QR' : 'Hiện mã QR để quét'}</span>
          </button>

          {showQr && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center animate-fade-in">
              <img src={qrImageUrl} alt="QR Code" className="w-40 h-40 mx-auto rounded-lg shadow-xs" />
              <p className="text-[11px] text-gray-500 mt-2">Dùng camera điện thoại để quét và mở thiệp trực tiếp</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
