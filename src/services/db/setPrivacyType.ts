'use server'
import 'server-only'

import { setPrivacyTypeSchema } from './validation'
import { createService } from '../service'
import { createServiceSupabaseClient, getSession } from '@/src/lib/supabase-server'

export const { handler, action } = createService(
    setPrivacyTypeSchema,
    async ({ orgId, privacyType }) => {
      const supabaseService = createServiceSupabaseClient();
      const session = await getSession();

      if (!session) {
        throw new Error("Unauthorized");
      }

      const { data: org } = await supabaseService.from("organizations").select("*").eq('id', orgId).single();
      if (org) {
        if (!org.privacy_type) {
          await supabaseService.from("organizations").update({ privacy_type: privacyType }).eq("id", orgId);
          return { success: true };
        } else {
          throw new Error("Privacy type already exists");
        }
      } else {
        return new Error("Organization not found");      
      }
    }
)
