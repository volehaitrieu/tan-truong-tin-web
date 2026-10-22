import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Báo cáo' };
export default function Page(){ return <MockWorkspace view='bao-cao'/>; }


