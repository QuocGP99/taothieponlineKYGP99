import { NextResponse } from 'next/server';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION } from '@/data/templates';
import { InvitationData, RSVP } from '@/types/invitation';
import {
  isMysqlConfigured,
  getInvitationFromDb,
  incrementViewsInDb,
  incrementSharesInDb,
  addRsvpToDb
} from '@/lib/mysql';

// GET: Lấy thông tin chi tiết một thiệp mời từ MySQL theo slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    // 1. Tìm thiệp trong MySQL
    const dbItem = await getInvitationFromDb(slug);
    if (dbItem) {
      await incrementViewsInDb(slug);
      dbItem.views = (dbItem.views || 0) + 1;
      return NextResponse.json(dbItem);
    }

    // 2. Fallback cho mẫu template mặc định nếu slug là preset demo
    if (slug.includes('green-student')) {
      return NextResponse.json(GREEN_STUDENT_INVITATION);
    }
    if (slug.includes('hoang-ngoc') || slug === 'sample' || slug.includes('crimson')) {
      return NextResponse.json(SAMPLE_INVITATION);
    }

    return NextResponse.json({ error: 'Không tìm thấy thiệp mời kỷ yếu trong cơ sở dữ liệu.' }, { status: 404 });
  } catch (err: any) {
    console.error(`[API/Slug GET MySQL Error for ${slug}]:`, err);
    return NextResponse.json(
      { error: 'Lỗi truy vấn cơ sở dữ liệu MySQL: ' + err.message },
      { status: 500 }
    );
  }
}

// POST: Tương tác với thiệp mời trên MySQL (RSVP, chia sẻ)
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
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
      return NextResponse.json({ success: true, storageEngine: 'mysql' });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[API/Slug POST MySQL Error for ${slug}]:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
