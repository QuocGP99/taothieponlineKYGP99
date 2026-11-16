import { Template, InvitationData } from '../types/invitation';

export const TEMPLATES: Template[] = [
  {
    id: 'modern-crimson-spotlight',
    name: 'Modern Crimson Spotlight (Kỷ Yếu Poster)',
    category: 'hien-dai',
    categoryName: 'Poster Kỷ Yếu Hiện Đại',
    description: 'Phong cách tối giản, hiện đại với tone đỏ rượu Crimson, chùm ánh sáng sân khấu và tên nghệ thuật hai bên ảnh chân dung.',
    previewImage: '/images/poster-reference.jpg',
    badge: 'Mẫu chuẩn GP Studio99',
    defaultColors: {
      primary: '#890F0D',
      secondary: '#720000',
      background: '#250000',
      text: '#FFFFFF',
      accent: '#D97706',
    },
    fontFamily: 'Plus Jakarta Sans',
    styleName: 'Crimson Spotlight'
  },
  {
    id: 'green-student',
    name: 'Sổ Lưu Bút Kỷ Yếu (Scrapbook)',
    category: 'thanh-xuan',
    categoryName: 'Sổ Lưu Bút Thanh Xuân',
    description: 'Thiết kế cuốn sổ lưu bút tuổi học trò độc đáo: bìa sổ pastel chạm mở lật trang, giấy kẻ ô, washi tape dán ảnh polaroid, checklist và lưu bút.',
    previewImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    badge: 'Mẫu Sổ Lưu Bút Hot',
    defaultColors: {
      primary: '#D6BCFA',
      secondary: '#F472B6',
      background: '#FFF5F8',
      text: '#1F2937',
      accent: '#FDE047',
    },
    fontFamily: 'Quicksand',
    styleName: 'Scrapbook Youth'
  }
];

