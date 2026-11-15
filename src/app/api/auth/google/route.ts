import { NextRequest, NextResponse } from 'next/server';
import { isMysqlConfigured, upsertUserInDb } from '@/lib/mysql';

export async function POST(req: NextRequest) {
  try {
    const user = await req.json();

    if (!user || !user.email) {
      return NextResponse.json({ success: false, message: 'Thiếu email người dùng' }, { status: 400 });
    }

    if (isMysqlConfigured()) {
      try {
        await upsertUserInDb({
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          provider: user.provider || 'google',
          token: user.token
        });
        console.log(`[AUTH/Google] Đã lưu thông tin tài khoản Google ${user.email} vào MySQL iNET.`);
      } catch (err: any) {
        console.warn('[AUTH/Google] Lỗi lưu user MySQL:', err.message);
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error('Google Auth Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
