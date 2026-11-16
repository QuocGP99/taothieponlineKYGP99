import { Template, InvitationData } from '../types/invitation';

export const TEMPLATES: Template[] = [
  {
    id: 'modern-crimson-spotlight',
    name: 'Modern Crimson Spotlight (Kỷ Yếu Poster)',
    category: 'hien-dai',
    categoryName: 'Poster Kỷ Yếu Hiện Đại',
    description: 'Phong cách tối giản, hiện đại với tone đỏ rượu Crimson, chùm ánh sáng sân khấu và tên nghệ thuật hai bên ảnh chân dung.',
    previewImage: '/templates/modern-crimson.webp',
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
    previewImage: '/templates/scrapbook.jpg',
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
  },
  {
    id: 'vintage-film-roll',
    name: 'Cuộn Phim Thanh Xuân (Vintage Film)',
    category: 'thanh-xuan',
    categoryName: 'Cuộn Phim Hoài Niệm',
    description: 'Phong cách cuộn phim 35mm điện ảnh hoài niệm, vé xem phim vintage có cuống vé rời, dải phim timeline và bảng The End hoài niệm.',
    previewImage: '/templates/vintage-film.jpg',
    badge: 'Mẫu Điện Ảnh Mới',
    defaultColors: {
      primary: '#382113',
      secondary: '#C27803',
      background: '#F7F2EA',
      text: '#231A16',
      accent: '#F59E0B',
    },
    fontFamily: 'Cormorant Garamond',
    styleName: 'Vintage Cinema 35mm'
  },
  {
    id: 'cyber-y2k-futuristic',
    name: 'Cyber 2030 (Neo-Futuristic Y2K)',
    category: 'thanh-xuan',
    categoryName: 'Cyber Y2K 2030',
    description: 'Phong cách 3D Cyber Futuristic & Y2K Neo-Pop: thẻ học sinh 3D trong suốt, cửa sổ hệ điều hành Retro OS, pixel art icon và tone màu neon sống động.',
    previewImage: '/templates/cyber-2030.jpg',
    badge: 'Mẫu 3D Futuristic Mới',
    defaultColors: {
      primary: '#FF2E93',
      secondary: '#A3E635',
      background: '#38BDF8',
      text: '#000000',
      accent: '#FACC15',
    },
    fontFamily: 'Righteous',
    styleName: 'Neo-Futuristic 2030'
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

export const FILM_ROLL_INVITATION: InvitationData = {
  ...SAMPLE_INVITATION,
  id: 'gp-vintage-film-roll',
  slug: 'cuon-phim-thanh-xuan',
  templateId: 'vintage-film-roll',
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
  title: 'Thanh Xuân',
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
  signature: 'Thương! ♡',
  avatarPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  groupPhoto: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  primaryColor: '#382113',
  secondaryColor: '#C27803',
  fontFamily: 'Cormorant Garamond',
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
      invitationId: 'gp-vintage-film-roll',
      guestName: 'Mỹ Duyên',
      relation: 'Bạn thân',
      status: 'confirmed',
      message: 'Hẹn gặp cậu trong những thước phim thanh xuân đẹp nhất nhé!',
      createdAt: '2026-11-15T09:00:00Z'
    },
    {
      id: 'rsvp-2',
      invitationId: 'gp-vintage-film-roll',
      guestName: 'Quốc Huy',
      relation: 'Bạn cùng lớp',
      status: 'confirmed',
      message: 'Chúc cuộn phim thanh xuân của bạn đạt 100 điểm rực rỡ!',
      createdAt: '2026-11-15T10:30:00Z'
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
  creatorEmail: 'baoanh.film@gmail.com',
  status: 'published',
  views: 420,
  shares: 135,
  createdAt: '2026-11-14T10:00:00Z',
  updatedAt: '2026-11-15T10:00:00Z'
};

export const CYBER_FUTURISTIC_INVITATION: InvitationData = {
  id: 'gp-cyber-y2k-futuristic',
  slug: 'cyber-2030',
  templateId: 'cyber-y2k-futuristic',
  studentName: 'SHREYA PATEL',
  namePart1: 'SHREYA',
  namePart2: 'PATEL',
  nickname: 'Shreya 2030',
  className: 'K23 Multimedia & Design',
  schoolName: 'ĐẠI HỌC CÔNG NGHỆ THIẾT KẾ GP',
  schoolYear: '2023 - 2027',
  senderName: 'Shreya Patel',
  guestName: 'Bạn Thân Mến',
  friendPhotoTime: '08:30 - 11:30 (Đón bạn bè chụp ảnh & check-in)',
  title: 'CREATIVE YEARBOOK 2030 – SHREYA PATEL',
  date: '2026-12-31',
  dayOfWeek: 'Thứ Năm',
  startTime: '07:00',
  endTime: '12:00',
  gatheringLocation: 'Sân Trường & Cyber Studio Hub',
  shootLocation: 'Cơ sở chính - Đại học Công Nghệ GP, 14 đường Hồng Bàng, Quận 3, TP.HCM',
  detailedAddress: '14 đường Hồng Bàng, Phường 6, Quận 3, TP. Hồ Chí Minh',
  googleMapsUrl: 'https://maps.google.com/?q=Dai+Hoc+GP+Studio',
  dressCode: 'Tone màu Neon Pop, Y2K Futuristic hoặc tự do sáng tạo rực rỡ nhất!',
  note: 'Mang theo năng lượng tích cực và cùng check-in thẻ học sinh 3D xịn sò nhé!',
  timeline: [
    {
      id: 'step-1',
      time: '06:30',
      title: 'Tập trung & Trang phục Cử nhân / Concept 3D',
      location: 'Studio sảnh chính',
      note: 'Chuẩn bị thẻ học sinh, dây đeo thẻ và phụ kiện'
    },
    {
      id: 'step-2',
      time: '07:30',
      title: 'Chụp ảnh tập thể cả lớp & flycam sân trường',
      location: 'Sân trường & Đài phun nước',
      note: 'Khoảnh khắc đại gia đình lớp K23 tỏa sáng'
    },
    {
      id: 'step-3',
      time: '09:00',
      title: 'Chụp concept nhóm bạn thân & Retro OS Booth',
      location: 'Khu vực sáng tạo & Vườn sinh thái',
      note: 'Chụp tự do cùng bạn bè và người thân'
    },
    {
      id: 'step-4',
      time: '10:30',
      title: 'Ảnh cá nhân, ký tên lưu bút & ném nón cử nhân',
      location: 'Sảnh danh dự',
      note: 'Ký vào sổ Guestbook 3D và nhận hoa lưu niệm'
    }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80'
  ],
  wishes: [
    {
      id: 'wish-1',
      senderName: 'Minh Hoàng',
      relation: 'Bạn thân',
      message: 'Chúc mừng Shreya tốt nghiệp đỉnh chóp! Chiếc thiệp 3D xịn quá, nhất định mình sẽ có mặt sớm nhất!',
      createdAt: '2026-11-16T08:00:00Z'
    },
    {
      id: 'wish-2',
      senderName: 'Lan Chi',
      relation: 'Bạn cùng lớp',
      message: 'Chúc bạn luôn tỏa sáng rực rỡ và thành công trên chặng đường thiết kế tương lai!',
      createdAt: '2026-11-16T08:30:00Z'
    }
  ],
  inviteMessage: 'Một chặng đường đại học rực rỡ sắp khép lại để mở ra những chân trời mới. Ngày chụp ảnh kỷ yếu của mình đã đến rồi! Sự hiện diện của bạn là mảnh ghép tuyệt vời nhất để hoàn thiện cuốn Yearbook 2030 này. Hãy ghé qua chung vui và chụp cùng mình những khoảnh khắc đáng nhớ nhất nhé!',
  wishMessage: 'Cảm ơn bạn vì đã cùng mình tạo nên những kỷ niệm thanh xuân 3D không thể nào quên!',
  signature: 'Shreya Patel',
  avatarPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  groupPhoto: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  primaryColor: '#FF2E93',
  secondaryColor: '#A3E635',
  fontFamily: 'Righteous',
  fontSize: 'md',
  textAlign: 'center',
  stickers: [],
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
  creatorName: 'Shreya Patel',
  creatorEmail: 'shreya.cyber2030@gmail.com',
  creatorPhone: '0901234567',
  agreedToTerms: true,
  status: 'published',
  views: 580,
  shares: 210,
  rsvps: [
    {
      id: 'rsvp-1',
      invitationId: 'gp-cyber-y2k-futuristic',
      guestName: 'Minh Hoàng',
      relation: 'Bạn thân',
      status: 'confirmed',
      message: 'Hẹn gặp cậu tại trạm Cyber Studio 2030 đúng giờ nhé!',
      createdAt: '2026-11-16T08:00:00Z'
    },
    {
      id: 'rsvp-2',
      invitationId: 'gp-cyber-y2k-futuristic',
      guestName: 'Lan Chi',
      relation: 'Bạn cùng lớp',
      status: 'confirmed',
      message: 'Đã sẵn sàng hoa và quà tặng cậu rồi nè!',
      createdAt: '2026-11-16T08:30:00Z'
    }
  ],
  createdAt: '2026-11-16T08:00:00Z',
  updatedAt: '2026-11-16T08:00:00Z'
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
