# HƯỚNG DẪN TRIỂN KHAI THIỆP MỜI KỶ YẾU GP STUDIO99 LÊN HOSTING INET (CPANEL)

Tài liệu này hướng dẫn chi tiết từng bước đưa mã nguồn dự án **Thiệp Mời Kỷ Yếu Online – GP Studio99** lên dịch vụ Hosting tại **iNET** sử dụng **Node.js App** và **MySQL**.

---

## MỤC LỤC
1. [Chuẩn bị cơ sở dữ liệu MySQL trên iNET cPanel](#1-chuẩn-bị-cơ-sở-dữ-liệu-mysql-trên-inet-cpanel)
2. [Cài đặt ứng dụng Node.js trên cPanel](#2-cài-đặt-ứng-dụng-nodejs-trên-cpanel)
3. [Tải mã nguồn (.zip) và giải nén](#3-tải-mã-nguồn-zip-và-giải-nén)
4. [Cấu hình biến môi trường (.env / Environment Variables)](#4-cấu-hình-biến-môi-trường)
5. [Cài đặt thư viện (npm install) và khởi động ứng dụng](#5-cài-đặt-thư-viện-và-khởi-động)
6. [Cấu hình gửi email OTP qua Gmail / iNET Webmail](#6-cấu-hình-gửi-email-otp)
7. [Kiểm tra hoạt động thực tế](#7-kiểm-tra-hoạt-động-thực-tế)

---

## 1. Chuẩn bị cơ sở dữ liệu MySQL trên iNET cPanel

### Bước 1.1: Tạo Database & User MySQL
1. Đăng nhập vào **cPanel** quản trị hosting tại iNET.
2. Tìm đến mục **Databases** -> chọn **MySQL® Database Wizard** (hoặc **MySQL® Databases**).
3. **New Database**: Đặt tên cơ sở dữ liệu (ví dụ: `gpstud_thieponline`). Nhấn *Next Step*.
4. **Create Database Users**:
   - Username: ví dụ `gpstud_dbuser`
   - Password: Tạo mật khẩu mạnh (lưu lại mật khẩu này).
5. **Add User to Database**:
   - Tích chọn **ALL PRIVILEGES** (Tất cả các quyền).
   - Nhấn *Make Changes*.

### Bước 1.2: Nhập cấu trúc bảng từ `schema.sql`
1. Quay lại trang chủ cPanel, tìm mục **Databases** -> mở **phpMyAdmin**.
2. Chọn Database vừa tạo ở cột bên trái (ví dụ: `gpstud_thieponline`).
3. Nhấp vào tab **Import** (Nhập) ở thanh menu trên cùng.
4. Chọn tệp tin `database/schema.sql` trong thư mục dự án và nhấn **Go** (Thực hiện).
5. Hệ thống sẽ tự động tạo đủ 5 bảng:
   - `users`: Tài khoản khách hàng & quản trị viên.
   - `invitations`: Lưu trữ toàn bộ thiệp mời kỷ yếu trực tuyến.
   - `rsvps`: Danh sách khách mời xác nhận tham gia.
   - `wishes`: Lời chúc & sổ lưu bút từ bạn bè.
   - `otp_codes`: Quản lý mã OTP 6 số gửi qua email.
   - Đồng thời tự động nạp sẵn dữ liệu thiệp mẫu `green-student` và `modern-crimson-spotlight`.

---

## 2. Cài đặt ứng dụng Node.js trên cPanel

1. Tại cPanel, tìm mục **Software** -> chọn **Setup Node.js App**.
2. Nhấn nút **Create Application**:
   - **Node.js version**: Chọn phiên bản **18.x** hoặc **20.x** (khuyến nghị `20.x`).
   - **Application mode**: Chọn `Production`.
   - **Application root**: Nhập thư mục lưu mã nguồn (ví dụ: `thiep-online` hoặc thư mục domain của bạn).
   - **Application URL**: Chọn tên miền / subdomain chạy web (ví dụ: `thieponline.chupanhdanang.com` hoặc `chupanhdanang.com/thieponline`).
   - **Application startup file**: Nhập chính xác: `server.js`
3. Nhấn **Create** để hệ thống tạo môi trường Node.js.

---

## 3. Tải mã nguồn (.zip) và giải nén

File nén `thiep-online-inet-deploy.zip` đã được đóng gói sẵn toàn bộ bản build tối ưu:
1. Mở **File Manager** trên cPanel.
2. Truy cập vào thư mục bạn đã đặt ở mục *Application root* (ví dụ: `/thiep-online`).
3. Nhấn nút **Upload** và tải tệp tin `thiep-online-inet-deploy.zip` lên.
4. Nhấp chuột phải vào file `.zip` vừa upload -> chọn **Extract** để giải nén toàn bộ tập tin ra thư mục hiện tại.
5. Kiểm tra đảm bảo các thư mục và file sau đã có mặt:
   - `.next/`
   - `public/`
   - `database/`
   - `src/`
   - `package.json`
   - `server.js`
   - `next.config.js`
   - `.env` (hoặc tạo từ `.env.example`)

---

## 4. Cấu hình biến môi trường

Tại trang quản trị **Setup Node.js App** trên cPanel, cuộn xuống phần **Environment variables** và nhấn **Add Variable** cho từng mục (hoặc tạo file `.env` trực tiếp trong thư mục gốc):

| Tên biến (Key) | Giá trị mẫu | Giải thích |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Chế độ chạy tối ưu hóa |
| `NEXT_PUBLIC_APP_URL` | `https://chupanhdanang.com` | Tên miền chính thức của web |
| `DB_HOST` | `localhost` | Máy chủ MySQL trên iNET cPanel |
| `DB_PORT` | `3306` | Cổng kết nối MySQL mặc định |
| `DB_NAME` | `gpstud_thieponline` | Tên Database đã tạo ở Bước 1 |
| `DB_USER` | `gpstud_dbuser` | Tên User MySQL đã tạo |
| `DB_PASSWORD` | `MatKhauCuaBan123@` | Mật khẩu Database MySQL |
| `GMAIL_USER` | `hotro.gpstudio99@gmail.com` | Email gửi mã OTP |
| `GMAIL_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` | Mật khẩu ứng dụng Gmail (16 ký tự) |

*(Nếu sử dụng Webmail theo tên miền của iNET, xem hướng dẫn mục 6 bên dưới).*

---

## 5. Cài đặt thư viện và khởi động

1. Tại giao diện **Setup Node.js App**:
   - Nhấn nút **Run NPM Install** để cPanel tự động tải các gói phụ thuộc (Next.js, mysql2, nodemailer,...).
   - Nếu iNET hỗ trợ terminal SSH, bạn có thể chạy:
     ```bash
     npm install --omit=dev
     ```
2. Nhấn nút **Restart** (Khởi động lại) ứng dụng Node.js.
3. Nhấp vào đường link **Open** bên cạnh *Application URL* để kiểm tra trang web.

---

## 6. Cấu hình gửi email OTP

Hệ thống hỗ trợ 2 hình thức gửi mã OTP đăng nhập thật:

### Cách 1: Sử dụng Gmail cá nhân / công ty (Khuyến nghị - Ổn định nhất)
1. Đăng nhập tài khoản Google của bạn -> Vào **Bảo mật** (Security) -> Bật **Xác minh 2 bước** (2-Step Verification).
2. Tìm mục **Mật khẩu ứng dụng** (App Passwords) -> Tạo tên "Thiep Online GP Studio" -> Nhận chuỗi 16 ký tự.
3. Điền vào biến môi trường:
   - `GMAIL_USER=emailcuaban@gmail.com`
   - `GMAIL_APP_PASSWORD=chuỗi-16-ký-tự-ở-trên`

### Cách 2: Sử dụng Webmail iNET theo tên miền
Nếu bạn có tài khoản email doanh nghiệp trên iNET (ví dụ: `lienhe@chupanhdanang.com`):
- `SMTP_HOST=mail.chupanhdanang.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=lienhe@chupanhdanang.com`
- `SMTP_PASSWORD=mat_khau_email`

---

## 7. Kiểm tra hoạt động thực tế

Sau khi khởi động thành công:
1. **Kiểm tra link thiệp mời trực tiếp:**
   - Truy cập: `https://tenmien-cua-ban.com/invitation/green-student` hoặc `https://tenmien-cua-ban.com/thiep-moi/green-student`
   - Kiểm tra xem thiệp có hiển thị chuẩn giao diện thực tế (Polaroid + hoa phượng + lời mời) và đếm lượt xem (views) tự động tăng trong MySQL không.
2. **Kiểm tra đăng nhập gửi mã OTP:**
   - Bấm "Chỉnh sửa mẫu này" -> Nhập email thật -> Bấm nhận mã.
   - Kiểm tra hòm thư nhận mã OTP 6 số và bảng `otp_codes` trong MySQL.
3. **Kiểm tra tạo link gửi bạn bè:**
   - Vào chỉnh sửa và nhấn **Xuất bản & Chia sẻ link**, copy link gửi cho bạn bè xác nhận tham dự (RSVP). Khách xác nhận sẽ được ghi ngay vào bảng `rsvps` trong MySQL.
