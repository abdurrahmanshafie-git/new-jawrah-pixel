import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function createUserNotification(params: {
  userId: string;
  title: string;
  body?: string;
}) {
  if (!isSupabaseConfigured || !params.userId) {
    return { data: null, error: null };
  }

  return supabase.from('notifications').insert({
    user_id: params.userId,
    title: params.title,
    body: params.body ?? null,
  });
}
