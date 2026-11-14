import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { LeadData } from '@/types/lead';

const LEADS_FILE = path.join(process.cwd(), 'src', 'data', 'leads.json');

function readLeads(): LeadData[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
      fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const content = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function writeLeads(data: LeadData[]): void {
  try {
    fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
    fs.writeFileSync(LEADS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing leads:', err);
  }
}

export async function GET() {
  const leads = readLeads();
  // Sắp xếp lead mới nhất lên đầu
  leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(leads);
}

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

    const leads = readLeads();
    const newLead: LeadData = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      schoolClass: schoolClass.trim(),
      studentCount: studentCount ? Number(studentCount) : undefined,
      region: region || 'Đà Nẵng',
      expectedMonth: expectedMonth || 'Chưa rõ',
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
      status: 'new',
      discountCode: 'GPKY10-XUAN2026'
    };

    leads.unshift(newLead);
    writeLeads(leads);

    return NextResponse.json({
      success: true,
      lead: newLead,
      message: 'GP Studio99 đã nhận thông tin và sẽ liên hệ lớp trong 15 phút'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu id hoặc trạng thái' }, { status: 400 });
    }

    const leads = readLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin khách hàng' }, { status: 404 });
    }

    leads[idx].status = status;
    writeLeads(leads);

    return NextResponse.json({ success: true, lead: leads[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi cập nhật' }, { status: 500 });
  }
}
