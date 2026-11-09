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

// Kiểm thử phí/biên nhận thuần, không kết nối DB hay tạo đơn.
test('Phí giao hàng 15k dưới 500k, miễn phí từ 500k; nhận tại shop miễn phí; chưa bật giữ luật cũ', async () => {
  const { shippingFee, FLAT_SHIPPING_POLICY: policy } = await import('../lib/shipping.ts');
  for (const subtotal of [1, 305000, 499999, 500000, 10000000]) {
    assert.equal(shippingFee('inner', subtotal, policy, 20000, 500000), subtotal >= 500000 ? 0 : 15000);
    assert.equal(shippingFee('province', subtotal, policy, 20000, 500000), subtotal >= 500000 ? 0 : 15000);
    assert.equal(shippingFee('pickup', subtotal, policy, 20000, 500000), 0);
  }
  assert.equal(shippingFee('inner', 305000, undefined, 20000, 500000), 20000);
  assert.equal(shippingFee('inner', 500000, undefined, 20000, 500000), 0);
  assert.equal(shippingFee('province', 305000, undefined, 20000, 500000), null);
});
test('Biên nhận và QR cộng phí server, không áp 15k hồi tố cho đơn cũ', async () => {
  const { receiptAmounts } = await import('../lib/shipping.ts');
  const a = receiptAmounts(305000, 'province', 15000);
  assert.equal(a.total, 320000);
  assert.equal(a.shippingPending, false);
  assert.ok(vietQrPayload(bank, a.total, 'TTT001064').includes('5406320000'));
  assert.equal(receiptAmounts(305000, 'inner', 20000).total, 325000);
  assert.equal(receiptAmounts(610000, 'inner', 0).total, 610000);
  assert.equal(receiptAmounts(305000, 'pickup').shippingFee, 0);
  assert.equal(receiptAmounts(305000, 'province').shippingPending, true);
  assert.equal(receiptAmounts(305000, 'inner', null).total, 305000);
});

test('Webhook SePay: HMAC raw body đúng, sai chữ ký hoặc timestamp cũ đều bị từ chối', async () => {
  const { createHmac } = await import('node:crypto');
  const { parseSePayTransaction, verifySePaySignature } = await import('../lib/sepay-webhook.ts');
  const secret = 'test-only-secret';
  const rawBody = '{"id":123,"content":"TTT001064","transferAmount":320000}';
  const timestamp = '1794230400';
  const signature = 'sha256=' + createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  const nowMs = Number(timestamp) * 1000;
  assert.equal(verifySePaySignature({ rawBody, timestamp, signature, secret, nowMs }), true);
  assert.equal(verifySePaySignature({ rawBody: rawBody + ' ', timestamp, signature, secret, nowMs }), false);
  assert.equal(verifySePaySignature({ rawBody, timestamp, signature: 'sha256=' + '0'.repeat(64), secret, nowMs }), false);
  assert.equal(verifySePaySignature({ rawBody, timestamp: String(Number(timestamp) - 301), signature, secret, nowMs }), false);
  assert.equal(verifySePaySignature({ rawBody, timestamp, signature, secret: '', nowMs }), false);
});

test('Webhook SePay: chỉ nhận dữ liệu giao dịch có kiểu và số tiền hợp lệ', async () => {
  const { parseSePayTransaction } = await import('../lib/sepay-webhook.ts');
  assert.deepEqual(parseSePayTransaction({ id: 123, accountNumber: '0123456789', transferAmount: 320000, transferType: 'in', content: 'TTT001064' }), {
    id: '123', accountNumber: '0123456789', transferAmount: 320000, transferType: 'in', code: null, content: 'TTT001064',
  });
  for (const bad of [null, [], {}, { id: 'x', accountNumber: 'abc', transferAmount: 1, transferType: 'in' },
    { id: 'x', accountNumber: '0123456789', transferAmount: 1.5, transferType: 'in' },
    { id: 'x', accountNumber: '0123456789', transferAmount: -1, transferType: 'in' },
    { id: 'x', accountNumber: '0123456789', transferAmount: 100, transferType: 'refund' }]) {
    assert.equal(parseSePayTransaction(bad), null);
  }
});
