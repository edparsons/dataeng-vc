'use server'
import 'server-only'

import { createSafeActionClient } from 'next-safe-action'
import { getUser } from '../lib/supabase-server'

export const action = createSafeActionClient()

export const authAction = createSafeActionClient({
    middleware: async () => {
      const { user, supabase } = await getUser();

        return {
            user,
            supabase,
        }
    },
})

