import { ConsortiumPage } from '@/components/consortium-page';
import { ja } from '@/content/ja';

export const dynamic = 'force-static';

export default function JapanesePage() {
  return <ConsortiumPage c={ja} />;
}
