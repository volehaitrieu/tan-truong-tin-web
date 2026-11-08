import assert from 'node:assert/strict';
import { test } from 'node:test';
import { orderMessage, quoteMessage } from '../lib/notify/messages.ts';

const base = { code: 'TTT-0001', name: 'Nguyễn Văn A', phone: '0900000000', delivery: 'inner', street: '1 Đường giả', ward: 'Phường giả', province: 'Khánh Hòa', note: 'Gọi trước', subtotal: 1250000, shippingFee: 20000, items: [{ name: 'Quạt đứng giả', qty: 2 }] };

test('Tin đơn mới: đủ thông tin, văn bản thuần', () => {
  const t = orderMessage(base);
  for (const part of ['ĐƠN MỚI TTT-0001', 'Nguyễn Văn A · 0900000000', 'Giao nội thành Nha Trang', '- 2 × Quạt đứng giả', 'Ghi chú: Gọi trước']) assert.ok(t.includes(part), part);
  assert.ok(t.includes('1.250.000'));
});

test('Tên/ghi chú độc hại hay xuống dòng không phá cấu trúc, không chèn liên kết định dạng', () => {
  const t = orderMessage({ ...base, name: 'A\n\nĐƠN MỚI GIẢ <b>x</b>', note: 'x\u0000y'.repeat(500), items: Array.from({ length: 40 }, (_, i) => ({ name: `Món ${i}`, qty: 1 })) });
  assert.equal(t.split('\n').filter((l) => l.startsWith('ĐƠN MỚI')).length, 1);
  assert.ok(t.length < 4096);
  assert.ok(t.includes('… và 10 món khác'));
});

test('Phí ship chưa có hiện "báo sau"; báo giá có SĐT và nội dung', () => {
  assert.ok(orderMessage({ ...base, shippingFee: null }).includes('Phí ship: báo sau'));
  const q = quoteMessage('10 ống PVC', '0911111111');
  assert.ok(q.includes('YÊU CẦU BÁO GIÁ') && q.includes('0911111111') && q.includes('10 ống PVC'));
});
