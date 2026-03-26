import { AppHeader } from '@/components/layout/header';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={user} />
      <main className="flex flex-1 bg-muted/40 pt-24">{children}</main>
    </div>
  );
}