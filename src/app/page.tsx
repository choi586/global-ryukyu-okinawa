export const metadata = { alternates: { canonical: '/', languages: { ko: '/', ja: '/ja' } } };
import View from '@/views/home';
export const dynamic = 'force-dynamic';
export default function Page() {
  return <View />;
}
