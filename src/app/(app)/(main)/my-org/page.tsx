import { Metadata } from "next"
import { createServerSupabaseClient, getSession } from "@/src/lib/supabase-server"
import { redirect } from "next/navigation"
import OrgPasswordInput from "./OrgPasswordInput"
import OrgTools from "./OrgTools"

export const metadata: Metadata = {
  title: "DataEng.vc - My Organization",
}

export default async function OrgsPage() {
  const supabase = createServerSupabaseClient();
  const session = await getSession();

  if (!session) {
    return redirect('/sign-in');
  }

  const { data } = await supabase.from('users')
  .select('*, organization:organizations!public_users_organization_id_fkey(*, users!public_users_organization_id_fkey(*))')
  .eq('id', session.user.id)
  .single()

  if (!data || !data.organization) {
    return <div>No Org Found</div>
  }
  

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="min-w-[70px] mt-2">
            <img src={`https://logo.clearbit.com/${data.organization?.domain}`} alt={data.organization?.name ?? ''} width={50} height={50} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">{data.organization?.name}</h2>
            <p className="text-muted-foreground">
              
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <div>
          Team:
          <div>
            {data.organization?.users.map((user) => (<div key={user.id}>{user.name} ({user.email})</div>))}
          </div>
        </div>
        <OrgPasswordInput />
        {data.organization_id && <OrgTools organizationId={data.organization_id} />}
      </div>
    </>
  )
}
