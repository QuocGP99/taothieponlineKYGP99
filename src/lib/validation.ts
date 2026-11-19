/**
 * Kiểm tra định dạng email và phát hiện lỗi gõ nhầm tên miền phổ biến (VD: gmail.xom, gmail.con, gmai.com)
 */
export interface EmailValidationResult {
  isValid: boolean;
  error: string;
  suggestion?: string;
}

export function validateEmailInput(input: string): EmailValidationResult {
  const trimmed = (input || '').trim().toLowerCase();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Vui lòng nhập địa chỉ Gmail của bạn.'
    };
  }

  // 1. Kiểm tra cấu trúc email cơ bản
  const basicRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!basicRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Địa chỉ email không đúng định dạng (Ví dụ: tenban@gmail.com).'
    };
  }

  const [username, domain] = trimmed.split('@');

  if (!username || username.length < 2) {
    return {
      isValid: false,
      error: 'Tên tài khoản email trước dấu @ quá ngắn (tối thiểu 2 ký tự).'
    };
  }

  // 2. Danh sách các lỗi gõ sai tên miền Gmail / Email phổ biến
  const typoMap: Record<string, string> = {
    'gmail.xom': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.vom': 'gmail.com',
    'gmail.cpm': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'gmail.om': 'gmail.com',
    'gmail.kom': 'gmail.com',
    'gmail.dom': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmaik.com': 'gmail.com',
    'gmai.vn': 'gmail.com',
    'gmail.vn': 'gmail.com',
    'gmail.com.vn': 'gmail.com',
    'yahoo.xom': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'iclud.com': 'icloud.com',
  };

  if (typoMap[domain]) {
    const suggested = `${username}@${typoMap[domain]}`;
    return {
      isValid: false,
      error: `Đuôi "@${domain}" bị sai chính tả. Có phải ý bạn là "${suggested}"?`,
      suggestion: suggested
    };
  }

  // 3. Kiểm tra phần mở rộng tên miền (TLD - ví dụ: .com, .vn, .edu.vn)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];

  // Các đuôi gõ sai phổ biến
  const invalidTlds = ['xom', 'con', 'vom', 'cpm', 'cm', 'om', 'kom', 'dom', 'cim'];
  if (invalidTlds.includes(tld)) {
    return {
      isValid: false,
      error: `Đuôi tên miền ".${tld}" không tồn tại. Vui lòng sửa lại thành ".com" hoặc đuôi hợp lệ.`
    };
  }

  if (tld.length < 2) {
    return {
      isValid: false,
      error: 'Đuôi tên miền không hợp lệ.'
    };
  }

  return {
    isValid: true,
    error: ''
  };
}
