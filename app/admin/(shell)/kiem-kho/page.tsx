import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Kiểm kho' };
export default function Page(){ return <MockWorkspace view='kiem-kho'/>; }


