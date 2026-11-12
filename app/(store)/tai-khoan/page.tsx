import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, LogOut, MapPin, PackageCheck, UserRound } from "lucide-react";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { Product } from "@/lib/mock/store";
import { getCustomerSession } from "@/lib/customer";
import { logoutCustomer } from "@/app/(store)/tai-khoan/actions";
import { AddressForm, PasswordForm, ProfileForm } from "@/components/storefront/AccountForms";
import { OrderHistory, type HistoryOrder } from "@/components/storefront/OrderHistory";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tài khoản khách hàng" };
export const dynamic = "force-dynamic";

const card = "rounded-md border border-line bg-white p-5 sm:p-6";

export default async function CustomerAccountPage({ searchParams }: { searchParams: Promise<{ "email-trung"?: string }> }) {
  const session = await getCustomerSession();
  const emailTaken = (await searchParams)["email-trung"] === "1";
  let orders: HistoryOrder[] = [];
  let favorites: Product[] = [];
  if (session.kind === "customer" && session.customer) {
    const db = await createClient();
    const [{ data }, { data: favs }, products] = await Promise.all([
      db.rpc("customer_orders"),
      db.from("customer_favorites").select("products(sku)").eq("customer_id", session.customer.id),
      getProducts(),
    ]);
    orders = Array.isArray(data) ? (data as HistoryOrder[]) : [];
    const skus = new Set((favs ?? []).flatMap((r) => { const p = r.products as unknown as { sku: string } | null; return p ? [p.sku] : []; }));
    favorites = products.filter((p) => skus.has(p.sku));
  }
  return (
    <div className="mx-auto max-w-4xl">
      <div hidden data-theme-v2 />
      <p className="text-sm font-semibold text-brand">Khu vực khách hàng</p>
      <h1 className="mt-1 text-[28px] font-extrabold sm:text-[34px]">Tài khoản của bạn</h1>

      {session.kind === "guest" && (
        <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_300px]">
          <section className={card} aria-labelledby="account-login-title">
            <div className="grid size-12 place-items-center rounded-md bg-brand-tint text-brand"><UserRound className="size-6" aria-hidden /></div>
            <h2 id="account-login-title" className="mt-4 text-xl font-bold">Đăng nhập hoặc tạo tài khoản</h2>
            <p className="mt-2 text-sm leading-6 text-ink-2">Lưu thông tin để đặt hàng nhanh hơn. Bạn vẫn đặt hàng và tra cứu đơn được khi không có tài khoản.</p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link href="/tai-khoan/dang-nhap" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B6972] px-6 font-semibold text-white hover:bg-[#07545C]">Đăng nhập <ArrowRight className="size-4" aria-hidden /></Link>
              <Link href="/tai-khoan/dang-ky" className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white px-6 font-semibold text-ink hover:bg-sunk">Tạo tài khoản mới</Link>
            </div>
          </section>
          <Side />
        </div>
      )}

      {session.kind === "staff" && (
        <section className={`${card} mt-6`}>
          <p>Bạn đang đăng nhập bằng tài khoản nhân viên. Tài khoản nhân viên không dùng khu vực khách hàng.</p>
          <Link href="/admin" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand underline">Về trang quản trị</Link>
        </section>
      )}

      {session.kind === "customer" && (
        <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <section className={card} aria-labelledby="profile-title">
              <h2 id="profile-title" className="text-lg font-bold">{session.customer ? "Thông tin của bạn" : "Hoàn tất hồ sơ"}</h2>
              <dl className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] gap-y-2 text-sm">
                <dt className="text-ink-2">Số điện thoại</dt><dd className="num font-medium">{session.phone ?? <span className="font-normal text-ink-2">Chưa có</span>}</dd>
                <dt className="text-ink-2">Email</dt>
                <dd className="min-w-0 break-words">{session.customer?.email
                  ? <>{session.customer.email} {session.providerName && session.customer.email === session.providerEmail?.toLowerCase()
                      ? <span className="ml-1 inline-block rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-ok">Đã xác minh qua {session.providerName}</span>
                      : <span className="ml-1 inline-block rounded-full bg-[#fff4d6] px-2 py-0.5 text-xs font-semibold text-gold-ink">Chưa xác minh</span>}</>
                  : <span className="text-ink-2">Chưa có</span>}</dd>
              </dl>
              {emailTaken && !session.customer && <p role="alert" className="mt-3 text-sm text-danger">Email bạn nhập đã được sử dụng. Nhập email khác hoặc để trống.</p>}
              <div className="mt-4 border-t border-line pt-4">
                <ProfileForm name={session.customer?.full_name ?? ""} email={session.customer?.email ?? session.providerEmail ?? ""} complete={!session.customer} needPhone={!session.customer && !session.phoneLogin} />
              </div>
            </section>
            {session.customer && (
              <section className={card} aria-labelledby="orders-title">
                <h2 id="orders-title" className="flex items-center gap-2 text-lg font-bold"><PackageCheck className="size-5 text-brand" aria-hidden />Đơn hàng của bạn</h2>
                <div className="mt-3"><OrderHistory orders={orders} /></div>
              </section>
            )}
            {session.customer && (
              <section className={card} aria-labelledby="fav-title">
                <h2 id="fav-title" className="flex items-center gap-2 text-lg font-bold"><Heart className="size-5 text-brand" aria-hidden />Sản phẩm yêu thích</h2>
                {favorites.length === 0
                  ? <p className="mt-2 text-sm text-ink-2">Bấm hình trái tim trên sản phẩm để lưu vào đây.</p>
                  : <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{favorites.map((p) => <ProductCard key={p.sku} p={p} />)}</div>}
              </section>
            )}
            {session.customer && (
              <section className={card} aria-labelledby="addr-title">
                <h2 id="addr-title" className="flex items-center gap-2 text-lg font-bold"><MapPin className="size-5 text-brand" aria-hidden />Địa chỉ nhận hàng</h2>
                <p className="mt-1 text-sm text-ink-2">Tự điền khi bạn đặt hàng.</p>
                <div className="mt-3"><AddressForm province={session.customer.province ?? ""} ward={session.customer.ward ?? ""} street={session.customer.street ?? ""} /></div>
              </section>
            )}
            {session.customer && session.phoneLogin && (
              <section className={card} aria-labelledby="pw-title">
                <h2 id="pw-title" className="text-lg font-bold">Đổi mật khẩu</h2>
                <div className="mt-3"><PasswordForm /></div>
              </section>
            )}
            <form action={logoutCustomer}>
              <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 font-semibold text-ink hover:bg-sunk"><LogOut className="size-4" aria-hidden />Đăng xuất</button>
            </form>
          </div>
          <aside><Link href="/tra-cuu" className="flex min-h-11 items-center justify-center rounded-md border border-brand bg-white px-4 text-sm font-semibold text-brand hover:bg-brand-tint">Tra cứu đơn bằng mã</Link></aside>
        </div>
      )}
    </div>
  );
}

function Side() {
  return (
    <aside className="space-y-3">
      <div className="rounded-md border border-line bg-white p-4">
        <PackageCheck className="size-5 text-brand" aria-hidden />
        <h2 className="mt-2 font-semibold">Lịch sử đơn hàng</h2>
        <p className="mt-1 text-sm text-ink-2">Đăng nhập để xem các đơn bạn đã đặt.</p>
      </div>
      <div className="rounded-md border border-line bg-white p-4">
        <MapPin className="size-5 text-brand" aria-hidden />
        <h2 className="mt-2 font-semibold">Địa chỉ nhận hàng</h2>
        <p className="mt-1 text-sm text-ink-2">Lưu địa chỉ để đặt hàng nhanh hơn.</p>
      </div>
      <Link href="/tra-cuu" className="flex min-h-11 items-center justify-center rounded-md border border-brand bg-white px-4 text-sm font-semibold text-brand hover:bg-brand-tint">Tra cứu đơn hiện tại</Link>
    </aside>
  );
}
