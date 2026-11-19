'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2,
  AlertCircle, ShieldCheck, Sparkles, Key
} from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';
import { validateEmailInput } from '@/lib/validation';

export const dynamic = 'force-dynamic';

function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect') || '/dashboard';

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Kiểm tra session hiện có khi tải trang
  useEffect(() => {
    const savedUser = localStorage.getItem('gp_auth_user');
    if (savedUser) {
      router.push(redirectTarget);
    }
  }, [router, redirectTarget]);

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

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError) {
      const check = validateEmailInput(val);
      if (check.isValid) {
        setEmailError('');
        setEmailSuggestion('');
      }
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) return;
    const check = validateEmailInput(email);
    if (!check.isValid) {
      setEmailError(check.error);
      setEmailSuggestion(check.suggestion || '');
    } else {
      setEmailError('');
      setEmailSuggestion('');
    }
  };

  // Bước 1: Gửi mã OTP từ lienhe@taothiepkyyeugp99.io.vn
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const validation = validateEmailInput(cleanEmail);

    if (!validation.isValid) {
      setEmailError(validation.error);
      setEmailSuggestion(validation.suggestion || '');
      return;
    }

    setEmailError('');
    setEmailSuggestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.');
      }

      // NẾU TÀI KHOẢN ĐÃ CÓ TRÊN HỆ THỐNG: ĐĂNG NHẬP THẲNG, BỎ QUA OTP!
      if (data.isExistingUser && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gp_auth_user', JSON.stringify(data.user));
        }

        triggerConfetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#890F0D', '#B91C1C', '#E11D48', '#F59E0B', '#10B981']
        });

        setSuccessMessage(data.message || 'Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 300);
        return;
      }

      // NẾU LÀ TÀI KHOẢN MỚI: BƯỚC 2 NHẬP MÃ OTP 6 SỐ
      setVerificationToken(data.verificationToken || '');
      setSuccessMessage(data.message || 'Mã xác thực 6 số đã được gửi thành công.');
      setStep(2);
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);

    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý nhập từng ô số
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');

    if (clean.length > 1) {
      const pasted = clean.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
    const fullCode = otpDigits.join('').trim();

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
          email: email.trim().toLowerCase(),
          otp: fullCode,
          verificationToken
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Mã xác thực không chính xác hoặc đã hết hạn.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('gp_auth_user', JSON.stringify(data.user));
      }

      triggerConfetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#890F0D', '#B91C1C', '#E11D48', '#F59E0B', '#10B981']
      });

      router.push(redirectTarget);

    } catch (err: any) {
      setErrorMessage(err.message || 'Mã xác thực không đúng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#890F0D]/15 relative overflow-hidden space-y-6">

      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#720000] via-[#890F0D] to-[#B91C1C] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#890F0D]/20">
          <Sparkles className="w-7 h-7 text-amber-300" />
        </div>

        <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
          XÁC THỰC & ĐĂNG NHẬP
        </span>

        <h1 className="text-2xl font-black text-stone-900 leading-snug">
          {step === 1 ? 'Nhập Gmail Của Bạn' : 'Nhập Mã Xác Thực 6 Số'}
        </h1>

        <p className="text-xs text-stone-600 leading-relaxed font-normal">
          {step === 1 ? (
            <>
              Nhập Gmail của bạn. Nếu tài khoản đã có trên hệ thống, bạn sẽ được <strong className="text-[#890F0D] font-bold">chuyển thẳng vào trang quản lý thiệp</strong>. Tài khoản mới sẽ nhận mã xác thực 6 số để kích hoạt lần đầu.
            </>
          ) : (
            <>
              Mã xác thực 6 số đã được gửi đến: <strong className="text-[#890F0D] font-bold">{email}</strong>. Vui lòng kiểm tra Hộp thư đến (hoặc Thư rác/Spam).
            </>
          )}
        </p>
      </div>

      {/* Báo lỗi nếu có */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-semibold leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* BƯỚC 1: NHẬP GMAIL */}
      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Địa chỉ Gmail của bạn:
            </label>
            <div className="relative">
              <Mail className={`w-5 h-5 absolute left-4 top-3.5 transition-colors ${emailError ? 'text-rose-500' : 'text-stone-400'}`} />
              <input
                type="email"
                required
                placeholder="vidu: hocsinh.kyeu@gmail.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 text-sm outline-none transition-all placeholder:text-stone-400 ${
                  emailError
                    ? 'border-rose-500 bg-rose-50/20 text-stone-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/15'
                    : 'border-stone-200 focus:border-[#890F0D] focus:ring-4 focus:ring-[#890F0D]/10'
                }`}
              />
            </div>

            {/* Báo lỗi trực tiếp ngay bên dưới thanh nhập */}
            {emailError && (
              <div className="mt-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{emailError}</span>
                </div>
                {emailSuggestion && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(emailSuggestion);
                      setEmailError('');
                      setEmailSuggestion('');
                    }}
                    className="self-start text-[11px] font-bold text-[#890F0D] bg-white hover:bg-[#890F0D] hover:text-white px-3 py-1.5 rounded-lg border border-[#890F0D]/30 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>💡 Đổi nhanh thành:</span>
                    <span className="underline">{emailSuggestion}</span>
                  </button>
                )}
              </div>
            )}

            <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gửi an toàn từ hòm thư lienhe@taothiepkyyeugp99.io.vn</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-[#890F0D] hover:bg-[#720000] text-white font-black text-sm tracking-wide shadow-xl shadow-[#890F0D]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Đang kiểm tra tài khoản...</span>
              </>
            ) : (
              <>
                <span>Tiếp tục đăng nhập</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      {/* BƯỚC 2: NHẬP MÃ 6 SỐ */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-stone-700 text-center mb-2.5">
              Nhập mã 6 chữ số:
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

          <button
            type="submit"
            disabled={isLoading || otpDigits.join('').trim().length !== 6}
            className="w-full py-4 px-6 rounded-2xl bg-[#890F0D] hover:bg-[#720000] text-white font-black text-sm tracking-wide shadow-xl shadow-[#890F0D]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Đang kiểm tra mã...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                <span>Xác Nhận & Bắt Đầu Tạo Thiệp</span>
              </>
            )}
          </button>

          {/* Gửi lại hoặc đổi email */}
          <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorMessage('');
                setOtpDigits(['', '', '', '', '', '']);
              }}
              className="hover:text-[#890F0D] flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Đổi Gmail khác</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendOTP()}
              disabled={!canResend || isLoading}
              className="hover:text-[#890F0D] font-medium disabled:opacity-40 disabled:hover:text-stone-500"
            >
              {canResend ? 'Gửi lại mã mới' : `Gửi lại sau (${countdown}s)`}
            </button>
          </div>
        </form>
      )}

      {/* Footer Back Link */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
        <Link href="/" className="text-stone-500 hover:text-[#890F0D] flex items-center gap-1 font-bold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>
        <span className="text-stone-400 font-mono text-[11px]">GP Studio99</span>
      </div>

    </div>
  );
}

// Fallback tĩnh tức thời để KHÔNG BAO GIỜ bị treo spinner trắng trang
function LoginCardSkeleton() {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#890F0D]/15 relative overflow-hidden space-y-6 animate-pulse">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-stone-200 mx-auto" />
        <div className="h-4 w-32 bg-stone-200 rounded-full mx-auto" />
        <div className="h-6 w-48 bg-stone-200 rounded-md mx-auto" />
        <div className="h-3 w-64 bg-stone-100 rounded mx-auto" />
      </div>
      <div className="space-y-3">
        <div className="h-12 bg-stone-100 rounded-2xl" />
        <div className="h-12 bg-[#890F0D]/40 rounded-2xl" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <Suspense fallback={<LoginCardSkeleton />}>
          <LoginCard />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
