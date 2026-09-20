'use client';
import { createContext, useContext } from 'react';
import { translate, type Locale } from './config';
const Context = createContext<Locale>('ko');
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <Context.Provider value={locale}>{children}</Context.Provider>;
}
export function useLanguage() {
  const locale = useContext(Context);
  return { locale, t: (text: string) => translate(locale, text) };
}
