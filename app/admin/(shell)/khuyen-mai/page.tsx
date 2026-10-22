import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Khuyến mãi' };
export default function Page(){ return <MockWorkspace view='khuyen-mai'/>; }


