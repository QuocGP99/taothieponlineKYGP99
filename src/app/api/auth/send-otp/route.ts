import { NextRequest, NextResponse } from 'next/server';
import { generate6DigitOTP, saveOTP, createVerificationToken } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/mailer';
import { isDbConfigured, saveOtpToDb } from '@/lib/db';
import { validateEmailInput } from '@/lib/validation';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const validation = validateEmailInput(email);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.error, suggestion: validation.suggestion },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 0. NẾU TÀI KHOẢN ĐÃ TỒN TẠI TRÊN HỆ THỐNG: ĐĂNG NHẬP LUÔN, KHÔNG BẮT OTP
    if (isDbConfigured()) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        });

        if (existingUser) {
          const token = existingUser.token || `gp_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

          try {
            await prisma.user.update({
              where: { email: normalizedEmail },
              data: { lastLogin: new Date(), token }
            });
          } catch (e) { }

          return NextResponse.json({
            success: true,
            isExistingUser: true,
            message: `Chào mừng bạn quay lại! Đăng nhập thành công vào tài khoản ${normalizedEmail}.`,
            user: {
              email: existingUser.email,
              name: existingUser.name || normalizedEmail.split('@')[0].toUpperCase(),
              avatar: existingUser.avatar || null,
              provider: existingUser.provider || 'email_otp',
              token,
              loginAt: new Date().toISOString()
            }
          });
        }
      } catch (err: any) {
        console.warn('[AUTH] Lỗi kiểm tra user hiện có:', err.message);
      }
    }

    // NẾU LÀ TÀI KHOẢN MỚI: TẠO MÃ OTP VÀ GỬI EMAIL XÁC THỰC LẦN ĐẦU
    const otp = generate6DigitOTP();
    const verificationToken = createVerificationToken(normalizedEmail, otp, 300); // 5 phút

    // 1. Lưu vào Database nếu có cấu hình
    if (isDbConfigured()) {
      try {
        await saveOtpToDb(normalizedEmail, otp, 300);
      } catch (err: any) {
        console.warn('[AUTH] Lỗi lưu OTP vào DB:', err.message);
      }
    }

    // 2. Lưu vào RAM store dự phòng
    saveOTP(normalizedEmail, otp, 300);

    // 3. Gửi email từ lienhe@taothiepkyyeugp99.io.vn
    const mailResult = await sendOtpEmail({ to: normalizedEmail, otp });

    if (mailResult.success) {
      return NextResponse.json({
        success: true,
        isExistingUser: false,
        verificationToken,
        message: `Mã xác thực 6 số đã được gửi từ lienhe@taothiepkyyeugp99.io.vn đến hộp thư: ${normalizedEmail}. Vui lòng kiểm tra hộp thư đến (hoặc mục Thư rác/Spam).`,
        isLiveEmail: true,
        sentVia: mailResult.sentVia
      });
    }

    // Trường hợp máy chủ chưa có SMTP_PASSWORD
    console.warn(`[AUTH] Gửi email thất bại: ${mailResult.error || 'Chưa cấu hình mật khẩu SMTP'}`);
    return NextResponse.json({
      success: false,
      message: mailResult.error ? `Lỗi gửi thư: ${mailResult.error}` : 'Chưa cấu hình thông số SMTP_PASSWORD trên Vercel. Vui lòng thêm biến môi trường để gửi thư thực tế.',
      needsConfig: true
    }, { status: 500 });

  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống khi gửi mã xác thực. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
