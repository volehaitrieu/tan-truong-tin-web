import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Nhật ký thao tác' };
export default function Page(){ return <MockWorkspace view='nhat-ky'/>; }


