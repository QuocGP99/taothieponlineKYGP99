import { NextRequest, NextResponse } from 'next/server';
import { generate6DigitOTP, saveOTP, createVerificationToken } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/mailer';
import { isMysqlConfigured, saveOtpToDb } from '@/lib/mysql';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ Gmail không hợp lệ. Vui lòng nhập đúng định dạng (VD: tenban@gmail.com).' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ Gmail không đúng định dạng. Vui lòng kiểm tra lại.' },
        { status: 400 }
      );
    }

    const otp = generate6DigitOTP();
    const verificationToken = createVerificationToken(normalizedEmail, otp, 300); // 5 phút

    // 1. Lưu vào MySQL nếu có cấu hình
    if (isMysqlConfigured()) {
      try {
        await saveOtpToDb(normalizedEmail, otp, 300);
      } catch (err: any) {
        console.warn('[AUTH] Lỗi lưu OTP vào MySQL:', err.message);
      }
    }

    // 2. Lưu vào RAM store dự phòng
    saveOTP(normalizedEmail, otp, 300);

    // 3. Gửi email từ lienhe@taothiepkyyeugp99.io.vn
    const mailResult = await sendOtpEmail({ to: normalizedEmail, otp });

    if (mailResult.success) {
      return NextResponse.json({
        success: true,
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
