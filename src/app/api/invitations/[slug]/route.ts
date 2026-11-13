import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SAMPLE_INVITATION } from '@/data/templates';
import { InvitationData, RSVP } from '@/types/invitation';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'db.json');

function readDb(): InvitationData[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = [SAMPLE_INVITATION];
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [SAMPLE_INVITATION];
  }
}

function writeDb(data: InvitationData[]): void {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const invitations = readDb();
  const invitation = invitations.find(i => i.slug === params.slug || i.id === params.slug);

  if (!invitation) {
    return NextResponse.json({ error: 'Không tìm thấy thiệp mời' }, { status: 404 });
  }

  // Increment view count
  invitation.views = (invitation.views || 0) + 1;
  writeDb(invitations);

  return NextResponse.json(invitation);
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const invitations = readDb();
    const invitation = invitations.find(i => i.slug === params.slug || i.id === params.slug);

    if (!invitation) {
      return NextResponse.json({ error: 'Không tìm thấy thiệp mời' }, { status: 404 });
    }

    // Action: RSVP or Share
    if (body.action === 'rsvp') {
      const newRsvp: RSVP = {
        id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        invitationId: invitation.id,
        guestName: body.guestName || 'Khách mời',
        status: body.status || 'confirmed',
        phone: body.phone,
        message: body.message,
        companionCount: body.companionCount || 0,
        createdAt: new Date().toISOString()
      };

      if (!invitation.rsvps) invitation.rsvps = [];
      invitation.rsvps.unshift(newRsvp);
      invitation.updatedAt = new Date().toISOString();
      writeDb(invitations);

      return NextResponse.json({ success: true, rsvp: newRsvp });
    }

    if (body.action === 'share') {
      invitation.shares = (invitation.shares || 0) + 1;
      writeDb(invitations);
      return NextResponse.json({ success: true, shares: invitation.shares });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const invitations = readDb();
  const filtered = invitations.filter(i => i.slug !== params.slug && i.id !== params.slug);
  writeDb(filtered);
  return NextResponse.json({ success: true });
}
