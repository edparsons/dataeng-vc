import { cn } from "@/src/lib/utils"

export default async function Page() {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            Terms and Conditions
          </h1>
          <p>TBD</p>
        </div>
      </div>
    </main>
  )
}