export const SAMPLE_INVITATION: InvitationData = {
  id: 'gp-hoang-ngoc-dong-a',
  slug: 'hoang-ngoc-dai-hoc-dong-a-2027',
  templateId: 'modern-crimson-spotlight',

  // Tên người tạo & tên chia 2 bên poster
  studentName: 'HOÀNG NGỌC',
  namePart1: 'HOÀNG',
  namePart2: 'NGỌC',
  nickname: 'Ngọc Xinh',
  className: 'K23 Marketing',
  schoolName: 'TRƯỜNG ĐẠI HỌC ĐÔNG Á',
  schoolYear: '2023 - 2027',
  senderName: 'Hoàng Ngọc',
  guestName: 'Mỹ Linh',

  // Khung giờ đón bạn bè
  friendPhotoTime: '13:00 - 18:00 (Đón bạn bè & người thân chụp ảnh giao lưu)',

  // Tiêu đề & thời gian
  title: 'HAPPY YEARBOOK EVENT – HOÀNG NGỌC',
  date: '2027-07-22',
  dayOfWeek: 'Thứ tư',
  startTime: '13:00',
  endTime: '18:00',
  gatheringLocation: 'Sân trường Đại học Đông Á',
  shootLocation: '14 ngõ 23 đường Hồng Bàng, quận 3, thành phố Hồ Chí Minh',
  detailedAddress: '14 ngõ 23 đường Hồng Bàng, quận 3, thành phố Hồ Chí Minh',
  googleMapsUrl: 'https://www.google.com/maps/search/Truong+Dai+Hoc+Dong+A',
  dressCode: 'Tone màu trắng, be hoặc trang phục tự do nhẹ nhàng, thanh lịch để chụp ảnh kỷ niệm nhé!',
  note: 'Mang theo nụ cười rạng rỡ và tinh thần hứng khởi đến chụp cùng Ngọc nha!',

  // Lịch trình chi tiết (Timeline)
  timeline: [
    {
      id: 'tl-1',
      time: '13:00 - 14:00',
      title: 'Tập trung & Chụp trang phục Cử Nhân',
      location: 'Cổng chính & Giảng đường',
      note: 'Chuẩn bị trang phục, nón cử nhân và bằng tốt nghiệp'
    },
    {
      id: 'tl-2',
      time: '14:00 - 16:30',
      title: 'Khung giờ đón Bạn Bè & Gia Đình chụp ảnh tự do',
      location: 'Sân trường & Khuôn viên trường',
      note: 'Thời gian chụp ảnh lưu niệm cùng bạn bè thân thiết và người thân'
    },
    {
      id: 'tl-3',
      time: '16:30 - 18:00',
      title: 'Chụp tập thể lớp & Ném nón tốt nghiệp hoàng hôn',
      location: 'Sân vận động & Đài phun nước',
      note: 'Khoảnh khắc tung nón lưu giữ thanh xuân cùng GP Studio99'
    }
  ],

  // Bộ sưu tập ảnh & Album của bạn
  gallery: [
    '/images/poster-reference.jpg',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  ],

  // Lời chúc từ bạn bè (Guestbook)
  wishes: [
    {
      id: 'wish-1',
      senderName: 'Mỹ Linh',
      relation: 'Bạn thân',
      message: 'Chúc mừng Hoàng Ngọc tốt nghiệp thật xuất sắc! Nhất định tớ sẽ đến đúng 14h mang theo hoa hướng dương chụp cùng cậu nha!',
      createdAt: '2026-11-12T14:30:00Z'
    },
    {
      id: 'wish-2',
      senderName: 'Tuấn Khang',
      relation: 'Bạn cùng lớp',
      message: 'Chúc bạn tớ luôn tự tin, xinh đẹp và thành công rực rỡ trên con đường phía trước!',
      createdAt: '2026-11-13T09:15:00Z'
    }
  ],

  // Lời nhắn gửi bạn bè
  inviteMessage: 'Bốn năm đại học trôi qua tựa một cái chớp mắt, ngày chụp ảnh kỷ yếu tốt nghiệp của mình đã đến. Sự hiện diện và nụ cười của bạn là món quà quý giá nhất trong ngày thanh xuân này. Hãy ghé qua chung vui và chụp cùng mình những bức ảnh thật đẹp nhé!',
  wishMessage: 'Cảm ơn bạn vì đã là một phần thanh xuân rực rỡ nhất của Hoàng Ngọc!',
  signature: 'Hoàng Ngọc • Trân trọng',

  // Hình ảnh
  avatarPhoto: '/images/poster-reference.jpg',
  groupPhoto: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',

  // Thiết kế
  primaryColor: '#890F0D',
  secondaryColor: '#720000',
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 'md',
  textAlign: 'center',
  stickers: ['🎓', '✨', '📸', '💐', '🎉'],
  componentsVisible: {
    showCountdown: true,
    showLocationMap: true,
    showDressCode: true,
    showSchedule: true,
    showFriendPhotoTime: true,
    showWishes: true,
    showMusic: true,
    showRSVP: true
  },

  // Người tạo (Không bắt buộc email)
  creatorName: 'Hoàng Ngọc',
  creatorEmail: 'hello@reallygreatsite.com',
  creatorPhone: '0903414848',
  agreedToTerms: true,
  status: 'published',
  views: 312,
  shares: 88,
  rsvps: [
    {
      id: 'rsvp-1',
      invitationId: 'gp-hoang-ngoc-dong-a',
      guestName: 'Mỹ Linh',
      relation: 'Bạn thân',
      status: 'confirmed',
      virtualGift: 'bouquet',
      message: 'Tớ sẽ có mặt lúc 14h chụp ảnh cùng cậu nhé!',
      createdAt: '2026-11-12T14:35:00Z'
    }
  ],
  createdAt: '2026-11-10T10:00:00Z',
  updatedAt: '2026-11-13T16:00:00Z'
};

