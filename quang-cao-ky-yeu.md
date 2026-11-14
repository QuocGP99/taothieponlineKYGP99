# Kế Hoạch Triển Khai: Hệ Thống Quảng Cáo Kỷ Yếu & Form Nhận Ưu Đãi 10% GP Studio99

> **Mã kế hoạch:** `quang-cao-ky-yeu.md`  
> **Chế độ:** PLANNING ONLY (Không viết code thực thi trong phase này)  
> **Dự án:** Thiệp Online Kỷ Yếu GP Studio99 (`ThiepOnlineKyYeuGP`)  
> **Loại dự án:** WEB (Next.js 14 App Router, TypeScript, Tailwind CSS)  
> **Đơn vị:** Kỷ yếu GP Studio99 (Hotline: 0899236001)  

---

## 1. Tổng Quan & Mục Tiêu (Overview & Objectives)

### 1.1 Bối Cảnh
Trang web tạo thiệp online kỷ yếu cá nhân dành cho học sinh, sinh viên tại Đà Nẵng và miền Trung. Để khai thác tối đa lượng truy cập từ các bạn trẻ tạo thiệp và bạn bè xem thiệp, hệ thống cần tích hợp bộ công cụ quảng cáo dịch vụ chụp ảnh kỷ yếu trọn gói của **Kỷ yếu GP Studio99** (đặt lịch theo lớp), thu thập khách hàng tiềm năng (leads) thông qua form nhận ưu đãi giảm 10%.

### 1.2 Quyết Định Thiết Kế Đã Thống Nhất (User Decisions)
1. **Vị trí hiển thị:** Khối quảng cáo & form ưu đãi được đặt **ngay trước phần "QUY TRÌNH ĐƠN GIẢN"** (`#guide`) trên Trang Chủ (`src/app/page.tsx`), đồng thời tích hợp linh hoạt vào chân trang thiệp mời cá nhân (`src/components/InvitationCard.tsx`).
2. **Thông báo sau khi gửi form:** *"GP Studio99 đã nhận thông tin và sẽ liên hệ lớp trong 15 phút"* (kèm nút kết nối nhanh qua Zalo `0899236001`).
3. **Phương án thực hiện:** **Phương án A (Full Marketing Suite)** gồm:
   - Thanh thông báo nổi bật đầu trang (Promo Announcement Bar).
   - Card quảng cáo dịch vụ kỷ yếu GP Studio99 (Marketing Showcase Hero Card) theo đúng bố cục ảnh mẫu 2.
   - Form đăng ký nhận mã ưu đãi giảm 10% (Lead Capture Form) theo đúng mẫu ảnh 1.
   - API lưu trữ & Tab quản lý khách đăng ký tư vấn trong trang Quản trị (`/taothiep/admin`).

---

## 2. Tiêu Chí Thành Công (Success Criteria)

- [ ] **Giao diện chuẩn nhận diện:** Tông màu chủ đạo Đỏ đô Burgundy `#890F0D`, Đỏ vang đậm `#720000`, Vàng kim `#D97706`, nền trắng/be hiện đại, kính mờ (glassmorphism), responsive mượt mà 100% trên cả Mobile và Desktop.
- [ ] **Thông tin chính xác 100%:**
  - Tên thương hiệu: **Kỷ yếu GP Studio99**
  - Hotline / Zalo: `0899236001` (link `tel:0899236001` và `https://zalo.me/0899236001`)
  - Bảng giá: `https://chupanhdanang.com/bang-gia-ky-yeu/`
  - Concept & Trang phục: `https://chupanhdanang.com/thue-trang-phuc-ky-yeu-da-nang/`
  - Sản phẩm ảnh đẹp: `https://chupanhdanang.com/sanphamkyyeudanang/`
- [ ] **Trải nghiệm mượt mà:** Click `[🎁 Giảm 10%]` trên thanh thông báo hoặc Showcase Card tự động cuộn êm (smooth scroll) đến Form ưu đãi.
- [ ] **Xử lý Lead chuẩn xác:** Gửi form thành công hiển thị ngay thông báo cam kết gọi lại trong 15 phút, đồng thời ghi nhận vào danh sách quản lý để admin liên hệ chốt hợp đồng.
- [ ] **Chất lượng mã nguồn:** Build Next.js (`npm run build`) không lỗi, Type-safe TypeScript 100%, không rò rỉ token/secret.

