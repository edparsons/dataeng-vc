import { Metadata } from "next"
import { createServerSupabaseClient } from "@/src/lib/supabase-server"
import OrganzationView from "./organization";

export const metadata: Metadata = {
  title: "DataEng.vc - Organizations",
}

export default async function ToolsPage(params: { params: { orgId: string }}) {
  const supabase = createServerSupabaseClient();

  const { data } = await supabase.from('organizations')
  .select('*, users (*)')
  .eq('id', params.params.orgId)
  .single()

  if (!data) {
    return <div>No Org Found</div>
  }
  
  return (
    <>
      <OrganzationView data={data} />
    </>
  )
}
