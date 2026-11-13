import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the actual server modules with isolated service doubles. No keys or DB writes.
function load(file, imports, globals = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, process: { env: {} }, FormData, ...globals, require: (name) => {
    if (!(name in imports)) throw new Error(`Unexpected dependency: ${name}`);
    return imports[name];
  } }, { filename: file });
  return exports;
}

test('Revoked staff permissions are checked again on the next request', async () => {
  let active = true;
  const db = {
    auth: { getClaims: async () => ({ data: { claims: { sub: 'staff-test' } } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { full_name: 'Test', role: 'order_staff', is_active: active } }) }) }) }),
    rpc: async () => ({ data: active ? [{ permission: 'manage_staff' }] : [] }),
  };
  const auth = load('lib/auth.ts', {
    'server-only': {}, react: { cache: (fn) => fn },
    'next/navigation': { redirect: () => { throw new Error('redirect'); } },
    '@/lib/supabase/server': { createClient: async () => db },
  });
  assert.equal((await auth.getStaff()).perms.has('manage_staff'), true);
  active = false;
  assert.equal(await auth.getStaff(), null);
});

function customerActions(db) {
  return load('app/(store)/tai-khoan/actions.ts', {
    '@supabase/supabase-js': {}, 'next/headers': { headers: async () => new Map([['origin', 'https://tantruongtin.com']]) }, 'next/cache': {},
    'next/navigation': { redirect: () => { throw new Error('redirect'); } },
    '@/lib/supabase/server': { createClient: async () => db },
    '@/lib/customer': { normalizePhone: (p) => /^0\d{9}$/.test(p) ? p : null, customerLoginEmail: (p) => `${p}@khach.tantruongtin.vn` },
    '@/lib/password-rule': { passwordProblem: () => '' },
    '@/lib/turnstile': { captchaOption: () => ({}), isCaptchaError: (e) => e?.code === 'captcha_failed', CAPTCHA_FAILED: 'captcha failed' },
  });
}

test('Invalid CAPTCHA cannot probe whether a customer phone/email exists', async () => {
  let probes = 0;
  const db = {
    rpc: () => { probes++; return { single: async () => ({ data: { phone_taken: true } }) }; },
    auth: { signUp: async () => ({ data: {}, error: { code: 'captcha_failed' } }) },
  };
  const form = new FormData();
  for (const [k, v] of Object.entries({ name: 'Audit Test', phone: '0900000000', email: 'audit@example.invalid', password: 'Example1234', password2: 'Example1234' })) form.set(k, v);
  const result = await customerActions(db).registerCustomer(form);
  assert.equal(probes, 0);
  assert.equal(result.error, 'captcha failed');
});

test('Disabled OAuth provider is rejected on server before calling provider', async () => {
  let calls = 0;
  const result = await customerActions({ auth: { signInWithOAuth: async () => { calls++; return { error: {}, data: {} }; } } }).oauthLogin('facebook');
  assert.equal(calls, 0);
  assert.ok(result.error);
});

test('Corrupt cart storage cannot crash add-to-cart', () => {
  const storage = new Map([['ttt-cart-v2', 'null']]);
  const cart = load('components/storefront/CartControls.tsx', {
    react: {}, 'react/jsx-runtime': {}, 'next/image': {}, 'next/link': {}, 'lucide-react': {},
    '@/app/(store)/actions': {}, '@/lib/shipping': {}, '@/lib/shop': {},
  }, { localStorage: { getItem: (k) => storage.get(k), setItem: (k, v) => storage.set(k, v) }, window: { dispatchEvent() {} }, Event });
  assert.doesNotThrow(() => cart.addToCart('VALID-SKU'));
  assert.deepEqual(JSON.parse(storage.get('ttt-cart-v2')), [{ sku: 'VALID-SKU', quantity: 1 }]);
});

test('Logout clears local favorites and ignores an older in-flight sync', async () => {
  const storage = new Map([['ttt-favorite-products', '["OLD-SKU"]']]);
  let finish;
  const pending = new Promise((resolve) => { finish = resolve; });
  const favorites = load('components/storefront/FavoriteButton.tsx', {
    react: { useEffect: (fn) => fn(), useState: () => [false, () => {}] },
    'react/jsx-runtime': { jsx: () => null, jsxs: () => null }, 'lucide-react': {},
    '@/app/(store)/yeu-thich-actions': { syncFavorites: () => pending },
  }, {
    localStorage: { getItem: (k) => storage.get(k), setItem: (k, v) => storage.set(k, v), removeItem: (k) => storage.delete(k) },
    document: { cookie: 'sb-test-auth-token=test' }, Event,
    window: { dispatchEvent() {}, addEventListener() {}, removeEventListener() {} },
  });
  favorites.FavoriteButton({ sku: 'OLD-SKU', name: 'Test' });
  assert.equal(typeof favorites.clearFavorites, 'function');
  favorites.clearFavorites();
  finish(['OLD-SKU']);
  await pending;
  await Promise.resolve();
  assert.deepEqual(JSON.parse(storage.get('ttt-favorite-products') ?? '[]'), []);
});

test('Failed CAPTCHA blocks submission instead of sending an empty token', () => {
  const captcha = load('components/TurnstileWidget.tsx', {
    react: { useState: (initial) => [initial === 'waiting' ? 'failed' : initial, () => {}], useCallback: (fn) => fn },
    'react/jsx-runtime': {}, 'next/script': {},
    '@/lib/turnstile': { TURNSTILE_SITE_KEY: 'test-public-site-key' },
  });
  const state = captcha.useCaptcha();
  assert.equal(state.waiting, false);
  assert.equal(state.blocked, true);
});

for (const kind of ['quote', 'lookup']) test(`${kind}: network failure shows an error and releases the submit button`, async () => {
  const states = kind === 'quote' ? ['Test item', '0900000000', {}, false, false] : ['TTT000000', '0900000000', '', null, false, 0];
  let index = 0;
  const jsx = (type, props) => ({ type, props });
  const mod = load(kind === 'quote' ? 'components/storefront/QuoteForm.tsx' : 'components/storefront/OrderLookup.tsx', {
    react: { useEffect() {}, useState: () => { const at = index++; return [states[at], (v) => { states[at] = v; }]; } },
    'react/jsx-runtime': { jsx, jsxs: jsx }, 'lucide-react': {},
    '@/components/storefront/OrderSteps': {}, '@/components/storefront/BankQr': {}, '@/lib/shop': {},
    '@/app/(store)/actions': { submitQuote: async () => { throw new Error('offline'); }, lookupOrder: async () => { throw new Error('offline'); } },
  });
  const tree = kind === 'quote' ? mod.QuoteForm({}) : mod.OrderLookup({});
  const form = kind === 'quote' ? tree : tree.props.children[0];
  await assert.doesNotReject(() => form.props.onSubmit({ preventDefault() {} }));
  assert.equal(states[4], false);
  assert.ok(kind === 'quote' ? states[2].phone : states[2]);
});
