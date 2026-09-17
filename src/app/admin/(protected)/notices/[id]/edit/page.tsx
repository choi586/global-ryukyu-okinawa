import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getRecord } from '@/lib/store';
import type { Notice } from '@/lib/types';
import { NoticeEditor } from '@/components/notice-editor';
export default async function Edit({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const notice = await getRecord<Notice>('notices', (await params).id);
  if (!notice) notFound();
  return (
    <>
      <div className="editor-heading">
        <p className="eyebrow">EDIT NOTICE</p>
        <h1>공지사항 수정</h1>
      </div>
      <NoticeEditor notice={notice} />
    </>
  );
}
