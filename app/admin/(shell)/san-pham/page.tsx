import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Sản phẩm' };
export default async function Page() { await requireStaff(); return <MockWorkspace view='san-pham'/>; }


