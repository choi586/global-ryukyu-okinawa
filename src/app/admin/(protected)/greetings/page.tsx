import { requireAdmin } from '@/lib/auth';
import { GreetingsEditor } from '@/components/greetings-editor';
export default async function Page() {
  await requireAdmin();
  return <GreetingsEditor />;
}
