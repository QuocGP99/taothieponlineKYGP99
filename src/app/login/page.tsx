'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, 
  AlertCircle, Camera, ShieldCheck, Sparkles, Key, Zap, Info
} from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';
import { parseGoogleJwt } from '@/lib/googleAuth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [isLiveEmail, setIsLiveEmail] = useState<boolean | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Tích hợp Google Identity Services nếu có Google Client ID
  useEffect(() => {
    if (!googleClientId) return;

    const initGsi = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (!response?.credential) return;
            const payload = parseGoogleJwt(response.credential);
            const userEmail = payload?.email || 'user@gmail.com';
            const name = payload?.name || userEmail.split('@')[0];
            const avatar = payload?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

            const realUser = {
              email: userEmail.toLowerCase(),
              name,
              avatar,
              provider: 'google',
              token: response.credential,
              loginAt: new Date().toISOString()
            };

            if (typeof window !== 'undefined') {
              localStorage.setItem('gp_auth_user', JSON.stringify(realUser));
            }

            try {
              await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(realUser)
              });
            } catch (_) {}

            triggerConfetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#890F0D']
            });

            router.push(redirectTarget);
          }
        });

        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '320',
          text: 'continue_with',
          shape: 'pill'
        });
      }
    };

    const existingScript = document.getElementById('google-gsi-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [googleClientId, redirectTarget, router]);

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
    setWarningMessage(null);

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

      setVerificationToken(data.verificationToken || '');
      setSuccessMessage(data.message);
      setIsLiveEmail(data.isLiveEmail);

      if (data.warning) {
        setWarningMessage(data.warning);
      }

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

  // Tự động điền mã OTP khi có gợi ý (dành cho chế độ thử nghiệm)
  const handleQuickFillOtp = (code: string) => {
    const chars = code.split('').slice(0, 6);
    setOtpDigits(chars);
    inputRefs.current[5]?.focus();
  };

  // Đăng nhập nhanh bằng Google (1-Click Google Sign-In)
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockGoogleUser = {
        email: email.trim().toLowerCase() || 'hocsinh.kyeu@gmail.com',
        name: 'Học Sinh GP Studio99',
        provider: 'google',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        token: `gp_google_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        loginAt: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('gp_auth_user', JSON.stringify(mockGoogleUser));
      }

      triggerConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#890F0D']
      });

      router.push(redirectTarget);
    }, 500);
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
          otp: fullCode,
          verificationToken
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
      triggerConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#890F0D', '#720000', '#D97706']
      });

      // Chuyển hướng tới đích (mặc định /dashboard hoặc /builder nếu đang bấm tạo thiệp)
      router.push(redirectTarget);

    } catch (err: any) {
      setErrorMessage(err.message || 'Mã xác thực không đúng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          {redirectTarget.includes('builder') ? 'Đăng Nhập Để Tạo Thiệp' : 'Trình Quản Lý Thiệp Kỷ Yếu'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {redirectTarget.includes('builder')
            ? 'Xác thực Gmail để bảo vệ quyền sở hữu và quản lý thiệp mời của bạn.'
            : 'Đăng nhập bằng mã xác thực Gmail an toàn, không cần nhớ mật khẩu.'}
        </p>
      </div>

      {/* ======================================================== */}
      {/* BƯỚC 1: ĐĂNG NHẬP GOOGLE HOẶC GMAIL OTP                  */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Form Nhập Gmail duy nhất */}
          <form onSubmit={handleSendOTP} className="space-y-4">
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
        </div>
      )}

      {/* ======================================================== */}
      {/* BƯỚC 2: NHẬP 6 SỐ XÁC THỰC                              */}
      {/* ======================================================== */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4 animate-in fade-in">
          <div className="p-3 bg-[#FFF8F8] rounded-2xl border border-[#890F0D]/20 text-center text-xs">
            <span className="text-stone-500">Mã xác thực 6 số gửi tới:</span>
            <p className="font-extrabold text-[#720000] text-sm mt-0.5">{email}</p>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtpDigits(['', '', '', '', '', '']);
                setErrorMessage('');
                setDevOtpHint(null);
              }}
              className="text-[11px] text-[#890F0D] hover:underline font-bold mt-1 inline-block"
            >
              Đổi địa chỉ Gmail khác
            </button>
          </div>

          {/* Hộp hỗ trợ thử nghiệm nếu chưa cấu hình SMTP thực */}
          {devOtpHint && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">Chế độ thử nghiệm:</p>
                  <p className="text-[11px] text-amber-800">
                    Mã xác thực của bạn là: <strong className="font-mono text-sm tracking-widest text-[#720000] bg-white px-2 py-0.5 rounded border border-amber-300">{devOtpHint}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleQuickFillOtp(devOtpHint)}
                className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Bấm để tự động điền mã {devOtpHint}</span>
              </button>
            </div>
          )}

          {isLiveEmail && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã gửi email thực tế! Vui lòng kiểm tra hộp thư đến (hoặc mục Spam).</span>
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
                <span>Xác thực & Tiếp tục</span>
              </>
            )}
          </button>

          {/* Gửi lại mã OTP */}
          <div className="text-center text-xs text-stone-500 pt-1">
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
        <span className="text-stone-400 font-mono text-[11px]">GP Studio99</span>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col selection:bg-[#FEE2E2] selection:text-[#720000]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <Suspense fallback={
          <div className="w-12 h-12 rounded-2xl bg-[#890F0D] text-white flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
        }>
          <LoginContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
