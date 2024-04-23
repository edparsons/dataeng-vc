'use server'
import 'server-only'

import { savePublicKeySchema } from './validation'
import { createService } from '../service'
import { createServiceSupabaseClient, getSession } from '@/src/lib/supabase-server'

export const { handler, action } = createService(
    savePublicKeySchema,
    async ({ orgId, publicKey }) => {
      const supabaseService = createServiceSupabaseClient();
      const session = await getSession();

      if (!session) {
        throw new Error("Unauthorized");
      }

      const { data: org } = await supabaseService.from("organizations").select("*").eq('id', orgId).single();
      if (org) {
        if (!org.public_key) {
          await supabaseService.from("organizations").update({ public_key: publicKey, public_key_user: session.user.email }).eq("id", orgId);
          return { success: true };
        } else {
          throw new Error("Public key already exists");
        }
      } else {
        return new Error("Organization not found");      
      }
    }
)
