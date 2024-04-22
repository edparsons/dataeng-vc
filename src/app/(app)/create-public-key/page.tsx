import * as React from "react"

import { HomeLayout } from "@/src/components/Layouts/HomeLayout"
import { PublicKeyForm } from "./PublicKeyForm"

const Page = () => {
  return (
    <HomeLayout>
      <PublicKeyForm />
    </HomeLayout>
  )
}

export default Page
