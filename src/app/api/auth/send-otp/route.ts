import { NextRequest, NextResponse } from 'next/server';
import { generate6DigitOTP, saveOTP } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/mailer';

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
    saveOTP(normalizedEmail, otp, 300); // Mã có hiệu lực 5 phút

    // Thử gửi email thực tế qua Gmail SMTP hoặc Resend
    const mailResult = await sendOtpEmail({ to: normalizedEmail, otp });

    if (mailResult.success) {
      return NextResponse.json({
        success: true,
        message: `Mã xác thực 6 số đã được gửi trực tiếp đến Gmail: ${normalizedEmail}. Vui lòng kiểm tra hộp thư đến (hoặc mục Thư rác/Spam).`,
        isLiveEmail: true
      });
    }

    // Nếu chưa cấu hình SMTP thực tế, hiển thị mã xác thực ngay cho người dùng
    console.log(`[AUTH OTP DEMO] Chưa cấu hình SMTP/Resend. Mã OTP cho ${normalizedEmail}: ${otp}`);
    return NextResponse.json({
      success: true,
      message: `Mã xác thực của bạn là: ${otp}`,
      isLiveEmail: false,
      debugOtp: otp,
      warning: 'Chưa cấu hình Gmail SMTP hoặc RESEND_API_KEY nên email chưa được gửi ra Internet. Bạn có thể dùng mã hiển thị trên màn hình để đăng nhập ngay.'
    });

  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi xử lý mã xác thực.' },
      { status: 500 }
    );
  }
}
