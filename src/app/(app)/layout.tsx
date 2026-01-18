import { AppHeader } from '@/components/layout/header';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={user} />
      <main className="flex flex-1 bg-muted/40">{children}</main>
    </div>
  );
}
