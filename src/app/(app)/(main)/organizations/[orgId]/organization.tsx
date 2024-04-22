import { Database } from "@/src/types_db";

type OrganzationViewProps = {
  data: Database['public']['Tables']['organizations']['Row'] & { users: Database['public']['Tables']['users']['Row'][] }
}

export default async function OrganzationView(props: OrganzationViewProps) {
  const {data} = props;
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{data.name}</h2>
            <p className="text-muted-foreground">
              
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <div>
          Team:
          <div>
            {data.users.map((user) => (<div>{user.name} ({user.email})</div>))}
          </div>
        </div>
        {/* <DataTable data={data ?? []} columns={columns} /> */}
      </div>

    </>
  )
}
