import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crc16, parseBank, transferNote, vietQrPayload } from '../lib/vietqr.ts';

// Số tài khoản giả, chỉ để kiểm thử.
const bank = { bin: '970436', account_no: '0123456789', account_name: 'TEST' };

test('CRC16-CCITT-FALSE đúng giá trị chuẩn', () => {
  assert.equal(crc16('123456789'), '29B1');
});

test('Mã VietQR: đúng khung, số tiền, nội dung và CRC khớp', () => {
  const p = vietQrPayload(bank, 305000, 'TTT001064');
  assert.ok(p.startsWith('000201010212'));
  assert.ok(p.includes('0006970436' + '01100123456789'));
  assert.ok(p.includes('A000000727'));
  assert.ok(p.includes('QRIBFTTA'));
  assert.ok(p.includes('5406305000'));
  assert.ok(p.includes('5303704') && p.includes('5802VN'));
  assert.ok(p.includes('0809TTT001064'));
  assert.equal(p.slice(-4), crc16(p.slice(0, -4)));
});

test('Không có số tiền thì dùng loại QR tĩnh', () => {
  const p = vietQrPayload(bank, 0, '');
  assert.ok(p.startsWith('000201010211'));
  assert.ok(p.includes('5303704' + '5802VN'), 'sau tiền tệ là quốc gia, không có thẻ số tiền');
});

test('Nội dung chuyển khoản chỉ giữ chữ/số', () => {
  assert.equal(transferNote('TTT-0010 64!'), 'TTT001064');
});

test('parseBank: sai hình dạng = chưa cài', () => {
  assert.equal(parseBank(null), null);
  assert.equal(parseBank({ bin: '12', account_no: '123' }), null);
  assert.equal(parseBank({ bin: '970436', account_no: 'abc' }), null);
  assert.deepEqual(parseBank({ bin: '970436', account_no: '0123456789', account_name: 'A' }), { bin: '970436', account_no: '0123456789', account_name: 'A' });
});
