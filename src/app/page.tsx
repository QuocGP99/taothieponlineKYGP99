'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetalsEffect from '@/components/PetalsEffect';
import InvitationCard from '@/components/InvitationCard';
import PromoBannerBar from '@/components/PromoBannerBar';
import MarketingShowcaseCard from '@/components/MarketingShowcaseCard';
import DiscountLeadForm from '@/components/DiscountLeadForm';
import { TEMPLATES, SAMPLE_INVITATION } from '@/data/templates';
import { TemplateCategory } from '@/types/invitation';
import {
  Sparkles, PlusCircle, ArrowRight, CheckCircle2,
  Camera, Heart, Share2, Mail, Users, Star,
  Calendar, Layers, ShieldCheck, ChevronRight, Phone, Clock, UserCheck
} from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');

  const filteredTemplates = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAF8F8] selection:bg-[#FEE2E2] selection:text-[#720000]">
      <PetalsEffect />
      <PromoBannerBar />
      <Navbar />

      {/* ========================================================= */}
      {/* SECTION 1: HERO SECTION                                   */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient Gradient Glows in Burgundy #890F0D & #720000 */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#890F0D]/15 via-[#FCA5A5]/20 to-[#720000]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-[#890F0D]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#890F0D]/10 border border-[#890F0D]/20 text-[#890F0D] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706] animate-spin" style={{ animationDuration: '8s' }} />
                <span>GP STUDIO99 • THIỆP MỜI KỶ YẾU CÁ NHÂN GỬI BẠN BÈ</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 leading-[1.15]">
                BIẾN BUỔI CHỤP KỶ YẾU THÀNH{' '}
                <span className="bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#B91C1C] bg-clip-text text-transparent">
                  MỘT NGÀY ĐÁNG NHỚ!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
                Tự tay tạo thiệp mời kỷ yếu cá nhân gửi đến bạn thân, bạn cùng trường và gia đình. Chọn mẫu, thêm ảnh chân dung, định khung giờ đón bạn bè và gửi link nhận phản hồi RSVP tức thì.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/builder"
                  className="px-8 py-4 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#B91C1C] hover:from-[#540000] hover:to-[#720000] shadow-xl shadow-[#890F0D]/30 hover:shadow-2xl hover:shadow-[#890F0D]/40 transform hover:-translate-y-1 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>TẠO THIỆP POSTER CỦA BẠN NGAY</span>
                </Link>

                <a
                  href="/thiep-moi/hoang-ngoc-dai-hoc-dong-a-2027"
                  className="px-6 py-4 rounded-2xl font-bold text-sm text-[#720000] bg-white/90 hover:bg-white border border-[#890F0D]/20 shadow-xs hover:shadow transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#890F0D]" />
                  <span>Xem thiệp mẫu thực tế</span>
                </a>

                <a
                  href="#guide"
                  className="px-5 py-4 rounded-2xl font-semibold text-sm text-stone-600 hover:text-[#890F0D] hover:underline transition-colors"
                >
                  Xem hướng dẫn
                </a>
              </div>

              {/* Proof badges */}
              <div className="pt-6 border-t border-[#890F0D]/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thiệp cá nhân hóa từng học sinh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Khung giờ đón bạn bè chụp chung</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Nhận hoa & lời chúc RSVP trực tiếp</span>
                </div>
              </div>

            </div>

            {/* Right: Phone Mockup of Personal Live Invitation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">

                {/* Floating decor pills */}
                <div className="absolute -top-6 -left-6 z-20 bg-white/95 backdrop-blur px-3.5 py-2 rounded-2xl shadow-xl border border-[#890F0D]/15 flex items-center gap-2 text-xs font-bold text-[#720000] animate-float-slow">
                  <Heart className="w-4 h-4 text-[#E11D48] fill-[#E11D48]" />
                  <span>286 Bạn bè đã xem thiệp</span>
                </div>

                <div className="absolute -bottom-6 -right-6 z-20 bg-white/95 backdrop-blur px-3.5 py-2 rounded-2xl shadow-xl border border-[#890F0D]/15 flex items-center gap-2 text-xs font-bold text-stone-900 animate-float-slow" style={{ animationDelay: '2s' }}>
                  <Users className="w-4 h-4 text-[#890F0D]" />
                  <span>Hẹn gặp tại sân trường!</span>
                </div>

                {/* Smartphone Container Frame */}
                <div className="relative bg-[#1A0505] p-3 sm:p-4 rounded-[42px] shadow-2xl border-4 border-stone-800">
                  <div className="w-28 h-4 bg-stone-900 rounded-full mx-auto mb-3" />

                  {/* Inner Screen */}
                  <div className="bg-[#FAF8F8] rounded-[32px] overflow-hidden max-h-[580px] overflow-y-auto p-2 scrollbar-none">
                    <InvitationCard data={SAMPLE_INVITATION} isInteractive={false} />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* KHỐI QUẢNG CÁO KỶ YẾU GP STUDIO99 & FORM NHẬN ƯU ĐÃI 10%    */}
      {/* (Nằm ngay trước phần QUY TRÌNH ĐƠN GIẢN)                  */}
      {/* ========================================================= */}
      <section className="py-8 sm:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <MarketingShowcaseCard />
          <DiscountLeadForm />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: CÁCH TẠO THIỆP (4 BƯỚC)                        */}
      {/* ========================================================= */}
      <section id="guide" className="py-20 bg-white border-y border-[#890F0D]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3.5 py-1 rounded-full">
              QUY TRÌNH ĐƠN GIẢN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mt-3">
              Tạo Thiệp Mời Kỷ Yếu Cá Nhân Trong 3 Phút
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Dành riêng cho bạn để gửi lời mời đến hội bạn thân, bạn cùng trường, người thương và gia đình ghé qua chụp ảnh kỷ niệm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Step 1 */}
            <div className="bg-[#FFF8F8] p-6 rounded-3xl border border-[#890F0D]/15 relative group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#890F0D] text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-[#890F0D]/30 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Tải ảnh & Đổi tên Poster</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Tải ảnh chân dung cử nhân / áo dài của bạn, tùy chỉnh tên nghệ thuật nổi bật hai bên ảnh và tên khách mời.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFF8F8] p-6 rounded-3xl border border-[#890F0D]/15 relative group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#890F0D] text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-[#890F0D]/30 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Lịch trình & Google Maps</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Cập nhật timeline các mốc giờ chụp, khung giờ đón bạn bè và tự động liên kết vị trí Google Maps chỉ đường.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFF8F8] p-6 rounded-3xl border border-[#890F0D]/15 relative group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#890F0D] text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-[#890F0D]/30 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Trang phục & Album ảnh</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Gợi ý dress code, viết lời nhắn thanh xuân ấm áp và thêm ảnh vào album kỷ niệm để bạn bè cùng chiêm ngưỡng.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#FFF8F8] p-6 rounded-3xl border border-[#890F0D]/15 relative group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#720000] to-[#890F0D] text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-[#890F0D]/30 group-hover:scale-110 transition-transform">
                4
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Xuất bản & Chia sẻ ngay</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Nhận đường link thiệp riêng ngay tức thì (không cần nhập Gmail), dễ dàng gửi qua Zalo, Messenger, Facebook!
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#720000] to-[#890F0D] hover:opacity-95 shadow-lg shadow-[#890F0D]/30"
            >
              <span>BẮT ĐẦU TẠO THIỆP NGAY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: THƯ VIỆN MẪU THIỆP (12 TEMPLATES)              */}
      {/* ========================================================= */}
      <section id="templates" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3.5 py-1 rounded-full">
              PHONG CÁCH POSTER ĐỘC QUYỀN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mt-3">
              Mẫu Thiệp Kỷ Yếu Cá Nhân Poster Hiện Đại
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Bố cục chuyên nghiệp chuẩn phong cách nghệ thuật GP Studio99 — tôn vinh trọn vẹn nét đẹp thanh xuân và cá tính riêng của bạn.
            </p>
          </div>

          {/* Template Feature Showcase */}
          <div className="max-w-xl mx-auto">
            {TEMPLATES.map(tmpl => (
              <div
                key={tmpl.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#890F0D]/20 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail Image */}
                <div className="relative h-96 overflow-hidden bg-stone-100">
                  <img
                    src={tmpl.previewImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {tmpl.badge && (
                    <span className="absolute top-4 left-4 bg-[#890F0D] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow">
                      {tmpl.badge}
                    </span>
                  )}

                  <span className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-[10px] font-mono px-2.5 py-1 rounded-md">
                    {tmpl.styleName}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-[#FCA5A5] block uppercase tracking-wider">
                      {tmpl.categoryName}
                    </span>
                    <h3 className="text-2xl font-black mt-0.5">{tmpl.name}</h3>
                  </div>
                </div>

                {/* Body description */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {tmpl.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#890F0D]">
                      Màu chủ đạo: #890F0D & #720000
                    </span>
                    <Link
                      href={`/builder?template=${tmpl.id}`}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#890F0D] hover:bg-[#720000] shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Tạo thiệp theo mẫu này</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: GIỚI THIỆU KỶ YẾU ĐÀ NẴNG GP STUDIO99          */}
      {/* ========================================================= */}
      <section className="py-20 bg-gradient-to-br from-[#2B0504] via-[#540000] to-[#2B0504] text-white relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#890F0D]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest bg-white/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full">
              KỶ YẾU ĐÀ NẴNG – GP STUDIO99 (TỪ 2018)
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight leading-tight">
              THANH XUÂN CHỈ CÓ MỘT LẦN –{' '}
              <span className="bg-gradient-to-r from-amber-300 via-rose-200 to-amber-100 bg-clip-text text-transparent">
                HÃY ĐỂ GP STUDIO99 LƯU GIỮ!
              </span>
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed">
              GP Studio99 – Đơn vị chụp ảnh & quay phim kỷ yếu uy tín tại Đà Nẵng, Quảng Nam, Huế. Hơn 1.000+ lớp đã tin tưởng gửi gắm kỷ niệm tuổi học trò.
            </p>
          </div>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#890F0D] flex items-center justify-center text-white mb-5 shadow-lg">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đa Dạng Concept Thanh Xuân</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Concept Thanh xuân (Xám, Nâu, Xanh đen), Học sinh Hàn Quốc, Áo dài trắng, Cổ phục Việt Nam, Concept Đồ bao cấp và Party bãi biển.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#890F0D] flex items-center justify-center text-white mb-5 shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Xem Trước 3-5 Bản Demo Màu</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Đặc quyền của khách hàng GP Studio99: được xem trước từ 3-5 bản demo màu ảnh và đóng góp ý kiến trước khi tiến hành hậu kỳ hoàn thiện.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#890F0D] flex items-center justify-center text-white mb-5 shadow-lg">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trang Phục & Ekip Tận Tâm</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Kho trang phục đầy đủ phụ kiện (vòng hoa, nơ, cà vạt, pháo khói, gấu tốt nghiệp). Ekip có thợ chụp, thợ quay vlog và stylist hướng dẫn tạo dáng.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-[#540000] via-[#720000] to-[#540000] border border-[#890F0D]/50 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              Tư Vấn & Đặt Lịch Chụp Kỷ Yếu Cùng GP Studio99
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto mb-6">
              Liên hệ ngay để nhận báo giá chi tiết, trọn bộ concept mới nhất và ưu đãi gói quay Flycam toàn trường cho lớp của bạn!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://chupanhdanang.com"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-2xl font-black text-sm text-[#540000] bg-amber-300 hover:bg-amber-200 shadow-xl transition-all"
              >
                TRUY CẬP CHUPANHDANANG.COM
              </a>
              <a
                href="tel:0899236001"
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-white/15 hover:bg-white/25 border border-white/30 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Hotline / Zalo: 0899.236.001</span>
              </a>
              <Link
                href="/builder"
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-rose-200 hover:text-white flex items-center gap-1.5"
              >
                <span>Tạo thiệp cá nhân ngay →</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
