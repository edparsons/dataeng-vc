import { Metadata } from "next"
import { createServerSupabaseClient, getSession } from "@/src/lib/supabase-server"
import { redirect } from "next/navigation"
import OrgPasswordInput from "./OrgPasswordInput"
import OrgTools from "./OrgTools"

export const metadata: Metadata = {
  title: "Organizations",
}

export default async function OrgsPage() {
  const supabase = createServerSupabaseClient();
  const session = await getSession();

  if (!session) {
    return redirect('/sign-in');
  }

  const { data } = await supabase.from('users')
  .select('*, organization:organizations(*, users(*))')
  .eq('id', session.user.id)
  .single()

  if (!data || !data.organization) {
    return <div>No Org Found</div>
  }
  

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div>
          My Organzation: {data.organization?.name}
        </div>
        <div>
          Team:
          <div>
            {data.organization?.users.map((user) => (<div>{user.name} ({user.email})</div>))}
          </div>
        </div>
        <OrgPasswordInput />
        {data.organization_id && <OrgTools organizationId={data.organization_id} />}
      </div>
    </>
  )
}
