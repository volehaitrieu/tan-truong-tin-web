import assert from 'node:assert/strict';
import { test } from 'node:test';
import { detectAndParse, splitClassifications, splitServiceLines, TEMPLATE_COLUMNS } from '../lib/excel/parse-products.ts';

// Dòng giả, không dùng dữ liệu thật. Danh mục con "quat" (cấp 2, cha là "gia-dung").
const subs = [{ slug: 'gia-dung', name: 'Gia dụng', parent: '', parent_id: null }, { slug: 'quat', name: 'Quạt', parent: 'Gia dụng', parent_id: 1 }];
const parse = (cells) => {
  const base = { 'Mã hàng hóa': 'TEST-01', 'Tên sản phẩm': 'Quạt giả để kiểm thử', 'Đơn vị tính': 'Cái', 'Giá bán': '500000', 'Danh mục con': 'Quạt', ...cells };
  return detectAndParse({ SanPham: [[...TEMPLATE_COLUMNS], TEMPLATE_COLUMNS.map((c) => base[c] ?? '')] }, [], subs).rows[0];
};

test('Phân loại: tách dấu ;, bỏ trùng, ô trống giữ nguyên', () => {
  assert.deepEqual(splitClassifications(' Quạt sàn ;  Quạt   công nghiệp; quạt sàn '), ['Quạt sàn', 'Quạt công nghiệp']);
  assert.equal(splitClassifications(''), null);
  assert.equal(splitClassifications('   '), null);
  assert.deepEqual(splitClassifications(' ; ;'), []);
  // Dấu phẩy không phải dấu phân cách (không tự đổi)
  assert.deepEqual(splitClassifications('Quạt sàn, Quạt công nghiệp'), ['Quạt sàn, Quạt công nghiệp']);
});

test('Phân loại: lỗi dòng khi chỉ có dấu ;, quá 20 loại, tên quá dài, thiếu Danh mục con', () => {
  assert.deepEqual(parse({ 'Phân loại': 'Quạt sàn; Quạt công nghiệp' }).errors, []);
  assert.deepEqual(parse({ 'Phân loại': '' }).classifications, null);
  assert.match(parse({ 'Phân loại': ';;' }).errors.join(), /không có tên nào/);
  assert.match(parse({ 'Phân loại': Array.from({ length: 21 }, (_, i) => `Loại ${i}`).join(';') }).errors.join(), /Tối đa 20/);
  assert.match(parse({ 'Phân loại': 'x'.repeat(81) }).errors.join(), /80 ký tự/);
  assert.match(parse({ 'Phân loại': 'Quạt sàn', 'Danh mục con': '' }).errors.join(), /Danh mục con/);
});

test('Thông số: tách Bảo hành / Xuất xứ / Sản xuất tại, giữ dòng Điều khiển', () => {
  const r = splitServiceLines('Công suất: 65W\nĐiều khiển: Núm vặn\nBảo hành: 12 tháng\nXuất xứ: Việt Nam\nSản xuất tại: Việt Nam');
  assert.equal(r.spec, 'Công suất: 65W\nĐiều khiển: Núm vặn');
  assert.deepEqual([r.warranty, r.origin, r.madeIn], ['12 tháng', 'Việt Nam', 'Việt Nam']);
});

test('Hướng dẫn sử dụng: đọc cột mới, ô trống = giữ nguyên, quá 3.000 ký tự báo lỗi', () => {
  const ok = parse({ 'Hướng dẫn sử dụng': '1. Lắp quạt\n2. Cắm điện' });
  assert.equal(ok.usageGuide, '1. Lắp quạt\n2. Cắm điện');
  assert.deepEqual(ok.errors, []);
  assert.equal(parse({ 'Hướng dẫn sử dụng': '' }).usageGuide, null);
  assert.match(parse({ 'Hướng dẫn sử dụng': 'x'.repeat(3001) }).errors.join(), /quá dài/);
});
