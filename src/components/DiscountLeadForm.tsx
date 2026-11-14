'use client';

import React, { useState } from 'react';
import { 
  Gift, CheckCircle2, Phone, MessageCircle, 
  Send, Sparkles, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function DiscountLeadForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    schoolClass: '',
    studentCount: '',
    region: 'Đà Nẵng',
    expectedMonth: 'Tháng 4',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState('GPKY10-XUAN2026');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.schoolClass.trim()) {
      setError('Vui lòng điền Họ tên, Số điện thoại và Trường – lớp của bạn.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Có lỗi xảy ra khi gửi thông tin');
      }

      if (json.lead?.discountCode) {
        setDiscountCode(json.lead.discountCode);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Không thể gửi dữ liệu, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="lead-discount-form" className="relative scroll-mt-24">
      
      {/* Background card container with glass & gentle gradient */}
      <div className="relative rounded-[32px] sm:rounded-[36px] bg-white border border-[#890F0D]/20 shadow-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
        
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#890F0D]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {success ? (
          /* ========================================================== */
          /* SUCCESS STATE: GP STUDIO99 ĐÃ NHẬN THÔNG TIN & SẼ LIÊN HỆ  */
          /* ========================================================== */
          <div className="py-10 text-center max-w-xl mx-auto space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ĐĂNG KÝ THÀNH CÔNG</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                🎉 GP Studio99 đã nhận thông tin và sẽ liên hệ lớp trong 15 phút!
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                Tư vấn viên sẽ gọi điện hoặc kết nối qua Zalo <strong className="text-stone-900 font-bold">{formData.phone}</strong> để tư vấn chi tiết concept, trang phục và áp dụng mã giảm giá 10% trọn gói cho lớp <strong className="text-stone-900 font-bold">{formData.schoolClass}</strong>.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F5] to-[#FEE2E2] border border-[#890F0D]/20 inline-block">
              <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Mã ưu đãi của bạn</p>
              <div className="text-xl sm:text-2xl font-black text-[#890F0D] tracking-widest mt-1">
                {discountCode}
              </div>
              <p className="text-[11px] text-[#890F0D] mt-1 font-medium">
                (Đã lưu vào hệ thống GP Studio99 - Áp dụng giảm 10% khi chốt hợp đồng)
              </p>
            </div>

            {/* Fast Connection Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://zalo.me/0899236001`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-[#0068FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Nhắn tin Zalo giữ ưu đãi ngay</span>
              </a>

              <a
                href="tel:0899236001"
                className="px-6 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-[#890F0D]" />
                <span>Gọi Hotline: 0899 236 001</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setFormData({
                  fullName: '',
                  phone: '',
                  schoolClass: '',
                  studentCount: '',
                  region: 'Đà Nẵng',
                  expectedMonth: 'Tháng 4',
                  notes: ''
                });
              }}
              className="text-xs text-stone-500 hover:text-[#890F0D] underline font-medium cursor-pointer"
            >
              Đăng ký thêm cho lớp khác
            </button>
          </div>
        ) : (
          /* ========================================================== */
          /* FORM ENTRY: 2 COLUMNS (Chuẩn ảnh tham khảo 1)              */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Offer Details & Guarantees */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Pink -10% Badge */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D81B60] via-[#E91E63] to-[#FF4081] text-white flex items-center justify-center font-black text-xl shadow-xl shadow-pink-600/30">
                -10%
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug">
                  Nhận ưu đãi{' '}
                  <span className="text-[#D81B60]">giảm 10%</span>{' '}
                  gói chụp kỷ yếu GP Studio99
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed font-normal">
                  Để lại thông tin, bạn nhận ngay mã giảm 10%. Tư vấn viên GP Studio99 sẽ gọi lại để tư vấn concept và báo giá phù hợp nhất cho lớp.
                </p>
              </div>

              {/* Guarantees with pink checkmarks */}
              <div className="space-y-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D81B60] shrink-0 mt-0.5" />
                  <span>Áp dụng cho đặt lịch chụp kỷ yếu tập thể lớp</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D81B60] shrink-0 mt-0.5" />
                  <span>Tư vấn hoàn toàn miễn phí, không bắt buộc đặt lịch</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D81B60] shrink-0 mt-0.5" />
                  <span>Thông tin bảo mật, chỉ dùng để GP Studio99 liên hệ tư vấn</span>
                </div>
              </div>

              {/* Direct call hint */}
              <div className="pt-2 text-xs sm:text-sm text-stone-600 font-medium flex items-center gap-2">
                <span>Cần gấp? Gọi ngay:</span>
                <a 
                  href="tel:0899236001" 
                  className="font-black text-[#890F0D] hover:underline flex items-center gap-1 text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 fill-[#890F0D]" />
                  <span>0899 236 001</span>
                </a>
              </div>

            </div>

            {/* Right Column: Form Fields */}
            <div className="lg:col-span-7 bg-[#FFFBFB] p-6 sm:p-8 rounded-3xl border border-[#890F0D]/15 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#890F0D] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>

                  {/* Số điện thoại / Zalo */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Số điện thoại / Zalo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#890F0D] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Trường - Lớp */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Trường – lớp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12A1 – THPT Ông Ích Khiêm, Đà Nẵng"
                    value={formData.schoolClass}
                    onChange={(e) => setFormData({ ...formData, schoolClass: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#890F0D] focus:border-transparent transition-all shadow-xs"
                  />
                </div>

                {/* Sĩ số - Khu vực - Dự kiến chụp (3 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Sĩ số */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Sĩ số
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 40"
                      min={5}
                      max={120}
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#890F0D] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>

                  {/* Khu vực */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Khu vực
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#890F0D] focus:border-transparent transition-all shadow-xs"
                    >
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Quảng Nam">Quảng Nam</option>
                      <option value="Huế">Huế</option>
                      <option value="Quảng Ngãi">Quảng Ngãi</option>
                      <option value="Khác">Khu vực khác</option>
                    </select>
                  </div>

                  {/* Dự kiến chụp */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Dự kiến chụp
                    </label>
                    <select
                      value={formData.expectedMonth}
                      onChange={(e) => setFormData({ ...formData, expectedMonth: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#890F0D] focus:border-transparent transition-all shadow-xs"
                    >
                      <option value="Chưa rõ">Chưa rõ</option>
                      <option value="Tháng 2">Tháng 2</option>
                      <option value="Tháng 3">Tháng 3</option>
                      <option value="Tháng 4">Tháng 4</option>
                      <option value="Tháng 5">Tháng 5</option>
                      <option value="Tháng 10">Tháng 10</option>
                      <option value="Tháng 11">Tháng 11</option>
                      <option value="Tháng 12">Tháng 12</option>
                    </select>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Ghi chú
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Concept yêu thích, địa điểm muốn chụp, yêu cầu đặc biệt..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#890F0D] focus:border-transparent transition-all shadow-xs"
                  />
                </div>

                {/* Nút Nhận mã giảm 10% */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E91E63] to-[#FF4081] hover:from-[#C2185B] hover:to-[#D81B60] text-white font-extrabold text-sm shadow-xl shadow-pink-600/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Gift className="w-4 h-4" />
                      <span>🎁 Nhận mã giảm 10%</span>
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
