import { Metadata } from "next"
import { createServerSupabaseClient, getSession } from "@/src/lib/supabase-server"
import { SubmitReviewDialog } from "./SubmitReivewDialog";
import { DataTable } from "@/src/components/tables/DataTable";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "DataEng.vc - Organizations",
}

export default async function ToolsPage(params: { params: { toolId: string }}) {
  const supabase = createServerSupabaseClient();
  const session = await getSession();

  if (!session) {
    return null
  }

  const { data: user } = await supabase.from('users')
  .select('*, organizations!users_organization_id_fkey(*, users!users_organization_id_fkey(*))')
  .eq('id', session.user.id)
  .single()

console.log(user, session.user.id)

  if (!user || !user.organizations || !user.organization_id) {
    return null
  }


  const { data: tool } = await supabase.from('tools')
  .select('*, reviews (*)')
  .eq('id', params.params.toolId)
  .single()

  if (!tool) {
    return <div>No Tool Found</div>
  }
  
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{tool.name}</h2>
            <p className="text-muted-foreground">
              { tool.description }
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <div>
          <SubmitReviewDialog toolId={tool.id} orgId={user.organization_id} toolName={tool.name} />
        </div>
        <DataTable data={tool.reviews ?? []} columns={columns} />
      </div>

    </>
  )
}
