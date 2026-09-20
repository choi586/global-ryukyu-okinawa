import Detail, { generateMetadata as detailMetadata } from '@/views/detail';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export function generateMetadata(props: Props) {
  return detailMetadata(props);
}
export default function Page(props: Props) {
  return <Detail {...props} />;
}
