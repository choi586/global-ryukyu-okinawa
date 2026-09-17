import { requireAdmin } from '@/lib/auth';
import { NoticeEditor } from '@/components/notice-editor';
export default async function NewNotice() {
  await requireAdmin();
  return (
    <>
      <div className="editor-heading">
        <p className="eyebrow">NEW NOTICE</p>
        <h1>새 공지 작성</h1>
      </div>
      <NoticeEditor />
    </>
  );
}
