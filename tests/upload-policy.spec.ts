import { test, expect } from '@playwright/test';
import { DatabaseSync } from 'node:sqlite';
import { mediaSchema, reserveMediaSql } from '../src/lib/media-quota';
import { MAX_STORAGE_BYTES, MAX_FILE_BYTES } from '../src/lib/upload-policy';
import { uploadForm } from '../src/lib/upload-form';

test('quota fails closed, reserves before writes, counts pending files and releases after deletion', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(mediaSchema);
    const reserve = (id: string, bytes: number) =>
      db.prepare(reserveMediaSql).get(id, bytes, bytes, MAX_STORAGE_BYTES);
    expect(reserve('uninitialized', 1)).toBeUndefined();
    db.exec('INSERT INTO media_policy VALUES (1,1)');
    db.prepare('INSERT INTO media_usage VALUES (?,?)').run('existing', MAX_STORAGE_BYTES - 100);
    expect(reserve('too-large', 101)).toBeUndefined();
    expect(reserve('pending', 60)).toBeTruthy();
    expect(reserve('second-request', 41)).toBeUndefined();
    expect(reserve('exact-boundary', 40)).toBeTruthy();
    expect(reserve('over', 1)).toBeUndefined();
    expect(() => reserve('pending', 0)).toThrow();
    db.prepare('DELETE FROM media_usage WHERE id=?').run('pending');
    expect(reserve('replacement', 60)).toBeTruthy();
  } finally {
    db.close();
  }
});

test('multipart body is bounded even without Content-Length', async () => {
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      controller.enqueue(new Uint8Array(1_000_000));
    },
    cancel() {
      cancelled = true;
    },
  });
  const request = new Request('http://localhost/upload', {
    method: 'POST',
    body,
    duplex: 'half',
  } as RequestInit);
  await expect(uploadForm(request)).rejects.toThrow('총용량');
  expect(cancelled).toBe(true);
  expect(MAX_FILE_BYTES).toBe(3 * 1024 * 1024);
});
