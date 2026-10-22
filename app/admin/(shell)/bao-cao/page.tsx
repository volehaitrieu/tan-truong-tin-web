import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Báo cáo' };
export default async function Page() { await requireStaff("view_reports"); return <MockWorkspace view='bao-cao'/>; }


