import { Metadata } from "next"
import { createServerSupabaseClient, getSession, getUser } from "@/src/lib/supabase-server"
import { SubmitReviewDialog } from "./SubmitReivewDialog";
import { DataTable } from "@/src/components/tables/DataTable";
import { columns } from "./columns";
import ogs from 'open-graph-scraper';
import { getRootDomain } from "@/src/lib/utils";
import Link from "next/link";
import HasPrivateKey from "../../my-org/HasPrivateKey";
import OrgprivateKeyInput from "../../my-org/OrgPasswordInput";
  
export const metadata: Metadata = {
  title: "DataEng.vc - Organizations",
}

export default async function ToolsPage(params: { params: { toolId: string }}) {
  const supabase = createServerSupabaseClient();
  const user = await getUser();

  if (!user) {
    return null
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
          <OrgprivateKeyInput>
            <SubmitReviewDialog toolId={tool.id} toolName={tool.name} />
          </OrgprivateKeyInput>
        </div>
        <HasPrivateKey
          hasReviews={true}
          hasReviewsFallback={<div>
            <span>You must add at least one rating before seeing others.</span>
            <DataTable data={[]} columns={columns} />
          </div>}
        >
          <DataTable data={tool.reviews ?? []} columns={columns} />
        </HasPrivateKey>
      </div>
    </>
  )
}
