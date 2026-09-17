// Structural binding types keep the local Node test build independent of Wrangler.
export interface Statement {
  bind(...values: unknown[]): Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { changes: number } }>;
}
export interface Bindings {
  DB: { prepare(sql: string): Statement };
  MEDIA: {
    put(
      key: string,
      value: Uint8Array,
      options: { httpMetadata: { contentType: string } },
    ): Promise<unknown>;
    get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
    delete(key: string): Promise<void>;
  };
}
export async function cloudflareBindings(): Promise<Bindings | null> {
  if (process.env.STORAGE_DRIVER !== 'cloudflare') return null;
  const { env } = await import(/* webpackIgnore: true */ 'cloudflare:workers');
  const bindings = env as unknown as Bindings;
  if (!bindings.DB || !bindings.MEDIA)
    throw new Error('Cloudflare D1(DB)·R2(MEDIA) 연결이 필요합니다.');
  return bindings;
}
