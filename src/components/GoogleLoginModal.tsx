'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Mail, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';
import { validateEmailInput } from '@/lib/validation';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
  redirectUrl?: string;
  templateName?: string;
}

export default function GoogleLoginModal({
  isOpen,
  onClose,
  onSuccess,
  redirectUrl,
  templateName = 'Template Kỷ Yếu'
}: GoogleLoginModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Đếm ngược thời gian gửi lại mã OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

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
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể gửi mã xác thực. Vui lòng kiểm tra lại cấu hình.');
      }

      // NẾU TÀI KHOẢN ĐÃ CÓ TRÊN HỆ THỐNG: ĐĂNG NHẬP THẲNG, BỎ QUA OTP!
      if (data.isExistingUser && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gp_auth_user', JSON.stringify(data.user));
        }
        triggerConfetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#890F0D']
        });
        if (onSuccess) onSuccess(data.user);
        onClose();
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
        return;
      }

      setVerificationToken(data.verificationToken || '');
      setSuccessMessage(data.message || 'Đã gửi mã xác thực 6 số thành công.');
      setStep(2);
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);

      // Tự động focus vào ô số đầu tiên
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);

    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ khi gửi mã xác thực.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi gõ mã số OTP vào 6 ô
  const handleOtpChange = (index: number, val: string) => {
    const rawVal = val.replace(/\D/g, '');

    // Nếu paste cả chuỗi 6 số
    if (rawVal.length >= 6) {
      const parts = rawVal.slice(0, 6).split('');
      setOtpDigits(parts);
      inputRefs.current[5]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = rawVal.slice(-1);
    setOtpDigits(newDigits);

    // Tự động nhảy sang ô tiếp theo
    if (rawVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Bước 2: Xác thực mã 6 số
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('').trim();

    if (fullOtp.length !== 6) {
      setErrorMessage('Vui lòng nhập đầy đủ 6 chữ số mã xác thực.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
          verificationToken
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Mã xác thực không chính xác hoặc đã hết hạn.');
      }

      // Xác thực thành công: Lưu phiên đăng nhập
      if (typeof window !== 'undefined') {
        localStorage.setItem('gp_auth_user', JSON.stringify(data.user));
      }

      // Bắn pháo hoa chào mừng
      triggerConfetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#890F0D', '#B91C1C', '#E11D48', '#F59E0B', '#10B981']
      });

      setLoading(false);

      if (onSuccess) {
        onSuccess(data.user);
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        onClose();
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'Mã xác thực không chính xác.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#890F0D]/20 overflow-hidden space-y-6">
        
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề & Biểu tượng */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#720000] via-[#890F0D] to-[#B91C1C] text-white flex items-center justify-center shadow-lg shadow-[#890F0D]/25">
            <Sparkles className="w-7 h-7 text-amber-300" />
          </div>

          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
            XÁC THỰC TÀI KHOẢN TẠO THIỆP
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
            {step === 1 ? 'Nhập Gmail Của Bạn' : 'Nhập Mã Xác Thực 6 Số'}
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            {step === 1 ? (
              <>
                Để bắt đầu tạo và lưu thiệp mời mẫu <strong className="text-[#890F0D] font-bold">"{templateName}"</strong>, hệ thống sẽ gửi mã 6 số từ <strong className="text-stone-800 font-semibold">lienhe@taothiepkyyeugp99.io.vn</strong> để kích hoạt quyền tạo thiệp.
              </>
            ) : (
              <>
                Mã 6 số đã được gửi đến: <strong className="text-[#890F0D] font-bold">{email}</strong>. Vui lòng kiểm tra Hộp thư đến (hoặc Thư rác/Spam).
              </>
            )}
          </p>
        </div>

        {/* Báo lỗi đỏ nếu có */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* BƯỚC 1: NHẬP GMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Địa chỉ Gmail của bạn:
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${emailError ? 'text-rose-500' : 'text-stone-400'}`} />
                <input
                  type="email"
                  required
                  placeholder="vidu: hocsinh.kyeu@gmail.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  className={`w-full pl-10 pr-3 py-3 rounded-xl border text-sm outline-none transition-all placeholder:text-stone-400 ${
                    emailError
                      ? 'border-rose-500 bg-rose-50/20 text-stone-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600'
                      : 'border-stone-300 focus:ring-2 focus:ring-[#890F0D] focus:border-[#890F0D]'
                  }`}
                />
              </div>

              {/* Báo lỗi trực tiếp ngay bên dưới thanh nhập */}
              {emailError && (
                <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex flex-col gap-1.5 animate-fadeIn">
                  <div className="flex items-start gap-1.5">
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
                      className="self-start text-[11px] font-bold text-[#890F0D] bg-white hover:bg-[#890F0D] hover:text-white px-2.5 py-1 rounded-lg border border-[#890F0D]/30 transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>💡 Đổi nhanh thành:</span>
                      <span className="underline">{emailSuggestion}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#890F0D] hover:bg-[#720000] text-white font-bold text-sm shadow-lg shadow-[#890F0D]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang gửi mã từ lienhe@taothiepkyyeugp99.io.vn...</span>
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

        {/* BƯỚC 2: NHẬP MÃ 6 SỐ */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 text-center">
                Nhập 6 chữ số mã xác thực:
              </label>
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border-2 border-stone-200 focus:border-[#890F0D] focus:ring-2 focus:ring-[#890F0D]/20 outline-none transition-all bg-stone-50 focus:bg-white text-stone-900"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpDigits.join('').trim().length !== 6}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#890F0D] hover:bg-[#720000] text-white font-bold text-sm shadow-lg shadow-[#890F0D]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang kiểm tra mã xác thực...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
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
                }}
                className="hover:text-[#890F0D] flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Đổi Gmail khác</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendOTP()}
                disabled={!canResend || loading}
                className="hover:text-[#890F0D] font-medium disabled:opacity-40 disabled:hover:text-stone-500"
              >
                {canResend ? 'Gửi lại mã mới' : `Gửi lại sau (${countdown}s)`}
              </button>
            </div>
          </form>
        )}

        {/* Chân trang bảo mật */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bảo mật 100% qua iNET OxMail • Hotline / Zalo: 0899.236.001</span>
        </div>

      </div>
    </div>
  );
}
