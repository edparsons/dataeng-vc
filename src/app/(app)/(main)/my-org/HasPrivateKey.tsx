'use client';

import { useSupabase } from "@/src/components/Providers/SupabaseProvider";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode
    hasReviews?: boolean
    hasReviewsFallback?: React.ReactNode
}

export default function HasPrivateKey({ children, hasReviews, hasReviewsFallback } : Props) {
  const [hasPrivateKey, setHasPrivateKey] = useState<boolean | null | undefined>() // undefined === loading, null === n/a org is public, false === hasn't entered private key, true === has private key
  const { user }  = useSupabase()
  const [privateKey, setPrivateKey] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    if (user?.organization?.privacy_type === 'anonymous') {
        if (user?.organization?.public_key) {
            const privateKey = localStorage.getItem('private_key');
            if (privateKey) {
                setHasPrivateKey(true)
            }  
        }
        setHasPrivateKey(false)
    } else {
        setHasPrivateKey(null)
    }
  }, []);

  const savePrivateKey = () => {
    localStorage.setItem('private_key', privateKey)
    router.refresh()
  }

  if (hasReviews && !user?.organization?.hasReviews) {
    return hasReviewsFallback || <>Please submit some ratings of tools</>
  }

  if (hasPrivateKey === undefined) return null

      return hasPrivateKey === true || hasPrivateKey === null ? (children) : <div className="flex flex-col gap-2">
      <Label>Your organization is set to annoymous mode.<br />Please enter organization private key to view or add tools</Label>
      <Input id="org-privateKey" className="w-[200px]" required value={privateKey} onChange={(e) => setPrivateKey(e.currentTarget.value)} />
      <div>
        <Button onClick={savePrivateKey}>
          Submit Private Key
        </Button>
      </div>
    </div>

  }
