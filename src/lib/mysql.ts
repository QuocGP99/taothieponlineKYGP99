import mysql, { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { InvitationData, RSVP, GuestWish } from '@/types/invitation';

let pool: Pool | null = null;

// Kiểm tra xem hệ thống đã được cấp thông số kết nối MySQL chưa
export function isMysqlConfigured(): boolean {
  return Boolean(
    process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_NAME
  );
}

// Khởi tạo Connection Pool kết nối MySQL iNET cPanel
export function getDbPool(): Pool | null {
  if (!isMysqlConfigured()) {
    return null;
  }

  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        charset: 'utf8mb4'
      });
      console.log(`[MYSQL] Khởi tạo Connection Pool kết nối tới MySQL iNET: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
    } catch (err) {
      console.error('[MYSQL] Lỗi khởi tạo pool MySQL:', err);
      pool = null;
    }
  }

  return pool;
}

// Chạy truy vấn SQL tổng quát
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const p = getDbPool();
  if (!p) {
    throw new Error('MySQL chưa được cấu hình. Vui lòng thiết lập biến môi trường DB_HOST, DB_USER, DB_NAME.');
  }
  const [rows] = await p.execute(sql, params);
  return rows as T;
}

// Kiểm tra kết nối thử nghiệm
export async function testDbConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const p = getDbPool();
    if (!p) {
      return { success: false, message: 'Chưa cấu hình thông tin MySQL trong .env' };
    }
    await p.query('SELECT 1');
    return { success: true, message: 'Kết nối MySQL iNET thành công!' };
  } catch (err: any) {
    return { success: false, message: `Lỗi kết nối MySQL: ${err.message}` };
  }
}

// Map hàng trong bảng invitations thành đối tượng InvitationData
function mapRowToInvitation(row: any, rsvps: RSVP[] = [], wishes: GuestWish[] = []): InvitationData {
  let gallery: string[] = [];
  try {
    gallery = typeof row.gallery === 'string' ? JSON.parse(row.gallery) : (row.gallery || []);
  } catch (e) {
    gallery = [];
  }

  let timeline: any[] = [];
  try {
    timeline = typeof row.timeline === 'string' ? JSON.parse(row.timeline) : (row.timeline || []);
  } catch (e) {
    timeline = [];
  }

  let rowWishes: any[] = [];
  try {
    rowWishes = typeof row.wishes === 'string' ? JSON.parse(row.wishes) : (row.wishes || []);
  } catch (e) {
    rowWishes = [];
  }

  let stickers: string[] = [];
  try {
    stickers = typeof row.stickers === 'string' ? JSON.parse(row.stickers) : (row.stickers || []);
  } catch (e) {
    stickers = [];
  }

  let componentsVisible = {
    showCountdown: true,
    showLocationMap: true,
    showDressCode: true,
    showSchedule: true,
    showFriendPhotoTime: true,
    showWishes: true,
    showMusic: true,
    showRSVP: true
  };
  try {
    if (row.components_visible) {
      componentsVisible = { ...componentsVisible, ...(typeof row.components_visible === 'string' ? JSON.parse(row.components_visible) : row.components_visible) };
    }
  } catch (e) {}

  return {
    id: row.id,
    slug: row.slug,
    templateId: row.template_id || 'modern-crimson-spotlight',
    studentName: row.student_name,
    namePart1: row.name_part1 || '',
    namePart2: row.name_part2 || '',
    nickname: row.nickname || '',
    className: row.class_name,
    schoolName: row.school_name,
    schoolYear: row.school_year || '2024 – 2027',
    senderName: row.sender_name || row.student_name,
    guestName: row.guest_name || 'Bạn thân mến',
    friendPhotoTime: row.friend_photo_time || '',
    title: row.title,
    date: row.date,
    dayOfWeek: row.day_of_week || '',
    startTime: row.start_time,
    endTime: row.end_time || '',
    gatheringLocation: row.gathering_location || '',
    shootLocation: row.shoot_location,
    detailedAddress: row.detailed_address || '',
    googleMapsUrl: row.google_maps_url || '',
    dressCode: row.dress_code || '',
    note: row.note || '',
    inviteMessage: row.invite_message || '',
    wishMessage: row.wish_message || '',
    signature: row.signature || '',
    avatarPhoto: row.avatar_photo || '',
    groupPhoto: row.group_photo || '',
    bgImage: row.bg_image || '',
    gallery,
    timeline,
    wishes: wishes.length > 0 ? wishes : rowWishes,
    stickers,
    componentsVisible,
    primaryColor: row.primary_color || '#890F0D',
    secondaryColor: row.secondary_color || '#720000',
    fontFamily: row.font_family || 'Plus Jakarta Sans',
    fontSize: row.font_size || 'md',
    textAlign: row.text_align || 'center',
    creatorName: row.creator_name || '',
    creatorEmail: row.creator_email || '',
    creatorPhone: row.creator_phone || '',
    agreedToTerms: true,
    views: Number(row.views || 0),
    shares: Number(row.shares || 0),
    status: row.status || 'published',
    rsvps,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  };
}

// 1. Lưu hoặc cập nhật thiệp mời vào MySQL
export async function saveInvitationToDb(invitation: InvitationData): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  const sql = `
    INSERT INTO invitations (
      id, slug, template_id, creator_email, creator_name, creator_phone,
      student_name, name_part1, name_part2, nickname, class_name, school_name, school_year,
      sender_name, guest_name, friend_photo_time, title, date, day_of_week,
      start_time, end_time, gathering_location, shoot_location, detailed_address,
      google_maps_url, dress_code, note, invite_message, wish_message, signature,
      avatar_photo, group_photo, bg_image, gallery, timeline, wishes, stickers, components_visible,
      primary_color, secondary_color, font_family, font_size, text_align,
      views, shares, status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, NOW(), NOW()
    ) ON DUPLICATE KEY UPDATE
      template_id = VALUES(template_id),
      creator_email = VALUES(creator_email),
      creator_name = VALUES(creator_name),
      creator_phone = VALUES(creator_phone),
      student_name = VALUES(student_name),
      name_part1 = VALUES(name_part1),
      name_part2 = VALUES(name_part2),
      nickname = VALUES(nickname),
      class_name = VALUES(class_name),
      school_name = VALUES(school_name),
      school_year = VALUES(school_year),
      sender_name = VALUES(sender_name),
      guest_name = VALUES(guest_name),
      friend_photo_time = VALUES(friend_photo_time),
      title = VALUES(title),
      date = VALUES(date),
      day_of_week = VALUES(day_of_week),
      start_time = VALUES(start_time),
      end_time = VALUES(end_time),
      gathering_location = VALUES(gathering_location),
      shoot_location = VALUES(shoot_location),
      detailed_address = VALUES(detailed_address),
      google_maps_url = VALUES(google_maps_url),
      dress_code = VALUES(dress_code),
      note = VALUES(note),
      invite_message = VALUES(invite_message),
      wish_message = VALUES(wish_message),
      signature = VALUES(signature),
      avatar_photo = VALUES(avatar_photo),
      group_photo = VALUES(group_photo),
      bg_image = VALUES(bg_image),
      gallery = VALUES(gallery),
      timeline = VALUES(timeline),
      wishes = VALUES(wishes),
      stickers = VALUES(stickers),
      components_visible = VALUES(components_visible),
      primary_color = VALUES(primary_color),
      secondary_color = VALUES(secondary_color),
      font_family = VALUES(font_family),
      font_size = VALUES(font_size),
      text_align = VALUES(text_align),
      status = VALUES(status),
      updated_at = NOW()
  `;

  const params = [
    invitation.id,
    invitation.slug,
    invitation.templateId || 'modern-crimson-spotlight',
    invitation.creatorEmail || null,
    invitation.creatorName || null,
    invitation.creatorPhone || null,
    invitation.studentName || 'Học Sinh Kỷ Yếu',
    invitation.namePart1 || null,
    invitation.namePart2 || null,
    invitation.nickname || null,
    invitation.className || '12A1',
    invitation.schoolName || 'THPT',
    invitation.schoolYear || '2024 – 2027',
    invitation.senderName || invitation.studentName,
    invitation.guestName || 'Bạn thân mến',
    invitation.friendPhotoTime || null,
    invitation.title || 'Thiệp Mời Kỷ Yếu',
    invitation.date,
    invitation.dayOfWeek || null,
    invitation.startTime || '13:00',
    invitation.endTime || null,
    invitation.gatheringLocation || null,
    invitation.shootLocation,
    invitation.detailedAddress || null,
    invitation.googleMapsUrl || null,
    invitation.dressCode || null,
    invitation.note || null,
    invitation.inviteMessage || null,
    invitation.wishMessage || null,
    invitation.signature || null,
    invitation.avatarPhoto || null,
    invitation.groupPhoto || null,
    invitation.bgImage || null,
    JSON.stringify(invitation.gallery || []),
    JSON.stringify(invitation.timeline || []),
    JSON.stringify(invitation.wishes || []),
    JSON.stringify(invitation.stickers || []),
    JSON.stringify(invitation.componentsVisible || {}),
    invitation.primaryColor || '#890F0D',
    invitation.secondaryColor || '#720000',
    invitation.fontFamily || 'Plus Jakarta Sans',
    invitation.fontSize || 'md',
    invitation.textAlign || 'center',
    invitation.views || 0,
    invitation.shares || 0,
    invitation.status || 'published'
  ];

  await p.execute(sql, params);
  return true;
}

// 2. Lấy thông tin thiệp mời theo slug hoặc id từ MySQL
export async function getInvitationFromDb(slugOrId: string): Promise<InvitationData | null> {
  const p = getDbPool();
  if (!p) return null;

  const [rows]: [RowDataPacket[], any] = await p.execute(
    'SELECT * FROM invitations WHERE slug = ? OR id = ? LIMIT 1',
    [slugOrId, slugOrId]
  );

  if (!rows || rows.length === 0) return null;
  const row = rows[0];

  // Lấy danh sách RSVPs tương ứng
  const [rsvpsRows]: [RowDataPacket[], any] = await p.execute(
    'SELECT * FROM rsvps WHERE invitation_id = ? OR invitation_slug = ? ORDER BY created_at DESC',
    [row.id, row.slug]
  );
  const rsvps: RSVP[] = (rsvpsRows || []).map((r: any) => ({
    id: r.id,
    invitationId: r.invitation_id,
    guestName: r.guest_name,
    relation: r.relation || 'Bạn thân',
    status: r.status || 'confirmed',
    phone: r.phone || '',
    message: r.message || '',
    virtualGift: r.virtual_gift || 'bouquet',
    companionCount: Number(r.companion_count || 0),
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
  }));

  // Lấy danh sách Lời chúc Wishes tương ứng
  const [wishesRows]: [RowDataPacket[], any] = await p.execute(
    'SELECT * FROM wishes WHERE invitation_id = ? OR invitation_slug = ? ORDER BY created_at DESC',
    [row.id, row.slug]
  );
  const wishes: GuestWish[] = (wishesRows || []).map((w: any) => ({
    id: w.id,
    senderName: w.sender_name,
    relation: w.relation || '',
    message: w.message,
    createdAt: w.created_at ? new Date(w.created_at).toISOString() : new Date().toISOString()
  }));

  return mapRowToInvitation(row, rsvps, wishes);
}

// 3. Lấy tất cả danh sách thiệp (có thể lọc theo creatorEmail)
export async function getAllInvitationsFromDb(creatorEmail?: string): Promise<InvitationData[]> {
  const p = getDbPool();
  if (!p) return [];

  let sql = 'SELECT * FROM invitations';
  const params: any[] = [];

  if (creatorEmail) {
    sql += ' WHERE creator_email = ?';
    params.push(creatorEmail.trim().toLowerCase());
  }

  sql += ' ORDER BY created_at DESC LIMIT 100';

  const [rows]: [RowDataPacket[], any] = await p.execute(sql, params);
  return (rows || []).map((r: any) => mapRowToInvitation(r));
}

// 4. Thêm phản hồi RSVP vào MySQL
export async function addRsvpToDb(
  slugOrId: string,
  rsvpData: Omit<RSVP, 'id' | 'createdAt' | 'invitationId'> & { invitationId?: string }
): Promise<RSVP | null> {
  const p = getDbPool();
  if (!p) return null;

  const inv = await getInvitationFromDb(slugOrId);
  const invitationId = inv ? inv.id : slugOrId;
  const invitationSlug = inv ? inv.slug : slugOrId;

  const rsvpId = `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const sql = `
    INSERT INTO rsvps (
      id, invitation_id, invitation_slug, guest_name, relation, status, phone, message, virtual_gift, companion_count, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  await p.execute(sql, [
    rsvpId,
    invitationId,
    invitationSlug,
    rsvpData.guestName,
    rsvpData.relation || 'Bạn thân',
    rsvpData.status || 'confirmed',
    rsvpData.phone || null,
    rsvpData.message || null,
    rsvpData.virtualGift || 'bouquet',
    rsvpData.companionCount || 0
  ]);

  return {
    id: rsvpId,
    invitationId,
    guestName: rsvpData.guestName,
    relation: rsvpData.relation,
    status: rsvpData.status,
    phone: rsvpData.phone,
    message: rsvpData.message,
    virtualGift: rsvpData.virtualGift,
    companionCount: rsvpData.companionCount,
    createdAt: new Date().toISOString()
  };
}

// 5. Tăng lượt xem (views) trong MySQL
export async function incrementViewsInDb(slug: string): Promise<void> {
  const p = getDbPool();
  if (!p) return;
  await p.execute('UPDATE invitations SET views = views + 1 WHERE slug = ? OR id = ?', [slug, slug]);
}

// 6. Tăng lượt chia sẻ (shares) trong MySQL
export async function incrementSharesInDb(slug: string): Promise<void> {
  const p = getDbPool();
  if (!p) return;
  await p.execute('UPDATE invitations SET shares = shares + 1 WHERE slug = ? OR id = ?', [slug, slug]);
}

// 7. Lưu mã OTP vào bảng otp_codes
export async function saveOtpToDb(email: string, otp: string, ttlSeconds = 300): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  // Vô hiệu hóa các mã cũ của email này
  await p.execute(
    'UPDATE otp_codes SET is_used = 1 WHERE email = ? AND is_used = 0',
    [normalizedEmail]
  );

  // Lưu mã mới
  await p.execute(
    'INSERT INTO otp_codes (email, otp, expires_at, is_used, created_at) VALUES (?, ?, ?, 0, NOW())',
    [normalizedEmail, otp, expiresAt]
  );

  return true;
}

// 8. Xác thực mã OTP từ bảng otp_codes
export async function verifyOtpInDb(email: string, otp: string): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  const [rows]: [RowDataPacket[], any] = await p.execute(
    'SELECT * FROM otp_codes WHERE email = ? AND otp = ? AND is_used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [normalizedEmail, cleanOtp]
  );

  if (!rows || rows.length === 0) {
    return false;
  }

  // Đánh dấu đã sử dụng
  await p.execute('UPDATE otp_codes SET is_used = 1 WHERE id = ?', [rows[0].id]);
  return true;
}

// 9. Lưu / Cập nhật tài khoản người dùng vào bảng users
export async function upsertUserInDb(user: {
  email: string;
  name?: string;
  avatar?: string;
  provider?: string;
  token?: string;
}): Promise<void> {
  const p = getDbPool();
  if (!p) return;

  const userId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const normalizedEmail = user.email.trim().toLowerCase();

  await p.execute(
    `INSERT INTO users (id, email, name, avatar, provider, token, created_at, last_login)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE
       name = COALESCE(VALUES(name), name),
       avatar = COALESCE(VALUES(avatar), avatar),
       provider = VALUES(provider),
       token = VALUES(token),
       last_login = NOW()`,
    [
      userId,
      normalizedEmail,
      user.name || null,
      user.avatar || null,
      user.provider || 'google',
      user.token || null
    ]
  );
}
