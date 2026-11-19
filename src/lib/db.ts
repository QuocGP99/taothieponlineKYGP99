import prisma from './prisma';
import { InvitationData, RSVP, GuestWish } from '@/types/invitation';

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL);
}

export const isMysqlConfigured = isDbConfigured;

// Chuyển record từ Prisma model Invitation sang đối tượng frontend InvitationData
export function mapPrismaToInvitation(
  inv: any,
  rsvps: RSVP[] = [],
  wishes: GuestWish[] = []
): InvitationData {
  let gallery: string[] = [];
  try {
    gallery = typeof inv.gallery === 'string' ? JSON.parse(inv.gallery) : (inv.gallery || []);
  } catch (e) {
    gallery = [];
  }

  let timeline: any[] = [];
  try {
    timeline = typeof inv.timeline === 'string' ? JSON.parse(inv.timeline) : (inv.timeline || []);
  } catch (e) {
    timeline = [];
  }

  let rowWishes: any[] = [];
  try {
    rowWishes = typeof inv.wishesJson === 'string' ? JSON.parse(inv.wishesJson) : (inv.wishesJson || []);
  } catch (e) {
    rowWishes = [];
  }

  let stickers: string[] = [];
  let recipients: any[] = [];
  try {
    const parsed = typeof inv.stickers === 'string' ? JSON.parse(inv.stickers) : (inv.stickers || []);
    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && parsed[0]?.name) {
        recipients = parsed;
      } else {
        stickers = parsed;
      }
    }
  } catch (e) {
    stickers = [];
    recipients = [];
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
    if (inv.componentsVisible) {
      componentsVisible = {
        ...componentsVisible,
        ...(typeof inv.componentsVisible === 'string'
          ? JSON.parse(inv.componentsVisible)
          : inv.componentsVisible)
      };
    }
  } catch (e) {}

  const mappedRsvps: RSVP[] = (inv.rsvps || rsvps || []).map((r: any) => ({
    id: r.id,
    invitationId: r.invitationId,
    guestName: r.guestName,
    relation: r.relation || 'Bạn thân',
    status: r.status || 'confirmed',
    phone: r.phone || '',
    message: r.message || '',
    virtualGift: (r.virtualGift as any) || 'bouquet',
    companionCount: r.companionCount || 0,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString()
  }));

  const mappedWishes: GuestWish[] = (inv.wishes || wishes || rowWishes || []).map((w: any) => ({
    id: w.id,
    senderName: w.senderName,
    relation: w.relation || 'Bạn bè',
    message: w.message,
    createdAt: w.createdAt ? new Date(w.createdAt).toISOString() : new Date().toISOString()
  }));

  return {
    id: inv.id,
    slug: inv.slug,
    templateId: inv.templateId || 'modern-crimson-spotlight',
    studentName: inv.studentName,
    namePart1: inv.namePart1 || '',
    namePart2: inv.namePart2 || '',
    nickname: inv.nickname || '',
    className: inv.className,
    schoolName: inv.schoolName,
    schoolYear: inv.schoolYear || '2024 – 2027',
    senderName: inv.senderName || inv.studentName,
    guestName: inv.guestName || 'Bạn thân mến',
    friendPhotoTime: inv.friendPhotoTime || '',
    title: inv.title,
    date: inv.date,
    dayOfWeek: inv.dayOfWeek || '',
    startTime: inv.startTime,
    endTime: inv.endTime || '',
    gatheringLocation: inv.gatheringLocation || '',
    shootLocation: inv.shootLocation,
    detailedAddress: inv.detailedAddress || '',
    googleMapsUrl: inv.googleMapsUrl || '',
    dressCode: inv.dressCode || '',
    note: inv.note || '',
    inviteMessage: inv.inviteMessage || '',
    wishMessage: inv.wishMessage || '',
    signature: inv.signature || '',
    avatarPhoto: inv.avatarPhoto || '',
    groupPhoto: inv.groupPhoto || '',
    bgImage: inv.bgImage || '',
    gallery,
    timeline,
    wishes: mappedWishes,
    stickers,
    recipients,
    componentsVisible,
    primaryColor: inv.primaryColor || '#890F0D',
    secondaryColor: inv.secondaryColor || '#720000',
    fontFamily: inv.fontFamily || 'Plus Jakarta Sans',
    fontSize: inv.fontSize || 'md',
    textAlign: inv.textAlign || 'center',
    creatorName: inv.creatorName || '',
    creatorEmail: inv.creatorEmail || '',
    creatorPhone: inv.creatorPhone || '',
    agreedToTerms: true,
    views: Number(inv.views || 0),
    shares: Number(inv.shares || 0),
    status: (inv.status as any) || 'published',
    rsvps: mappedRsvps,
    createdAt: inv.createdAt ? new Date(inv.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: inv.updatedAt ? new Date(inv.updatedAt).toISOString() : new Date().toISOString()
  };
}

