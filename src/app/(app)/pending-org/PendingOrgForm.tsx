'use client';

import { useSupabase } from "@/src/components/Providers/SupabaseProvider"
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PendingOrgForm({ className, ...props }: UserAuthFormProps) {
  const { user } = useSupabase()
  const router = useRouter()
  if (!user) {
    return null
  }

  useEffect(() => {
    if (user.organization?.status !== 'pending') {
      router.push('/tools')
    }
  }, [user.organization?.status])


  const domain = user.email.split("@")[1];

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Pending organization for { domain }
      </h1>
      <p className="text-sm text-muted-foreground">
        A request for organization for { domain } has been made. We're waiting for a DataEng.vc team member to approve
      </p>
    </div>
  </div>
  )
}