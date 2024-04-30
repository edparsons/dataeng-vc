import { Metadata } from "next"
import Image from "next/image"

import { DataTable } from "@/src/components/tables/DataTable"
import { createServerSupabaseClient } from "@/src/lib/supabase-server"
import { columns } from "./columns"

export const metadata: Metadata = {
  title: "DataEng.vc - Users",
  description: "A user tracker build using Tanstack Table.",
}

export default async function TaskPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('users').select('*')


  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <DataTable data={data ?? []} columns={columns} filterLabel="users" />
      </div>
    </>
  )
}
