'use client';
import { MAX_FILE_BYTES } from './upload-policy';

// Rendering happens only in the administrator's browser, never in Workers.
export async function pdfPreview(file: File): Promise<File> {
  if (file.size > MAX_FILE_BYTES) throw new Error('PDF 파일은 3MB 이하여야 합니다.');
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.mjs';
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    cMapUrl: '/vendor/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/vendor/pdfjs/standard_fonts/',
    wasmUrl: '/vendor/pdfjs/wasm/',
  });
  task.onPassword = () => {
    void task.destroy();
  };
  const canvas = document.createElement('canvas');
  try {
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const original = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({
      scale: Math.min(1000 / original.width, 1400 / original.height, 2),
    });
    canvas.width = Math.max(1, Math.ceil(viewport.width));
    canvas.height = Math.max(1, Math.ceil(viewport.height));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('미리보기 이미지를 만들 수 없습니다.');
    await page.render({ canvas, canvasContext: context, viewport, background: '#ffffff' }).promise;
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) => (value ? resolve(value) : reject(new Error('이미지 변환에 실패했습니다.'))),
        'image/webp',
        0.88,
      ),
    );
    if (blob.size > MAX_FILE_BYTES) throw new Error('미리보기 이미지 용량을 줄이지 못했습니다.');
    const name = file.name.toLowerCase().endsWith('.pdf') ? file.name.slice(0, -4) : file.name;
    return new File([blob], name + '-미리보기.webp', {
      type: blob.type,
    });
  } finally {
    await task.destroy();
    canvas.width = canvas.height = 0;
  }
}
