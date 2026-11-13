'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Sparkles, Menu, X, Phone, Heart, PlusCircle, Shield, User } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[#890F0D]/10 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand GP Studio99 */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#720000] via-[#890F0D] to-[#B91C1C] flex items-center justify-center text-white shadow-md shadow-[#890F0D]/20 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#B91C1C] bg-clip-text text-transparent">
                  GP STUDIO99
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#890F0D]/10 text-[#890F0D] border border-[#890F0D]/20">
                  THIỆP CÁ NHÂN
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Kỷ yếu Đà Nẵng • <span className="text-[#890F0D] font-semibold hover:underline">chupanhdanang.com</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-700">
            <Link href="/" className="hover:text-[#890F0D] transition-colors">
              Trang chủ
            </Link>
            <Link href="/#templates" className="hover:text-[#890F0D] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#890F0D]" />
              <span>Mẫu thiệp</span>
            </Link>
            <Link href="/#guide" className="hover:text-[#890F0D] transition-colors">
              Hướng dẫn
            </Link>
            <Link 
              href="/login" 
              className="hover:text-[#890F0D] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#890F0D]/20 bg-[#FFF8F8] text-[#890F0D] font-bold"
            >
              <User className="w-4 h-4" />
              <span>Thiệp của tôi</span>
            </Link>
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:0899236001" 
              className="flex items-center gap-2 text-xs font-bold text-[#890F0D] bg-[#890F0D]/5 hover:bg-[#890F0D]/10 px-3.5 py-2 rounded-xl transition-colors border border-[#890F0D]/20"
            >
              <Phone className="w-3.5 h-3.5 text-[#890F0D]" />
              <span>0899.236.001</span>
            </a>
            
            <Link
              href="/builder"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#720000] to-[#890F0D] hover:from-[#540000] hover:to-[#720000] shadow-md shadow-[#890F0D]/25 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo thiệp của bạn</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/builder"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#890F0D] shadow"
            >
              Tạo thiệp
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-[#890F0D]/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-[#890F0D]/15 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#890F0D]/5"
          >
            Trang chủ
          </Link>
          <Link
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#890F0D]/5"
          >
            Mẫu thiệp
          </Link>
          <Link
            href="/#guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#890F0D]/5"
          >
            Hướng dẫn tạo thiệp
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-bold text-[#890F0D] bg-[#FFF8F8] border border-[#890F0D]/20"
          >
            Thiệp của tôi / Đăng nhập
          </Link>
          <div className="pt-2 border-t border-[#890F0D]/10 flex items-center justify-between">
            <span className="text-xs text-gray-500">Hotline Kỷ Yếu GP Studio99:</span>
            <a href="tel:0899236001" className="text-sm font-bold text-[#890F0D]">0899.236.001</a>
          </div>
        </div>
      )}
    </header>
  );
}