export const GREEN_STUDENT_INVITATION: InvitationData = {
  ...SAMPLE_INVITATION,
  id: 'gp-green-student',
  slug: 'green-student',
  templateId: 'green-student',
  studentName: 'Hoàng Ngọc Bảo Anh',
  namePart1: 'BẢO',
  namePart2: 'ANH',
  nickname: 'Bảo Anh',
  className: '12A1',
  schoolName: 'Tên trường của bạn',
  schoolYear: '2024 — 2027',
  senderName: 'Tên gọi',
  guestName: 'Bạn thân mến',
  friendPhotoTime: '07:00 - 11:30 (Đón bạn bè chụp ảnh kỷ niệm)',
  title: 'Kỷ yếu của tụi mình!',
  date: '2026-12-31',
  dayOfWeek: 'Thứ Năm',
  startTime: '07:00',
  endTime: '11:30',
  gatheringLocation: 'Sân trường',
  shootLocation: 'Sân trường',
  detailedAddress: 'Địa chỉ trường của bạn',
  googleMapsUrl: 'https://www.google.com/maps/search/San+Truong',
  dressCode: 'Áo dài trắng hoặc đồng phục trường của bạn nhé!',
  note: 'Nhớ đến đúng giờ và mang theo nụ cười thật tươi nhé!',
  inviteMessage: 'Ba năm cấp ba trôi nhanh như một cái chớp mắt. Ngày chụp kỷ yếu sắp đến rồi — mình mong có cậu ở đó, cùng lưu lại khoảnh khắc thanh xuân rực rỡ nhất của chúng mình!',
  wishMessage: 'Thanh xuân không có nếu như — chỉ có những ngày ta đã sống hết mình.',
  signature: 'Tên gọi ♡',
  avatarPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  groupPhoto: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  primaryColor: '#D6BCFA',
  secondaryColor: '#F472B6',
  fontFamily: 'Quicksand',
  timeline: [
    {
      id: 'tl-1',
      time: '06:30',
      title: 'Trang điểm & thay trang phục',
      location: 'Phòng học lớp 12A1',
      note: 'Chuẩn bị trang phục thanh xuân'
    },
    {
      id: 'tl-2',
      time: '07:30',
      title: 'Chụp ảnh tập thể cả lớp',
      location: 'Cổng chính & Giảng đường',
      note: 'Chụp cùng giáo viên chủ nhiệm và cả lớp'
    },
    {
      id: 'tl-3',
      time: '09:00',
      title: 'Chụp concept, nhóm bạn thân',
      location: 'Sân trường & Vườn cây',
      note: 'Thời gian chụp tự do cùng bạn bè'
    },
    {
      id: 'tl-4',
      time: '10:30',
      title: 'Ảnh cá nhân, tặng hoa & lưu bút',
      location: 'Hành lang & Sân bóng',
      note: 'Ký lưu bút và tặng hoa tốt nghiệp'
    }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80'
  ],
  rsvps: [
    {
      id: 'rsvp-1',
      invitationId: 'gp-green-student',
      guestName: 'Bảo Trâm',
      relation: 'Bạn thân',
      status: 'confirmed',
      message: 'Tớ nhất định sẽ đến đúng 7h mang hoa cho cậu nhé!',
      createdAt: '2026-11-15T08:30:00Z'
    },
    {
      id: 'rsvp-2',
      invitationId: 'gp-green-student',
      guestName: 'Minh Quân',
      relation: 'Bạn cùng lớp',
      status: 'confirmed',
      message: 'Chúc bạn có bộ ảnh thanh xuân rực rỡ nhất!',
      createdAt: '2026-11-15T09:15:00Z'
    }
  ],
  componentsVisible: {
    showCountdown: true,
    showLocationMap: true,
    showDressCode: true,
    showSchedule: true,
    showFriendPhotoTime: true,
    showWishes: true,
    showMusic: true,
    showRSVP: true
  },
  creatorName: 'Hoàng Ngọc Bảo Anh',
  creatorEmail: 'baoanh.kyeu@gmail.com',
  status: 'published',
  views: 388,
  shares: 112,
  createdAt: '2026-11-14T10:00:00Z',
  updatedAt: '2026-11-15T10:00:00Z'
};

export const PREMADE_MESSAGES = [
  {
    title: 'Gửi bạn bè thân thiết',
    content: 'Thanh xuân như một cơn mưa rào. Ngày mình chụp ảnh kỷ yếu, nhất định phải có cậu đứng cạnh trong khung hình để cùng lưu giữ nụ cười nhé!'
  },
  {
    title: 'Gửi người thân & gia đình',
    content: 'Con/Em trân trọng kính mời gia đình đến chung vui và chụp cùng con/em những bức ảnh kỷ niệm nhân ngày tốt nghiệp đánh dấu chặng đường trưởng thành.'
  },
  {
    title: 'Gửi bạn bè cùng trường',
    content: 'Ngày chụp kỷ yếu của mình đã đến rồi! Tranh thủ ghé qua sân trường chụp cùng mình vài tấm hình kỷ niệm thật vui nhé!'
  }
];
