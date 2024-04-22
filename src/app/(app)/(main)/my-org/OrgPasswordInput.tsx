'use client';

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function OrgprivateKeyInput() {
  const [hasKey,setHasKey] = useState<boolean>(false)
  const [privateKey, setPrivateKey] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const privateKey = localStorage.getItem('private_key');
    if (privateKey) {
      setHasKey(true)
    }
  }, []);

  const savePrivateKey = () => {
    localStorage.setItem('private_key', privateKey)
    router.refresh()
  }

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey)
    toast.success('Private key copied to clipboard')
  }
      return !hasKey ? (
        <div>
        <Label>Enter organization private key to view or add tools</Label>
        <Input id="org-privateKey" className="w-[200px]" required value={privateKey} onChange={(e) => setPrivateKey(e.currentTarget.value)} />
        <Button onClick={savePrivateKey}>
              Submit Private Key
           </Button>
        </div>
    ) : <div>
      <Label>Organization private key has been saved</Label>
      <Button onClick={() => copyPrivateKey()}>
        Copy Private Key
      </Button>
    </div>
  }
