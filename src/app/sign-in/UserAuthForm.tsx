'use client';

import { useState } from 'react'
import { cn } from '@/src/lib/utils'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/src/components/Providers/SupabaseProvider"
import { Spinner } from '@phosphor-icons/react';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN')

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (mode === 'SIGNUP' && !name) {
      alert('Please enter your name')
      return
    }
    setIsLoading(true)
    try {
      const { error, data: { user } } =
        mode === 'LOGIN'
          ? await supabase.auth.signInWithPassword({ email: username, password })
          : await supabase.auth.signUp({ email: username, password, options: { emailRedirectTo: window.location.origin + '/auth/callback',
             data: {
            name,
          }}})
      // If the user doesn't exist here and an error hasn't been raised yet,
      // that must mean that a confirmation email has been sent.
      // NOTE: Confirming your email address is required by default.
      if (error) {
        alert('Error with auth: ' + error.message)
      } else if (!user || !user.email_confirmed_at) {
        alert('Signup successful, confirmation mail should be sent soon!')
      } else {
        router.push('/tools')
      }
    } catch (error) {
      console.log('error', error)
      alert((error as any).error_description || error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        { mode === 'SIGNUP' ? 'Create an account' : 'Login to your account' }
      </h1>
      <p className="text-sm text-muted-foreground">
        { mode === 'SIGNUP' ? 'Enter your email below to create your account' : 'Enter your email below to login your account'}        
      </p>
    </div>
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@vc.com (Please use your work email)"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          { mode === 'SIGNUP' && <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="your name (e.g. Sam Altman)"
              type="text"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div> }
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="your password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading} onClick={handleLogin}>
            {isLoading && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
            { mode === 'LOGIN' ? 'Login with Email' : 'Sign Up with Email' }
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue to
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} onClick={() => setMode(mode === 'SIGNUP' ? 'LOGIN' : 'SIGNUP')}>
        { mode === 'LOGIN' ? 'Signup' : 'Login' }
      </Button>
    </div>
    <p className="px-8 text-center text-sm text-muted-foreground">
      By clicking continue, you agree to our{" "}
      <Link
        href="/terms"
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        href="/privacy"
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </Link>
      .
    </p>
  </div>
  )
}