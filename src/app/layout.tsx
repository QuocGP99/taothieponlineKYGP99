import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GP STUDIO99 – YEARBOOK INVITATION MAKER | Tạo Thiệp Mời Kỷ Yếu Online',
  description: 'Tự tay thiết kế thiệp mời chụp ảnh kỷ yếu phong cách thanh xuân học đường độc quyền từ GP Studio99 Đà Nẵng (chupanhdanang.com). Chọn mẫu, thêm ảnh, gửi link RSVP cho cả lớp và thầy cô.',
  keywords: 'thiệp kỷ yếu online, tạo thiệp mời kỷ yếu, kỷ yếu đà nẵng, chupanhdanang.com, gp studio99, thiep moi chup anh ky yeu',
  openGraph: {
    title: 'GP STUDIO99 – YEARBOOK INVITATION MAKER',
    description: 'Biến buổi chụp kỷ yếu thành một ngày đáng nhớ cùng thiệp mời kỷ yếu online!',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://taothiepkyyeugp99.io.vn',
    siteName: 'GP Studio99 YearBook',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Thiệp mời kỷ yếu GP Studio99',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 selection:bg-purple-200 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}
