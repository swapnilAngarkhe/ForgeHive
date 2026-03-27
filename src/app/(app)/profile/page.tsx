import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileClientPage } from './profile-client-page';

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('tool_id')
    .eq('user_id', user.id);

  const toolIds = favorites?.map((f) => f.tool_id) || [];

  let savedTools = [];
  if (toolIds.length > 0) {
    const { data } = await supabase
      .from('tools')
      .select('*, categories(category_name)')
      .in('id', toolIds);

    savedTools = data || [];
  }

  return (
    <ProfileClientPage 
      user={user}
      profile={profile}
      savedTools={savedTools}
    />
  );
}
