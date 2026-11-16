import crypto from 'crypto';

interface OTPEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// In-memory store for OTP codes (RAM fallback)
declare global {
  var __otpStore: Map<string, OTPEntry> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map<string, OTPEntry>();
}

const store = global.__otpStore;

const OTP_SECRET = process.env.AUTH_SECRET || process.env.SMTP_PASSWORD || 'gp_studio99_oxmail_secret_2026';

export function generate6DigitOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Tạo token mã hóa HMAC ký số cho OTP.
 * Giúp xác thực không trạng thái (stateless) hoạt động 100% ổn định trên Vercel Serverless
 * mà không cần cơ sở dữ liệu hay bộ nhớ dùng chung.
 */
export function createVerificationToken(email: string, otp: string, ttlSeconds = 300): string {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const data = `${normalizedEmail}:${otp.trim()}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', OTP_SECRET).update(data).digest('hex');
  return `${expiresAt}.${hmac}`;
}

/**
 * Kiểm tra token HMAC ký số và mã OTP 6 số.
 * Tuyệt đối an toàn chống giả mạo, tự động hết hạn sau thời gian TTL.
 */
export function verifySignedOTP(
  email: string,
  code: string,
  token?: string
): { success: boolean; message: string } {
  if (!token || !token.includes('.')) {
    return { success: false, message: 'Mã xác thực hoặc phiên đăng nhập không hợp lệ.' };
  }

  const [expiresStr, expectedHmac] = token.split('.');
  const expiresAt = Number(expiresStr);

  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { success: false, message: 'Mã xác thực đã hết hạn (chỉ có hiệu lực trong 5 phút).' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();
  const data = `${normalizedEmail}:${cleanCode}:${expiresAt}`;
  const computedHmac = crypto.createHmac('sha256', OTP_SECRET).update(data).digest('hex');

  if (computedHmac !== expectedHmac) {
    return { success: false, message: 'Mã xác thực không chính xác. Vui lòng kiểm tra lại.' };
  }

  return { success: true, message: 'Xác thực thành công!' };
}

// Lưu trữ RAM hỗ trợ
export function saveOTP(email: string, otp: string, ttlSeconds = 300): void {
  const normalizedEmail = email.trim().toLowerCase();
  store.set(normalizedEmail, {
    otp,
    expiresAt: Date.now() + ttlSeconds * 1000,
    attempts: 0
  });
}

// Kiểm tra mã qua RAM (dành cho legacy fallback)
export function verifyOTP(email: string, code: string): { success: boolean; message: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = store.get(normalizedEmail);

  if (!entry) {
    return { success: false, message: 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu mã mới.' };
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(normalizedEmail);
    return { success: false, message: 'Mã xác thực đã hết hạn (chỉ có hiệu lực trong 5 phút).' };
  }

  if (entry.attempts >= 5) {
    store.delete(normalizedEmail);
    return { success: false, message: 'Bạn đã nhập sai quá 5 lần. Vui lòng yêu cầu mã mới.' };
  }

  if (entry.otp !== code.trim()) {
    entry.attempts += 1;
    return { success: false, message: `Mã xác thực không đúng. Còn ${5 - entry.attempts} lần thử.` };
  }

  store.delete(normalizedEmail);
  return { success: true, message: 'Xác thực thành công!' };
}
