import { requireStaff } from "@/lib/auth";
import type { Metadata } from "next"; import { StockCount } from "@/components/admin/AdvancedScreens";
export const metadata:Metadata={title:"Đếm kho"}; export default async function Page() { await requireStaff("count_stock");return <StockCount/>;}
