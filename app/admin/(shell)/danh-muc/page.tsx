import { requireStaff } from "@/lib/auth";
import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Danh mục & thương hiệu' };
export default async function Page() { await requireStaff("edit_products"); return <MockWorkspace view='danh-muc'/>; }


