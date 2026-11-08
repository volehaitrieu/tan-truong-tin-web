import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addSku, buildSpecRows, compareHref, hasSku, isMissing, mixedKinds, normalizeSkus, parseSkuParam, parseStored, removeSku, serializeStored } from '../lib/compare.ts';

// Chỉ kiểm hàm thuần: không đọc DB, không dùng khóa.
const P = (sku, specs, cat = 'quat', sub = 'Quạt') => ({ sku, cat, sub, specs });

test('SKU: độ dài 2/42 hợp lệ, 1/43 và ký tự lạ bị bỏ', () => {
  assert.deepEqual(normalizeSkus(['AB', 'A', 'a'.repeat(42), 'a'.repeat(43), 'A B', 'A;B', 'A,B', '', null, 5, {}]), ['AB', 'a'.repeat(42)]);
  assert.deepEqual(normalizeSkus('AB'), []);
  assert.deepEqual(normalizeSkus(null), []);
});

test('Bỏ trùng không phân biệt hoa/thường, giữ thứ tự, tối đa 3', () => {
  assert.deepEqual(normalizeSkus(['ab1', 'AB1', 'CD2', 'EF3', 'GH4']), ['ab1', 'CD2', 'EF3']);
});

test('Thêm/bỏ: không nhân đôi, món thứ tư không đổi danh sách, bỏ món lạ không lỗi, không sửa mảng đầu vào', () => {
  const input = ['AB1', 'CD2', 'EF3'];
  const snapshot = [...input];
  assert.equal(addSku(input, 'ab1').status, 'exists');
  const full = addSku(input, 'GH4');
  assert.equal(full.status, 'full');
  assert.deepEqual(full.list, snapshot);
  assert.equal(addSku([], 'x y').status, 'invalid');
  assert.deepEqual(addSku(['AB1'], 'CD2'), { list: ['AB1', 'CD2'], status: 'added' });
  assert.deepEqual(removeSku(input, 'zz9'), snapshot);
  assert.deepEqual(removeSku(input, 'cd2'), ['AB1', 'EF3']);
  assert.deepEqual(removeSku(input, 'AB1').length, 2);
  assert.deepEqual(input, snapshot);
  assert.ok(hasSku(input, 'ef3'));
});

test('Bộ nhớ: JSON hỏng, null, sai cấu trúc, phiên bản lạ, SKU rác/quá giới hạn', () => {
  assert.deepEqual(parseStored(null), []);
  assert.deepEqual(parseStored('{hỏng'), []);
  assert.deepEqual(parseStored('null'), []);
  assert.deepEqual(parseStored('[]'), []);
  assert.deepEqual(parseStored('{"version":2,"skus":["AB1"]}'), []);
  assert.deepEqual(parseStored('{"version":1,"skus":"AB1"}'), []);
  assert.deepEqual(parseStored('{"version":1,"skus":["AB1","<x>","CD2","EF3","GH4"]}'), ['AB1', 'CD2', 'EF3']);
  assert.deepEqual(parseStored(serializeStored(['AB1', 'CD2'])), ['AB1', 'CD2']);
});

test('URL: ?sku= chấp nhận dấu phẩy, tham số lặp, chuẩn hóa; liên kết dựng lại đúng', () => {
  assert.deepEqual(parseSkuParam('AB1,CD2'), ['AB1', 'CD2']);
  assert.deepEqual(parseSkuParam(['AB1', 'ab1,CD2', 'EF3,GH4']), ['AB1', 'CD2', 'EF3']);
  assert.deepEqual(parseSkuParam(undefined), []);
  assert.deepEqual(parseSkuParam('a b,%3Cscript%3E,AB1'), ['AB1']);
  assert.equal(compareHref(['AB1', 'CD2']), '/so-sanh?sku=AB1,CD2');
  assert.equal(compareHref([]), '/so-sanh');
});

