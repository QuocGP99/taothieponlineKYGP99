import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Thiếu email hoặc mã xác thực.' },
        { status: 400 }
      );
    }

    const result = verifyOTP(email, otp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Tạo token phiên đăng nhập đơn giản
    const token = `gp_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Xác thực thành công!',
      user: {
        email: email.trim().toLowerCase(),
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
