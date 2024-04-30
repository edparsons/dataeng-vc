import { Metadata } from "next"
import Image from "next/image"

import { DataTable } from "@/src/components/tables/DataTable"
import { createServerSupabaseClient } from "@/src/lib/supabase-server"
import { columns } from "./columns"

export const metadata: Metadata = {
  title: "DataEng.vc - Organizations",
}

export default async function OrgsPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('organizations').select('*').eq('status', 'approved');


  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Organizations</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of all the organizations DataEng.vc is tracking
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <DataTable data={data ?? []} columns={columns} filterLabel="organizatins" />
      </div>
    </>
  )
}