// 1. Lưu hoặc cập nhật thiệp mời vào Postgres qua Prisma
export async function saveInvitationToDb(invitation: InvitationData): Promise<boolean> {
  if (!isDbConfigured()) return false;

  try {
    const data = {
      templateId: invitation.templateId || 'modern-crimson-spotlight',
      creatorEmail: invitation.creatorEmail ? invitation.creatorEmail.trim().toLowerCase() : null,
      creatorName: invitation.creatorName || null,
      creatorPhone: invitation.creatorPhone || null,
      studentName: invitation.studentName,
      namePart1: invitation.namePart1 || null,
      namePart2: invitation.namePart2 || null,
      nickname: invitation.nickname || null,
      className: invitation.className,
      schoolName: invitation.schoolName,
      schoolYear: invitation.schoolYear || '2024 – 2027',
      senderName: invitation.senderName || invitation.studentName,
      guestName: invitation.guestName || 'Bạn thân mến',
      friendPhotoTime: invitation.friendPhotoTime || null,
      title: invitation.title,
      date: invitation.date,
      dayOfWeek: invitation.dayOfWeek || null,
      startTime: invitation.startTime,
      endTime: invitation.endTime || null,
      gatheringLocation: invitation.gatheringLocation || null,
      shootLocation: invitation.shootLocation,
      detailedAddress: invitation.detailedAddress || null,
      googleMapsUrl: invitation.googleMapsUrl || null,
      dressCode: invitation.dressCode || null,
      note: invitation.note || null,
      inviteMessage: invitation.inviteMessage || null,
      wishMessage: invitation.wishMessage || null,
      signature: invitation.signature || null,
      avatarPhoto: invitation.avatarPhoto || null,
      groupPhoto: invitation.groupPhoto || null,
      bgImage: invitation.bgImage || null,
      gallery: invitation.gallery ? JSON.stringify(invitation.gallery) : null,
      timeline: invitation.timeline ? JSON.stringify(invitation.timeline) : null,
      wishesJson: invitation.wishes ? JSON.stringify(invitation.wishes) : null,
      stickers: (invitation.recipients && invitation.recipients.length > 0)
        ? JSON.stringify(invitation.recipients)
        : (invitation.stickers ? JSON.stringify(invitation.stickers) : null),
      componentsVisible: invitation.componentsVisible ? JSON.stringify(invitation.componentsVisible) : null,
      primaryColor: invitation.primaryColor || '#890F0D',
      secondaryColor: invitation.secondaryColor || '#720000',
      fontFamily: invitation.fontFamily || 'Plus Jakarta Sans',
      fontSize: invitation.fontSize || 'md',
      textAlign: invitation.textAlign || 'center',
      views: Number(invitation.views || 0),
      shares: Number(invitation.shares || 0),
      status: invitation.status || 'published',
    };

    await prisma.invitation.upsert({
      where: { slug: invitation.slug },
      update: data,
      create: {
        id: invitation.id,
        slug: invitation.slug,
        ...data
      }
    });

    return true;
  } catch (err: any) {
    console.error('[PRISMA] Lỗi lưu thiệp mời:', err.message);
    return false;
  }
}

// 2. Lấy thông tin thiệp mời theo slug hoặc id
export async function getInvitationFromDb(slugOrId: string): Promise<InvitationData | null> {
  if (!isDbConfigured()) return null;

  try {
    const inv = await prisma.invitation.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      },
      include: {
        rsvps: { orderBy: { createdAt: 'desc' } },
        wishes: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!inv) return null;
    return mapPrismaToInvitation(inv);
  } catch (err: any) {
    console.warn(`[PRISMA] Lỗi tìm thiệp ${slugOrId}:`, err.message);
    return null;
  }
}

export const getInvitationBySlugFromDb = getInvitationFromDb;

// 3. Lấy tất cả thiệp mời (hỗ trợ lọc theo email người tạo)
export async function getAllInvitationsFromDb(creatorEmail?: string): Promise<InvitationData[]> {
  if (!isDbConfigured()) return [];

  try {
    const where: any = {};
    if (creatorEmail && creatorEmail.trim()) {
      where.creatorEmail = creatorEmail.trim().toLowerCase();
    }

    const rows = await prisma.invitation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        rsvps: true,
        wishes: true
      }
    });

    return rows.map(r => mapPrismaToInvitation(r));
  } catch (err: any) {
    console.warn('[PRISMA] Lỗi lấy danh sách thiệp:', err.message);
    return [];
  }
}

