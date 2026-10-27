# 🏀 HƯỚNG DẪN CÀI ĐẶT MÔI TRƯỜNG & VẬN HÀNH HỆ THỐNG HOOPZONE

Dành cho Giảng viên hướng dẫn, Hội đồng phản biện và Sinh viên ngành Công nghệ Thông tin – Trường Đại học Phương Đông.

---

## 1. Khởi chạy nhanh 1-Click (Khuyên Dùng Nhất)

Dự án đã được tích hợp sẵn các tệp kịch bản thực thi tự động (Batch file) để khắc phục triệt để lỗi **PowerShell Execution Policy** (`cannot be loaded because running scripts is disabled on this system`) và lỗi đường dẫn chứa dấu `&`:

1. **Bước 1 (Nếu máy mới chưa có `node_modules`):**
   - Nhấn đúp chuột vào tệp: **`install.bat`**
   - Kịch bản sẽ tự động gọi `npm.cmd install --legacy-peer-deps` để cài đặt đầy đủ tất cả các gói thư viện tương thích.
2. **Bước 2 (Khởi chạy ứng dụng):**
   - Nhấn đúp chuột vào tệp: **`start.bat`**
   - Hệ thống sẽ tự động khởi động máy chủ Vite tại cổng 3000 và tự động mở trình duyệt web hiển thị trang chủ: `http://localhost:3000`
3. **Bước 3 (Kiểm tra biên dịch):**
   - Nhấn đúp chuột vào tệp: **`build.bat`** để kiểm tra kiểm tra kiểu dữ liệu TypeScript và tối ưu bản đóng gói sản phẩm (0 lỗi).

---

## 2. Hướng dẫn chạy bằng dòng lệnh thủ công (Nếu sử dụng Terminal)

Nếu bạn sử dụng **PowerShell** trên Windows và gặp lỗi bị chặn script:
```powershell
# Chạy lệnh cho phép thực thi script tạm thời trong phiên làm việc hiện tại:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Sử dụng trực tiếp npm.cmd thay vì npm:
npm.cmd install --legacy-peer-deps
npm.cmd run dev
```

Hoặc sử dụng **Command Prompt (cmd.exe)**:
```cmd
npm install --legacy-peer-deps
npm run dev
```

---

## 3. Danh sách tài khoản thử nghiệm & Chuyển đổi vai trò 1-Click

Trên thanh điều hướng (Navbar) góc trên bên phải của website, hệ thống tích hợp sẵn nút bấm **1-Click Role Switcher** cho phép chuyển đổi nhanh chóng giữa 3 vai trò:

| Vai trò (Role) | Nhãn hiển thị | Mô tả quyền hạn & Trải nghiệm |
|---|---|---|
| **Khách hàng** | `🛒 Customer` | Mua hàng, chọn size/màu, áp dụng voucher `HOOPZONE10`, quét VietQR, theo dõi đơn, gửi đánh giá 5 sao kèm nhận xét. |
| **Nhân viên** | `👨‍💼 Staff` | Chấm công ca làm việc (Check-in/Check-out lưu timestamp), quản lý xử lý đơn hàng tại kho. |
| **Quản trị viên** | `👑 Admin` | Mở **Admin Dashboard**: Xem biểu đồ KPI doanh thu, cập nhật tồn kho từng size, tạo mã voucher, duyệt bảng chấm công nhân sự. |

---

## 4. Vị trí tệp mô hình StarUML & Báo cáo đồ án (>50 trang)

Tất cả các tài liệu chuẩn mực đều được đặt trong thư mục `docs/`:

- **Báo cáo đồ án Word hoàn thiện (83 trang, chuẩn ĐH Phương Đông):**
  - Đường dẫn: `docs/BAO_CAO_DO_AN_KY_HOOPZONE_HOAN_THIEN.docx`
  - Định dạng: Chuẩn lề (Trái 3cm, Trên/Dưới/Phải 2cm), phông Times New Roman 13pt, dãn dòng 1.3, chứa **22 bảng biểu chi tiết** và **36 sơ đồ UML & UI độ phân giải cao**.
- **Tệp thiết kế StarUML gốc (.mdj):**
  - Đường dẫn: `docs/HoopZone.mdj`
  - Mở bằng phần mềm **StarUML** (phiên bản 5.0 trở lên) để xem toàn bộ 28 sơ đồ: Use Case, Activity, Sequence, State Machine, Class, Component, Deployment Diagrams.
- **Thư mục ảnh sơ đồ nét cao 300 DPI:**
  - Đường dẫn: `docs/diagrams/`
