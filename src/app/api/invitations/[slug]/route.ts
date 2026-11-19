import { NextResponse } from 'next/server';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION, FILM_ROLL_INVITATION, CYBER_FUTURISTIC_INVITATION } from '@/data/templates';
import { InvitationData, RSVP } from '@/types/invitation';
import {
  isDbConfigured,
  getInvitationFromDb,
  incrementViewsInDb,
  incrementSharesInDb,
  addRsvpToDb,
  deleteInvitationFromDb
} from '@/lib/db';

// GET: Lấy thông tin chi tiết một thiệp mời từ MySQL theo slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = decodeURIComponent(params.slug || '').trim().toLowerCase();

  try {
    // 1. Tìm thiệp trong MySQL
    const dbItem = await getInvitationFromDb(slug);
    if (dbItem) {
      try {
        await incrementViewsInDb(slug);
      } catch (_) { }
      dbItem.views = (dbItem.views || 0) + 1;
      return NextResponse.json(dbItem);
    }
  } catch (err: any) {
    console.warn(`[API/Slug GET MySQL Warning for ${slug}]:`, err.message);
  }

  // 2. Fallback cho mẫu template mặc định nếu ĐÚNG là slug của các preset demo
  const DEMO_PRESET_SLUGS: Record<string, any> = {
    'cyber-2030': CYBER_FUTURISTIC_INVITATION,
    'cuon-phim-thanh-xuan': FILM_ROLL_INVITATION,
    'green-student': GREEN_STUDENT_INVITATION,
    'hoang-ngoc-dai-hoc-dong-a-2027': SAMPLE_INVITATION,
    'sample': SAMPLE_INVITATION,
    'modern-crimson-spotlight': SAMPLE_INVITATION,
  };

  if (DEMO_PRESET_SLUGS[slug]) {
    return NextResponse.json(DEMO_PRESET_SLUGS[slug]);
  }

  return NextResponse.json({ error: 'Không tìm thấy thiệp mời kỷ yếu trong cơ sở dữ liệu.' }, { status: 404 });
}

// POST: Tương tác với thiệp mời trên MySQL (RSVP, chia sẻ)
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = decodeURIComponent(params.slug || '').trim().toLowerCase();
  try {
    const body = await request.json();

    if (body.action === 'rsvp') {
      const newRsvp = await addRsvpToDb(slug, {
        guestName: body.guestName || 'Khách mời',
        status: body.status || 'confirmed',
        relation: body.relation || 'Bạn thân',
        phone: body.phone || '',
        message: body.message || '',
        virtualGift: body.virtualGift || 'bouquet',
        companionCount: Number(body.companionCount || 0)
      });

      if (!newRsvp) {
        return NextResponse.json(
          { error: 'Không thể lưu phản hồi RSVP vào MySQL.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, rsvp: newRsvp, storageEngine: 'mysql' });
    }

    if (body.action === 'share') {
      await incrementSharesInDb(slug);
      return NextResponse.json({ success: true, storageEngine: 'prisma' });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[API/Slug POST Error for ${slug}]:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Xóa thiệp mời khỏi cơ sở dữ liệu (Dành cho Admin)
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = decodeURIComponent(params.slug || '').trim().toLowerCase();
  try {
    const success = await deleteInvitationFromDb(slug);
    if (!success) {
      return NextResponse.json({ error: 'Không thể xóa thiệp' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Đã xóa thiệp thành công' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
