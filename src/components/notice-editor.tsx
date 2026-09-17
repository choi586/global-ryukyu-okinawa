'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Notice } from '@/lib/types';
import { optimizeUpload } from '@/lib/optimize-upload';
export function NoticeEditor({ notice }: { notice?: Notice }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const retained = notice?.attachments.filter((f) => !removed.includes(f.id)) || [];
  async function remove() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/notices/${notice!.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      router.push('/admin?result=deleted');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : '삭제하지 못했습니다.');
      dialog.current?.close();
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form
        className="editor-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError('');
          const form = new FormData(event.currentTarget);
          try {
            const selected = form
              .getAll('files')
              .filter((value): value is File => value instanceof File && value.size > 0);
            form.delete('files');
            for (const file of selected) form.append('files', await optimizeUpload(file));
            const response = await fetch(notice ? `/api/notices/${notice.id}` : '/api/notices', {
              method: notice ? 'PUT' : 'POST',
              body: form,
            });
            const result = await response.json();
            if (!response.ok) throw Error(result.error);
            router.push('/admin?result=saved');
            router.refresh();
          } catch (error) {
            setError(error instanceof Error ? error.message : '저장하지 못했습니다.');
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="editor-main">
          <section className="editor-panel stack-form">
            <label>
              제목 <span className="required">필수</span>
              <input
                name="title"
                required
                maxLength={200}
                defaultValue={notice?.title}
                placeholder="공지사항 제목을 입력하세요"
              />
            </label>
            <label>
              본문 <span className="required">필수</span>
              <textarea
                name="body"
                required
                maxLength={50000}
                defaultValue={notice?.body}
                rows={15}
                placeholder="안내할 내용을 입력하세요. 줄바꿈은 그대로 반영됩니다."
              />
            </label>
            <p className="field-help">
              본문은 일반 텍스트로 저장됩니다. 이미지는 본문 아래에 표시됩니다.
            </p>
          </section>
          <section className="editor-panel stack-form">
            <h2>이미지 및 첨부파일</h2>
            <p className="field-help">
              JPG · PNG · WEBP · PDF / 사진 자동 최적화 / 최적화 후 새 파일 합계 3MB 이하 / 전체
              저장 한도 5GB / 글당 최대 10개
            </p>
            {retained.length > 0 && (
              <ul className="existing-files">
                {retained.map((file) => (
                  <li key={file.id}>
                    <input type="hidden" name="retain" value={file.id} />
                    <a href={`/api/files/${notice!.id}/${file.id}?download=1`}>{file.name}</a>
                    <button
                      type="button"
                      className="small-button"
                      onClick={() => setRemoved([...removed, file.id])}
                      aria-label={`${file.name} 첨부 제외`}
                    >
                      제외
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {removed.length > 0 && (
              <button type="button" className="text-link" onClick={() => setRemoved([])}>
                제외한 첨부파일 복원
              </button>
            )}
            <label className="upload-box">
              파일 선택
              <input
                type="file"
                name="files"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                multiple
                onChange={(event) => setFiles(Array.from(event.target.files || []))}
              />
            </label>
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="selected-file">
                <strong>{file.name}</strong>
                {file.type.startsWith('image/') && (
                  <label>
                    이미지 설명 <span className="required">필수</span>
                    <input
                      name={`alt-${i}`}
                      required
                      maxLength={300}
                      placeholder="이미지의 내용을 설명해주세요"
                    />
                  </label>
                )}
              </div>
            ))}
          </section>
        </div>
        <aside className="editor-sidebar">
          <section className="editor-panel stack-form">
            <h2>게시 설정</h2>
            <label>
              게시 영역
              <select name="category" defaultValue={notice?.category || 'news'}>
                <option value="news">NEWS · 공지·소식</option>
                <option value="activities">ACTIVITIES · 학술활동</option>
                <option value="publications">PUBLICATIONS · 연구·출판</option>
              </select>
            </label>
            <label>
              행사일·발행일 (선택)
              <input type="date" name="eventDate" defaultValue={notice?.eventDate || ''} />
            </label>
            <label>
              공개 상태
              <select name="status" defaultValue={notice?.status || 'draft'}>
                <option value="draft">초안 — 관리자만 열람</option>
                <option value="published">공개 — 누구나 열람</option>
              </select>
            </label>
            <label className="checkbox-label">
              <input name="pinned" type="checkbox" value="true" defaultChecked={notice?.pinned} />
              중요 공지로 상단 고정
            </label>
            <p className="field-help">공개 상태로 저장하면 선택한 영역에 반영됩니다.</p>
            <button className="button full-width" type="submit" disabled={busy}>
              {busy ? '처리 중…' : '저장하기'}
            </button>
            <Link className="button secondary full-width" href="/admin">
              목록으로
            </Link>
            {notice && (
              <button
                type="button"
                className="delete-button"
                disabled={busy}
                onClick={() => dialog.current?.showModal()}
              >
                공지사항 삭제
              </button>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </section>
        </aside>
      </form>
      <dialog ref={dialog} className="confirm-dialog" aria-labelledby="delete-title">
        <h2 id="delete-title">공지사항을 삭제할까요?</h2>
        <p className="delete-target">{notice?.title}</p>
        <p>삭제한 글과 첨부파일은 복구할 수 없습니다.</p>
        <div className="dialog-actions">
          <button
            className="button secondary"
            type="button"
            onClick={() => dialog.current?.close()}
            disabled={busy}
          >
            취소
          </button>
          <button className="button danger" type="button" onClick={remove} disabled={busy}>
            {busy ? '삭제 중…' : '삭제하기'}
          </button>
        </div>
      </dialog>
    </>
  );
}
