import { Metadata } from "next"
import { createServerSupabaseClient, getSession } from "@/src/lib/supabase-server"
import { SubmitReviewDialog } from "./SubmitReivewDialog";
import { DataTable } from "@/src/components/tables/DataTable";
import { columns } from "./columns";
import ogs from 'open-graph-scraper';
import { getRootDomain } from "@/src/lib/utils";
import Link from "next/link";
  
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
  .select('*, organizations!public_users_organization_id_fkey(*, users!public_users_organization_id_fkey(*))')
  .eq('id', session.user.id)
  .single()

  if (!user || !user.organizations || !user.organization_id) {
    return <div>No user found</div>
  }

  const { data: tool } = await supabase.from('tools')
  .select('*, reviews (*)')
  .eq('id', params.params.toolId)
  .single()

  if (!tool) {
    return <div>No Tool Found</div>
  }
  
  // open-graph-scrape the website
  // let ogData = null;
  // if (tool.website) {
  //   const options = { url: tool.website };
  //   ogData = await ogs(options)
  //   console.log(ogData.result)
  // }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-2 md:p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="min-w-[70px] mt-2">
            <img src={tool.logo || `https://logo.clearbit.com/${getRootDomain(tool.website)}`} alt={tool.name} width={50} height={50} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">{tool.name}</h2>
            <p className="text-muted-foreground">
              { tool.description }
            </p>
            <p className="text-sm text-muted-foreground">
              <Link target={'_blank'} href={tool.website}>{ tool.website }</Link>
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <div>
          <SubmitReviewDialog toolId={tool.id} toolName={tool.name} />
        </div>
        <DataTable data={tool.reviews ?? []} columns={columns} />
      </div>
    </>
  )
}
