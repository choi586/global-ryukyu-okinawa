// Keep the existing 3 MiB upload limit. Bucket quota is 5 GB (decimal).
export const MAX_FILE_BYTES = 3 * 1024 * 1024;
export const MAX_BATCH_BYTES = 3 * 1024 * 1024;
export const MAX_STORAGE_BYTES = 5_000_000_000;
export class InputError extends Error {}
export const MAX_CAROUSEL_BATCH_BYTES = 15 * 1024 * 1024;
