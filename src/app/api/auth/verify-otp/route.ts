import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otpStore';
import { isMysqlConfigured, verifyOtpInDb, upsertUserInDb } from '@/lib/mysql';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Thiếu email hoặc mã xác thực.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    let isOtpValid = false;

    // 1. Kiểm tra mã từ MySQL iNET nếu có cấu hình
    if (isMysqlConfigured()) {
      try {
        isOtpValid = await verifyOtpInDb(normalizedEmail, otp);
      } catch (err: any) {
        console.warn('[AUTH] Lỗi xác thực OTP từ MySQL:', err.message);
      }
    }

    // 2. Nếu MySQL chưa xác thực được, thử kiểm tra từ RAM store dự phòng
    if (!isOtpValid) {
      const memResult = verifyOTP(normalizedEmail, otp);
      if (memResult.success) {
        isOtpValid = true;
      }
    }

    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, message: 'Mã xác thực không chính xác hoặc đã hết hạn.' },
        { status: 400 }
      );
    }

    // Tạo token phiên đăng nhập
    const token = `gp_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 3. Cập nhật hoặc lưu user vào MySQL
    if (isMysqlConfigured()) {
      try {
        await upsertUserInDb({
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0],
          provider: 'email_otp',
          token
        });
      } catch (err: any) {
        console.warn('[AUTH] Lỗi lưu user vào MySQL:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Xác thực thành công!',
      user: {
        email: normalizedEmail,
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
