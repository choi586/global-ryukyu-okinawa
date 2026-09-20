import { ja } from './ja';
export type Locale = 'ko' | 'ja';
export const translate = (locale: Locale, text: string): string => {
  if (locale === 'ko') return text;
  const key = text.trim();
  return ja[key] ? text.replace(key, ja[key]) : text;
};
export function localePath(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const path = href.replace(/^\/ja(?=\/|\?|#|$)/, '') || '/';
  if (/^\/(admin|api|images|_next)(\/|\?|#|$)/.test(path)) return path;
  return locale === 'ja' ? '/ja' + (path === '/' ? '' : path) : path;
}
