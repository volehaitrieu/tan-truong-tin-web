import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Khuyến mãi' };
export default async function Page() { await requireStaff("edit_price"); return <MockWorkspace view='khuyen-mai'/>; }


