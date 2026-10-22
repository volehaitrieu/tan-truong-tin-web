import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Nhân viên & quyền' };
export default async function Page() { await requireStaff("manage_staff"); return <MockWorkspace view='nhan-vien'/>; }


