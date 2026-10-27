import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs(r"C:\Users\Admin\Desktop\hoopzone-basketball-store\docs\diagrams", exist_ok=True)

def setup_canvas(w=9, h=5.5):
    fig, ax = plt.subplots(figsize=(w, h), dpi=300)
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')
    ax.axis('off')
    return fig, ax

def save_bw(fig, filename):
    filepath = os.path.join(r"C:\Users\Admin\Desktop\hoopzone-basketball-store\docs\diagrams", filename)
    fig.savefig(filepath, bbox_inches='tight', facecolor='white', edgecolor='none', dpi=300)
    plt.close(fig)
    print(f"Rendered B&W: {filename}")

def draw_stick_figure(ax, x, y, name, scale=1.0):
    # Sleek, well-proportioned actor (aspect-ratio corrected so head is circular)
    fig = ax.get_figure()
    w_c, h_c = fig.get_size_inches()
    aspect = h_c / w_c
    
    ry = 0.024 * scale
    rx = ry * aspect
    head = patches.Ellipse((x, y + 0.055 * scale), 2 * rx, 2 * ry, edgecolor='black', facecolor='white', lw=1.5, zorder=5)
    ax.add_patch(head)
    # Spine
    ax.plot([x, x], [y + 0.031 * scale, y - 0.02 * scale], color='black', lw=1.5, zorder=5)
    # Arms
    arm_w = 0.028 * scale * aspect
    ax.plot([x - arm_w, x + arm_w], [y + 0.012 * scale, y + 0.012 * scale], color='black', lw=1.5, zorder=5)
    # Legs
    leg_w = 0.024 * scale * aspect
    ax.plot([x, x - leg_w], [y - 0.02 * scale, y - 0.075 * scale], color='black', lw=1.5, zorder=5)
    ax.plot([x, x + leg_w], [y - 0.02 * scale, y - 0.075 * scale], color='black', lw=1.5, zorder=5)
    # Name label with white box pad so overlapping lines never obscure text
    ax.text(x, y - 0.095 * scale, name, ha='center', va='top', fontsize=8.8 * scale, fontweight='bold', color='black',
            bbox=dict(boxstyle='square,pad=0.2', fc='white', ec='none'), zorder=6)

def draw_usecase(ax, x, y, text, w=0.29, h=0.09, stereo=None, fontsize=10):
    oval = patches.Ellipse((x, y), w, h, edgecolor='black', facecolor='white', lw=1.4, zorder=4)
    ax.add_patch(oval)
    full_text = f"<<{stereo}>>\n{text}" if stereo else text
    ax.text(x, y, full_text, ha='center', va='center', fontsize=fontsize, fontweight='medium', color='black', zorder=5)

def draw_boundary(ax, x, y, w, h, title):
    rect = patches.Rectangle((x, y), w, h, edgecolor='black', facecolor='#FAFAFA', lw=1.4, ls='-', zorder=1)
    ax.add_patch(rect)
    # Generous tab width to guarantee no text cutting
    tab_w = min(w * 0.96, 0.06 + len(title) * 0.0155)
    tab_h = 0.045
    tab = patches.Rectangle((x, y + h - tab_h), tab_w, tab_h, edgecolor='black', facecolor='#EAEAEA', lw=1.2, zorder=2)
    ax.add_patch(tab)
    ax.text(x + 0.015, y + h - tab_h / 2, title, ha='left', va='center', fontsize=9.0, fontweight='bold', color='black', zorder=3)

def draw_assoc(ax, x1, y1, x2, y2, label=None, ls='-', arrow=''):
    if arrow == '->':
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle='->', color='black', lw=1.2, ls=ls), zorder=3)
    elif arrow == '<-':
        ax.annotate('', xy=(x1, y1), xytext=(x2, y2),
                    arrowprops=dict(arrowstyle='->', color='black', lw=1.2, ls=ls), zorder=3)
    else:
        ax.plot([x1, x2], [y1, y2], color='black', lw=1.2, ls=ls, zorder=3)
    
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx, my + 0.015, label, ha='center', va='bottom', fontsize=8,
                bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), color='black', zorder=4)

# ==========================================
# 1. HÌNH 3.1: USE CASE TỔNG QUÁT (MONOCHROME - PROPORTIONAL & CLEAR)
# ==========================================
def gen_hinh_3_1():
    fig, ax = setup_canvas(13.5, 9.2)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    
    # Large spacious system boundary (from x=0.16 to x=0.84)
    draw_boundary(ax, 0.16, 0.03, 0.68, 0.94, "HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ BÓNG RỔ HOOPZONE")
    
    # Sleek, well-proportioned actors outside boundary (scale=0.82)
    draw_stick_figure(ax, 0.08, 0.58, "Khách Hàng\n(Customer)", scale=0.82)
    draw_stick_figure(ax, 0.92, 0.74, "Quản Trị Viên\n(Admin)", scale=0.82)
    draw_stick_figure(ax, 0.92, 0.28, "Nhân Viên\n(Staff)", scale=0.82)
    
    # Left Column (Customer Use Cases)
    cust_ucs = [
        (0.32, 0.88, "Xem sản phẩm & Thông số kỹ thuật"),
        (0.32, 0.75, "Quản lý giỏ hàng & Đặt hàng"),
        (0.32, 0.62, "Thanh toán (VietQR / COD)"),
        (0.32, 0.49, "Theo dõi tiến trình đơn hàng"),
        (0.32, 0.36, "Đánh giá sản phẩm (1-5 sao)"),
        (0.32, 0.23, "Tra cứu lịch sử đơn hàng")
    ]
    for cx, cy, text in cust_ucs:
        draw_usecase(ax, cx, cy, text, w=0.27, h=0.088, fontsize=9.5)
        draw_assoc(ax, 0.08, 0.58, cx - 0.135, cy)
        
    # Right Column (Admin & Staff Use Cases)
    admin_ucs = [
        (0.68, 0.88, "Quản lý sản phẩm & Tồn kho mẫu"),
        (0.68, 0.75, "Báo cáo doanh thu & KPI"),
        (0.68, 0.62, "Quản lý mã Voucher khuyến mãi"),
        (0.68, 0.49, "Quản lý đơn hàng & Đóng gói kho"),
        (0.68, 0.36, "Quản lý ca làm & Bảng chấm công"),
        (0.68, 0.23, "Chấm công ca làm việc")
    ]
    for ax_pos, ay, text in admin_ucs:
        draw_usecase(ax, ax_pos, ay, text, w=0.27, h=0.088, fontsize=9.5)
        if ay >= 0.36:
            draw_assoc(ax, 0.89, 0.74, ax_pos + 0.135, ay)
        if ay in [0.49, 0.23]:
            draw_assoc(ax, 0.89, 0.28, ax_pos + 0.135, ay)
            
    # Shared Bottom Use Case: Đăng nhập & Xác thực JWT
    draw_usecase(ax, 0.50, 0.095, "Đăng nhập & Phân quyền JWT", w=0.30, h=0.085, fontsize=10.0)
    draw_assoc(ax, 0.08, 0.58, 0.35, 0.095)
    draw_assoc(ax, 0.89, 0.28, 0.65, 0.095)
    
    save_bw(fig, "Hinh_3_1_UseCase_TongQuat.png")

