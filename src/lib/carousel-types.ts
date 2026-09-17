import type { Attachment } from './types';
export type Slide = {
  id: string;
  title: string;
  description: string;
  href: string;
  published: boolean;
  fit: 'cover' | 'contain';
  image: Attachment;
};
export type Carousel = { revision: number; slides: Slide[] };
