'use client';

import { useState } from 'react'
import { cn } from '@/src/lib/utils'
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/src/components/Providers/SupabaseProvider"
import { generateKeyPair } from '@/src/lib/browser-crypto';
import { Textarea } from '@/src/components/ui/textarea';
import { Spinner } from '@phosphor-icons/react';
import { useAction } from '@/src/services/useAction';
import { action as savePublicKeyAction } from '@/src/services/db/savePublicKey';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function PublicKeyForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasTakenAction, setHasTakenAction] = useState(false)

  const { mutate: savePublicKey } = useAction({
    action: savePublicKeyAction,
    onSuccess: () => {
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  if (!user) {
    return null
  }

  if (!user.organization) {
    return null
  }

  const handleCreateKey = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    const keys = await generateKeyPair();
    setPublicKey(keys.publicKey)
    setPrivateKey(keys.privateKey)
    if (user.organization?.id) {
      await savePublicKey({ orgId: user.organization?.id, publicKey: keys.publicKey })
    }
  }

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (hasTakenAction) {
      localStorage.setItem('private_key', privateKey)
      router.push(`/tools`)
    } else {
      alert('Please email or copy your private key before continuing')
    }
  }

  const handleEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const email = user.email
    const subject = 'Your Private Key'
    const body = `Your private key is ${privateKey}`
    const url = `mailto:${email}?subject=${subject}&body=${body}`
    window.open(url , '_blank');
    setHasTakenAction(true)
  }

  const handleClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigator.clipboard.writeText(privateKey)
    setHasTakenAction(true)
  }

  const getFirstName = (name: string) => {
    return name.split(' ')[0]
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hi {getFirstName(user.name)}, {user.organization.name} needs a private key
        </h1>
        <p className="text-sm text-muted-foreground">
          Each organization has a private key so it can submit review annoymously. Remember to save your private key you will need it to add data to DataEng.vc. You can share it with your team.
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form>
          <div className="grid gap-4">
            {!privateKey && <Button disabled={isLoading} onClick={handleCreateKey}>
              {isLoading && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Key
            </Button>}
            <div className="grid gap-1">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Private Key
                  </span>
                </div>
              </div>

              <Label className="sr-only" htmlFor="private-key">
                Private Key
              </Label>
              <Textarea
                className='border-2 border-black'
                id="private-key"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={true}
                value={privateKey}
              />
              { privateKey && <div className='flex flex-row gap-2'>

                <Button disabled={isLoading} onClick={handleEmail} className='flex-1'>
                {isLoading && (
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
                Email to Me
              </Button>
              <Button disabled={isLoading} onClick={handleClipboard} className='flex-1'>
                Copy To Clipboard
              </Button>

                </div>}
            </div>
            <div className="grid gap-1">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Public Key
                  </span>
                </div>
              </div>
              <Label className="sr-only" htmlFor="public-key">
                Public Key
              </Label>
              <Textarea
                id="public-key"
                className='border-2 border-black'
                autoCapitalize="none"
                autoCorrect="off"
                disabled={true}
                value={publicKey}
              />
              <Label>
                Your public key has been saved to your organization.
              </Label>
            </div>
            <Button variant={hasTakenAction ? 'default' : 'secondary'} disabled={isLoading} onClick={handleContinue} className='flex-1'>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}