# ==========================================
# 2-13. USE CASES CHI TIẾT TỪNG CHỨC NĂNG (HÌNH 3.2 -> 3.13)
# ==========================================
def gen_detail_usecase(filename, actor_name, main_uc, sub_ucs, title_boundary):
    fig, ax = setup_canvas(9.8, 5.2)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    
    draw_boundary(ax, 0.19, 0.05, 0.78, 0.90, title_boundary)
    draw_stick_figure(ax, 0.095, 0.50, actor_name, scale=0.92)
    
    # Main UC
    mx, my = 0.36, 0.50
    draw_usecase(ax, mx, my, main_uc, 0.26, 0.13, fontsize=9.2)
    draw_assoc(ax, 0.12, 0.50, mx - 0.13, my)
    
    # Sub UCs (include/extend)
    n = len(sub_ucs)
    if n == 1:
        positions = [(0.81, 0.50)]
    elif n == 2:
        positions = [(0.81, 0.70), (0.81, 0.30)]
    elif n == 3:
        positions = [(0.81, 0.76), (0.81, 0.50), (0.81, 0.24)]
    else:
        positions = [(0.81, 0.82 - i * 0.22) for i in range(n)]
        
    for i, (suc, stype) in enumerate(sub_ucs):
        sx, sy = positions[i]
        draw_usecase(ax, sx, sy, suc, 0.26, 0.12, fontsize=8.8)
        if stype == "include":
            draw_assoc(ax, mx + 0.13, my, sx - 0.13, sy, label="<<include>>", ls='--', arrow='->')
        elif stype == "extend":
            draw_assoc(ax, sx - 0.13, sy, mx + 0.13, my, label="<<extend>>", ls='--', arrow='->')
        else:
            draw_assoc(ax, mx + 0.13, my, sx - 0.13, sy, ls='-', arrow='')
            
    save_bw(fig, filename)

def gen_all_detail_usecases():
    # UC01 - Hình 3.2: Tra cứu thông số kỹ thuật & bảng size giày bóng rổ
    gen_detail_usecase(
        "Hinh_3_2_UseCase_XemMenu_3D.png",
        "Khách Hàng",
        "Tra cứu sản phẩm &\nBảng Size & Đệm Air",
        [("Xem bảng Size & Màu sắc chi tiết", "include"), ("Lọc theo 4 danh mục & Tồn kho", "extend")],
        "Phân hệ Xem Sản Phẩm & Thông Số Kỹ Thuật"
    )
    # UC02 - Hình 3.3
    gen_detail_usecase(
        "Hinh_3_3_UseCase_DatHang_Kho.png",
        "Khách Hàng",
        "Quản lý giỏ hàng &\nĐặt hàng",
        [("Kiểm tra tồn kho nguyên tử", "include"), ("Áp dụng mã giảm giá", "extend")],
        "Phân hệ Giỏ Hàng & Đặt Hàng Trực Tuyến"
    )
    # UC03 - Hình 3.4: 2 phương thức thanh toán VietQR & COD
    gen_detail_usecase(
        "Hinh_3_4_UseCase_ThanhToan_VietQR.png",
        "Khách Hàng",
        "Thanh toán đơn hàng",
        [("Chuyển khoản VietQR động", "extend"), ("Tiền mặt khi nhận (COD)", "extend"), ("Xác nhận & Lưu đơn hàng", "include")],
        "Phân hệ Thanh Toán Đơn Hàng (VietQR & COD)"
    )
    # UC04 - Hình 3.5
    gen_detail_usecase(
        "Hinh_3_5_UseCase_TheoDoiDonHang.png",
        "Khách Hàng",
        "Tra cứu & Theo dõi\ntiến độ đơn",
        [("Cập nhật trạng thái thời gian thực", "include"), ("Hủy đơn chờ thanh toán", "extend")],
        "Phân hệ Tra Cứu & Lịch Sử Đơn Hàng"
    )
    # UC05 - Hình 3.6: Đánh giá số sao (1-5) & Đính kèm ảnh thực tế
    gen_detail_usecase(
        "Hinh_3_6_UseCase_DanhGia_Rating.png",
        "Khách Hàng",
        "Đánh giá sản phẩm &\nDịch vụ",
        [("Chấm điểm số sao (1-5)", "include"), ("Đính kèm ảnh thực tế", "extend")],
        "Phân hệ Đánh Giá & Phản Hồi Chất Lượng"
    )
    # UC06 - Hình 3.7
    gen_detail_usecase(
        "Hinh_3_7_UseCase_DangNhap_HoSo.png",
        "Người Dùng\n(Tất cả vai trò)",
        "Đăng nhập hệ thống",
        [("Đăng ký tài khoản mới", "extend"), ("Cập nhật thông tin cá nhân", "extend")],
        "Phân hệ Xác Thực & Quản Lý Hồ Sơ"
    )
    # UC07 - Hình 3.8
    gen_detail_usecase(
        "Hinh_3_8_UseCase_Admin_MonAn_Kho.png",
        "Quản Trị Viên",
        "Quản lý sản phẩm &\nKiểm soát kho",
        [("Thêm / Sửa / Xóa sản phẩm", "include"), ("Khóa đặt hàng khi hết tồn kho", "include")],
        "Phân hệ Quản Lý Sản Phẩm & Tồn Kho Mẫu"
    )
    # UC08 - Hình 3.9
    gen_detail_usecase(
        "Hinh_3_9_UseCase_QuanLyDon_Bep.png",
        "Nhân Viên / Admin",
        "Điều phối đơn hàng &\nVận hành kho",
        [("Tiếp nhận đơn & Đóng gói", "include"), ("Chuyển trạng thái giao hàng", "include")],
        "Phân hệ Xử Lý Đơn Hàng & Đóng Gói Kho"
    )
    # UC09 - Hình 3.10
    gen_detail_usecase(
        "Hinh_3_10_UseCase_Admin_DoanhThu.png",
        "Quản Trị Viên",
        "Báo cáo phân tích\ndoanh thu",
        [("Lọc doanh thu theo ngày/tháng", "include"), ("Thống kê sản phẩm bán chạy", "extend")],
        "Phân hệ Thống Kê & Báo Cáo Doanh Thu"
    )
    # UC10 - Hình 3.11
    gen_detail_usecase(
        "Hinh_3_11_UseCase_Admin_Voucher.png",
        "Quản Trị Viên",
        "Quản lý Voucher\nkhuyến mại",
        [("Thiết lập mã & tỷ lệ giảm", "include"), ("Giới hạn số lượt & thời hạn", "include")],
        "Phân hệ Khuyến Mại & Mã Giảm Giá"
    )
    # UC11 - Hình 3.12
    gen_detail_usecase(
        "Hinh_3_12_UseCase_NhanVien_ChamCong.png",
        "Nhân Viên",
        "Điểm danh ca làm",
        [("Xác nhận ca làm việc", "include"), ("Ghi nhận giờ Vào / Tan ca", "include")],
        "Phân hệ Điểm Danh & Chấm Công Nhân Viên"
    )
    # UC12 - Hình 3.13
    gen_detail_usecase(
        "Hinh_3_13_UseCase_Admin_Luong.png",
        "Quản Trị Viên",
        "Duyệt công &\nTính bảng lương",
        [("Đồng bộ dữ liệu chấm công", "include"), ("Tính lương tự động & Xuất Excel", "include")],
        "Phân hệ Bảng Lương & Phê Duyệt Chấm Công"
    )

