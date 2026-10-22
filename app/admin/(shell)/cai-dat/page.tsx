import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Cài đặt' };
export default async function Page() { await requireStaff("settings"); return <MockWorkspace view='cai-dat'/>; }


