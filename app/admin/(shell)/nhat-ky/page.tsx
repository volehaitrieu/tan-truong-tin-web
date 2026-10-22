import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Nhật ký thao tác' };
export default async function Page() { await requireStaff("view_audit"); return <MockWorkspace view='nhat-ky'/>; }


