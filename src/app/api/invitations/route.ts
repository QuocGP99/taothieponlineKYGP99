import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION } from '@/data/templates';
import { InvitationData } from '@/types/invitation';
import { isMysqlConfigured, getAllInvitationsFromDb, saveInvitationToDb } from '@/lib/mysql';

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
    console.error('Error reading JSON DB fallback:', err);
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

// GET: Lấy danh sách thiệp mời
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || undefined;

  // 1. Thử truy vấn từ MySQL iNET nếu đã cấu hình
  if (isMysqlConfigured()) {
    try {
      const dbList = await getAllInvitationsFromDb(email);
      if (dbList && dbList.length > 0) {
        return NextResponse.json(dbList);
      }
    } catch (err) {
      console.warn('[API/Invitations] Không thể lấy từ MySQL, chuyển sang JSON fallback:', err);
    }
  }

  // 2. Fallback sang file JSON
  let invitations = readDb();
  if (email) {
    invitations = invitations.filter(i => i.creatorEmail?.toLowerCase() === email.toLowerCase());
  }

  return NextResponse.json(invitations);
}

// POST: Tạo mới hoặc cập nhật thiệp mời
export async function POST(request: Request) {
  try {
    const newInvitation = await request.json();
    let savedToMysql = false;

    // 1. Lưu vào MySQL iNET nếu đã cấu hình
    if (isMysqlConfigured()) {
      try {
        savedToMysql = await saveInvitationToDb(newInvitation);
        console.log(`[API/Invitations] Đã lưu thiệp [${newInvitation.slug}] vào MySQL iNET.`);
      } catch (err: any) {
        console.error('[API/Invitations] Lỗi lưu MySQL:', err.message);
      }
    }

    // 2. Đồng thời lưu vào file JSON dự phòng
    const invitations = readDb();
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

    return NextResponse.json({
      success: true,
      invitation: newInvitation,
      storageEngine: savedToMysql ? 'mysql' : 'json_fallback'
    });
  } catch (err: any) {
    console.error('[API/Invitations POST Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