---

## 3. Kiến Trúc & Cấu Trúc File Dự Kiến (File Structure)

```
d:\ThiepOnlineKyYeuGP\
├── src\
│   ├── components\
│   │   ├── PromoBannerBar.tsx          # [MỚI] Thanh thông báo mỏng ở đầu trang
│   │   ├── MarketingShowcaseCard.tsx   # [MỚI] Khối giới thiệu Kỷ yếu GP Studio99 (ảnh mẫu 2)
│   │   ├── DiscountLeadForm.tsx        # [MỚI] Form đăng ký nhận ưu đãi 10% (ảnh mẫu 1)
│   │   ├── Navbar.tsx                  # [CẬP NHẬT] Gắn PromoBannerBar hoặc đồng bộ layout
│   │   ├── InvitationCard.tsx          # [CẬP NHẬT] Tích hợp khối quảng cáo vào thiệp cá nhân
│   ├── app\
│   │   ├── page.tsx                    # [CẬP NHẬT] Chèn khối quảng cáo trước "QUY TRÌNH ĐƠN GIẢN"
│   │   ├── api\
│   │   │   └── leads\
│   │   │       └── route.ts            # [MỚI] API tiếp nhận & lấy danh sách khách hàng tiềm năng
│   │   ├── taothiep\
│   │   │   └── admin\
│   │   │       └── page.tsx            # [CẬP NHẬT] Bổ sung Tab "Khách Đăng Ký Tư Vấn (10%)"
│   ├── data\
│   │   └── leads.json                  # [MỚI] File dữ liệu lưu trữ các yêu cầu tư vấn
│   └── types\
│       └── lead.ts                     # [MỚI] Định nghĩa TypeScript interface cho Lead
```

---

## 4. Phân Rã Công Việc Chi Tiết (Task Breakdown)

### Nhiệm Vụ 1: Định Nghĩa Kiểu Dữ Liệu & API Tiếp Nhận Khách Hàng (Backend & Types)
- **ID:** `TASK-01`
- **Người phụ trách:** `backend-specialist`
- **Kỹ năng áp dụng:** `@clean-code` + `@api-patterns`
- **Mức độ ưu tiên:** P0 (Nền tảng dữ liệu)
- **Đầu vào (INPUT):** Yêu cầu lưu trữ các trường: `fullName`, `phone`, `schoolClass`, `studentCount`, `region`, `expectedMonth`, `notes`, `createdAt`, `status` ("Mới" | "Đã liên hệ" | "Đã chốt").
- **Đầu ra (OUTPUT):**
  - File `src/types/lead.ts`: Interface `LeadData`.
  - File `src/data/leads.json`: Dữ liệu khởi tạo mẫu.
  - File `src/app/api/leads/route.ts`: Handler POST (validate và lưu lead) & GET (lấy danh sách lead cho admin).
- **Kiểm tra (VERIFY):** Gọi API POST lưu thành công lead mới, trả về HTTP status 200/201 kèm thông điệp xác nhận.

---

### Nhiệm Vụ 2: Xây Dựng Component Card Showcase Kỷ Yếu GP Studio99
- **ID:** `TASK-02`
- **Người phụ trách:** `frontend-specialist`
- **Kỹ năng áp dụng:** `@frontend-design` + `@ui-ux-pro-max`
- **Mức độ ưu tiên:** P1 (Giao diện Showcase)
- **Đầu vào (INPUT):** Giao diện chuẩn từ `media_1794614370362_12006f03.jpg`.
- **Đầu ra (OUTPUT):** File `src/components/MarketingShowcaseCard.tsx`:
  - Thẻ nền gradient rượu vang đậm `#540000` đến `#2B0504`, bo góc 3xl, viền ánh đỏ kim.
  - Badge `KỶ YẾU GP STUDIO99`.
  - Tiêu đề: *"Chụp ảnh kỷ yếu có tâm cho cả lớp bạn"*.
  - Đoạn phụ đề truyền cảm hứng thanh xuân.
  - 3 dòng cam kết chất lượng với icon tích xanh/vàng.
  - 4 nút CTA chuẩn link: `Xem báo giá`, `Giảm 10%`, `Xem concept`, `Xem sản phẩm`.
  - 2 nút liên hệ trực tiếp: Hotline `0899236001` và Chat Zalo.
  - Cụm 3 ảnh collage thanh xuân của học sinh Đà Nẵng với hiệu ứng hover tinh tế.