# ==========================================
# 14. BIỂU ĐỒ HOẠT ĐỘNG TỔNG QUÁT (HÌNH 3.14)
# ==========================================
def gen_hinh_3_14():
    fig, ax = setup_canvas(10, 7)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    
    # 4 Swimlanes
    lanes = [
        (0.04, 0.22, "Khách Hàng"),
        (0.26, 0.22, "Hệ Thống HoopZone"),
        (0.48, 0.24, "Bộ Phận Kho"),
        (0.72, 0.24, "Vận Chuyển / Giao Hàng")
    ]
    for lx, lw, lt in lanes:
        rect = patches.Rectangle((lx, 0.05), lw, 0.90, edgecolor='black', facecolor='#FAFAFA' if lx%0.2>0.1 else 'white', lw=1.2, ls='-', zorder=1)
        ax.add_patch(rect)
        ax.text(lx + lw/2, 0.92, lt, ha='center', va='center', fontsize=9.5, fontweight='bold', color='black')
        
    def act(x, y, text, w=0.18, h=0.07):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle='round,pad=0.015,rounding_size=0.02',
                                     edgecolor='black', facecolor='white', lw=1.2, zorder=3)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=8, color='black', zorder=4)

    # Helper functions for activity diagram nodes
    def draw_act_start(ax, x, y, r=0.018):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        start = patches.Ellipse((x, y), 2 * r * aspect, 2 * r, facecolor='black', edgecolor='black', zorder=4)
        ax.add_patch(start)

    def draw_act_end(ax, x, y, r_out=0.02, r_in=0.012):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        end_outer = patches.Ellipse((x, y), 2 * r_out * aspect, 2 * r_out, facecolor='white', edgecolor='black', lw=1.5, zorder=4)
        end_inner = patches.Ellipse((x, y), 2 * r_in * aspect, 2 * r_in, facecolor='black', edgecolor='black', zorder=5)
        ax.add_patch(end_outer)
        ax.add_patch(end_inner)

    # Start
    draw_act_start(ax, 0.15, 0.85)
    
    act(0.15, 0.74, "Tra cứu sản phẩm &\nChọn Size/Màu vào giỏ")
    draw_assoc(ax, 0.15, 0.832, 0.15, 0.775, arrow='->')
    
    act(0.15, 0.60, "Xác nhận đặt hàng &\nQuét VietQR")
    draw_assoc(ax, 0.15, 0.705, 0.15, 0.635, arrow='->')
    
    # Flow to System
    draw_assoc(ax, 0.24, 0.60, 0.37, 0.60, arrow='->')
    act(0.37, 0.60, "Xác thực giao dịch &\nKhóa trừ tồn kho")
    
    # Flow to Warehouse
    draw_assoc(ax, 0.46, 0.60, 0.60, 0.60, arrow='->')
    act(0.60, 0.60, "Tiếp nhận đơn &\nLấy giày/áo từ kệ kho")
    
    act(0.60, 0.44, "Kiểm tra size & Đóng hộp\nBàn giao đơn vị vận chuyển")
    draw_assoc(ax, 0.60, 0.565, 0.60, 0.475, arrow='->')
    
    # Flow to Delivery
    draw_assoc(ax, 0.69, 0.44, 0.84, 0.44, arrow='->')
    act(0.84, 0.44, "Nhận đơn &\nVận chuyển tới khách")
    
    act(0.84, 0.28, "Giao sản phẩm thành công &\nCập nhật 'Delivered'")
    draw_assoc(ax, 0.84, 0.405, 0.84, 0.315, arrow='->')
    
    # Back to Customer
    draw_assoc(ax, 0.75, 0.28, 0.24, 0.28, arrow='->')
    act(0.15, 0.28, "Nhận sản phẩm &\nGửi đánh giá sao")
    
    # End node
    draw_act_end(ax, 0.15, 0.14)
    draw_assoc(ax, 0.15, 0.245, 0.15, 0.165, arrow='->')
    
    save_bw(fig, "Hinh_3_14_Activity_TongQuat.png")

