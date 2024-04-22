'use server'
import 'server-only'

import { savePublicKeySchema } from './validation'
import { createService } from '../service'
import { createServiceSupabaseClient } from '@/src/lib/supabase-server'

export const { handler, action } = createService(
    savePublicKeySchema,
    async ({ orgId, publicKey }) => {
      const supabaseService = createServiceSupabaseClient();

      const { data: org } = await supabaseService.from("organizations").select("*").eq('id', orgId).single();
      if (org) {
        if (!org.public_key) {
          await supabaseService.from("organizations").update({ public_key: publicKey }).eq("id", orgId);
          return { success: true };
        } else {
          return new Error("Public key already exists");
        }
      } else {
        return new Error("Organization not found");      
      }
    }
)
