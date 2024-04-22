import Link from "next/link"

import { cn } from "@/src/lib/utils"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/src/components/ui/page-header"
import { buttonVariants } from "../components/ui/button"

export default function IndexPage() {
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 mt-1 h-12 w-12"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <div>
            DataEng.vc
            </div>
          </PageHeaderHeading>
        <PageHeaderDescription>
          This is a community of engineers and data scientists who working in VC.
          We work to build relationships, share knowledge, in a field that can be isolating.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/sign-in/" className={cn(buttonVariants())}>
            Get Started
          </Link>
        </PageActions>
      </PageHeader>
    </div>
  )
}

