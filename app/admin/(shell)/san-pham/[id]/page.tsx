import { requireStaff } from "@/lib/auth";
import type { Metadata } from "next";
import { ProductEditor } from "@/components/admin/MockWorkspace";
export const metadata: Metadata = { title: "Sửa sản phẩm" };
export default async function Page() { await requireStaff("edit_products"); return <ProductEditor/>; }
