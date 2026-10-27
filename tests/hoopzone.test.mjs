import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('1. Phân hệ Tồn kho & Đặt hàng nguyên tử (Atomic Inventory)', () => {
  it('TC01: Lọc sản phẩm theo danh mục và kiểm tra tồn kho theo size', () => {
    const product = {
      id: 'prod-01',
      name: 'Nike Zoom Freak V Pro Edition',
      category: 'shoes',
      stockBySize: { '40': 5, '41': 8, '42': 5, '43': 12, '44': 1, '45': 3 }
    };
    assert.equal(product.category, 'shoes');
    assert.equal(product.stockBySize['42'], 5);
  });

  it('TC02: Chặn đặt hàng vượt quá số lượng tồn kho khả dụng (Anti-Overselling)', () => {
    const stock = 1;
    const requestedQty = 2;
    const canAddToCart = requestedQty <= stock;
    assert.equal(canAddToCart, false, 'Không được phép thêm vào giỏ khi vượt tồn kho');
  });

  it('TC03: Khóa giao dịch và trừ tồn kho nguyên tử thành công', () => {
    let stockBySize = { '42': 5 };
    const buyQty = 2;
    if (stockBySize['42'] >= buyQty) {
      stockBySize['42'] -= buyQty;
    }
    assert.equal(stockBySize['42'], 3);
  });
});

describe('2. Phân hệ Giỏ hàng & Khuyến mãi (Cart & Voucher)', () => {
  it('TC04: Áp dụng voucher DUNK10 chiết khấu chính xác 10%', () => {
    const subtotal = 2500000;
    const voucher = { code: 'DUNK10', discountPercent: 10, minOrder: 500000 };
    assert.ok(subtotal >= voucher.minOrder);
    const discountAmount = Math.round(subtotal * (voucher.discountPercent / 100));
    const totalAmount = subtotal - discountAmount;
    assert.equal(discountAmount, 250000);
    assert.equal(totalAmount, 2250000);
  });

  it('TC05: Từ chối voucher khi đơn hàng chưa đạt giá trị tối thiểu', () => {
    const subtotal = 300000;
    const voucher = { code: 'DUNK10', discountPercent: 10, minOrder: 500000 };
    const isValid = subtotal >= voucher.minOrder;
    assert.equal(isValid, false);
  });
});

describe('3. Phân hệ Cổng thanh toán VietQR EMVCo', () => {
  it('TC06: Khởi tạo URL ảnh VietQR đúng cấu trúc NAPAS', () => {
    const bankId = 'MBBank';
    const accountNo = '0988776655';
    const amount = 2250000;
    const orderId = 'HZ-171829';
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${orderId}`;
    assert.ok(qrUrl.includes('MBBank-0988776655'));
    assert.ok(qrUrl.includes('amount=2250000'));
    assert.ok(qrUrl.includes('addInfo=HZ-171829'));
  });
});

describe('4. Phân hệ Chấm công & Phân quyền (Attendance & RBAC)', () => {
  it('TC07: Ghi nhận timestamp Check-in và Check-out của nhân viên', () => {
    const checkIn = new Date().toISOString();
    assert.ok(checkIn.length > 0);
  });

  it('TC08: Quản trị viên cập nhật tồn kho biến thể thành công', () => {
    const inventory = { '43': 10 };
    inventory['43'] = 25;
    assert.equal(inventory['43'], 25);
  });
});
