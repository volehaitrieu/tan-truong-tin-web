import assert from 'node:assert/strict';
import { test } from 'node:test';
import { detectAndParse, TEMPLATE_COLUMNS } from '../lib/excel/parse-products.ts';

const parseStock = (qty, omit = false) => {
  const cells = {
    'Mã hàng hóa': 'TEST-01', 'Tên sản phẩm': 'Sản phẩm giả để kiểm thử',
    'Đơn vị tính': 'Cái', 'Giá bán': '123456', 'Tồn': qty,
    'Tồn tối thiểu': '3', 'Thông số': 'Thông số giả',
  };
  const headers = TEMPLATE_COLUMNS.filter(c => !omit || c !== 'Tồn');
  return detectAndParse({ SanPham: [[...headers], headers.map(c => cells[c] ?? '')] }, []).rows[0];
};

test('Tồn: số hợp lệ, số 0, trống và mẫu cũ không có cột Tồn', () => {
  for (const [value, expected] of [['5', 5], ['0', 0], ['100000', 100000], ['', null], ['  ', null]]) {
    const row = parseStock(value);
    assert.equal(row.qty, expected);
    assert.deepEqual(row.errors, []);
    assert.equal(row.minQty, 3);
    assert.equal(row.spec, 'Thông số giả');
  }
  assert.equal(parseStock('', true).qty, null);
});

test('Tồn: từ chối số lẻ, số âm, quá giới hạn và chữ; không làm tròn', () => {
  for (const value of ['1.5', '1,5', '-0.2', '-1', '100001', 'abc', 'Infinity']) {
    assert.ok(parseStock(value).errors.includes('Tồn phải là số nguyên từ 0 đến 100.000'), value);
    assert.equal(parseStock(value).raw?.['Tồn'], value);
  }
});

test('DMHH và mẫu quạt cũ vẫn đọc đúng, không tự gán tồn', () => {
  const dmhh = detectAndParse({ DMHH: [
    ['Mã hàng hóa', 'Tên hàng hóa', 'Đơn vị tính', 'Đơn giá'],
    ['TEST-DMHH', 'Quạt đứng giả', 'Cái', '234567'],
  ] }, []).rows[0];
  assert.equal(dmhh.price, 234567);
  assert.equal(dmhh.qty, undefined);
  assert.deepEqual(dmhh.errors, []);
  const fan = detectAndParse({ Import_SanPham: [
    ['SKU', 'Tên sản phẩm', 'Giá bán', 'Đơn vị'],
    ['TEST-FAN', 'Quạt đứng giả', '234', 'Cái'],
  ] }, []).rows[0];
  assert.equal(fan.price, 234000);
  assert.equal(fan.qty, undefined);
  assert.deepEqual(fan.errors, []);
});
