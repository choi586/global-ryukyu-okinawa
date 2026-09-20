import 'server-only';
import { headers } from 'next/headers';
import type { Locale } from './config';
export async function requestLocale(): Promise<Locale> {
  return (await headers()).get('x-site-locale') === 'ja' ? 'ja' : 'ko';
}
