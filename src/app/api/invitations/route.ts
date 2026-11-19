import { NextResponse } from 'next/server';
import { InvitationData } from '@/types/invitation';
import { isDbConfigured, getAllInvitationsFromDb, saveInvitationToDb } from '@/lib/db';

// GET: Lấy danh sách thiệp mời trực tiếp từ cơ sở dữ liệu PostgreSQL qua Prisma
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || undefined;

  try {
    const dbList = await getAllInvitationsFromDb(email);
    // Trả về dữ liệu thực tế từ database (không trả về mẫu demo để tránh nhầm lẫn)
    return NextResponse.json(dbList || []);
  } catch (err: any) {
    console.error('[API/Invitations GET PostgreSQL Error]:', err.message);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Tạo mới hoặc cập nhật thiệp mời trực tiếp vào PostgreSQL qua Prisma
export async function POST(request: Request) {
  try {
    const newInvitation = await request.json();

    if (!newInvitation || !newInvitation.slug) {
      return NextResponse.json({ error: 'Dữ liệu thiệp mời không hợp lệ.' }, { status: 400 });
    }

    // Bảo vệ database tránh tràn dung lượng (Zero Bloat):
    // Giới hạn độ dài ảnh base64 lớn để tránh phình dung lượng database PostgreSQL free tier
    const sanitizeBase64 = (val?: string | null) => {
      if (!val) return null;
      if (val.startsWith('data:image') && val.length > 700000) {
        console.warn(`[PRISMA] Bỏ qua ảnh base64 quá lớn (${val.length} bytes) để chống tràn database.`);
        return null;
      }
      return val;
    };

    newInvitation.avatarPhoto = sanitizeBase64(newInvitation.avatarPhoto);
    newInvitation.groupPhoto = sanitizeBase64(newInvitation.groupPhoto);
    newInvitation.bgImage = sanitizeBase64(newInvitation.bgImage);

    const success = await saveInvitationToDb(newInvitation);
    if (!success) {
      return NextResponse.json(
        { error: 'Không thể lưu thiệp mời vào cơ sở dữ liệu PostgreSQL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: newInvitation,
      storageEngine: 'prisma-postgres'
    });
  } catch (err: any) {
    console.error('[API/Invitations POST Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
