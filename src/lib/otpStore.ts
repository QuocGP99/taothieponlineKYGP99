interface OTPEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// In-memory store for OTP codes
// Global declaration ensures persistence across hot-reloads in development
declare global {
  var __otpStore: Map<string, OTPEntry> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map<string, OTPEntry>();
}

const store = global.__otpStore;

export function generate6DigitOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOTP(email: string, otp: string, ttlSeconds = 300): void {
  const normalizedEmail = email.trim().toLowerCase();
  store.set(normalizedEmail, {
    otp,
    expiresAt: Date.now() + ttlSeconds * 1000,
    attempts: 0
  });
}

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

  // Xác thực thành công: xóa mã khỏi store để chống dùng lại (anti-replay)
  store.delete(normalizedEmail);
  return { success: true, message: 'Xác thực thành công!' };
}
