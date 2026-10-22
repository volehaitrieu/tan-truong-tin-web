import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Bán tại quầy' };
export default function Page(){ return <MockWorkspace view='ban-tai-quay'/>; }


