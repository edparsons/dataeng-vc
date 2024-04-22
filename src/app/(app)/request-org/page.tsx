import * as React from "react"

import { HomeLayout } from "@/src/components/Layouts/HomeLayout"
import { RequestOrgForm } from "./RequestOrgForm"

const Page = () => {
  return (
    <HomeLayout>
      <RequestOrgForm />
    </HomeLayout>
  )
}

export default Page
