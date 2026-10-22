import { requireStaff } from "@/lib/auth";
import type { Metadata } from "next"; import { InfoImage } from "@/components/admin/AdvancedScreens";
export const metadata:Metadata={title:"Ảnh thông tin sản phẩm"}; export default async function Page() { await requireStaff();return <InfoImage/>;}
