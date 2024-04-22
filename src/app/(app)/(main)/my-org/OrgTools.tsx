'use client';

import { DataTable } from "@/src/components/tables/DataTable";
import { signMessage } from "@/src/lib/browser-crypto";
import { Database } from "@/src/types_db";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useSupabase } from "@/src/components/Providers/SupabaseProvider";

export default function OrgTools({organizationId} : {organizationId: string}) {
  const [reviews, setReviews] = useState<(Database['public']['Tables']['reviews']['Row'] & { tool: Database['public']['Tables']['tools']['Row'] | null})[]>()
  const [shouldLoad, setShouldLoad] = useState(false)
  const { supabase } = useSupabase();

  const getTools = async () => {
    const privateKey = localStorage.getItem('private_key');
    if (privateKey) {
      setShouldLoad(true)
      const orgHash = await signMessage(privateKey, organizationId);
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

  useEffect(() => {
    getTools();
  }, []);

      return (
        shouldLoad && (<DataTable data={reviews ?? []} columns={columns} filterLabel="tools" /> )
    )
  }
