import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION } from '@/data/templates';
import { InvitationData, RSVP, GuestWish } from '@/types/invitation';
import {
  isMysqlConfigured,
  getInvitationFromDb,
  incrementViewsInDb,
  incrementSharesInDb,
  addRsvpToDb
} from '@/lib/mysql';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'db.json');

function readDb(): InvitationData[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = [SAMPLE_INVITATION, GREEN_STUDENT_INVITATION];
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [SAMPLE_INVITATION, GREEN_STUDENT_INVITATION];
  }
}

function writeDb(data: InvitationData[]): void {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON DB fallback:', err);
  }
}

// GET: Lấy thông tin chi tiết một thiệp mời theo slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // 1. Thử lấy từ MySQL iNET
  if (isMysqlConfigured()) {
    try {
      const dbItem = await getInvitationFromDb(slug);
      if (dbItem) {
        // Tăng lượt xem trong MySQL
        await incrementViewsInDb(slug);
        dbItem.views = (dbItem.views || 0) + 1;
        return NextResponse.json(dbItem);
      }
    } catch (err) {
      console.warn(`[API/Slug] Lỗi truy vấn MySQL cho slug [${slug}], dùng JSON fallback:`, err);
    }
  }

  // 2. Fallback sang file JSON
  const invitations = readDb();
  let invitation = invitations.find(i => i.slug === slug || i.id === slug);

  // 3. Fallback sang mẫu template mặc định nếu slug là preset demo
  if (!invitation) {
    if (slug.includes('green-student')) {
      invitation = GREEN_STUDENT_INVITATION;
    } else if (slug.includes('hoang-ngoc') || slug === 'sample' || slug.includes('crimson')) {
      invitation = SAMPLE_INVITATION;
    }
  }

  if (!invitation) {
    return NextResponse.json({ error: 'Không tìm thấy thiệp mời kỷ yếu.' }, { status: 404 });
  }

  // Tăng lượt xem JSON
  invitation.views = (invitation.views || 0) + 1;
  writeDb(invitations);

  return NextResponse.json(invitation);
}

// POST: Tương tác với thiệp mời (RSVP, gửi lời chúc, tăng chia sẻ)
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    let savedToMysql = false;

    // 1. Thao tác trên MySQL nếu đã kết nối
    if (isMysqlConfigured()) {
      try {
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
          savedToMysql = true;
          return NextResponse.json({ success: true, rsvp: newRsvp, storageEngine: 'mysql' });
        }

        if (body.action === 'share') {
          await incrementSharesInDb(slug);
          return NextResponse.json({ success: true, storageEngine: 'mysql' });
        }
      } catch (err: any) {
        console.error('[API/Slug POST MySQL Error]:', err.message);
      }
    }

    // 2. Thao tác trên JSON Database fallback
    const invitations = readDb();
    const invitation = invitations.find(i => i.slug === slug || i.id === slug);

    if (!invitation) {
      return NextResponse.json({ error: 'Không tìm thấy thiệp mời' }, { status: 404 });
    }

    if (body.action === 'rsvp') {
      const newRsvp: RSVP = {
        id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        invitationId: invitation.id,
        guestName: body.guestName || 'Khách mời',
        status: body.status || 'confirmed',
        relation: body.relation || 'Bạn thân',
        phone: body.phone || '',
        message: body.message || '',
        virtualGift: body.virtualGift || 'bouquet',
        companionCount: Number(body.companionCount || 0),
        createdAt: new Date().toISOString()
      };

      invitation.rsvps = [newRsvp, ...(invitation.rsvps || [])];
      writeDb(invitations);
      return NextResponse.json({ success: true, rsvp: newRsvp, storageEngine: 'json_fallback' });
    }

    if (body.action === 'share') {
      invitation.shares = (invitation.shares || 0) + 1;
      writeDb(invitations);
      return NextResponse.json({ success: true, storageEngine: 'json_fallback' });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
