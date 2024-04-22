'use server'
import 'server-only'

import { upsertToolSchema } from './validation'
import { createService } from '../service'
import { createServiceSupabaseClient, getSession } from '@/src/lib/supabase-server'

export const { handler, action } = createService(
    upsertToolSchema,
    async (tool) => {
      const supabaseService = createServiceSupabaseClient();
      const session = await getSession();

      console.log('session', session)

      if (!session || !session.user) {
        throw new Error("No user");
      }
      
      // Upsert the review
      const { data: dbTool, error } = await supabaseService.from("tools").upsert(tool, {
        onConflict: 'website',
      }).select('*').single();

      console.log('tool', dbTool, error)

      return dbTool;
    }
)
