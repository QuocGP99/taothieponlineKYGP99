import nodemailer from 'nodemailer';

interface SendOtpEmailParams {
  to: string;
  otp: string;
}

export async function sendOtpEmail({ to, otp }: SendOtpEmailParams): Promise<{ success: boolean; sentVia?: string; error?: string }> {
  const normalizedEmail = to.trim().toLowerCase();

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
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">GP STUDIO99 • ĐÀ NẴNG</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #fecaca;">Xác thực tài khoản quản lý thiệp kỷ yếu online</p>
        </div>
        
        <div style="padding: 30px 25px; text-align: center;">
          <p style="font-size: 14px; color: #4b5563; margin-top: 0; line-height: 1.6;">
            Xin chào! Bạn vừa yêu cầu đăng nhập vào <strong>Trình Tạo & Quản Lý Thiệp Kỷ Yếu</strong>. Dưới đây là mã xác thực 6 số của bạn:
          </p>
          
          <div style="background: #fff5f5; border: 2px dashed #890F0D; border-radius: 16px; padding: 18px 24px; margin: 25px 0; display: inline-block;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #720000;">
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
        
        <div style="background: #fafaf9; padding: 16px 20px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 11px; color: #6b7280;">
          GP Studio99 Đà Nẵng • Hotline / Zalo: 0899.236.001 • <a href="https://chupanhdanang.com" style="color: #890F0D; text-decoration: none; font-weight: bold;">chupanhdanang.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Cấu hình gửi mail qua Custom SMTP (Máy chủ Email iNET cPanel hoặc SMTP tùy chỉnh)
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 465);

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // SSL đối với port 465
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false // Chấp nhận chứng chỉ SSL cPanel iNET
        }
      });

      await transporter.sendMail({
        from: `"GP Studio99 Kỷ Yếu" <${smtpUser}>`,
        to: normalizedEmail,
        subject: `[GP Studio99] Mã xác thực đăng nhập: ${otp} 🎓`,
        html: emailHtml
      });

      console.log(`[MAILER] Đã gửi mã OTP thực tế qua iNET SMTP (${smtpHost}) tới: ${normalizedEmail}`);
      return { success: true, sentVia: 'inet_smtp' };
    } catch (err: any) {
      console.error('[MAILER] Lỗi gửi qua iNET SMTP:', err);
    }
  }

  // 2. Gửi bằng Gmail SMTP (Nodemailer) nếu có GMAIL_USER & GMAIL_APP_PASSWORD
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass
        }
      });

      await transporter.sendMail({
        from: `"GP Studio99 Đà Nẵng" <${gmailUser}>`,
        to: normalizedEmail,
        subject: `[GP Studio99] Mã xác thực đăng nhập: ${otp} 🎓`,
        html: emailHtml
      });

      console.log(`[MAILER] Đã gửi mã OTP thực tế qua Gmail SMTP tới: ${normalizedEmail}`);
      return { success: true, sentVia: 'gmail_smtp' };
    } catch (err: any) {
      console.error('[MAILER] Lỗi gửi qua Gmail SMTP:', err);
    }
  }

  // 3. Thử gửi qua Resend API nếu có RESEND_API_KEY
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'GP Studio99 <thiep@chupanhdanang.com>',
          to: [normalizedEmail],
          subject: `[GP Studio99] Mã xác thực đăng nhập: ${otp} 🎓`,
          html: emailHtml
        })
      });

      if (res.ok) {
        console.log(`[MAILER] Đã gửi mã OTP thực tế qua Resend tới: ${normalizedEmail}`);
        return { success: true, sentVia: 'resend' };
      }
    } catch (err: any) {
      console.error('[MAILER] Lỗi gửi qua Resend:', err);
    }
  }

  return {
    success: false,
    error: 'Chưa cấu hình dịch vụ gửi email SMTP (iNET SMTP hoặc GMAIL_USER + GMAIL_APP_PASSWORD trong .env).'
  };
}
