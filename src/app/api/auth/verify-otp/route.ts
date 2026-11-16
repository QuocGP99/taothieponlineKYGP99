import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, verifySignedOTP } from '@/lib/otpStore';
import { isMysqlConfigured, verifyOtpInDb, upsertUserInDb } from '@/lib/mysql';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, verificationToken } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Thiếu email hoặc mã xác thực.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();
    let isOtpValid = false;
    let failReason = 'Mã xác thực không chính xác hoặc đã hết hạn.';

    // 1. Xác thực bằng HMAC ký số không trạng thái (Hoạt động hoàn hảo trên Vercel Serverless)
    if (verificationToken) {
      const signedResult = verifySignedOTP(normalizedEmail, cleanOtp, verificationToken);
      if (signedResult.success) {
        isOtpValid = true;
      } else {
        failReason = signedResult.message;
      }
    }

    // 2. Dự phòng: Kiểm tra mã từ MySQL iNET nếu có cấu hình
    if (!isOtpValid && isMysqlConfigured()) {
      try {
        isOtpValid = await verifyOtpInDb(normalizedEmail, cleanOtp);
      } catch (err: any) {
        console.warn('[AUTH] Lỗi xác thực OTP từ MySQL:', err.message);
      }
    }

    // 3. Dự phòng: Thử kiểm tra từ RAM store
    if (!isOtpValid) {
      const memResult = verifyOTP(normalizedEmail, cleanOtp);
      if (memResult.success) {
        isOtpValid = true;
      }
    }

    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, message: failReason },
        { status: 400 }
      );
    }

    // Tạo token phiên đăng nhập
    const token = `gp_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const displayName = normalizedEmail.split('@')[0].toUpperCase();

    // 4. Cập nhật hoặc lưu user vào MySQL nếu có
    if (isMysqlConfigured()) {
      try {
        await upsertUserInDb({
          email: normalizedEmail,
          name: displayName,
          provider: 'email_otp',
          token
        });
      } catch (err: any) {
        console.warn('[AUTH] Lỗi lưu user vào MySQL:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Xác thực tài khoản thành công!',
      user: {
        email: normalizedEmail,
        name: displayName,
        provider: 'email_otp',
        token,
        loginAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống khi xác thực mã.' },
      { status: 500 }
    );
  }
}
