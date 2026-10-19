'use client';
import { useEffect, useState } from 'react';
import {
  defaultLaunchBanner,
  emptyGreetings,
  type Greetings,
  type Greeting,
} from '@/lib/greeting-types';
import { pdfPreview } from '@/lib/pdf-preview';
import { optimizeUpload } from '@/lib/optimize-upload';
export function GreetingsEditor() {
  const [data, setData] = useState<Greetings>(emptyGreetings),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [files, setFiles] = useState<Record<string, File>>({});
  useEffect(() => {
    fetch('/api/greetings?admin=1')
      .then(async (r) => {
        if (!r.ok) throw Error('불러오지 못했습니다. 다시 로그인해주세요.');
        return r.json();
      })
      .then((d) => {
        setData({ ...d, banner: d.banner ?? defaultLaunchBanner });
        setReady(true);
      })
      .catch((e) => setMessage(e.message));
  }, []);
  function update(id: string, patch: Partial<Greeting>) {
    setData((d) => ({ ...d, items: d.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  }
  function move(index: number, offset: number) {
    setData((d) => {
      const items = [...d.items];
      [items[index], items[index + offset]] = [items[index + offset], items[index]];
      return { ...d, items };
    });
  }
  function select(key: string, file: File | undefined) {
    setFiles((f) => {
      const next = { ...f };
      if (file) next[key] = file;
      else delete next[key];
      return next;
    });
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const form = new FormData();
      form.set('config', JSON.stringify(data));
      for (const [key, file] of Object.entries(files)) {
        if (
          key !== 'poster' &&
          !data.items.some(
            (i) => i.kind === 'pdf' && (key === 'document-' + i.id || key === 'preview-' + i.id),
          )
        )
          continue;
        form.set(key, await optimizeUpload(file));
      }
      for (const item of data.items) {
        if (item.kind !== 'pdf' || form.has('preview-' + item.id)) continue;
        const uploaded = form.get('document-' + item.id);
        if (!(uploaded instanceof File) && (item.preview || !item.document)) continue;
        setMessage(item.name + ' · PDF 미리보기를 만드는 중…');
        let pdf: File;
        if (uploaded instanceof File) pdf = uploaded;
        else {
          const response = await fetch('/api/greetings/' + item.document!.id);
          if (!response.ok) throw new Error(item.name + ' · PDF를 불러오지 못했습니다.');
          pdf = new File([await response.blob()], item.document!.name, { type: 'application/pdf' });
        }
        try {
          form.set('preview-' + item.id, await pdfPreview(pdf));
        } catch {
          throw new Error(
            item.name +
              ' · PDF 미리보기를 만들지 못했습니다. 암호가 없는 PDF로 다시 시도하거나 미리보기 이미지를 직접 선택해주세요.',
          );
        }
      }
      setMessage('파일을 저장하는 중…');
      const r = await fetch('/api/greetings', { method: 'PUT', body: form });
      const next = await r.json();
      if (!r.ok) throw Error(next.error);
      setData(next);
      setFiles({});
      setMessage('저장했습니다. 공개된 축사는 출범식 페이지에 바로 반영됩니다.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '저장하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <h1>출범식 축사 관리</h1>
      <p>
        위에서부터 표시됩니다. PDF 또는 유튜브 주소를 등록하고 공개 여부와 순서를 정한 뒤
        저장하세요.
      </p>
      <p>
        파일 하나와 한 번에 새로 올리는 파일의 합계는 3MB 이하입니다. 이미지는 업로드 전에 자동
        최적화됩니다.
      </p>
      <a href="/launch" target="_blank" rel="noopener noreferrer">
        출범식 페이지 보기 ↗
      </a>
      <p role="status">{message}</p>
      {ready && (
        <form onSubmit={save}>
          <fieldset disabled={busy} className="greeting-edit-fieldset">
            <section className="greeting-edit">
              <h2>메인 출범식 배너</h2>
              {(
                [
                  ['project', '사업명'],
                  ['title', '행사명'],
                  ['date', '날짜·시간'],
                  ['venue', '장소'],
                  ['href', '축하 메시지 링크'],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    required
                    maxLength={
                      key === 'href' ? 500 : key === 'project' ? 240 : key === 'venue' ? 160 : 100
                    }
                    value={(data.banner ?? defaultLaunchBanner)[key]}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        banner: { ...(d.banner ?? defaultLaunchBanner), [key]: e.target.value },
                      }))
                    }
                  />
                </label>
              ))}
            </section>
            <label>
              출범식 안내 이미지
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => select('poster', e.target.files?.[0])}
              />
            </label>
            {data.poster && (
              <a
                href={'/api/greetings/' + data.poster.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                현재 안내 이미지 보기
              </a>
            )}
            {data.items.map((item, index) => (
              <section className="greeting-edit" key={item.id}>
                <h2>
                  {index + 1}. {item.name || '새 축사'}
                </h2>
                <label>
                  성함
                  <input
                    required
                    maxLength={80}
                    value={item.name}
                    onChange={(e) => update(item.id, { name: e.target.value })}
                  />
                </label>
                <label>
                  소속 · 직함
                  <input
                    required
                    maxLength={200}
                    value={item.affiliation}
                    onChange={(e) => update(item.id, { affiliation: e.target.value })}
                  />
                </label>
                <label>
                  형식
                  <select
                    value={item.kind}
                    onChange={(e) => update(item.id, { kind: e.target.value as Greeting['kind'] })}
                  >
                    <option value="pdf">PDF 축사</option>
                    <option value="youtube">유튜브 영상</option>
                  </select>
                </label>
                {item.kind === 'pdf' ? (
                  <>
                    <label>
                      축사 PDF
                      {item.document && (
                        <a
                          href={'/api/greetings/' + item.document.id}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          현재 PDF 보기
                        </a>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => select('document-' + item.id, e.target.files?.[0])}
                      />
                    </label>
                    <label>
                      첫 페이지 미리보기 이미지 (직접 지정할 때만 선택)
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => select('preview-' + item.id, e.target.files?.[0])}
                      />
                      <span className="field-help">
                        선택하지 않으면 저장할 때 PDF 첫 페이지로 자동 생성합니다.
                      </span>
                    </label>
                  </>
                ) : (
                  <label>
                    유튜브 영상 주소
                    <input
                      type="url"
                      required
                      maxLength={500}
                      value={item.youtube}
                      onChange={(e) => update(item.id, { youtube: e.target.value })}
                    />
                  </label>
                )}
                <label className="greeting-publish">
                  <input
                    type="checkbox"
                    checked={item.published}
                    onChange={(e) => update(item.id, { published: e.target.checked })}
                  />{' '}
                  공개
                </label>
                <div className="greeting-edit-actions">
                  <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>
                    위로
                  </button>
                  <button
                    type="button"
                    disabled={index === data.items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    아래로
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('이 축사를 목록에서 삭제할까요? 저장하면 파일도 삭제됩니다.'))
                        setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== item.id) }));
                    }}
                  >
                    삭제
                  </button>
                </div>
              </section>
            ))}
            <div className="greeting-edit-actions">
              <button
                type="button"
                disabled={data.items.length >= 30}
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    items: [
                      ...d.items,
                      {
                        id: crypto.randomUUID(),
                        name: '',
                        affiliation: '',
                        kind: 'pdf',
                        youtube: '',
                        published: false,
                      },
                    ],
                  }))
                }
              >
                축사 추가
              </button>
              <button type="submit">{busy ? '저장 중…' : '전체 저장'}</button>
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
}
