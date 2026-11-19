export type TemplateCategory = 'thanh-xuan' | 'hien-dai' | 'trang-trong';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  categoryName: string;
  description: string;
  previewImage: string;
  badge?: string;
  defaultColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fontFamily: string;
  styleName: string;
}

export type VirtualGift = 'bouquet' | 'teddy' | 'sunflower' | 'milktea' | 'letter';

export interface RSVP {
  id: string;
  invitationId: string;
  guestName: string;
  relation?: string; // 'Bạn thân' | 'Bạn cùng trường' | 'Gia đình' | 'Người thân' | 'Khác'
  status: 'confirmed' | 'maybe' | 'declined';
  phone?: string;
  message?: string;
  virtualGift?: VirtualGift;
  companionCount?: number;
  createdAt: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  location?: string;
  note?: string;
}

export interface GuestWish {
  id: string;
  senderName: string;
  relation?: string;
  message: string;
  createdAt: string;
}

export type GuestGroup = 'friend' | 'classmate' | 'family' | 'teacher' | 'other';

export interface InvitationRecipient {
  id: string;
  name: string;
  group: GuestGroup;
  status?: 'confirmed' | 'maybe' | 'declined' | 'pending';
  createdAt: string;
}

export interface InvitationData {
  id: string;
  slug: string;
  templateId: string;
  
  // Danh sách người nhận thiệp riêng biệt & cá nhân hóa
  recipients?: InvitationRecipient[];

  // Thông tin cá nhân học sinh (chủ nhân thiệp)
  studentName: string;
  namePart1?: string; // Tên hiển thị bên trái (VD: HOÀNG, BẢO)
  namePart2?: string; // Tên hiển thị bên phải (VD: NGỌC, ANH)
  nickname?: string;
  className: string;
  schoolName: string;
  schoolYear: string;
  senderName: string;
  guestName?: string; // Tên khách mời (VD: Mỹ Linh, Bạn thân mến)
  
  // Khung giờ đón bạn bè & người thân chụp ảnh chung
  friendPhotoTime?: string;
  
  // Thông tin sự kiện buổi chụp
  title: string;
  date: string;
  dayOfWeek?: string;
  startTime: string;
  endTime?: string;
  gatheringLocation: string;
  shootLocation: string;
  detailedAddress?: string;
  googleMapsUrl?: string;
  dressCode: string;
  note?: string;
  
  // Lịch trình buổi chụp (Timeline)
  timeline?: TimelineItem[];
  
  // Bộ sưu tập ảnh & Album của bạn
  gallery?: string[];
  
  // Sổ lưu bút / Lời chúc từ bạn bè
  wishes?: GuestWish[];
  
  // Lời nhắn gửi bạn bè & người thân
  inviteMessage: string;
  wishMessage?: string;
  signature: string;
  
  // Hình ảnh
  avatarPhoto?: string; // Chân dung cá nhân học sinh (hiển thị trung tâm Poster)
  groupPhoto?: string;  // Ảnh lớp / kỷ yếu
  bgImage?: string;
  
  // Cá nhân hóa thiết kế
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  textAlign: 'left' | 'center' | 'right';
  stickers: string[];
  componentsVisible: {
    showCountdown: boolean;
    showLocationMap: boolean;
    showDressCode: boolean;
    showSchedule: boolean;
    showFriendPhotoTime: boolean;
    showWishes: boolean;
    showMusic: boolean;
    showRSVP: boolean;
  };
  
  // Nhạc nền thiệp mời ('dong-bang' | 'nu-cuoi-18-20' | 'tam-biet-nhe' | 'piano-chill' | 'none')
  musicTrack?: string;
  
  // Thông tin người tạo (Email không còn bắt buộc)
  creatorName: string;
  creatorEmail?: string;
  creatorPhone?: string;
  agreedToTerms: boolean;
  
  // Trạng thái & thống kê
  status: 'published' | 'draft' | 'archived';
  views: number;
  shares: number;
  rsvps: RSVP[];
  createdAt: string;
  updatedAt: string;
}
