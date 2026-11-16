import { NextResponse } from 'next/server';
import { SAMPLE_INVITATION, GREEN_STUDENT_INVITATION } from '@/data/templates';
import { InvitationData } from '@/types/invitation';
import { isMysqlConfigured, getAllInvitationsFromDb, saveInvitationToDb } from '@/lib/mysql';

// GET: Lấy danh sách thiệp mời trực tiếp từ cơ sở dữ liệu MySQL
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || undefined;

  try {
    const dbList = await getAllInvitationsFromDb(email);
    // Nếu trong MySQL chưa có thiệp nào, trả về 2 mẫu demo mặc định để giao diện không bị trống
    if (!dbList || dbList.length === 0) {
      const defaults = email ? [] : [SAMPLE_INVITATION, GREEN_STUDENT_INVITATION];
      return NextResponse.json(defaults);
    }
    return NextResponse.json(dbList);
  } catch (err: any) {
    console.error('[API/Invitations GET MySQL Error]:', err);
    return NextResponse.json(
      { error: 'Lỗi truy vấn cơ sở dữ liệu MySQL: ' + err.message },
      { status: 500 }
    );
  }
}

// POST: Tạo mới hoặc cập nhật thiệp mời trực tiếp vào MySQL
export async function POST(request: Request) {
  try {
    const newInvitation = await request.json();

    if (!newInvitation || !newInvitation.slug) {
      return NextResponse.json({ error: 'Dữ liệu thiệp mời không hợp lệ.' }, { status: 400 });
    }

    const success = await saveInvitationToDb(newInvitation);
    if (!success) {
      return NextResponse.json(
        { error: 'Không thể lưu thiệp mời vào cơ sở dữ liệu MySQL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: newInvitation,
      storageEngine: 'mysql'
    });
  } catch (err: any) {
    console.error('[API/Invitations POST Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
