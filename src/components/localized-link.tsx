'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLanguage } from '@/i18n/provider';
import { localePath } from '@/i18n/config';
export default function LocalizedLink(props: ComponentProps<typeof Link>) {
  const { locale } = useLanguage();
  return (
    <Link
      {...props}
      href={typeof props.href === 'string' ? localePath(props.href, locale) : props.href}
    />
  );
}
