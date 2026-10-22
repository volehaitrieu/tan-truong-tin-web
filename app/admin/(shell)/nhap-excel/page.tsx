import type { Metadata } from 'next';
import { MockWorkspace } from '@/components/admin/MockWorkspace';
export const metadata: Metadata = { title: 'Nhập Excel' };
export default function Page(){ return <MockWorkspace view='nhap-excel'/>; }