- **Kiểm tra (VERIFY):** Hiển thị chuẩn xác, không vỡ layout khi co kéo màn hình điện thoại (360px - 430px) và máy tính (1280px+).

---

### Nhiệm Vụ 3: Xây Dựng Component Form Nhận Ưu Đãi Giảm 10% (Lead Capture)
- **ID:** `TASK-03`
- **Người phụ trách:** `frontend-specialist`
- **Kỹ năng áp dụng:** `@frontend-design` + `@ui-ux-pro-max` + `@clean-code`
- **Mức độ ưu tiên:** P1 (Giao diện Form)
- **Đầu vào (INPUT):** Giao diện chuẩn từ `media_1794614352370_7af622ce.jpg`, logic gửi thông tin và thông báo hoàn tất.
- **Đầu ra (OUTPUT):** File `src/components/DiscountLeadForm.tsx`:
  - Khối bên trái: Huy hiệu `-10%`, tiêu đề *"Nhận ưu đãi giảm 10% gói chụp kỷ yếu GP Studio99"*, cam kết miễn phí tư vấn, hotline hỗ trợ nhanh.
  - Khối bên phải: Form nhập dữ liệu gồm Họ tên, Số điện thoại/Zalo, Trường - lớp, Sĩ số, Khu vực (Đà Nẵng, Quảng Nam, Huế, Quảng Ngãi, Khác), Dự kiến chụp (Tháng 3, 4, 5, 11, 12, Chưa rõ), Ghi chú concept.
  - Trạng thái hoàn thành: Khi gửi thành công, hiển thị hộp thông báo trang trọng:
    > **"GP Studio99 đã nhận thông tin và sẽ liên hệ lớp trong 15 phút!"**  
    > Kèm nút hỗ trợ gọi gấp `0899236001` hoặc mở Zalo trao đổi trực tiếp.
- **Kiểm tra (VERIFY):** Validate trường bắt buộc (Họ tên, SĐT, Trường lớp), submit form gửi request đến `/api/leads` và chuyển sang trạng thái thông báo thành công tức thì.

---

### Nhiệm Vụ 4: Xây Dựng Thanh Promo Bar & Tích Hợp Vào Trang Chủ (Vị Trí Trước Quy Trình Đơn Giản)
- **ID:** `TASK-04`
- **Người phụ trách:** `frontend-specialist`
- **Kỹ năng áp dụng:** `@ui-ux-pro-max` + `@clean-code`
- **Mức độ ưu tiên:** P1 (Tích hợp Layout Trang Chủ)
- **Đầu vào (INPUT):** File `src/app/page.tsx` và `src/components/PromoBannerBar.tsx`.
- **Đầu ra (OUTPUT):**
  - Tạo `src/components/PromoBannerBar.tsx`: Thanh thông báo mỏng ở đầu trang có nút tắt/bật, nút `[Xem báo giá]` và `[🎁 Nhận ưu đãi 10%]`.
  - Sửa `src/app/page.tsx`:
    - Đặt khối `<MarketingShowcaseCard />` và `<DiscountLeadForm />` **ngay trước Section 2 "QUY TRÌNH ĐƠN GIẢN"** (`#guide`).
    - Nút `[🎁 Nhận ưu đãi 10%]` khi click sẽ tự động cuộn êm xuống vị trí form đăng ký.
- **Kiểm tra (VERIFY):** Mở trang chủ `http://localhost:3000`, kiểm tra vị trí khối quảng cáo xuất hiện ngay trước tiêu đề "QUY TRÌNH ĐƠN GIẢN".

---

