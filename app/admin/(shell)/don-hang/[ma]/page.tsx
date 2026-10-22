import type { Metadata } from "next"; import { OrderDetail } from "@/components/admin/AdvancedScreens";
export const metadata:Metadata={title:"Chi tiết đơn hàng"}; export default function Page(){return <OrderDetail/>;}
