import Link from "next/link"
import { GetServerSideProps, Metadata } from "next"

import { cn } from "@/src/lib/utils"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/src/components/ui/page-header"
import { buttonVariants } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

export const metadata: Metadata = {
  title: "DataEng.vc",
}

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
          This is a community of engineers and data scientists working in VC.
          We build relationships, share knowledge, and bring people together.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/tools/" className={cn(buttonVariants())}>
            Get Started
          </Link>
        </PageActions>
        <div className="text-xl">Projects</div>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Tools DB</CardTitle>
            <CardDescription>Our first project is a tools database</CardDescription>
          </CardHeader>
          <CardContent>
            <div>Using the tools database organizations can anonymously share what tools they use and the terms of the contract.</div>
            <div>Through the aggregation of these contracts we aim to provide benchmarking data so future members can have more information going into negations with vendors.</div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              This was inspired by chats on <a>VC Data People</a> and the initial tools db was seeded with data by @Francesco_AI
            </p>
          </CardFooter>
        </Card>
      </PageHeader>
    </div>
  )
}

