/**
 * Chuyển đổi tên trường hoặc địa điểm thành liên kết tìm kiếm Google Maps
 * Ví dụ: "THPT Ông Ích Khiêm" -> "https://www.google.com/maps/search/THPT+Ong+Ich+Khiem"
 */
export function generateGoogleMapsUrl(locationName: string): string {
  if (!locationName || !locationName.trim()) {
    return 'https://www.google.com/maps';
  }

  const unaccented = locationName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, '+');

  return `https://www.google.com/maps/search/${unaccented}`;
}
