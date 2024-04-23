'use client';

import type { Database } from '../../types_db';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
  authUser?: UserResponse['data']['user'];
  user?: Database['public']['Tables']['users']['Row'] & {organization?: Database['public']['Tables']['organizations']['Row']} | null;
  refresh: () => Promise<void>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createPagesBrowserClient<Database>());
  const router = useRouter();
  const [authUser, setAuthUser] = useState<UserResponse['data']['user']>();
  const [user, setUser] = useState<
    Database['public']['Tables']['users']['Row'] | null
  >();

  if (typeof window !== 'undefined') {
    (window as any).supabase = supabase;
  }

  const refresh = useCallback(async () => {
    const user = await supabase.auth.getUser();
    let userData = null
    setAuthUser(user.data.user);
    if (user.data.user) {
      const { data, error } = await supabase
        .from('users')
        .select('*, organization:organizations!public_users_organization_id_fkey(*)')
        .eq('id', user.data.user.id)
        .single();
      if (error) {
        console.error('Error getting user:', error);
        return;
      }
      const userIdenfity: Record<string, string> = {};
      if (data?.name) {
        userIdenfity.name = data.name;
      }
      if (user.data.user.email) {
        userIdenfity.email = user.data.user.email;
      }
      userData = data
      setUser(data);
    } else {
      setUser(null);
    }
    if (window.location.pathname === '/' && userData) {
      router.push('/tools');
    } else {
      router.refresh();
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');
  //   if (code) {
  //     console.log('Code found in URL:', code);
  //     supabase.auth.exchangeCodeForSession(code)
  //   }
  // }, []);

  const value = useMemo(
    () => ({
      supabase,
      authUser,
      user: user ?? null,
      refresh,
    }),
    [supabase, authUser, user, refresh],
  );

  return (
    <Context.Provider value={value}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};
