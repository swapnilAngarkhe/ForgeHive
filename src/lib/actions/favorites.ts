'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Toggles a tool's favorite status for the current authenticated user.
 * 
 * @param toolId - The unique ID of the tool to favorite/unfavorite
 * @returns An object indicating if the favorite was 'added', 'removed', or an error occurred.
 */
export async function toggleFavorite(toolId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Check if the tool is already in the user's favorites
  const { data: existing } = await supabase
    .from('favorites')
    .select('favorite_id')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .maybeSingle();

  if (existing) {
    //  Remove favorite if it already exists
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('favorite_id', existing.favorite_id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    revalidatePath('/tools');
    revalidatePath('/profile');
    return { status: 'removed' };
  } else {
    //  Add favorite if it doesn't exist
    const { error: insertError } = await supabase.from('favorites').insert({
      user_id: user.id,
      tool_id: toolId,
    });

    if (insertError) {
      return { error: insertError.message };
    }

    revalidatePath('/tools');
    revalidatePath('/profile');
    return { status: 'added' };
  }
}
