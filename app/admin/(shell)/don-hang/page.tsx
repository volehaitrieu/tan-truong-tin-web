import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Đơn hàng' };
export default function Page(){ return <MockWorkspace view='don-hang'/>; }


