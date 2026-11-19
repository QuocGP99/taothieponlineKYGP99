import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDbConfigured } from '@/lib/db';
import { LeadStatus } from '@/types/lead';

// GET: Lấy danh sách khách hàng có nhu cầu chụp kỷ yếu từ PostgreSQL
export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json([]);
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200 // Giới hạn 200 bản ghi mới nhất để tối ưu tốc độ và bộ nhớ
    });

    const mapped = leads.map(l => ({
      id: l.id,
      fullName: l.fullName,
      phone: l.phone,
      schoolClass: l.schoolClass,
      studentCount: l.studentCount || undefined,
      region: l.region || 'Đà Nẵng',
      expectedMonth: l.expectedMonth || 'Chưa rõ',
      notes: l.notes || undefined,
      discountCode: l.discountCode || 'GPKY10-XUAN2026',
      status: (l.status as LeadStatus) || 'new',
      createdAt: l.createdAt.toISOString()
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error('[API/Leads GET Error]:', err.message);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Tiếp nhận yêu cầu tư vấn chụp kỷ yếu / nhận mã ưu đãi 10%
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, schoolClass, studentCount, region, expectedMonth, notes } = body;

    if (!fullName || !phone || !schoolClass) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ Họ và tên, Số điện thoại và Trường – lớp.' },
        { status: 400 }
      );
    }

    // Làm sạch và cắt ngắn dữ liệu để bảo vệ database (Zero Bloat)
    const cleanPhone = String(phone).trim().replace(/[^\d+]/g, '').slice(0, 20);
    const cleanFullName = String(fullName).trim().slice(0, 100);
    const cleanSchoolClass = String(schoolClass).trim().slice(0, 150);
    const cleanRegion = String(region || 'Đà Nẵng').trim().slice(0, 50);
    const cleanExpectedMonth = String(expectedMonth || 'Chưa rõ').trim().slice(0, 50);
    const cleanNotes = notes ? String(notes).trim().slice(0, 500) : null;

    const newLead = await prisma.lead.create({
      data: {
        fullName: cleanFullName,
        phone: cleanPhone,
        schoolClass: cleanSchoolClass,
        studentCount: studentCount ? Number(studentCount) : null,
        region: cleanRegion,
        expectedMonth: cleanExpectedMonth,
        notes: cleanNotes,
        discountCode: 'GPKY10-XUAN2026',
        status: 'new'
      }
    });

    return NextResponse.json({
      success: true,
      lead: {
        ...newLead,
        createdAt: newLead.createdAt.toISOString()
      },
      message: 'GP Studio99 đã nhận thông tin và sẽ liên hệ lớp trong 15 phút'
    });
  } catch (err: any) {
    console.error('[API/Leads POST Error]:', err.message);
    return NextResponse.json({ error: err.message || 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}

// PATCH: Cập nhật trạng thái chăm sóc khách hàng (new -> contacted -> closed)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu mã khách hàng hoặc trạng thái' }, { status: 400 });
    }

    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = String(notes).trim().slice(0, 500);
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      lead: {
        ...updated,
        createdAt: updated.createdAt.toISOString()
      }
    });
  } catch (err: any) {
    console.error('[API/Leads PATCH Error]:', err.message);
    return NextResponse.json({ error: err.message || 'Lỗi cập nhật' }, { status: 500 });
  }
}

// DELETE: Xóa lead rác / spam để tránh tràn database
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã khách hàng (id)' }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Đã xóa thông tin thành công' });
  } catch (err: any) {
    console.error('[API/Leads DELETE Error]:', err.message);
    return NextResponse.json({ error: err.message || 'Lỗi xóa khách hàng' }, { status: 500 });
  }
}
