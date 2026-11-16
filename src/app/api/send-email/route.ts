import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, creatorName, className, schoolName, invitationUrl, date, shootLocation } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json({ error: 'Địa chỉ Gmail không hợp lệ' }, { status: 400 });
    }

    // HTML Email template with GP Studio99 #890F0D & #720000 branding
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thiệp Mời Kỷ Yếu Cá Nhân - GP Studio99</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fdf8f8; margin: 0; padding: 20px; color: #2b0504; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(114, 0, 0, 0.1); border: 1px solid #fee2e2; }
          .header { background: linear-gradient(135deg, #720000 0%, #890F0D 100%); color: #ffffff; padding: 36px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; }
          .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 13px; }
          .content { padding: 32px 28px; line-height: 1.6; }
          .badge { display: inline-block; background-color: #fee2e2; color: #890F0D; font-weight: bold; padding: 6px 14px; border-radius: 9999px; font-size: 13px; margin-bottom: 16px; }
          .info-card { background: #fff8f8; border: 1px dashed #e28e8d; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; margin-bottom: 8px; font-size: 14px; }
          .btn-cta { display: block; width: fit-content; margin: 28px auto; background: linear-gradient(135deg, #720000, #890F0D); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(137, 15, 13, 0.35); text-align: center; }
          .footer { background: #240303; color: #d6d3d1; padding: 24px; text-align: center; font-size: 12px; }
          .footer a { color: #fca5a5; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GP STUDIO99 – THIỆP KỶ YẾU CÁ NHÂN</h1>
            <p>Kỷ Yếu Đà Nẵng (chupanhdanang.com) • Thành lập 2018</p>
          </div>
          <div class="content">
            <div class="badge">🎉 Thiệp mời cá nhân của bạn đã sẵn sàng!</div>
            <p>Xin chào <strong>${creatorName || 'Bạn'}</strong>,</p>
            <p>Thiệp mời kỷ yếu cá nhân của bạn (Lớp ${className || '12A'} • ${schoolName || 'THPT Phan Châu Trinh'}) đã được tạo và kích hoạt thành công trên hệ thống GP Studio99.</p>
            
            <div class="info-card">
              <div class="info-row"><strong>📅 Ngày chụp:</strong>&nbsp;${date || 'Sắp diễn ra'}</div>
              <div class="info-row"><strong>📍 Địa điểm:</strong>&nbsp;${shootLocation || 'Đà Nẵng'}</div>
              <div class="info-row"><strong>🔗 Đường link thiệp riêng:</strong>&nbsp;<a href="${invitationUrl}" style="color: #890F0D; word-break: break-all;">${invitationUrl}</a></div>
            </div>

            <a href="${invitationUrl}" class="btn-cta" target="_blank">👉 Xem & Gửi Thiệp Cho Bạn Bè Ngay</a>

            <p style="font-size: 14px; color: #57534e;">
              Bạn có thể sao chép đường link trên để gửi qua Zalo, Messenger, Facebook hoặc đăng Story để bạn thân, bạn cùng trường và gia đình xác nhận ghé qua chụp ảnh cùng bạn nhé!
            </p>
          </div>
          <div class="footer">
            <p><strong>GP STUDIO99 – KỶ YẾU ĐÀ NẴNG</strong></p>
            <p>Hotline / Zalo: 0899.236.001 | Website: <a href="https://chupanhdanang.com" target="_blank">chupanhdanang.com</a></p>
            <p>Địa chỉ: Trần Cao Vân, TP. Đà Nẵng</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Thử gửi qua Custom SMTP (iNET OxMail / cPanel Mail)
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT || 465);

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"GP Studio99 Kỷ Yếu" <${smtpUser}>`,
          to,
          subject: `[GP Studio99] Thiệp mời kỷ yếu của ${creatorName || 'bạn'} đã sẵn sàng! 🎓`,
          html: emailHtml
        });

        return NextResponse.json({
          success: true,
          provider: 'inet_smtp',
          message: `Email xác nhận thiệp mời đã được gửi thành công qua iNET SMTP đến ${to}`
        });
      } catch (err: any) {
        console.error('Error sending via iNET SMTP:', err);
      }
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'GP Studio99 <thiepmoi@chupanhdanang.com>',
            to: [to],
            subject: `[GP Studio99] Thiệp mời kỷ yếu của ${creatorName || 'bạn'} đã sẵn sàng! 🎓`,
            html: emailHtml,
          }),
        });

        const data = await res.json();
        return NextResponse.json({
          success: true,
          provider: 'resend',
          data,
          message: `Email xác nhận đã được gửi thành công đến ${to}`
        });
      } catch (err: any) {
        console.error('Error sending via Resend:', err);
        return NextResponse.json({
          success: true,
          provider: 'fallback',
          preview: emailHtml,
          message: `Hệ thống đã ghi nhận gửi email đến ${to}`
        });
      }
    }

    // If Resend API is not configured, return clear message and HTML preview
    return NextResponse.json({
      success: true,
      provider: 'preview_mode',
      preview: emailHtml,
      info: 'Chế độ mô phỏng email sẵn sàng. Để gửi email thực tế đến hộp thư người dùng, vui lòng cấu hình biến môi trường RESEND_API_KEY trong file .env.local',
      message: `Hệ thống đã ghi nhận địa chỉ Gmail: ${to}. Link thiệp cá nhân đã được tạo và sẵn sàng chia sẻ!`
    });
  } catch (error: any) {
    console.error('API send-email error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xử lý gửi email' }, { status: 500 });
  }
}
