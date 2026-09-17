'use client';

// Resize before upload, keeping PDF files and small images unchanged.
export async function optimizeUpload(file: File): Promise<File> {
  if (file.size > 20_000_000) throw new Error('원본 파일은 20MB 이하로 선택해주세요.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size < 200_000)
    return file;

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('사진을 처리하지 못했습니다.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) => (value ? resolve(value) : reject(new Error('사진을 변환하지 못했습니다.'))),
        'image/webp',
        0.88,
      ),
    );
    if (scale === 1 && blob.size >= file.size) return file;
    const extension = blob.type === 'image/webp' ? 'webp' : 'png';
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.${extension}`, {
      type: blob.type,
    });
  } finally {
    bitmap.close();
  }
}
