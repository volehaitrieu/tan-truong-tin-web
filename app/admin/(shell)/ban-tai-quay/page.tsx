import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Bán tại quầy' };
export default async function Page() { await requireStaff("pos_sale"); return <MockWorkspace view='ban-tai-quay'/>; }


