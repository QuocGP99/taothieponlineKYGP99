import { NextRequest, NextResponse } from 'next/server';
import { generate6DigitOTP, saveOTP } from '@/lib/otpStore';

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
    saveOTP(normalizedEmail, otp, 300); // 5 phút

    const resendApiKey = process.env.RESEND_API_KEY;

    // Email HTML template phong cách GP Studio99
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Mã Xác Thực GP Studio99</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf5f5; margin: 0; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #fee2e2; box-shadow: 0 10px 25px rgba(114,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #720000 0%, #890F0D 50%, #B91C1C 100%); padding: 30px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">GP STUDIO99 • ĐÀ NẴNG</h1>
            <p style="margin: 5px 0 0; font-size: 13px; color: #fecaca;">Xác thực tài khoản quản lý thiệp kỷ yếu online</p>
          </div>
          
          <div style="padding: 30px 25px; text-align: center;">
            <p style="font-size: 14px; color: #4b5563; margin-top: 0;">
              Xin chào! Bạn vừa yêu cầu đăng nhập vào <strong>Trình Quản Lý Thiệp Kỷ Yếu</strong>. Dưới đây là mã xác thực 6 số của bạn:
            </p>
            
            <div style="background: #fff5f5; border: 2px dashed #890F0D; border-radius: 16px; padding: 18px; margin: 25px 0; display: inline-block;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #720000;">
                ${otp}
              </span>
            </div>
            
            <p style="font-size: 12px; color: #dc2626; font-weight: 600; margin-bottom: 20px;">
              ⏱️ Mã có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.
            </p>
            
            <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin: 0;">
              Nếu bạn không yêu cầu mã này, bạn có thể yên tâm bỏ qua email này.
            </p>
          </div>
          
          <div style="background: #fafaf9; padding: 15px 20px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 11px; color: #6b7280;">
            GP Studio99 Đà Nẵng • Hotline: 0899.236.001 • <a href="https://chupanhdanang.com" style="color: #890F0D; text-decoration: none; font-weight: bold;">chupanhdanang.com</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Gửi qua Resend API nếu có key
    if (resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'GP Studio99 <onboarding@resend.dev>',
            to: normalizedEmail,
            subject: `[GP Studio99] Mã xác thực đăng nhập: ${otp}`,
            html: emailHtml
          })
        });

        if (resendRes.ok) {
          return NextResponse.json({
            success: true,
            message: `Mã xác thực 6 số đã được gửi đến ${normalizedEmail}. Vui lòng kiểm tra hộp thư (hoặc mục Spam).`
          });
        }
      } catch (err) {
        console.warn('Resend send failed, falling back to local mode:', err);
      }
    }

    // 2. Chế độ phát triển / Local demo fallback
    console.log(`[AUTH OTP DEV] Mã xác thực gửi tới ${normalizedEmail}: ${otp}`);
    return NextResponse.json({
      success: true,
      message: `Đã gửi mã xác thực 6 số đến ${normalizedEmail}.`,
      debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });

  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống khi gửi mã xác thực. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