# ==========================================
# 15. BIỂU ĐỒ HOẠT ĐỘNG: ĐẶT HÀNG & ATOMIC (HÌNH 3.15)
# ==========================================
def gen_hinh_3_15():
    fig, ax = setup_canvas(9.2, 7.5)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    
    draw_boundary(ax, 0.05, 0.04, 0.90, 0.92, "Quy Trình Đặt Hàng & Trừ Tồn Kho Nguyên Tử (Atomic Decrement)")
    
    def draw_act_start(ax, x, y, r=0.018):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        start = patches.Ellipse((x, y), 2 * r * aspect, 2 * r, facecolor='black', edgecolor='black', zorder=4)
        ax.add_patch(start)

    def draw_act_end(ax, x, y, r_out=0.02, r_in=0.012):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        end_outer = patches.Ellipse((x, y), 2 * r_out * aspect, 2 * r_out, facecolor='white', edgecolor='black', lw=1.5, zorder=4)
        end_inner = patches.Ellipse((x, y), 2 * r_in * aspect, 2 * r_in, facecolor='black', edgecolor='black', zorder=5)
        ax.add_patch(end_outer)
        ax.add_patch(end_inner)

    def rbox(x, y, text, w=0.32, h=0.08):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle='round,pad=0.015,rounding_size=0.02',
                                     edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=8.5, color='black', zorder=4)
        
    def diamond(x, y, text, w=0.36, h=0.10):
        pts = [[x, y + h/2], [x + w/2, y], [x, y - h/2], [x - w/2, y]]
        poly = patches.Polygon(pts, edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(poly)
        ax.text(x, y, text, ha='center', va='center', fontsize=7.2, color='black', zorder=4)

    # Start
    draw_act_start(ax, 0.38, 0.85)
    
    rbox(0.38, 0.75, "Khách hàng gửi yêu cầu\nĐặt hàng (Checkout)", w=0.32, h=0.08)
    draw_assoc(ax, 0.38, 0.832, 0.38, 0.79, arrow='->')
    
    rbox(0.38, 0.63, "Hệ thống mở giao dịch &\nThực thi atomic: findOneAndUpdate()", w=0.34, h=0.08)
    draw_assoc(ax, 0.38, 0.71, 0.38, 0.67, arrow='->')
    
    diamond(0.38, 0.51, "Số lượng tồn kho\n>= Số lượng đặt?", w=0.36, h=0.10)
    draw_assoc(ax, 0.38, 0.59, 0.38, 0.562, arrow='->')
    
    # Branch No
    draw_assoc(ax, 0.56, 0.51, 0.78, 0.51, arrow='->')
    ax.text(0.67, 0.525, "[Không đủ]", ha='center', va='bottom', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    rbox(0.78, 0.39, "Hủy giao dịch (Rollback)\nBáo lỗi 'Sản phẩm đã hết'", w=0.26, h=0.08)
    draw_assoc(ax, 0.78, 0.51, 0.78, 0.43, arrow='->')
    
    # Branch Yes
    draw_assoc(ax, 0.38, 0.458, 0.38, 0.41, arrow='->')
    ax.text(0.40, 0.435, "[Thỏa mãn]", ha='left', va='center', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    rbox(0.38, 0.37, "Trừ kho nguyên tử (stock -= qty)\nKhóa đơn hàng ở DB", w=0.32, h=0.08)
    
    rbox(0.38, 0.25, "Sinh mã thanh toán VietQR động\nChờ xác nhận thanh toán", w=0.32, h=0.08)
    draw_assoc(ax, 0.38, 0.33, 0.38, 0.29, arrow='->')
    
    # End
    draw_act_end(ax, 0.38, 0.12)
    draw_assoc(ax, 0.38, 0.21, 0.38, 0.142, arrow='->')
    draw_assoc(ax, 0.78, 0.35, 0.78, 0.12)
    draw_assoc(ax, 0.78, 0.12, 0.405, 0.12, arrow='->')
    
    save_bw(fig, "Hinh_3_15_Activity_DatHang_Atomic.png")

# ==========================================
# 16. BIỂU ĐỒ HOẠT ĐỘNG: CHẤM CÔNG & LƯƠNG (HÌNH 3.16)
# ==========================================
def gen_hinh_3_16():
    fig, ax = setup_canvas(9.2, 7.8)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    
    draw_boundary(ax, 0.05, 0.03, 0.90, 0.94, "Quy Trình Chấm Công Theo Ca & Tính Bảng Lương Nhân Viên")
    
    def draw_act_start(ax, x, y, r=0.018):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        start = patches.Ellipse((x, y), 2 * r * aspect, 2 * r, facecolor='black', edgecolor='black', zorder=4)
        ax.add_patch(start)

    def draw_act_end(ax, x, y, r_out=0.02, r_in=0.012):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        end_outer = patches.Ellipse((x, y), 2 * r_out * aspect, 2 * r_out, facecolor='white', edgecolor='black', lw=1.5, zorder=4)
        end_inner = patches.Ellipse((x, y), 2 * r_in * aspect, 2 * r_in, facecolor='black', edgecolor='black', zorder=5)
        ax.add_patch(end_outer)
        ax.add_patch(end_inner)

    def rbox(x, y, text, w=0.55, h=0.082):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle='round,pad=0.015,rounding_size=0.02',
                                     edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=8.6, color='black', zorder=4)

    # Start
    draw_act_start(ax, 0.50, 0.89)
    
    # Step 1: Login & Select shift
    rbox(0.50, 0.79, "Nhân viên đăng nhập hệ thống tại quán &\nChọn ca làm việc (Ca sáng / Ca chiều / Ca tối)", w=0.55, h=0.078)
    draw_assoc(ax, 0.50, 0.872, 0.50, 0.83, arrow='->')
    
    # Step 2: Check-in
    rbox(0.50, 0.65, "Bấm 'Vào ca làm việc' (Check-in):\nHệ thống ghi nhận InTime & Trạng thái 'Đang làm việc'", w=0.55, h=0.078)
    draw_assoc(ax, 0.50, 0.75, 0.50, 0.69, arrow='->')
    
    # Step 3: Shift duties
    rbox(0.50, 0.51, "Thực hiện nhiệm vụ ca làm việc tại quán ăn\n(Phục vụ / Thu ngân / Pha chế / Kho / Điều phối)", w=0.55, h=0.078)
    draw_assoc(ax, 0.50, 0.61, 0.50, 0.55, arrow='->')
    
    # Step 4: Check-out
    rbox(0.50, 0.37, "Kết thúc ca: Bấm 'Điểm danh tan ca' (Check-out):\nGhi nhận OutTime & Cập nhật trạng thái 'Hoàn thành ca'", w=0.55, h=0.078)
    draw_assoc(ax, 0.50, 0.47, 0.50, 0.41, arrow='->')
    
    # Step 5: Payroll sync
    rbox(0.50, 0.23, "Quản trị viên đồng bộ dữ liệu chấm công &\nHệ thống tính lương: Lương = Số ca * Đơn giá ca + Phụ cấp", w=0.58, h=0.078)
    draw_assoc(ax, 0.50, 0.33, 0.50, 0.27, arrow='->')
    
    # End
    draw_act_end(ax, 0.50, 0.10)
    draw_assoc(ax, 0.50, 0.19, 0.50, 0.122, arrow='->')
    
    save_bw(fig, "Hinh_3_16_Activity_ChamCong_Luong.png")

# ==========================================
# 17. BIỂU ĐỒ HOẠT ĐỘNG: ĐÁNH GIÁ & RATING (HÌNH 3.17)
# ==========================================
def gen_hinh_3_17():
    fig, ax = setup_canvas(9.2, 7.5)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    
    draw_boundary(ax, 0.05, 0.04, 0.90, 0.92, "Quy Trình Khách Hàng Đánh Giá Sản phẩm Ăn & Cập Nhật Sao Động")
    
    def draw_act_start(ax, x, y, r=0.018):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        start = patches.Ellipse((x, y), 2 * r * aspect, 2 * r, facecolor='black', edgecolor='black', zorder=4)
        ax.add_patch(start)

    def draw_act_end(ax, x, y, r_out=0.02, r_in=0.012):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        end_outer = patches.Ellipse((x, y), 2 * r_out * aspect, 2 * r_out, facecolor='white', edgecolor='black', lw=1.5, zorder=4)
        end_inner = patches.Ellipse((x, y), 2 * r_in * aspect, 2 * r_in, facecolor='black', edgecolor='black', zorder=5)
        ax.add_patch(end_outer)
        ax.add_patch(end_inner)

    def rbox(x, y, text, w=0.32, h=0.08):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle='round,pad=0.015,rounding_size=0.02',
                                     edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=8.5, color='black', zorder=4)
        
    def diamond(x, y, text, w=0.36, h=0.10):
        pts = [[x, y + h/2], [x + w/2, y], [x, y - h/2], [x - w/2, y]]
        poly = patches.Polygon(pts, edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(poly)
        ax.text(x, y, text, ha='center', va='center', fontsize=7.2, color='black', zorder=4)

    draw_act_start(ax, 0.38, 0.85)
    
    rbox(0.38, 0.75, "Khách hàng chọn đơn hàng\nđã giao thành công (Delivered)", w=0.32, h=0.08)
    draw_assoc(ax, 0.38, 0.832, 0.38, 0.79, arrow='->')
    
    diamond(0.38, 0.62, "Đơn hàng đã được\nđánh giá trước đó chưa?", w=0.36, h=0.10)
    draw_assoc(ax, 0.38, 0.71, 0.38, 0.672, arrow='->')
    
    # Already reviewed
    draw_assoc(ax, 0.56, 0.62, 0.78, 0.62, arrow='->')
    ax.text(0.67, 0.635, "[Đã đánh giá]", ha='center', va='bottom', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    rbox(0.78, 0.49, "Hiển thị đánh giá cũ\nKhông cho tạo trùng lặp", w=0.26, h=0.08)
    draw_assoc(ax, 0.78, 0.62, 0.78, 0.53, arrow='->')
    
    # Not yet
    draw_assoc(ax, 0.38, 0.568, 0.38, 0.51, arrow='->')
    ax.text(0.40, 0.54, "[Chưa đánh giá]", ha='left', va='center', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    rbox(0.38, 0.47, "Nhập số sao (1-5), lời bình luận\nvà tải ảnh sản phẩm kèm theo", w=0.32, h=0.08)
    
    rbox(0.38, 0.35, "Lưu bản ghi vào Collection Reviews\nvới UserId và ProductId", w=0.34, h=0.08)
    draw_assoc(ax, 0.38, 0.43, 0.38, 0.39, arrow='->')
    
    rbox(0.38, 0.23, "MongoDB Aggregation Pipeline:\nTính lại số sao trung bình sản phẩm", w=0.34, h=0.08)
    draw_assoc(ax, 0.38, 0.31, 0.38, 0.27, arrow='->')
    
    draw_act_end(ax, 0.38, 0.11)
    draw_assoc(ax, 0.38, 0.19, 0.38, 0.132, arrow='->')
    draw_assoc(ax, 0.78, 0.45, 0.78, 0.11)
    draw_assoc(ax, 0.78, 0.11, 0.405, 0.11, arrow='->')
    
    save_bw(fig, "Hinh_3_17_Activity_DanhGia_Rating.png")

# ==========================================
# 18-23. BIỂU ĐỒ TRÌNH TỰ (SEQUENCE DIAGRAMS - HÌNH 3.18 -> 3.23)
# ==========================================
def draw_sequence_base(ax, actors, title):
    # Boundary
    rect = patches.Rectangle((0.02, 0.02), 0.96, 0.96, edgecolor='black', facecolor='#FAFAFA', lw=1.4, zorder=1)
    ax.add_patch(rect)
    
    # Dedicated StarUML frame header tab at top-left
    tab_w = min(0.85, 0.06 + len(title) * 0.0125)
    tab_h = 0.042
    tab = patches.Rectangle((0.02, 0.98 - tab_h), tab_w, tab_h, edgecolor='black', facecolor='#EAEAEA', lw=1.2, zorder=2)
    ax.add_patch(tab)
    ax.text(0.035, 0.98 - tab_h/2, f"sd  {title}", ha='left', va='center', fontsize=9.0, fontweight='bold', color='black', zorder=3)
    
    n = len(actors)
    step = (0.865 - 0.135) / (n - 1)
    xs = [0.135 + i * step for i in range(n)]
    
    # Actors lowered to y=0.79 -> 0.845 (leaving clear space below title tab 0.938)
    for x, act in zip(xs, actors):
        box_w = 0.145
        box = patches.Rectangle((x - box_w/2, 0.79), box_w, 0.055, edgecolor='black', facecolor='white', lw=1.3, zorder=4)
        ax.add_patch(box)
        ax.text(x, 0.8175, act, ha='center', va='center', fontsize=7.4, fontweight='bold', color='black', zorder=5)
        ax.plot([x, x], [0.79, 0.05], color='black', lw=1.0, ls='--', zorder=2)
    return xs

def draw_seq_msg(ax, x1, x2, y, text, is_reply=False, is_async=False):
    ls = '--' if is_reply else '-'
    arrow = '->'
    ax.annotate('', xy=(x2, y), xytext=(x1, y),
                arrowprops=dict(arrowstyle=arrow, color='black', lw=1.2, ls=ls), zorder=4)
    mx = (x1 + x2) / 2
    ax.text(mx, y + 0.015, text, ha='center', va='bottom', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), color='black', zorder=5)

def gen_hinh_3_18():
    fig, ax = setup_canvas(10.5, 7.0)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    actors = ["Khách A & B", "Web Client", "Order Controller", "Product Model", "MongoDB Database"]
    xs = draw_sequence_base(ax, actors, "Biểu Đồ Tuần Tự: Xử Lý Tranh Chấp Kho Đồng Thời (Atomic Lock)")
    
    draw_seq_msg(ax, xs[0], xs[1], 0.720, "1. Cùng bấm 'Thanh toán' (Qty=1, Tồn=1)")
    draw_seq_msg(ax, xs[1], xs[2], 0.655, "2. Gửi đồng thời 2 request POST /orders")
    draw_seq_msg(ax, xs[2], xs[3], 0.590, "3. Khách A chạm DB trước: findOneAndUpdate({_id, stock: {$gte: 1}})")
    draw_seq_msg(ax, xs[3], xs[4], 0.525, "4. DB khóa tài liệu, trừ stock: 1 -> 0 thành công")
    draw_seq_msg(ax, xs[4], xs[2], 0.460, "5. Trả về doc hợp lệ cho Khách A", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[3], 0.395, "6. Khách B chạm DB sau: findOneAndUpdate({_id, stock: {$gte: 1}})")
    draw_seq_msg(ax, xs[3], xs[4], 0.330, "7. DB kiểm tra: stock=0 (<1) -> Không thỏa điều kiện")
    draw_seq_msg(ax, xs[4], xs[2], 0.265, "8. DB trả về null (Atomic Conflict Rejected)", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[1], 0.200, "9. Khách A: Mã QR | Khách B: Lỗi 409 'Sản phẩm đã hết'")
    draw_seq_msg(ax, xs[1], xs[0], 0.135, "10. Thông báo kết quả trực quan trên giao diện", is_reply=True)
    
    save_bw(fig, "Hinh_3_18_Sequence_RaceCondition.png")

def gen_hinh_3_19():
    fig, ax = setup_canvas(10.5, 7.0)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    actors = ["Khách Hàng", "Giao Diện App", "Payment Service", "VietQR Gateway", "Database"]
    xs = draw_sequence_base(ax, actors, "Biểu Đồ Tuần Tự: Sinh Mã VietQR Động & Xác Nhận Webhook Tự Động")
    
    draw_seq_msg(ax, xs[0], xs[1], 0.720, "1. Chọn phương thức 'Chuyển khoản VietQR'")
    draw_seq_msg(ax, xs[1], xs[2], 0.655, "2. Request POST /api/payment/vietqr")
    draw_seq_msg(ax, xs[2], xs[3], 0.590, "3. Tạo mã QR động kèm nội dung đơn (VD: HOOPZONE_OD123)")
    draw_seq_msg(ax, xs[3], xs[2], 0.525, "4. Trả về hình ảnh QR Code & URL", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[1], 0.460, "5. Hiển thị mã QR và thời gian đếm ngược", is_reply=True)
    draw_seq_msg(ax, xs[0], xs[3], 0.395, "6. Quét QR trên ứng dụng ngân hàng và chuyển khoản")
    draw_seq_msg(ax, xs[3], xs[2], 0.330, "7. Ngân hàng bắn IPN / Webhook báo chuyển tiền thành công")
    draw_seq_msg(ax, xs[2], xs[4], 0.265, "8. Cập nhật Order status = 'Paid', lưu TransactionId")
    draw_seq_msg(ax, xs[4], xs[2], 0.200, "9. DB ghi nhận thành công", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[1], 0.135, "10. Realtime thông báo: 'Thanh toán thành công!'")
    
    save_bw(fig, "Hinh_3_19_Sequence_ThanhToan_VietQR.png")

def gen_hinh_3_20():
    fig, ax = setup_canvas(10.5, 7.0)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    actors = ["Nhân Viên", "Web Client (Quán)", "Attendance Controller", "Shift Service", "Database"]
    xs = draw_sequence_base(ax, actors, "Biểu Đồ Tuần Tự: Điểm Danh Chấm Công Nhân Viên Theo Ca")
    
    draw_seq_msg(ax, xs[0], xs[1], 0.720, "1. Chọn ca làm (Sáng/Tối) & Bấm 'Vào ca làm việc'")
    draw_seq_msg(ax, xs[1], xs[2], 0.655, "2. Request POST /api/attendance/check-in {staffId, shiftId}")
    draw_seq_msg(ax, xs[2], xs[3], 0.590, "3. Xác thực tài khoản nhân viên & ca làm việc hợp lệ")
    draw_seq_msg(ax, xs[3], xs[4], 0.525, "4. Lưu bản ghi Attendance (InTime, Date, Status='Working')")
    draw_seq_msg(ax, xs[4], xs[2], 0.460, "5. DB ghi nhận bản ghi chấm công thành công", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[1], 0.395, "6. Trả về trạng thái 'Đang làm việc' trên giao diện", is_reply=True)
    draw_seq_msg(ax, xs[0], xs[1], 0.330, "7. Hết giờ: Bấm 'Điểm danh tan ca' (Check-out)")
    draw_seq_msg(ax, xs[1], xs[2], 0.265, "8. Request POST /api/attendance/check-out")
    draw_seq_msg(ax, xs[2], xs[4], 0.200, "9. Ghi nhận OutTime & cập nhật Status='Completed'")
    draw_seq_msg(ax, xs[4], xs[1], 0.135, "10. Thông báo hoàn thành ca & đồng bộ bảng lương", is_reply=True)
    
    save_bw(fig, "Hinh_3_20_Sequence_ChamCong.png")

def gen_hinh_3_21():
    fig, ax = setup_canvas(10.5, 7.0)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    actors = ["Quản Trị Viên", "Admin Dashboard", "Inventory Controller", "Product Model", "Database"]
    xs = draw_sequence_base(ax, actors, "Biểu Đồ Tuần Tự: Quản Lý Sản phẩm Ăn & Kiểm Soát Tồn Kho")
    
    draw_seq_msg(ax, xs[0], xs[1], 0.71, "1. Cập nhật số lượng nhập kho hoặc thông tin sản phẩm")
    draw_seq_msg(ax, xs[1], xs[2], 0.63, "2. Request PUT /api/products/:id/stock")
    draw_seq_msg(ax, xs[2], xs[3], 0.55, "3. Validate dữ liệu & kiểm tra quyền Admin")
    draw_seq_msg(ax, xs[3], xs[4], 0.47, "4. updateOne({_id}, {$set: {stock: newStock, isAvailable}})")
    draw_seq_msg(ax, xs[4], xs[3], 0.39, "5. MongoDB xác nhận cập nhật thành công", is_reply=True)
    draw_seq_msg(ax, xs[3], xs[2], 0.31, "6. Kích hoạt sự kiện WebSocket đồng bộ kho tới Client")
    draw_seq_msg(ax, xs[2], xs[1], 0.23, "7. Trả về thông tin sản phẩm mới nhất", is_reply=True)
    draw_seq_msg(ax, xs[1], xs[0], 0.15, "8. Bảng dữ liệu tự động làm mới, hiển thị tồn kho mới")
    
    save_bw(fig, "Hinh_3_21_Sequence_Admin_Kho.png")

def gen_hinh_3_22():
    fig, ax = setup_canvas(10.5, 7.0)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    actors = ["Khách Hàng", "Chi Tiết Đơn Hàng", "Review Controller", "Aggregation Engine", "Database"]
    xs = draw_sequence_base(ax, actors, "Biểu Đồ Tuần Tự: Gửi Đánh Giá Sản phẩm Ăn & Tính Sao Động")
    
    draw_seq_msg(ax, xs[0], xs[1], 0.71, "1. Nhập 5 sao, viết nhận xét và đính kèm ảnh")
    draw_seq_msg(ax, xs[1], xs[2], 0.64, "2. Gửi POST /api/reviews kèm thông tin đơn hàng")
    draw_seq_msg(ax, xs[2], xs[4], 0.57, "3. Lưu bản ghi đánh giá vào Collection Reviews")
    draw_seq_msg(ax, xs[4], xs[2], 0.50, "4. Ghi nhận thành công", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[3], 0.43, "5. Chạy Aggregation: Tính avgRating của ProductId")
    draw_seq_msg(ax, xs[3], xs[4], 0.36, "6. Cập nhật rating và numReviews vào Product")
    draw_seq_msg(ax, xs[4], xs[2], 0.29, "7. DB phản hồi kết quả tính toán", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[1], 0.22, "8. Trả về kết quả đánh giá thành công", is_reply=True)
    draw_seq_msg(ax, xs[1], xs[0], 0.15, "9. Hiển thị lời cảm ơn và số sao mới trên trang sản phẩm")
    
    save_bw(fig, "Hinh_3_22_Sequence_DanhGia_Rating.png")

def gen_hinh_3_23():
    fig, ax = setup_canvas(10.5, 7.0)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    actors = ["Quản Trị Viên", "Trang Báo Cáo", "Analytics Controller", "MongoDB Aggregation", "Database"]
    xs = draw_sequence_base(ax, actors, "Biểu Đồ Tuần Tự: Tổng Hợp Doanh Thu & Báo Cáo Kinh Doanh")
    
    draw_seq_msg(ax, xs[0], xs[1], 0.71, "1. Chọn khoảng thời gian báo cáo (Hôm nay / Tuần / Tháng)")
    draw_seq_msg(ax, xs[1], xs[2], 0.63, "2. Request GET /api/admin/reports/revenue?from=...&to=...")
    draw_seq_msg(ax, xs[2], xs[3], 0.55, "3. Gọi pipeline: $match -> $unwind -> $group -> $sort")
    draw_seq_msg(ax, xs[3], xs[4], 0.47, "4. Truy vấn tính tổng tiền và thống kê top sản phẩm bán chạy")
    draw_seq_msg(ax, xs[4], xs[3], 0.39, "5. Trả về mảng dữ liệu phân tích", is_reply=True)
    draw_seq_msg(ax, xs[3], xs[2], 0.31, "6. Đóng gói kết quả doanh thu, đơn hàng, KPI", is_reply=True)
    draw_seq_msg(ax, xs[2], xs[1], 0.23, "7. Trả về JSON chứa số liệu biểu đồ", is_reply=True)
    draw_seq_msg(ax, xs[1], xs[0], 0.15, "8. Render biểu đồ trực quan (Cột, Đường, Tròn)")
    
    save_bw(fig, "Hinh_3_23_Sequence_Admin_DoanhThu.png")

# ==========================================
# 24. BIỂU ĐỒ TRẠNG THÁI VÒNG ĐỜI ĐƠN HÀNG (HÌNH 3.24)
# ==========================================
def gen_hinh_3_24():
    fig, ax = setup_canvas(10.5, 6.5)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    draw_boundary(ax, 0.03, 0.03, 0.94, 0.94, "Biểu Đồ Trạng Thái: Vòng Đời Đơn Hàng (Order State Machine)")
    
    def state_box(x, y, title, actions="", w=0.25, h=0.11):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle='round,pad=0.015,rounding_size=0.03',
                                     edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(box)
        ax.text(x, y + 0.022, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='black', zorder=4)
        if actions:
            ax.plot([x - w/2 + 0.01, x + w/2 - 0.01], [y + 0.005, y + 0.005], color='black', lw=0.8, zorder=4)
            ax.text(x, y - 0.025, actions, ha='center', va='center', fontsize=7.5, color='black', zorder=4)

    def draw_act_start(ax, x, y, r=0.018):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        start = patches.Ellipse((x, y), 2 * r * aspect, 2 * r, facecolor='black', edgecolor='black', zorder=4)
        ax.add_patch(start)

    def draw_act_end(ax, x, y, r_out=0.02, r_in=0.012):
        fig = ax.get_figure()
        w_c, h_c = fig.get_size_inches()
        aspect = h_c / w_c
        end_outer = patches.Ellipse((x, y), 2 * r_out * aspect, 2 * r_out, facecolor='white', edgecolor='black', lw=1.5, zorder=4)
        end_inner = patches.Ellipse((x, y), 2 * r_in * aspect, 2 * r_in, facecolor='black', edgecolor='black', zorder=5)
        ax.add_patch(end_outer)
        ax.add_patch(end_inner)

    # Start
    draw_act_start(ax, 0.07, 0.72, r=0.018)
    
    # Pending (Chờ thanh toán)
    state_box(0.28, 0.72, "Pending (Chờ thanh toán)", "entry: Giữ tồn kho\ndo: Đếm ngược VietQR", w=0.25)
    draw_assoc(ax, 0.088, 0.72, 0.155, 0.72, arrow='->')
    ax.text(0.12, 0.735, "Đặt hàng", ha='center', va='bottom', fontsize=7.5,
            bbox=dict(boxstyle='square,pad=0.1', fc='white', ec='none'), zorder=5)
    
    # Paid (Đã thanh toán)
    state_box(0.72, 0.72, "Paid (Đã thanh toán)", "entry: Xác nhận GD\ndo: Thông báo kho", w=0.25)
    draw_assoc(ax, 0.405, 0.72, 0.595, 0.72, arrow='->')
    ax.text(0.50, 0.735, "Quét VietQR thành công", ha='center', va='bottom', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    
    # Processing (Đóng gói kho)
    state_box(0.72, 0.44, "Processing (Đóng gói)", "entry: In phiếu xuất kho\ndo: Soạn size giày & đóng hộp", w=0.25)
    draw_assoc(ax, 0.72, 0.665, 0.72, 0.495, arrow='->')
    ax.text(0.72, 0.58, "Kho nhận đơn", ha='center', va='center', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    
    # Delivering (Đang giao)
    state_box(0.72, 0.18, "Delivering (Đang giao)", "entry: Giao Shipper\ndo: Di chuyển tới khách", w=0.25)
    draw_assoc(ax, 0.72, 0.385, 0.72, 0.235, arrow='->')
    ax.text(0.72, 0.31, "Đóng gói xong", ha='center', va='center', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    
    # Delivered (Hoàn tất)
    state_box(0.28, 0.18, "Delivered (Hoàn tất)", "entry: Khách nhận sản phẩm\ndo: Mở tính năng đánh giá", w=0.25)
    draw_assoc(ax, 0.595, 0.18, 0.405, 0.18, arrow='->')
    ax.text(0.50, 0.195, "Giao thành công", ha='center', va='bottom', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    
    # Cancelled (Đã hủy)
    state_box(0.28, 0.44, "Cancelled (Đã hủy)", "entry: Hoàn trả tồn kho\ndo: Báo lý do hủy", w=0.25)
    draw_assoc(ax, 0.28, 0.665, 0.28, 0.495, arrow='->')
    ax.text(0.28, 0.58, "Quá hạn / Hủy", ha='center', va='center', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.15', fc='white', ec='none'), zorder=5)
    
    # End node
    draw_act_end(ax, 0.07, 0.18, r_out=0.02, r_in=0.012)
    draw_assoc(ax, 0.155, 0.18, 0.095, 0.18, arrow='->')
    
    # Cancelled to End node (orthogonal path avoiding Delivered box)
    draw_assoc(ax, 0.155, 0.44, 0.07, 0.44)
    draw_assoc(ax, 0.07, 0.44, 0.07, 0.205, arrow='->')
    
    save_bw(fig, "Hinh_3_24_State_DonHang.png")

# ==========================================
# 25. BIỂU ĐỒ LỚP MIỀN NGHIỆP VỤ (HÌNH 3.25)
# ==========================================
def gen_hinh_3_25():
    fig, ax = setup_canvas(11.5, 7.5)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    draw_boundary(ax, 0.03, 0.03, 0.94, 0.94, "Biểu Đồ Lớp Miền Nghiệp Vụ (Domain Class Model)")
    
    def uml_class(x, y, name, attrs, methods, w=0.23, h=0.27):
        rect = patches.Rectangle((x, y), w, h, edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(rect)
        # Header
        ax.text(x + w/2, y + h - 0.028, name, ha='center', va='center', fontsize=9, fontweight='bold', color='black', zorder=4)
        ax.plot([x, x + w], [y + h - 0.048, y + h - 0.048], color='black', lw=1.0, zorder=4)
        # Attributes
        ay = y + h - 0.068
        for a in attrs:
            ax.text(x + 0.010, ay, a, ha='left', va='center', fontsize=7.0, color='black', zorder=4)
            ay -= 0.023
        # Divider
        ax.plot([x, x + w], [ay - 0.005, ay - 0.005], color='black', lw=1.0, zorder=4)
        # Methods
        my = ay - 0.023
        for m in methods:
            ax.text(x + 0.010, my, m, ha='left', va='center', fontsize=7.0, color='black', zorder=4)
            my -= 0.023

    uml_class(0.05, 0.63, "User", 
              ["- id: ObjectId", "- fullName: String", "- email: String", "- role: String"], 
              ["+ login(): Boolean", "+ updateProfile()", "+ getPermissions()"], 0.23, 0.27)
              
    uml_class(0.385, 0.63, "Product", 
              ["- id: ObjectId", "- name: String", "- price: Number", "- stock: Number", "- imageUrl: String"], 
              ["+ checkStock(qty): Bool", "+ atomicDecStock(qty)", "+ updateRating()"], 0.23, 0.29)
              
    uml_class(0.72, 0.63, "Order", 
              ["- id: ObjectId", "- userId: ObjectId", "- totalAmount: Number", "- status: String"], 
              ["+ calculateTotal()", "+ applyVoucher(code)", "+ updateStatus(st)"], 0.23, 0.27)
              
    uml_class(0.05, 0.18, "Attendance", 
              ["- id: ObjectId", "- staffId: ObjectId", "- checkInTime: Date", "- shiftType: String"], 
              ["+ recordCheckIn()", "+ recordCheckOut()"], 0.23, 0.25)
              
    uml_class(0.385, 0.18, "Payroll", 
              ["- id: ObjectId", "- staffId: ObjectId", "- totalHours: Number", "- finalSalary: Number"], 
              ["+ syncAttendance()", "+ calculateSalary()", "+ exportPayslip()"], 0.23, 0.27)
              
    uml_class(0.72, 0.18, "Review", 
              ["- id: ObjectId", "- orderId: ObjectId", "- rating: Number", "- comment: String"], 
              ["+ submitReview()", "+ validateOrderDelivered()"], 0.23, 0.25)
              
    # Associations with clear gap labels
    draw_assoc(ax, 0.28, 0.77, 0.385, 0.77, ls='-')
    ax.text(0.3325, 0.79, "1..* xem 1..*", ha='center', va='bottom', fontsize=7.2,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)
            
    draw_assoc(ax, 0.615, 0.77, 0.72, 0.77, ls='-')
    ax.text(0.6675, 0.79, "1 chứa 1..*", ha='center', va='bottom', fontsize=7.2,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)
            
    draw_assoc(ax, 0.165, 0.63, 0.165, 0.43, label="1 có 0..*", ls='-')
    
    draw_assoc(ax, 0.28, 0.31, 0.385, 0.31, ls='--', arrow='->')
    ax.text(0.3325, 0.33, "tổng hợp", ha='center', va='bottom', fontsize=7.2,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)
            
    draw_assoc(ax, 0.835, 0.63, 0.835, 0.43, label="1 tạo 0..1", ls='-')

    save_bw(fig, "Hinh_3_25_Class_Diagram.png")

# ==========================================
# 26. BIỂU ĐỒ CƠ SỞ DỮ LIỆU MONGODB (HÌNH 3.26)
# ==========================================
def gen_hinh_3_26():
    fig, ax = setup_canvas(10.5, 7.5)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    draw_boundary(ax, 0.03, 0.03, 0.94, 0.94, "Cấu Trúc Các Document Collection Trong MongoDB (Database Schema)")
    
    def mongo_coll(x, y, coll_name, fields, w=0.27, h=0.26):
        rect = patches.Rectangle((x, y), w, h, edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(rect)
        hdr = patches.Rectangle((x, y + h - 0.042), w, 0.042, edgecolor='black', facecolor='#EEEEEE', lw=1.0, zorder=3)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.021, f"Collection: {coll_name}", ha='center', va='center', fontsize=8.5, fontweight='bold', color='black', zorder=4)
        
        fy = y + h - 0.065
        for f in fields:
            ax.text(x + 0.012, fy, f, ha='left', va='center', fontsize=7.2, color='black', zorder=4)
            fy -= 0.023

    mongo_coll(0.05, 0.64, "users", [
        "_id: ObjectId (PK)", "email: String (Indexed)", "passwordHash: String", 
        "role: Enum['customer', 'staff', 'admin']", "fullName: String", "createdAt: ISODate"
    ], 0.27, 0.25)
    
    mongo_coll(0.365, 0.62, "products", [
        "_id: ObjectId (PK)", "name: String (Indexed)", "price: Number", "stock: Number (Int32)", 
        "category: String", "imageUrl: String (JPG/PNG)", "rating: Number", "numReviews: Number"
    ], 0.27, 0.28)
    
    mongo_coll(0.68, 0.64, "orders", [
        "_id: ObjectId (PK)", "userId: ObjectId (FK)", "items: Array<OrderItem>", 
        "totalAmount: Number", "paymentMethod: String", "paymentStatus: String", "status: String (Indexed)"
    ], 0.27, 0.26)
    
    mongo_coll(0.05, 0.20, "attendances", [
        "_id: ObjectId (PK)", "staffId: ObjectId (FK)", "checkInTime: ISODate", 
        "checkOutTime: ISODate", "workHours: Number", "shiftType: String", "isApproved: Boolean"
    ], 0.27, 0.26)
    
    mongo_coll(0.365, 0.20, "payrolls", [
        "_id: ObjectId (PK)", "staffId: ObjectId (FK)", "monthYear: String", 
        "totalWorkHours: Number", "hourlyRate: Number", "bonus: Number", "netSalary: Number", "isApproved: Boolean"
    ], 0.27, 0.27)
    
    mongo_coll(0.68, 0.20, "reviews", [
        "_id: ObjectId (PK)", "userId: ObjectId (FK)", "productId: ObjectId (FK)", 
        "orderId: ObjectId (FK)", "rating: Number (1-5)", "comment: String", "images: Array<String>"
    ], 0.27, 0.26)
    
    # DB Relations
    draw_assoc(ax, 0.32, 0.77, 0.365, 0.77, ls='--', arrow='->')
    draw_assoc(ax, 0.635, 0.77, 0.68, 0.77, ls='--', arrow='->')
    draw_assoc(ax, 0.185, 0.64, 0.185, 0.46, ls='--', arrow='->')
    draw_assoc(ax, 0.32, 0.33, 0.365, 0.33, ls='--', arrow='->')
    draw_assoc(ax, 0.815, 0.64, 0.815, 0.46, ls='--', arrow='->')

    save_bw(fig, "Hinh_3_26_MongoDB_Schema.png")

# ==========================================
# 27. BIỂU ĐỒ THÀNH PHẦN KIẾN TRÚC (HÌNH 3.27)
# ==========================================
def gen_hinh_3_27():
    fig, ax = setup_canvas(11.5, 6.5)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    draw_boundary(ax, 0.03, 0.03, 0.94, 0.94, "Biểu Đồ Thành Phần Kiến Trúc Hệ Thống (Component Diagram)")
    
    def comp(x, y, name, details, w=0.23, h=0.22):
        rect = patches.Rectangle((x, y), w, h, edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(rect)
        # 2 port tabs on left
        p1 = patches.Rectangle((x - 0.012, y + h - 0.055), 0.024, 0.022, edgecolor='black', facecolor='white', lw=1.0, zorder=4)
        p2 = patches.Rectangle((x - 0.012, y + h - 0.095), 0.024, 0.022, edgecolor='black', facecolor='white', lw=1.0, zorder=4)
        ax.add_patch(p1); ax.add_patch(p2)
        ax.text(x + w/2, y + h - 0.035, f"<<component>>\n{name}", ha='center', va='center', fontsize=8.5, fontweight='bold', color='black', zorder=5)
        ax.text(x + w/2, y + 0.05, details, ha='center', va='center', fontsize=7.2, color='black', zorder=5)

    comp(0.05, 0.64, "Frontend SPA", "React 19 + TypeScript\nVite + Tailwind CSS\nCanvas UI & Lucide Icons", 0.23, 0.22)
    comp(0.385, 0.64, "API Gateway", "Express.js REST Engine\nJWT Auth & Masking\nRate Limiter & CORS", 0.23, 0.22)
    comp(0.72, 0.64, "Core Services", "Order & Inventory Service\nPayroll & Shift Service\nVoucher Engine", 0.23, 0.22)
    
    comp(0.05, 0.16, "VietQR Service", "Banking Webhook Listener\nDynamic QR Generator\nTransaction Reconcile", 0.23, 0.21)
    comp(0.385, 0.16, "Database Layer", "MongoDB Community Server\nMongoose ODM Models\nAtomic Transactions", 0.23, 0.21)
    comp(0.72, 0.16, "Storage / Assets", "Sneaker & Jersey Photos\nBaller Review Media\nAttendance Logs", 0.23, 0.21)
    
    # Connectors with generous margins
    draw_assoc(ax, 0.28, 0.75, 0.373, 0.75, arrow='->')
    ax.text(0.3265, 0.78, "HTTPS/JSON", ha='center', va='bottom', fontsize=7.5,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)
            
    draw_assoc(ax, 0.615, 0.75, 0.708, 0.75, arrow='->')
    ax.text(0.6615, 0.78, "Internal Call", ha='center', va='bottom', fontsize=7.5,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)
            
    draw_assoc(ax, 0.165, 0.64, 0.165, 0.37, label="Payment Intent", ls='--', arrow='->')
    draw_assoc(ax, 0.50, 0.64, 0.50, 0.37, label="Mongoose ODM", ls='-', arrow='->')
    draw_assoc(ax, 0.835, 0.64, 0.835, 0.37, label="Static Fetch", ls='--', arrow='->')

    save_bw(fig, "Hinh_3_27_Component_Diagram.png")

# ==========================================
# 28. BIỂU ĐỒ TRIỂN KHAI HỆ THỐNG (HÌNH 3.28)
# ==========================================
def gen_hinh_3_28():
    fig, ax = setup_canvas(11.5, 7.0)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    draw_boundary(ax, 0.03, 0.03, 0.94, 0.94, "Biểu Đồ Triển Khai Hệ Thống (Deployment Diagram)")
    
    def node_3d(x, y, w, h, name, desc=""):
        rect = patches.Rectangle((x, y), w, h, edgecolor='black', facecolor='white', lw=1.3, zorder=3)
        ax.add_patch(rect)
        # 3D isometric roof
        dx, dy = 0.016, 0.020
        roof = patches.Polygon([[x, y+h], [x+dx, y+h+dy], [x+w+dx, y+h+dy], [x+w, y+h]], edgecolor='black', facecolor='#F0F0F0', lw=1.2, zorder=2)
        side = patches.Polygon([[x+w, y], [x+w+dx, y+dy], [x+w+dx, y+h+dy], [x+w, y+h]], edgecolor='black', facecolor='#E0E0E0', lw=1.2, zorder=2)
        ax.add_patch(roof); ax.add_patch(side)
        ax.text(x + w/2, y + h - 0.035, f"<<device>>\n{name}", ha='center', va='center', fontsize=8.5, fontweight='bold', color='black', zorder=5)
        ax.text(x + w/2, y + 0.065, desc, ha='center', va='center', fontsize=7.2, color='black', zorder=5)

    node_3d(0.05, 0.52, 0.23, 0.36, "Client Device", "Web Browser (Chrome, Safari)\n<<artifact>>\nHoopZone React App (SPA)\nResponsive UI Components")
    node_3d(0.395, 0.52, 0.24, 0.36, "Application Server", "Node.js v20.x Runtime\n<<artifact>>\nExpress Server (Port 5000)\nAPI Gateway & Business Logic")
    node_3d(0.74, 0.52, 0.20, 0.36, "Database Server", "MongoDB 7.x Community\n<<artifact>>\nhoopzone_database\nCollections & B-Tree Indexes")
    
    node_3d(0.395, 0.08, 0.24, 0.28, "Payment Gateway Node", "VietQR Banking API\n<<artifact>>\nWebhook Listener (IPN)\nSecure HMAC Verification")
    
    # Deployment links with centered bboxes in generous gaps
    draw_assoc(ax, 0.296, 0.70, 0.395, 0.70, arrow='<->')
    ax.text(0.3455, 0.73, "TCP/IP (Port 5000)\nHTTPS / REST", ha='center', va='bottom', fontsize=7.2,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)
            
    draw_assoc(ax, 0.651, 0.70, 0.74, 0.70, arrow='<->')
    ax.text(0.6955, 0.73, "TCP/IP (27017)\nMongoDB", ha='center', va='bottom', fontsize=7.2,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)
            
    draw_assoc(ax, 0.515, 0.52, 0.515, 0.36, arrow='<->')
    ax.text(0.515, 0.44, "HTTPS Webhook\nCallback", ha='center', va='center', fontsize=7.2,
            bbox=dict(boxstyle='square,pad=0.12', fc='white', ec='none'), zorder=5)

    save_bw(fig, "Hinh_3_28_Deployment_Diagram.png")

print("Rendering all 28 B&W diagrams...")
gen_hinh_3_1()
gen_all_detail_usecases()
gen_hinh_3_14()
gen_hinh_3_15()
gen_hinh_3_16()
gen_hinh_3_17()
gen_hinh_3_18()
gen_hinh_3_19()
gen_hinh_3_20()
gen_hinh_3_21()
gen_hinh_3_22()
gen_hinh_3_23()
gen_hinh_3_24()
gen_hinh_3_25()
gen_hinh_3_26()
gen_hinh_3_27()
gen_hinh_3_28()
print("All 28 B&W UML Diagrams generated successfully!")
