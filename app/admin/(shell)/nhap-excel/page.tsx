import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Nhập Excel' };
export default async function Page() { await requireStaff("import_excel"); return <MockWorkspace view='nhap-excel'/>; }


