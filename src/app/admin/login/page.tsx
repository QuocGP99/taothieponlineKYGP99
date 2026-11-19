'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, Eye, EyeOff, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      username: username.trim(),
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError('Tên đăng nhập hoặc mật khẩu quản trị không chính xác.');
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#890F0D]/15 space-y-6">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#240303] text-white flex items-center justify-center mx-auto shadow-md border border-[#890F0D]/30">
          <Shield className="w-7 h-7 text-amber-300" />
        </div>

        <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
          QUẢN TRỊ VIÊN HỆ THỐNG
        </span>

        <h1 className="text-2xl font-black text-stone-900 leading-snug">
          Đăng Nhập Admin
        </h1>

        <p className="text-xs text-stone-500 leading-relaxed font-normal">
          Dành riêng cho ban quản trị GP Studio99. Vui lòng nhập tài khoản được cấu hình trong hệ thống.
        </p>
      </div>

      {/* Báo lỗi nếu có */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-semibold leading-relaxed">{error}</span>
        </div>
      )}

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Tên đăng nhập (Username):
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              required
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-200 text-sm focus:border-[#890F0D] focus:ring-4 focus:ring-[#890F0D]/10 outline-none transition-all placeholder:text-stone-400 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Mật khẩu (Password):
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-2xl border-2 border-stone-200 text-sm focus:border-[#890F0D] focus:ring-4 focus:ring-[#890F0D]/10 outline-none transition-all placeholder:text-stone-400 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !username.trim() || !password}
          className="w-full py-4 px-6 rounded-2xl bg-[#890F0D] hover:bg-[#720000] text-white font-black text-sm tracking-wide shadow-xl shadow-[#890F0D]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Đang kiểm tra...</span>
            </>
          ) : (
            <span>Đăng Nhập Quản Trị</span>
          )}
        </button>
      </form>

      {/* Footer Back Link */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
        <Link href="/" className="text-stone-500 hover:text-[#890F0D] flex items-center gap-1 font-bold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>
        <span className="text-stone-400 font-mono text-[11px]">Bảo mật nội bộ</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F8] flex items-center justify-center p-4 selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-stone-200 animate-pulse text-center">
          <div className="w-14 h-14 rounded-2xl bg-stone-200 mx-auto mb-4" />
          <div className="h-6 w-48 bg-stone-200 rounded mx-auto mb-2" />
          <div className="h-4 w-64 bg-stone-100 rounded mx-auto" />
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
