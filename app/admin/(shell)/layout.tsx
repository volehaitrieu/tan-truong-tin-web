import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { MobileTabBar } from "@/components/admin/MobileTabBar";

export default function AdminShellLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin-frame flex min-h-dvh bg-ground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="admin-sheet min-h-[calc(100dvh-4rem)] flex-1 px-4 pb-[calc(env(safe-area-inset-bottom)+88px)] pt-5 md:mx-2 md:mb-2 md:rounded-2xl md:border md:border-line md:bg-white md:px-6 md:pb-8">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
