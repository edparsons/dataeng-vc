import * as React from "react"

import { UserAuthForm } from "./UserAuthForm"
import { HomeLayout } from "@/src/components/Layouts/HomeLayout"


const Page = () => {
  return (
    <HomeLayout>
      <UserAuthForm />
    </HomeLayout>
  )
}

export default Page
