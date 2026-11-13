'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, KeyRound, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Đếm ngược 60s gửi lại mã
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Nếu đã đăng nhập trước đó, cho phép vào thẳng dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gp_auth_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user?.email) {
            setEmail(user.email);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Bước 1: Gửi mã OTP về Gmail
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ Gmail hợp lệ.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.');
      }

      setSuccessMessage(data.message);
      if (data.debugOtp) {
        setDevOtpHint(data.debugOtp);
      }
      setStep(2);
      setCountdown(60);
      setCanResend(false);

      // Focus vào ô số đầu tiên
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý nhập từng ô số
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (clean.length > 1) {
      // Trường hợp dán chuỗi số
      const pasted = clean.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Phím Backspace quay lại ô trước
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Xử lý dán mã OTP (Paste)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setOtpDigits(newDigits);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  // Bước 2: Xác thực mã 6 số
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otpDigits.join('');

    if (fullCode.length !== 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: fullCode
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Mã xác thực không chính xác.');
      }

      // Lưu thông tin người dùng đã xác thực vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('gp_auth_user', JSON.stringify(data.user));
      }

      // Pháo hoa chào mừng
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#890F0D', '#720000', '#D97706']
      });

      // Chuyển hướng tới Trình Quản Lý Thiệp
      router.push('/dashboard');

    } catch (err: any) {
      setErrorMessage(err.message || 'Mã xác thực không đúng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#890F0D]/15 relative overflow-hidden">
          
          {/* Top Decorative Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#720000] via-[#890F0D] to-[#B91C1C] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#890F0D]/20">
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
              GP STUDIO99 • ĐĂNG NHẬP
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-2">
              Trình Quản Lý Thiệp Kỷ Yếu
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Đăng nhập bằng mã xác thực Gmail an toàn, không cần mật khẩu.
            </p>
          </div>

          {/* ======================================================== */}
          {/* BƯỚC 1: NHẬP ĐỊA CHỈ GMAIL                               */}
          {/* ======================================================== */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Địa chỉ Gmail của bạn <span className="text-[#890F0D]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#890F0D] outline-none font-medium"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                  Hệ thống sẽ gửi một mã xác thực 6 số đến Gmail này để bạn đăng nhập vào quản lý tất cả thiệp đã tạo.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#720000] hover:opacity-95 shadow-xl shadow-[#890F0D]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang gửi mã xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi mã xác thực 6 số</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* BƯỚC 2: NHẬP 6 SỐ XÁC THỰC                              */}
          {/* ======================================================== */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in fade-in">
              <div className="p-3 bg-[#FFF8F8] rounded-2xl border border-[#890F0D]/20 text-center text-xs">
                <span className="text-stone-500">Mã xác thực 6 số đã được gửi tới:</span>
                <p className="font-extrabold text-[#720000] text-sm mt-0.5">{email}</p>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpDigits(['', '', '', '', '', '']);
                    setErrorMessage('');
                  }}
                  className="text-[11px] text-[#890F0D] hover:underline font-bold mt-1 inline-block"
                >
                  Đổi địa chỉ Gmail khác
                </button>
              </div>

              {devOtpHint && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 text-center font-mono">
                  💡 Gợi ý mã OTP (chế độ thử nghiệm): <strong>{devOtpHint}</strong>
                </div>
              )}

              {/* 6 Ô nhập số riêng biệt */}
              <div>
                <label className="block text-xs font-bold text-stone-700 text-center mb-2.5">
                  Nhập mã xác thực 6 chữ số:
                </label>
                <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-2xl font-black text-[#720000] bg-white rounded-xl border-2 border-stone-300 focus:border-[#890F0D] focus:ring-2 focus:ring-[#890F0D]/20 outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otpDigits.join('').length !== 6}
                className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#720000] via-[#890F0D] to-[#720000] hover:opacity-95 shadow-xl shadow-[#890F0D]/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực mã...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Xác thực & Vào quản lý thiệp</span>
                  </>
                )}
              </button>

              {/* Gửi lại mã OTP */}
              <div className="text-center text-xs text-stone-500 pt-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={() => handleSendOTP()}
                    className="text-[#890F0D] font-bold hover:underline"
                  >
                    Chưa nhận được mã? Bấm gửi lại mã mới
                  </button>
                ) : (
                  <span>Gửi lại mã sau: <strong className="text-[#890F0D]">{countdown}s</strong></span>
                )}
              </div>
            </form>
          )}

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <Link href="/" className="text-stone-500 hover:text-[#890F0D] flex items-center gap-1 font-bold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về trang chủ</span>
            </Link>
            <Link href="/builder" className="text-[#890F0D] hover:underline font-bold">
              Tạo thiệp mới ngay
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
