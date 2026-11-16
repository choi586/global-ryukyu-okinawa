/** Pulls the video id out of the usual YouTube address shapes. */
export function youtubeId(url: string): string | null {
  const match = url
    .trim()
    .match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
    );
  if (match) return match[1];
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}
