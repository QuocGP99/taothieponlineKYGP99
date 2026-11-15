import { NextRequest, NextResponse } from 'next/server';
import { generate6DigitOTP, saveOTP } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/mailer';
import { isMysqlConfigured, saveOtpToDb } from '@/lib/mysql';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ Gmail không hợp lệ. Vui lòng kiểm tra lại.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = generate6DigitOTP();

    // 1. Lưu vào MySQL nếu đã kết nối iNET
    if (isMysqlConfigured()) {
      try {
        await saveOtpToDb(normalizedEmail, otp, 300);
        console.log(`[AUTH] Đã lưu mã OTP cho ${normalizedEmail} vào MySQL.`);
      } catch (err: any) {
        console.warn('[AUTH] Lỗi lưu OTP vào MySQL:', err.message);
      }
    }

    // 2. Lưu vào RAM store dự phòng
    saveOTP(normalizedEmail, otp, 300); // Mã có hiệu lực 5 phút

    // 3. Gửi email thực tế qua iNET SMTP hoặc Gmail SMTP
    const mailResult = await sendOtpEmail({ to: normalizedEmail, otp });

    if (mailResult.success) {
      return NextResponse.json({
        success: true,
        message: `Mã xác thực 6 số đã được gửi trực tiếp đến Gmail: ${normalizedEmail}. Vui lòng kiểm tra hộp thư đến (hoặc mục Thư rác/Spam).`,
        isLiveEmail: true,
        sentVia: mailResult.sentVia
      });
    }

    // Nếu chưa cấu hình SMTP thực tế, hiển thị mã xác thực ngay cho người dùng thử nghiệm
    console.log(`[AUTH OTP DEMO] Chưa cấu hình SMTP. Mã OTP cho ${normalizedEmail}: ${otp}`);
    return NextResponse.json({
      success: true,
      message: `Mã xác thực của bạn là: ${otp}`,
      isLiveEmail: false,
      debugOtp: otp,
      warning: 'Chưa cấu hình SMTP iNET hoặc Gmail App Password nên email chưa thể gửi ra ngoài. Bạn có thể sử dụng mã OTP hiển thị trên màn hình để đăng nhập ngay.'
    });

  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi xử lý mã xác thực.' },
      { status: 500 }
    );
  }
}
