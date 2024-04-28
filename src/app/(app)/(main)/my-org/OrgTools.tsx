'use client';

import { DataTable } from "@/src/components/tables/DataTable";
import { signMessage } from "@/src/lib/browser-crypto";
import { Database } from "@/src/types_db";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useSupabase } from "@/src/components/Providers/SupabaseProvider";

export default function OrgTools({organization} : {organization: Database['public']['Tables']['organizations']['Row']}) {
  const [reviews, setReviews] = useState<(Database['public']['Tables']['reviews']['Row'] & { tool: Database['public']['Tables']['tools']['Row'] | null})[]>()
  const { supabase } = useSupabase();

  const getTools = async () => {
    if (organization.privacy_type === 'public') {
      const { data: toolsData } = await supabase.from('reviews')
      .select('*, tool: tools(*)')
      .eq('organization_id', organization.id)
      if (toolsData) {
        setReviews(toolsData);
      }
    } else {
      const privateKey = localStorage.getItem('private_key');
      if (privateKey) {
        const orgHash = await signMessage(privateKey, organization.id);
        if (orgHash) {
          const { data: toolsData } = await supabase.from('reviews')
          .select('*, tool: tools(*)')
          .eq('organization_hash', orgHash)
          if (toolsData) {
            setReviews(toolsData);
          }
        }  
      }    
    }
  }

  useEffect(() => {
    getTools();
  }, []);

      return (
        <DataTable data={reviews ?? []} columns={columns} filterLabel="tools" />
    )
  }