test('Thiếu dữ liệu: rỗng, "Đang cập nhật", "-" là thiếu; có chữ thì không', () => {
  for (const v of ['', '  ', '-', '—', 'Đang cập nhật', 'đang  cập nhật', 'Chưa rõ', undefined]) assert.ok(isMissing(v), String(v));
  // "Việt Nam" vs "Chưa rõ" không phải một điểm khác nhau (dữ liệu thật có giá trị "Chưa rõ")
  assert.equal(buildSpecRows([P('A', [['Xuất xứ', 'Việt Nam']]), P('B', [['Xuất xứ', 'Chưa rõ']])])[0].differs, false);
  assert.ok(!isMissing('40W'));
  assert.ok(!isMissing('0'));
});

test('Khác nhau: 40W/45W/thiếu là khác; 40W/thiếu/thiếu chưa đủ căn cứ; hai giá trị bằng nhau thì không khác', () => {
  const rows = buildSpecRows([
    P('A', [['Công suất', '40W'], ['Màu', 'Trắng'], ['Số cánh', '3']]),
    P('B', [['Công suất', '45W'], ['Màu', 'trắng '], ['Số cánh', 'Đang cập nhật']]),
    P('C', [['Số cánh', '5']]),
  ]);
  const by = Object.fromEntries(rows.map((r) => [r.label, r]));
  assert.equal(by['Công suất'].differs, true);
  assert.deepEqual(by['Công suất'].cells, [['40W'], ['45W'], null]);
  assert.equal(by['Màu'].differs, false);
  assert.equal(by['Số cánh'].differs, true);
  const one = buildSpecRows([P('A', [['Công suất', '40W']]), P('B', []), P('C', [])]);
  assert.equal(one[0].differs, false);
});

test('Không suy diễn: không bỏ dấu, không đổi đơn vị, không gộp "Xuất xứ" với "Sản xuất tại"', () => {
  const rows = buildSpecRows([P('A', [['Công suất', '0,04kW'], ['Xuất xứ', 'Việt Nam']]), P('B', [['Công suất', '40W'], ['Sản xuất tại', 'Việt Nam']])]);
  assert.equal(rows.find((r) => r.label === 'Công suất').differs, true);
  assert.ok(rows.find((r) => r.label === 'Xuất xứ'));
  assert.ok(rows.find((r) => r.label === 'Sản xuất tại'));
  const accent = buildSpecRows([P('A', [['Màu', 'Đỏ']]), P('B', [['Màu', 'Do']])]);
  assert.equal(accent[0].differs, true);
});

test('Nhãn trùng trong một sản phẩm: gom giá trị, bỏ giá trị lặp; nhãn đã có hàng riêng không lặp lại', () => {
  const rows = buildSpecRows([P('A', [['Điều khiển', 'Remote'], ['Điều khiển', 'remote'], ['Điều khiển', 'Nút nhấn'], ['Thương hiệu', 'X'], ['Bảo hành', '12 tháng'], ['Hẹn giờ', 'Có']]), P('B', [['Điều khiển', 'Remote'], ['Hẹn giờ', 'Không']])]);
  assert.deepEqual(rows.map((r) => r.label), ['Điều khiển']);
  assert.deepEqual(rows[0].cells[0], ['Remote', 'Nút nhấn']);
  assert.equal(rows[0].differs, true);
});

test('Thứ tự nhãn theo lần xuất hiện đầu tiên', () => {
  const rows = buildSpecRows([P('A', [['B', '1'], ['A', '1']]), P('B', [['C', '1'], ['A', '1']])]);
  assert.deepEqual(rows.map((r) => r.label), ['B', 'A', 'C']);
});

test('Khác loại: so cặp Danh mục + Danh mục con; thiếu Danh mục con thì không cảnh báo; trùng tên con khác cha thì cảnh báo', () => {
  assert.equal(mixedKinds([P('A', [], 'quat', 'Quạt'), P('B', [], 'quat', 'quạt')]), false);
  assert.equal(mixedKinds([P('A', [], 'quat', 'Quạt'), P('B', [], 'am', 'Ấm siêu tốc')]), true);
  assert.equal(mixedKinds([P('A', [], 'quat', 'Quạt'), P('B', [], 'quat', '')]), false);
  assert.equal(mixedKinds([P('A', [], 'dien', 'Khác'), P('B', [], 'nuoc', 'Khác')]), true);
  assert.equal(mixedKinds([P('A', [], 'quat', 'Quạt')]), false);
});
