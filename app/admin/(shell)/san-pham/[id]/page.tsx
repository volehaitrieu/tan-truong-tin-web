import type { Metadata } from "next";
import { ProductEditor } from "@/components/admin/MockWorkspace";
export const metadata: Metadata = { title: "Sửa sản phẩm" };
export default function Page(){ return <ProductEditor/>; }
