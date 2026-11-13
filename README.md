# GP STUDIO99 – YEARBOOK INVITATION MAKER
### Nền Tảng Tạo Thiệp Mời Kỷ Yếu Cá Nhân Gửi Bạn Bè & Người Thân
> Tích hợp trực tiếp vào hệ sinh thái website: **[chupanhdanang.com](https://chupanhdanang.com)**  
> Thương hiệu: **Kỷ Yếu Đà Nẵng – GP Studio99 (Thành lập từ năm 2018)**  
> Hotline / Zalo: **0899.236.001**  
> Địa chỉ: **Trần Cao Vân, TP. Đà Nẵng**

---

## 🌟 1. Giới thiệu dự án
**GP Studio99 – Yearbook Invitation Maker** là nền tảng web SaaS hiện đại, chuyên nghiệp, mang đậm cảm xúc thanh xuân học đường. Ứng dụng cho phép từng bạn học sinh, sinh viên tự tay tạo một chiếc thiệp mời kỷ yếu mang dấu ấn riêng để gửi đến **hội bạn thân, bạn cùng trường, người thương và gia đình** ghé qua chụp ảnh kỷ niệm trong ngày lễ tốt nghiệp/kỷ yếu.

### 🎨 Hệ thống màu sắc chủ đạo (Bordeaux Crimson & Wine Red):
- **Màu chính (Primary):** `#890F0D` (Đỏ thẫm Crimson thanh xuân)
- **Màu đậm (Deep Accent):** `#720000` (Đỏ rượu vang Bordeaux quý phái)
- **Màu bổ trợ:** Vàng kim (`#D97706`, `#F59E0B`), nền kem sáng (`#FFF8F8`, `#FDF2F2`), viền mềm mại (`#FEE2E2`).

---

## 🚀 2. Tính năng nổi bật

1. **Thiệp mời cá nhân hóa cho từng học sinh:**
   - Hiển thị tên bạn, biệt danh thân mật, lớp, trường học và niên khóa.
   - Ảnh chân dung cá nhân kết hợp cùng ảnh kỷ yếu lớp.
   - **Khung giờ đón bạn bè & người thân chụp ảnh giao lưu** (Free-shot time: ví dụ `09:30 - 11:30 & 14:30 - 16:30`) giúp bạn bè biết chính xác lúc nào bạn rảnh để ghé qua tặng hoa và chụp hình.
2. **Kho 12 mẫu thiệp độc quyền:**
   - 5 mẫu Thanh xuân: Sân trường, Mùa hạ, Học đường Hàn Quốc, Nhật ký lưu bút, Polaroid Memories.
   - 5 mẫu Hiện đại: Minimalist Editorial, Crimson Velvet Dream, Retro Film 35mm, Vogue Magazine, Concert Night Live.
   - 2 mẫu Trang trọng: Graduation Ceremony, Royal Elegant Gold.
   - **Không làm mất dữ liệu khi đổi mẫu.**
3. **Trải nghiệm trang thiệp dành cho người nhận (`/thiep-moi/[slug]`):**
   - Hiệu ứng mở phong bì sáp niêm phong (**Crimson Wax Seal**) kèm pháo hoa Confetti và cánh hoa phượng bay.
   - Nhạc nền thanh xuân du dương (Web Audio API).
   - Đồng hồ đếm ngược từng giây đến ngày chụp.
   - Tiện ích thêm lịch vào **Google Calendar** và mở vị trí trên **Google Maps**.
   - **Tương tác RSVP thân mật:** Bạn bè xác nhận ghé qua, gửi tặng quà ảo (💐 Bó hoa, 🧸 Gấu cử nhân, 🌻 Hướng dương, 🧋 Trà sữa) kèm lời chúc ngọt ngào vào sổ lưu bút.
4. **Nhập Gmail & gửi email xác nhận thực tế:**
   - Tích hợp chuẩn API Resend tại `/api/send-email` với email HTML chuẩn branding GP Studio99.
5. **Bảng điều khiển quản trị (Admin Dashboard):**
   - Theo dõi số lượng thiệp, lượt xem, lượt chia sẻ và phản hồi RSVP của bạn bè.

---

## 🛠️ 3. Khởi chạy ứng dụng

```bash
cd d:\ThiepOnlineKyYeuGP

# Cài đặt gói phụ thuộc
npm install

# Build ứng dụng
npm run build

# Khởi chạy production server
npm run start
```
Ứng dụng hoạt động tại: **`http://localhost:3000`**

---

## 🌐 4. Các đường link trực tiếp để trải nghiệm

- **Trang chủ:** [http://localhost:3000](http://localhost:3000)
- **Trình tạo thiệp cá nhân:** [http://localhost:3000/builder](http://localhost:3000/builder)
- **Thiệp mời mẫu cá nhân (Bảo Anh 12A1):** [http://localhost:3000/thiep-moi/bao-anh-12a1-phan-chau-trinh](http://localhost:3000/thiep-moi/bao-anh-12a1-phan-chau-trinh)
- **Bảng điều khiển quản trị:** [http://localhost:3000/admin](http://localhost:3000/admin)
