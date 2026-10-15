import Link from '@/components/localized-link';

// Render only explicit links; all other text remains escaped by React.
export function ArticleText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = /\[([^\]\n]{1,200})\]\((https?:\/\/[^\s)]+|\/(?!\/)[^\s)]*)\)/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const href = match[2];
    if (
      [...href].some(
        (char) =>
          char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 || char.charCodeAt(0) === 92,
      )
    )
      continue;
    if (!href.startsWith('/')) {
      try {
        const url = new URL(href);
        if (url.username || url.password) continue;
      } catch {
        continue;
      }
    }
    parts.push(text.slice(cursor, match.index));
    parts.push(
      <Link key={match.index} href={href}>
        {match[1]}
      </Link>,
    );
    cursor = match.index! + match[0].length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
