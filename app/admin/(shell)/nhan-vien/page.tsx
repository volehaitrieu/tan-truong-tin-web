import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Nhân viên & quyền' };
export default function Page(){ return <MockWorkspace view='nhan-vien'/>; }


