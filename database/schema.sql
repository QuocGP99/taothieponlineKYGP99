-- ========================================================
-- GP STUDIO99 – YEARBOOK INVITATION MAKER
-- HỆ THỐNG CƠ SỞ DỮ LIỆU MYSQL CHO HOSTING INET / CPANEL
-- Bảng mã: utf8mb4_unicode_ci (Hỗ trợ tiếng Việt có dấu và Emoji)
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Bảng users: Tài khoản học sinh & quản trị viên
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NULL,
  `avatar` TEXT NULL,
  `provider` VARCHAR(50) NOT NULL DEFAULT 'google',
  `token` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Bảng invitations: Dữ liệu thiệp mời kỷ yếu trực tuyến
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `invitations` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `template_id` VARCHAR(100) NOT NULL DEFAULT 'modern-crimson-spotlight',
  `creator_email` VARCHAR(255) NULL,
  `creator_name` VARCHAR(255) NULL,
  `creator_phone` VARCHAR(50) NULL,
  
  -- Thông tin học sinh (chủ thiệp)
  `student_name` VARCHAR(255) NOT NULL,
  `name_part1` VARCHAR(100) NULL,
  `name_part2` VARCHAR(100) NULL,
  `nickname` VARCHAR(100) NULL,
  `class_name` VARCHAR(150) NOT NULL,
  `school_name` VARCHAR(255) NOT NULL,
  `school_year` VARCHAR(100) NOT NULL DEFAULT '2024 – 2027',
  `sender_name` VARCHAR(255) NULL,
  `guest_name` VARCHAR(255) NULL,
  
  -- Sự kiện & lịch trình chụp ảnh
  `friend_photo_time` VARCHAR(255) NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `day_of_week` VARCHAR(50) NULL,
  `start_time` VARCHAR(50) NOT NULL,
  `end_time` VARCHAR(50) NULL,
  `gathering_location` TEXT NULL,
  `shoot_location` TEXT NOT NULL,
  `detailed_address` TEXT NULL,
  `google_maps_url` TEXT NULL,
  `dress_code` TEXT NULL,
  `note` TEXT NULL,
  
  -- Lời nhắn
  `invite_message` TEXT NULL,
  `wish_message` TEXT NULL,
  `signature` VARCHAR(255) NULL,
  
  -- Hình ảnh
  `avatar_photo` LONGTEXT NULL,
  `group_photo` LONGTEXT NULL,
  `bg_image` LONGTEXT NULL,
  
  -- Mảng dữ liệu cấu hình JSON
  `gallery` LONGTEXT NULL,
  `timeline` LONGTEXT NULL,
  `wishes` LONGTEXT NULL,
  `stickers` TEXT NULL,
  `components_visible` TEXT NULL,
  
  -- Cá nhân hóa giao diện
  `primary_color` VARCHAR(50) NOT NULL DEFAULT '#890F0D',
  `secondary_color` VARCHAR(50) NULL DEFAULT '#720000',
  `font_family` VARCHAR(100) NOT NULL DEFAULT 'Plus Jakarta Sans',
  `font_size` VARCHAR(20) NOT NULL DEFAULT 'md',
  `text_align` VARCHAR(20) NOT NULL DEFAULT 'center',
  
  -- Trạng thái & thống kê lượt xem/chia sẻ
  `views` INT NOT NULL DEFAULT 0,
  `shares` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_invitations_slug` (`slug`),
  INDEX `idx_invitations_creator` (`creator_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Bảng rsvps: Danh sách phản hồi xác nhận tham gia
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rsvps` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `invitation_id` VARCHAR(100) NOT NULL,
  `invitation_slug` VARCHAR(150) NULL,
  `guest_name` VARCHAR(255) NOT NULL,
  `relation` VARCHAR(100) NULL DEFAULT 'Bạn thân',
  `status` VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  `phone` VARCHAR(50) NULL,
  `message` TEXT NULL,
  `virtual_gift` VARCHAR(50) NULL DEFAULT 'bouquet',
  `companion_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_rsvps_invitation` (`invitation_id`),
  INDEX `idx_rsvps_slug` (`invitation_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Bảng wishes: Lời chúc & sổ lưu bút từ bạn bè
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wishes` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `invitation_id` VARCHAR(100) NOT NULL,
  `invitation_slug` VARCHAR(150) NULL,
  `sender_name` VARCHAR(255) NOT NULL,
  `relation` VARCHAR(100) NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_wishes_invitation` (`invitation_id`),
  INDEX `idx_wishes_slug` (`invitation_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Bảng otp_codes: Quản lý mã xác thực OTP gửi qua Gmail
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `otp_codes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_used` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_otp_verify` (`email`, `otp`, `is_used`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA CHO THIỆP MỜI)
-- --------------------------------------------------------
INSERT IGNORE INTO `invitations` (
  `id`, `slug`, `template_id`, `student_name`, `name_part1`, `name_part2`, `nickname`, 
  `class_name`, `school_name`, `school_year`, `sender_name`, `guest_name`, `friend_photo_time`, 
  `title`, `date`, `day_of_week`, `start_time`, `end_time`, `gathering_location`, 
  `shoot_location`, `detailed_address`, `google_maps_url`, `dress_code`, `note`, 
  `invite_message`, `wish_message`, `signature`, `avatar_photo`, `group_photo`, 
  `gallery`, `timeline`, `wishes`, `components_visible`, `primary_color`, `secondary_color`, 
  `font_family`, `views`, `shares`, `status`
) VALUES (
  'gp-green-student',
  'green-student',
  'green-student',
  'Tên gọi',
  'XUÂN',
  'TRƯỜNG',
  'Tên gọi',
  '12A1',
  'Tên trường của bạn',
  '2024 – 2027',
  'Tên gọi',
  'Bạn thân mến',
  '13:30 - 17:30 (Đón bạn bè chụp ảnh kỷ niệm)',
  'mùa phượng cuối',
  '2026-12-30',
  'Thứ tư',
  '13:00',
  '18:00',
  'Sân trường của bạn',
  'Cơ sở chính trường học, Đà Nẵng',
  'Đà Nẵng',
  'https://www.google.com/maps/search/Da+Nang',
  'Tone màu xanh sage, trắng hoặc be nhẹ nhàng thanh lịch',
  'Hãy ghé qua chụp ảnh cùng mình nhé!',
  'Ba năm cấp 3 trôi qua như một cái chớp mắt, ngày chụp ảnh kỷ yếu của mình đã đến rồi. Hãy ghé qua chung vui và chụp cùng mình vài tấm hình kỷ niệm thật vui nhé!',
  'Cảm ơn bạn vì đã đồng hành cùng mình trong suốt những năm tháng thanh xuân!',
  'Tên gọi • Trân trọng',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  '[\"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80\"]',
  '[{\"id\":\"tl-1\",\"time\":\"13:00 - 14:00\",\"title\":\"Tập trung chụp ảnh đồng phục lớp\",\"location\":\"Cổng chính & Giảng đường\",\"note\":\"Chuẩn bị trang phục thanh xuân\"},{\"id\":\"tl-2\",\"time\":\"14:00 - 16:30\",\"title\":\"Khung giờ đón bạn bè & người thân chụp ảnh\",\"location\":\"Sân trường & Vườn cây\",\"note\":\"Thời gian chụp tự do cùng bạn bè\"},{\"id\":\"tl-3\",\"time\":\"16:30 - 18:00\",\"title\":\"Chụp ảnh tập thể hoàng hôn\",\"location\":\"Sân bóng trường\",\"note\":\"Lưu giữ nụ cười thanh xuân\"}]',
  '[{\"id\":\"wish-1\",\"senderName\":\"Bạn thân mến\",\"relation\":\"Bạn thân\",\"message\":\"Chúc Xuân Trường có một ngày chụp kỷ yếu thật rực rỡ và đáng nhớ nhé!\",\"createdAt\":\"2026-11-15T10:00:00Z\"}]',
  '{\"showCountdown\":true,\"showLocationMap\":true,\"showDressCode\":true,\"showTimeline\":true,\"showGallery\":true,\"showWishes\":true,\"showRSVP\":true,\"showMusicPlayer\":true,\"showPetals\":true}',
  '#15803D',
  '#166534',
  'Quicksand',
  128,
  24,
  'published'
),
(
  'gp-hoang-ngoc-dong-a',
  'hoang-ngoc-dai-hoc-dong-a-2027',
  'modern-crimson-spotlight',
  'HOÀNG NGỌC',
  'HOÀNG',
  'NGỌC',
  'Ngọc Xinh',
  'K23 Marketing',
  'TRƯỜNG ĐẠI HỌC ĐÔNG Á',
  '2023 - 2027',
  'Hoàng Ngọc',
  'Mỹ Linh',
  '13:00 - 18:00 (Đón bạn bè & người thân chụp ảnh giao lưu)',
  'HAPPY YEARBOOK EVENT – HOÀNG NGỌC',
  '2027-07-22',
  'Thứ tư',
  '13:00',
  '18:00',
  'Sân trường Đại học Đông Á',
  '14 ngõ 23 đường Hồng Bàng, quận 3, thành phố Hồ Chí Minh',
  '14 ngõ 23 đường Hồng Bàng, quận 3, thành phố Hồ Chí Minh',
  'https://www.google.com/maps/search/Truong+Dai+Hoc+Dong+A',
  'Tone màu trắng, be hoặc trang phục tự do nhẹ nhàng, thanh lịch để chụp ảnh kỷ niệm nhé!',
  'Mang theo nụ cười rạng rỡ và tinh thần hứng khởi đến chụp cùng Ngọc nha!',
  'Bốn năm thanh xuân tại giảng đường đại học sắp khép lại. Ngọc rất mong bạn sẽ bớt chút thời gian đến chung vui và lưu lại những tấm ảnh kỷ niệm tuyệt đẹp nhé!',
  'Sự hiện diện của bạn là niềm vinh hạnh lớn của Ngọc!',
  'Hoàng Ngọc • Trân trọng kính mời',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  '[\"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80\"]',
  '[{\"id\":\"tl-1\",\"time\":\"13:00 - 14:00\",\"title\":\"Tập trung & Chụp trang phục Cử Nhân\",\"location\":\"Cổng chính & Giảng đường\",\"note\":\"Chuẩn bị trang phục, nón cử nhân\"},{\"id\":\"tl-2\",\"time\":\"14:00 - 16:30\",\"title\":\"Khung giờ đón Bạn Bè & Gia Đình chụp ảnh tự do\",\"location\":\"Sân trường & Khuôn viên trường\",\"note\":\"Chụp ảnh lưu niệm với người thân, bạn bè\"}]',
  '[{\"id\":\"wish-1\",\"senderName\":\"Mỹ Linh\",\"relation\":\"Bạn thân\",\"message\":\"Chúc Hoàng Ngọc ngày chụp kỷ yếu thật rạng rỡ, tốt nghiệp loại xuất sắc nha!\",\"createdAt\":\"2026-11-12T14:35:00Z\"}]',
  '{\"showCountdown\":true,\"showLocationMap\":true,\"showDressCode\":true,\"showTimeline\":true,\"showGallery\":true,\"showWishes\":true,\"showRSVP\":true,\"showMusicPlayer\":true,\"showPetals\":true}',
  '#890F0D',
  '#720000',
  'Plus Jakarta Sans',
  312,
  88,
  'published'
);

SET FOREIGN_KEY_CHECKS = 1;
