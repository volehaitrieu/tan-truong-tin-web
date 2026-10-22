import type { Metadata } from "next"; import { StockCount } from "@/components/admin/AdvancedScreens";
export const metadata:Metadata={title:"Đếm kho"}; export default function Page(){return <StockCount/>;}