// 4. Thêm phản hồi RSVP
export async function addRsvpToDb(
  slugOrId: string,
  rsvpData: Omit<RSVP, 'id' | 'createdAt' | 'invitationId'> & { invitationId?: string }
): Promise<RSVP | null> {
  if (!isDbConfigured()) return null;

  try {
    const inv = await prisma.invitation.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      }
    });

    if (!inv) return null;

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: inv.id,
        invitationSlug: inv.slug,
        guestName: rsvpData.guestName,
        relation: rsvpData.relation || 'Bạn thân',
        status: rsvpData.status || 'confirmed',
        phone: rsvpData.phone || null,
        message: rsvpData.message || null,
        virtualGift: rsvpData.virtualGift || 'bouquet',
        companionCount: rsvpData.companionCount || 0
      }
    });

    return {
      id: rsvp.id,
      invitationId: rsvp.invitationId,
      guestName: rsvp.guestName,
      relation: rsvp.relation || 'Bạn thân',
      status: rsvp.status as any,
      phone: rsvp.phone || '',
      message: rsvp.message || '',
      virtualGift: (rsvp.virtualGift as any) || 'bouquet',
      companionCount: rsvp.companionCount,
      createdAt: rsvp.createdAt.toISOString()
    };
  } catch (err: any) {
    console.error('[PRISMA] Lỗi thêm RSVP:', err.message);
    return null;
  }
}

// 5. Thêm lời chúc vào sổ lưu bút
export async function addWishToDb(
  slugOrId: string,
  wishData: Omit<GuestWish, 'id' | 'createdAt'>
): Promise<GuestWish | null> {
  if (!isDbConfigured()) return null;

  try {
    const inv = await prisma.invitation.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      }
    });

    if (!inv) return null;

    const wish = await prisma.wish.create({
      data: {
        invitationId: inv.id,
        invitationSlug: inv.slug,
        senderName: wishData.senderName,
        relation: wishData.relation || 'Bạn bè',
        message: wishData.message
      }
    });

    return {
      id: wish.id,
      senderName: wish.senderName,
      relation: wish.relation || 'Bạn bè',
      message: wish.message,
      createdAt: wish.createdAt.toISOString()
    };
  } catch (err: any) {
    console.error('[PRISMA] Lỗi thêm Wish:', err.message);
    return null;
  }
}

// 6. Tăng lượt xem (views)
export async function incrementViewsInDb(slug: string): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    await prisma.invitation.updateMany({
      where: { OR: [{ slug }, { id: slug }] },
      data: { views: { increment: 1 } }
    });
  } catch (err: any) {
    console.warn('[PRISMA] Lỗi tăng views:', err.message);
  }
}

// 7. Tăng lượt chia sẻ (shares)
export async function incrementSharesInDb(slug: string): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    await prisma.invitation.updateMany({
      where: { OR: [{ slug }, { id: slug }] },
      data: { shares: { increment: 1 } }
    });
  } catch (err: any) {
    console.warn('[PRISMA] Lỗi tăng shares:', err.message);
  }
}

// 8. Xóa thiệp
export async function deleteInvitationFromDb(idOrSlug: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  try {
    await prisma.invitation.deleteMany({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] }
    });
    return true;
  } catch (err: any) {
    console.error('[PRISMA] Lỗi xóa thiệp:', err.message);
    return false;
  }
}

// 9. Lưu mã OTP vào bảng otp_codes
export async function saveOtpToDb(email: string, otp: string, ttlSeconds = 300): Promise<boolean> {
  if (!isDbConfigured()) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  try {
    // Vô hiệu hóa các mã cũ chưa dùng
    await prisma.otpCode.updateMany({
      where: { email: normalizedEmail, isUsed: false },
      data: { isUsed: true }
    });

    // Lưu mã mới
    await prisma.otpCode.create({
      data: {
        email: normalizedEmail,
        otp,
        expiresAt,
        isUsed: false
      }
    });

    return true;
  } catch (err: any) {
    console.warn('[PRISMA/AUTH] Lỗi lưu OTP:', err.message);
    return false;
  }
}

// 10. Xác thực mã OTP
export async function verifyOtpInDb(email: string, otp: string): Promise<boolean> {
  if (!isDbConfigured()) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  try {
    const record = await prisma.otpCode.findFirst({
      where: {
        email: normalizedEmail,
        otp: cleanOtp,
        isUsed: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!record) return false;

    // Đánh dấu đã dùng
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { isUsed: true }
    });

    return true;
  } catch (err: any) {
    console.warn('[PRISMA/AUTH] Lỗi xác thực OTP:', err.message);
    return false;
  }
}

// 11. Lưu / Cập nhật tài khoản người dùng vào bảng users
export async function upsertUserInDb(user: {
  email: string;
  name?: string;
  avatar?: string;
  provider?: string;
  token?: string;
}): Promise<void> {
  if (!isDbConfigured()) return;

  const normalizedEmail = user.email.trim().toLowerCase();

  try {
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: user.name || undefined,
        avatar: user.avatar || undefined,
        provider: user.provider || 'google',
        token: user.token || undefined
      },
      create: {
        email: normalizedEmail,
        name: user.name || null,
        avatar: user.avatar || null,
        provider: user.provider || 'google',
        token: user.token || null
      }
    });
  } catch (err: any) {
    console.warn('[PRISMA/AUTH] Lỗi upsert user:', err.message);
  }
}
