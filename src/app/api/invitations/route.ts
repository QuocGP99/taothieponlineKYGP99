import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SAMPLE_INVITATION } from '@/data/templates';
import { InvitationData } from '@/types/invitation';

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
    console.error('Error reading DB:', err);
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

export async function GET() {
  const invitations = readDb();
  return NextResponse.json(invitations);
}

export async function POST(request: Request) {
  try {
    const newInvitation = await request.json();
    const invitations = readDb();
    
    // Check if exists
    const idx = invitations.findIndex(item => item.id === newInvitation.id || item.slug === newInvitation.slug);
    if (idx >= 0) {
      invitations[idx] = { ...invitations[idx], ...newInvitation, updatedAt: new Date().toISOString() };
    } else {
      invitations.unshift({
        ...newInvitation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    writeDb(invitations);
    return NextResponse.json({ success: true, invitation: newInvitation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
