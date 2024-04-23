'use client';

import { useState } from 'react'
import { cn } from '@/src/lib/utils'
import { Button } from "@/src/components/ui/button"
import { useSupabase } from "@/src/components/Providers/SupabaseProvider"
import { useAction } from '@/src/services/useAction';
import { action as createOrganizationAction } from '@/src/services/db/createOrganization';
import { Spinner } from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RequestOrgForm({ className, ...props }: UserAuthFormProps) {
  const { user } = useSupabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: createOrganization } = useAction({
    action: createOrganizationAction,
    onSuccess: ({ result}) => {
      router.push(`/pending-org`)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  if (!user) {
    return null
  }
  const domain = user.email.split("@")[1];


  const handleRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)
    createOrganization({ domain })
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        No organization for { domain }
      </h1>
      <p className="text-sm text-muted-foreground">
        DataEng.vc doesn't have an organization for { domain }. Please request one below.
      </p>
    </div>
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <Button disabled={isLoading} onClick={handleRequest}>
            {isLoading && (
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Request Organization for { domain }
          </Button>
        </div>
      </form>
    </div>
  </div>
  )
}