'use client';

import { useSupabase } from "@/src/components/Providers/SupabaseProvider";
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useToast } from "@/src/components/ui/use-toast";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrgprivateKeyInput({ children } : {children: React.ReactNode}) {
  const [hasPrivateKey, setHasPrivateKey] = useState<boolean>(false)
  const [privateKey, setPrivateKey] = useState<string>("")
  const { user }  = useSupabase()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user?.organization?.public_key) {
      const privateKey = localStorage.getItem('private_key');
      if (privateKey) {
        setHasPrivateKey(true)
      }  
    } else {
      // needs a public key 
    }
  }, []);

  const savePrivateKey = () => {
    localStorage.setItem('private_key', privateKey)
    router.refresh()
  }

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey)
    toast({
      title: 'Private key copied to clipboard'
    })
  }
      return !hasPrivateKey ? (
        <div className="flex flex-col gap-2">
        <Label>Enter organization private key to view or add tools</Label>
        <Input id="org-privateKey" className="w-[200px]" required value={privateKey} onChange={(e) => setPrivateKey(e.currentTarget.value)} />
        <div>
        <Button onClick={savePrivateKey}>
              Submit Private Key
           </Button>
           </div>
        </div>
    ) : <div className="flex flex-col gap-2">
      <Label>Organization private key has been saved</Label>
      <div>
        <Button onClick={() => copyPrivateKey()}>
          Copy Private Key
        </Button>
      </div>
      <div>
        { children }
      </div>
    </div>
  }
