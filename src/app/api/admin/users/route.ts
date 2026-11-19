import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDbConfigured } from '@/lib/db';

// GET: Lấy danh sách tài khoản người dùng thực tế từ PostgreSQL
export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      orderBy: { lastLogin: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        provider: true,
        createdAt: true,
        lastLogin: true
      },
      take: 200
    });

    const expiredOtpCount = await prisma.otpCode.count({
      where: {
        OR: [
          { isUsed: true },
          { expiresAt: { lt: new Date() } }
        ]
      }
    });

    return NextResponse.json({
      users: users.map(u => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        lastLogin: u.lastLogin.toISOString()
      })),
      expiredOtpCount
    });
  } catch (err: any) {
    console.error('[API/Admin/Users GET Error]:', err.message);
    return NextResponse.json({ users: [], expiredOtpCount: 0 }, { status: 500 });
  }
}

// DELETE: Xóa tài khoản người dùng test / spam
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Thiếu email người dùng' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { email: email.trim().toLowerCase() }
    });

    return NextResponse.json({ success: true, message: 'Đã xóa tài khoản thành công' });
  } catch (err: any) {
    console.error('[API/Admin/Users DELETE Error]:', err.message);
    return NextResponse.json({ error: err.message || 'Lỗi xóa tài khoản' }, { status: 500 });
  }
}

// POST: Tác vụ dọn dẹp database (xóa OTP hết hạn để tránh tràn database)
export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'purge-otps') {
      const result = await prisma.otpCode.deleteMany({
        where: {
          OR: [
            { isUsed: true },
            { expiresAt: { lt: new Date() } }
          ]
        }
      });
      return NextResponse.json({
        success: true,
        message: `Đã dọn dẹp thành công ${result.count} mã OTP rác để giải phóng dung lượng database.`
      });
    }

    return NextResponse.json({ error: 'Hành động không hỗ trợ' }, { status: 400 });
  } catch (err: any) {
    console.error('[API/Admin/Users POST Error]:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
