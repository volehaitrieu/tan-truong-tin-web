import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Danh mục & thương hiệu' };
export default function Page(){ return <MockWorkspace view='danh-muc'/>; }


