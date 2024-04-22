import * as React from "react"

import { HomeLayout } from "@/src/components/Layouts/HomeLayout"
import { PendingOrgForm } from "./PendingOrgForm"

const Page = () => {
  return (
    <HomeLayout>
      <PendingOrgForm />
    </HomeLayout>
  )
}

export default Page
