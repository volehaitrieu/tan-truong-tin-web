import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Sản phẩm' };
export default function Page(){ return <MockWorkspace view='san-pham'/>; }


