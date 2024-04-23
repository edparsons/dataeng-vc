import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '../types_db';

export const createServerSupabaseClient = () =>
  createServerComponentClient<Database>({ cookies });

export const createServiceSupabaseClient = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error('Missing env variables for Supabase');
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
};

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUser() {
  const supabase = createServerSupabaseClient();
  const session = await getSession();
  if (!session) {
    return { user: null, supabase, session };
  }
  const { data } = await supabase
    .from('users')
    .select('*, organization:organizations!users_organization_id_fkey(*)')
    .eq('id', session.user.id)
    .single();
  return { user: data, supabase, session };
}