### Nhiệm Vụ 5: Tích Hợp Khối Giới Thiệu Dịch Vụ Vào Thiệp Mời Cá Nhân
- **ID:** `TASK-05`
- **Người phụ trách:** `frontend-specialist`
- **Kỹ năng áp dụng:** `@frontend-design` + `@ui-ux-pro-max`
- **Mức độ ưu tiên:** P2 (Tối ưu Trải Nghiệm Thiệp Mời)
- **Đầu vào (INPUT):** File `src/components/InvitationCard.tsx` và `src/app/thiep-moi/[slug]/page.tsx`.
- **Đầu ra (OUTPUT):**
  - Chèn khối giới thiệu dịch vụ kỷ yếu GP Studio99 tinh gọn ở chân trang thiệp mời cá nhân (ngay trên phần chia sẻ / footer bản quyền GP Studio99).
  - Giúp bạn bè và tập thể lớp khi vào chúc mừng đều có thể thấy dịch vụ chụp ảnh kỷ yếu của GP Studio99 và liên hệ nhận ưu đãi.
- **Kiểm tra (VERIFY):** Xem thiệp thực tế `/thiep-moi/hoang-ngoc-dai-hoc-dong-a-2027`, khối quảng cáo hiển thị liền mạch, thẩm mỹ, không che khuất nội dung lời chúc hay thời gian chụp.

---

### Nhiệm Vụ 6: Bổ Sung Tab Quản Lý Khách Nhận Ưu Đãi Trên Trang Admin (`/taothiep/admin`)
- **ID:** `TASK-06`
- **Người phụ trách:** `frontend-specialist` + `backend-specialist`
- **Kỹ năng áp dụng:** `@clean-code` + `@ui-styling`
- **Mức độ ưu tiên:** P2 (Công Cụ Quản Trị)
- **Đầu vào (INPUT):** File `src/app/taothiep/admin/page.tsx`.
- **Đầu ra (OUTPUT):**
  - Thêm Tab thứ 3 trong Admin: **"Khách Nhận Ưu Đãi 10% (Leads)"**.
  - Bảng danh sách hiển thị: Thời gian gửi, Họ tên, Số điện thoại/Zalo, Trường - Lớp, Sĩ số, Khu vực, Thời gian dự kiến, Ghi chú, Nút gọi nhanh (`tel:`) và Nút mở Zalo trực tiếp.
  - Chức năng đổi trạng thái: *Mới* ➔ *Đã gọi tư vấn* ➔ *Đã chốt hợp đồng*.
- **Kiểm tra (VERIFY):** Đăng nhập `/taothiep/admin`, chuyển qua tab Leads thấy danh sách hiển thị đầy đủ, cập nhật trạng thái mượt mà.

---

## 5. Giai Đoạn Kiểm Thử & Nghiệm Thu (Phase X: Verification)

- [ ] **Kiểm tra cú pháp & Type-check:** Chạy `npx tsc --noEmit` không có lỗi typing.
- [ ] **Kiểm tra biên dịch sản phẩm (Build Verification):** Chạy `npm run build` xuất mã trạng thái code `0`.
- [ ] **Kiểm tra liên kết ngoại vi:**
  - Bảng giá mở đúng `https://chupanhdanang.com/bang-gia-ky-yeu/`
  - Concept mở đúng `https://chupanhdanang.com/thue-trang-phuc-ky-yeu-da-nang/`
  - Sản phẩm mở đúng `https://chupanhdanang.com/sanphamkyyeudanang/`
  - Hotline gọi đúng `0899236001`
  - Zalo mở đúng `https://zalo.me/0899236001`
- [ ] **Kiểm tra luồng điền form:**
  - Điền form thử nghiệm trên giao diện điện thoại và máy tính.
  - Hiển thị thông báo: *"GP Studio99 đã nhận thông tin và sẽ liên hệ lớp trong 15 phút"*.
  - Kiểm tra dữ liệu được lưu vào hệ thống và hiển thị ngay tại trang `/taothiep/admin`.
- [ ] **Đồng bộ mã nguồn:** Thực hiện `git commit` và `git push` lên GitHub `https://github.com/QuocGP99/taothieponlineKYGP99`.
