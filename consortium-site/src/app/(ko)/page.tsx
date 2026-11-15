import { ConsortiumPage } from '@/components/consortium-page';
import { ko } from '@/content/ko';

export const dynamic = 'force-static';

export default function KoreanPage() {
  return <ConsortiumPage c={ko} />;
}
