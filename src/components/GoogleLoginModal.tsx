'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, ShieldCheck, Mail, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';
import { parseGoogleJwt } from '@/lib/googleAuth';

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
  const [loading, setLoading] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [customEmailMode, setCustomEmailMode] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Xử lý khi nhận được Token thực tế từ Google Identity Services
  const handleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) return;

    setLoading(true);
    try {
      const payload = parseGoogleJwt(response.credential);
      const email = payload?.email || 'user.google@gmail.com';
      const name = payload?.name || email.split('@')[0].toUpperCase();
      const avatar = payload?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

      const realGoogleUser = {
        email: email.toLowerCase(),
        name,
        avatar,
        provider: 'google',
        token: response.credential,
        loginAt: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('gp_auth_user', JSON.stringify(realGoogleUser));
      }

      // Lưu tài khoản vào MySQL Backend
      try {
        await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(realGoogleUser)
        });
      } catch (e) {
        console.warn('[AUTH/Google] Lưu user MySQL warning:', e);
      }

      // Pháo hoa chào mừng
      triggerConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#890F0D']
      });

      setLoading(false);

      if (onSuccess) {
        onSuccess(realGoogleUser);
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        onClose();
      }
    } catch (err) {
      console.error('[GoogleLoginModal] Lỗi xử lý token Google:', err);
      setLoading(false);
    }
  };

  // Nạp Google GSI Script khi có Client ID và Modal đang mở
  useEffect(() => {
    if (!isOpen) return;

    if (!googleClientId) {
      return;
    }

    // Đã nạp script chưa?
    const existingScript = document.getElementById('google-gsi-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGsiLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setGsiLoaded(true);
    }
  }, [isOpen, googleClientId]);

  // Khởi tạo và render nút Google chính thức nếu có Client ID
  useEffect(() => {
    if (!isOpen || !gsiLoaded || !googleClientId || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleBtnContainerRef.current) {
        googleBtnContainerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          theme: 'outline',
          size: 'large',
          width: '320',
          text: 'continue_with',
          shape: 'pill',
        });
      }
    } catch (e) {
      console.warn('[GoogleLoginModal] Lỗi khởi tạo GSI button:', e);
    }
  }, [isOpen, gsiLoaded, googleClientId]);

  if (!isOpen) return null;

  // Fallback: Đăng nhập mô phỏng hoặc nhập Gmail trực tiếp (khi chưa cấu hình Client ID)
  const handleFallbackSignIn = (selectedEmail?: string) => {
    setLoading(true);

    const emailToUse = selectedEmail || googleEmail.trim() || 'hocsinh.kyeu@gmail.com';
    const namePart = emailToUse.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();

    setTimeout(async () => {
      const mockGoogleUser = {
        email: emailToUse.toLowerCase(),
        name: namePart || 'Học Sinh GP Studio99',
        provider: 'google',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        token: `gp_google_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        loginAt: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('gp_auth_user', JSON.stringify(mockGoogleUser));
      }

      // Lưu tài khoản vào MySQL Backend
      try {
        await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockGoogleUser)
        });
      } catch (e) {
        console.warn('Could not sync user to MySQL:', e);
      }

      // Bắn pháo hoa chào mừng
      triggerConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#890F0D']
      });

      setLoading(false);

      if (onSuccess) {
        onSuccess(mockGoogleUser);
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#890F0D]/20 overflow-hidden space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#720000] via-[#890F0D] to-[#B91C1C] text-white flex items-center justify-center shadow-lg shadow-[#890F0D]/25">
            <Sparkles className="w-7 h-7 text-amber-300" />
          </div>

          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#890F0D] bg-[#890F0D]/10 px-3 py-1 rounded-full border border-[#890F0D]/20">
            CHỈNH SỬA TEMPLATE
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
            Đăng Nhập Bằng Google
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            Để chỉnh sửa và lưu thiết kế cho mẫu <strong className="text-[#890F0D] font-bold">"{templateName}"</strong>, vui lòng đăng nhập để hệ thống tạo đường link thiệp riêng của bạn.
          </p>
        </div>

        {/* Action: Real Google Button or Fallback */}
        <div className="space-y-4">
          
          {/* TRƯỜNG HỢP 1: ĐÃ CÓ GOOGLE CLIENT ID (PRODUCTION REAL GOOGLE SIGN-IN) */}
          {googleClientId ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div ref={googleBtnContainerRef} className="min-h-[44px] flex items-center justify-center w-full" />
              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xác thực an toàn qua Google Identity Services</span>
              </p>
            </div>
          ) : (
            /* TRƯỜNG HỢP 2: CHƯA CÓ GOOGLE CLIENT ID (DEV / THỬ NGHIỆM TIỆN LỢI) */
            <div className="space-y-3">
              {!customEmailMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleFallbackSignIn()}
                    disabled={loading}
                    className="w-full py-3.5 px-5 rounded-2xl border-2 border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-stone-800 font-bold text-sm shadow-md flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
                  >
                    {/* Official Google 4-color SVG Logo */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>

                    <span>{loading ? 'Đang kết nối...' : 'Tiếp tục với Google (Nhanh)'}</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCustomEmailMode(true)}
                      className="text-xs text-stone-500 hover:text-[#890F0D] underline font-medium"
                    >
                      Hoặc nhập địa chỉ Gmail cá nhân của bạn
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nhập địa chỉ Gmail của bạn:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="tenban@gmail.com"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#890F0D] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleFallbackSignIn(googleEmail)}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-[#890F0D] hover:bg-[#720000] text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
                    >
                      <span>Xác nhận đăng nhập Gmail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomEmailMode(false)}
                      className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              HOẶC
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Option: Login with OTP */}
          <a
            href={`/login?redirect=${encodeURIComponent(redirectUrl || '/builder')}`}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-stone-500" />
            <span>Đăng nhập bằng mã OTP qua Gmail</span>
          </a>

        </div>

        {/* Footer Guarantee */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bảo mật 100% • Không yêu cầu mật khẩu</span>
        </div>

      </div>

    </div>
  );
}
