# Quản lý Thư viện (Library Management System)

Đây là dự án hệ thống quản lý thư viện, được chia thành 2 phần chính: **Backend** và **Frontend**.

## 🛠 Công nghệ sử dụng

### Backend
- **Ngôn ngữ**: Java 21
- **Framework**: Spring Boot (WebMVC, Data JPA, OAuth2 Resource Server)
- **Database**: Microsoft SQL Server
- **Công cụ hỗ trợ**: Lombok, MapStruct, Maven, Dotenv

### Frontend
- **Thư viện chính**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State/Routing/Utils**: React Router DOM, Axios, React Hook Form, Dayjs, React Toastify, Lucide React

## 📂 Cấu trúc dự án
- `/backend`: Mã nguồn Backend API viết bằng Spring Boot.
- `/frontend`: Mã nguồn giao diện người dùng viết bằng React và Vite.

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Database (SQL Server)
- Đảm bảo máy tính của bạn đã cài đặt SQL Server.
- Khôi phục (restore) cơ sở dữ liệu hoặc chạy script SQL khởi tạo.
- Đảm bảo cấu hình thông tin đăng nhập (username, password, db name) chính xác.

### 2. Backend (Spring Boot)
1. Mở terminal, di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cấu hình file biến môi trường: Tạo file `.env` tại thư mục `backend` và điền các thông tin sau (thay đổi giá trị sao cho khớp với database cục bộ hoặc cloud của bạn):
   ```env
   DB_URL=jdbc:sqlserver://<your-db-server>:1433;databaseName=<your-db-name>;encrypt=true;trustServerCertificate=false;
   DB_USERNAME=<your-db-username>
   DB_PASSWORD=<your-db-password>
   JWT_SIGNER_KEY=<chuoi-ky-tu-bi-mat-random>
   JWT_VALID_DURATION=1200
   ```
3. Chạy dự án:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Trường hợp dùng Windows, bạn có thể chạy `mvnw.cmd spring-boot:run`)*

### 3. Frontend (React + Vite)
1. Mở terminal mới, di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cấu hình biến môi trường: Tạo file `.env.development` (hoặc `.env`) tại thư mục `frontend` với nội dung như sau:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   VITE_READER_PREVIEW=true
   ```
3. Cài đặt các thư viện (packages):
   ```bash
   npm install
   ```
4. Chạy giao diện ở chế độ development:
   ```bash
   npm run dev
   ```
   *Ứng dụng web thường sẽ khởi chạy tại: `http://localhost:5173`*

---
*Lưu ý: Dự án này là báo cáo bài tập lớn, có thể tham khảo thêm các tài liệu báo cáo và slide liên quan để hiểu rõ về thiết kế hệ thống và CSDL.*
