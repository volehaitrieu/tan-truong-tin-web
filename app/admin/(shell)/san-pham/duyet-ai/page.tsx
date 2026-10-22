import { requireStaff } from "@/lib/auth";
import type { Metadata } from "next"; import { AiReview } from "@/components/admin/AdvancedScreens";
export const metadata:Metadata={title:"Duyệt gợi ý AI"}; export default async function Page() { await requireStaff("edit_products");return <AiReview/>;}
