'use client';
import { useEffect, useRef, useState } from 'react';
import type { Carousel, Slide } from '@/lib/carousel-types';
import { optimizeUpload } from '@/lib/optimize-upload';
type Editable = Omit<Slide, 'image'> & {
  image?: Slide['image'];
  alt: string;
  file?: File;
  preview?: string;
};
export function CarouselEditor({ initial }: { initial: Carousel }) {
  const [slides, setSlides] = useState<Editable[]>(
    initial.slides.map((s) => ({ ...s, alt: s.image.alt })),
  );
  const [revision, setRevision] = useState(initial.revision);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (removing && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [removing]);
  const published = slides.filter((s) => s.published).length;
  function patch(id: string, changes: Partial<Editable>) {
    setSaved(false);
    setSlides((items) => items.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }
  function move(index: number, delta: number) {
    setSaved(false);
    setSlides((items) => {
      const copy = [...items];
      [copy[index], copy[index + delta]] = [copy[index + delta], copy[index]];
      return copy;
    });
  }
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError('');
        setSaved(false);
        try {
          if (published > 5) throw new Error('메인에는 최대 5장까지 공개할 수 있습니다.');
          const form = new FormData();
          form.set(
            'config',
            JSON.stringify({
              revision,
              slides: slides.map(({ id, title, description, href, published, fit, alt }) => ({
                id,
                title,
                description,
                href,
                published,
                fit,
                alt,
              })),
            }),
          );
          for (const slide of slides)
            if (slide.file) form.append(`image-${slide.id}`, await optimizeUpload(slide.file));
          const response = await fetch('/api/carousel', { method: 'PUT', body: form });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          slides.forEach((s) => {
            if (s.preview) URL.revokeObjectURL(s.preview);
          });
          setSlides(result.slides.map((s: Slide) => ({ ...s, alt: s.image.alt })));
          setRevision(result.revision);
          setSaved(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : '저장하지 못했습니다.');
        } finally {
          setBusy(false);
        }
      }}
      className="carousel-editor"
    >
      <div className="carousel-editor-toolbar">
        <div>
          <strong>메인에 공개 중 {published} / 5장</strong>
          <p className="field-help">
            3~5장을 권장합니다. 사진을 추가하고 저장하면 메인에 반영됩니다.
          </p>
        </div>
        <button className="button" type="submit" disabled={busy}>
          {busy ? '사진 처리·저장 중…' : '캐러셀 저장하기'}
        </button>
      </div>
      {saved && (
        <p className="success-message" role="status">
          저장했습니다. 메인화면에 반영되었습니다.
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <fieldset disabled={busy} className="carousel-editor-fields">
        {slides.map((slide, index) => (
          <section
            className="carousel-edit-card"
            key={slide.id}
            aria-label={`${index + 1}번 사진 설정`}
          >
            <div className="carousel-edit-top">
              <strong>
                {index + 1}. {slide.title || '새 사진'}
              </strong>
              <div className="carousel-order">
                <button
                  className="small-button"
                  type="button"
                  disabled={index === 0}
                  aria-label={`${index + 1}번 사진 위로`}
                  onClick={() => move(index, -1)}
                >
                  ↑ 위로
                </button>
                <button
                  className="small-button"
                  type="button"
                  disabled={index === slides.length - 1}
                  aria-label={`${index + 1}번 사진 아래로`}
                  onClick={() => move(index, 1)}
                >
                  ↓ 아래로
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => setRemoving(slide.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="carousel-edit-grid">
              <div className="stack-form">
                <div className="carousel-image-preview">
                  {slide.preview || slide.image ? (
                    <img
                      src={slide.preview || `/api/carousel/${slide.image!.id}`}
                      alt={slide.alt || '선택한 사진 미리보기'}
                    />
                  ) : (
                    <span>사진이나 학술대회 포스터를 선택하세요.</span>
                  )}
                </div>
                <label>
                  사진 {slide.image ? '교체' : '추가'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required={!slide.image && !slide.file}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        if (slide.preview) URL.revokeObjectURL(slide.preview);
                        patch(slide.id, { file, preview: URL.createObjectURL(file) });
                      }
                    }}
                  />
                </label>
                <p className="field-help">
                  JPG · PNG · WEBP / 자동 최적화 / 최적화 후 한 장 최대 3MB · 한 번에 합계 15MB /
                  전체 저장 한도 5GB
                </p>
                <label>
                  사진 표시 방식
                  <select
                    value={slide.fit}
                    onChange={(e) => patch(slide.id, { fit: e.target.value as Slide['fit'] })}
                  >
                    <option value="contain">전체 보이기 — 포스터에 적합</option>
                    <option value="cover">화면 채우기 — 사진 일부가 잘릴 수 있음</option>
                  </select>
                </label>
              </div>
              <div className="stack-form">
                <label>
                  제목
                  <input
                    required
                    maxLength={140}
                    value={slide.title}
                    onChange={(e) => patch(slide.id, { title: e.target.value })}
                  />
                </label>
                <label>
                  짧은 설명
                  <textarea
                    maxLength={240}
                    rows={3}
                    value={slide.description}
                    onChange={(e) => patch(slide.id, { description: e.target.value })}
                  />
                </label>
                <label>
                  이미지 설명
                  <input
                    required
                    maxLength={300}
                    value={slide.alt}
                    onChange={(e) => patch(slide.id, { alt: e.target.value })}
                  />
                </label>
                <label>
                  연결할 링크 (선택)
                  <input
                    value={slide.href}
                    maxLength={2000}
                    placeholder="/activities/글주소 또는 https://…"
                    onChange={(e) => patch(slide.id, { href: e.target.value })}
                  />
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={slide.published}
                    onChange={(e) => patch(slide.id, { published: e.target.checked })}
                  />
                  메인에 공개
                </label>
              </div>
            </div>
          </section>
        ))}
        <button
          type="button"
          className="button secondary"
          disabled={slides.length >= 15}
          onClick={() => {
            setSaved(false);
            setSlides([
              ...slides,
              {
                id: crypto.randomUUID(),
                title: '',
                description: '',
                href: '',
                published: published < 5,
                fit: 'contain',
                alt: '',
              },
            ]);
          }}
        >
          ＋ 사진 추가
        </button>
      </fieldset>
      {removing && (
        <dialog
          ref={dialog}
          className="carousel-confirm"
          onCancel={() => setRemoving(null)}
          aria-labelledby="carousel-delete-title"
        >
          <div>
            <h2 id="carousel-delete-title">이 사진을 목록에서 삭제할까요?</h2>
            <p>‘캐러셀 저장하기’를 누르면 메인에서도 삭제됩니다.</p>
            <div className="dialog-actions">
              <button
                autoFocus
                type="button"
                className="button secondary"
                onClick={() => setRemoving(null)}
              >
                취소
              </button>
              <button
                type="button"
                className="button danger"
                onClick={() => {
                  const slide = slides.find((s) => s.id === removing);
                  if (slide?.preview) URL.revokeObjectURL(slide.preview);
                  setSlides(slides.filter((s) => s.id !== removing));
                  setRemoving(null);
                  setSaved(false);
                }}
              >
                사진 삭제
              </button>
            </div>
          </div>
        </dialog>
      )}
    </form>
  );
}
