'use client';

import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea";
import { Spinner } from "@phosphor-icons/react"
import { useState } from "react"
import { action as submitReviewAction } from '@/src/services/db/submitReview';
import { action as setPrivacyTypeAction } from '@/src/services/db/setPrivacyType';
import { useAction } from "@/src/services/useAction";
import { signMessage } from "@/src/lib/browser-crypto";
import { contractTypes, submitReviewPayloadSchema, toolTypes } from "@/src/services/db/validation";
import { DatePicker } from "@/src/components/ui/date-picker";
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from "@/src/components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useSupabase } from "@/src/components/Providers/SupabaseProvider";
import { Label } from "@/src/components/ui/label";
import { PublicKeyForm } from "../../../create-public-key/PublicKeyForm";

export function SubmitReviewDialog({ toolId, toolName }: { toolId?: string, toolName?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, refresh } = useSupabase()
  const { toast } = useToast()

  const { mutate: submitReviewKey } = useAction({
    action: submitReviewAction,
    onSuccess: ({ result }) => {
      setIsLoading(false)
      toast({
        title: 'Review added successfully'
      })
      setIsOpen(false)
      router.refresh()
    },
    onError: () => {
      alert('Failed to submit review')
      setIsLoading(false)
    }
  })

  const { mutate: setPrivacyType } = useAction({
    action: setPrivacyTypeAction,
    onSuccess: async ({ result }) => {
      await refresh()
      router.refresh()
    },
    onError: () => {
      alert('Failed to set Privacy type')
    }
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof submitReviewPayloadSchema>>({
    resolver: zodResolver(submitReviewPayloadSchema),
    defaultValues: {
      tool_id: toolId,
      organization_hash: '...',
    },
  })

  if (!user?.organization) {
    return null
  }

  const organization = user.organization

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof submitReviewPayloadSchema>) {
    setIsLoading(true)
    try {
      if (organization.privacy_type === 'public') {
        const payload = {
          ...values,
          tool_id: toolId,
          organization_hash: organization.id,
        }
        await submitReviewKey({
          payload: JSON.stringify(payload),
          signature: ''
        })  
      } else {
        const privateKey = localStorage.getItem('private_key')
        if (!privateKey) {
          alert('Please enter your private key')
          setIsLoading(false)
          return
        }
        const orgHash = await signMessage(privateKey, organization.id)
  
        const payload = {
          ...values,
          tool_id: toolId,
          organization_hash: orgHash,
        }
        const signature = await signMessage(privateKey, JSON.stringify(payload))
        await submitReviewKey({
          payload: JSON.stringify(payload),
          signature
        })  
      }
    } catch (error) {
      alert(error)
      setIsLoading(false)
    } finally {
    }
  }

  const setOrgPrivacyType = (val: string) => {
    // Update the organization privacy type
    setPrivacyType({ orgId: organization.id, privacyType: val })
  }

  const renderForm = () => {
    return <>
    <DialogHeader>
    <DialogTitle>Add contract for {toolName}</DialogTitle>
    <DialogDescription>
    </DialogDescription>
  </DialogHeader>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
            <FormLabel htmlFor="price" className="text-right">
              Price (USD)
            </FormLabel>
            <FormControl className="col-span-3">
              <Input {...field} id="price" type="number" placeholder="49.00" />
            </FormControl>
            <div className="col-span-1"></div>
            <div className="col-span-3 col-offset-1">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
            <FormLabel className="text-right">Type</FormLabel>
            <div className="col-span-3">
              <FormControl>
                <Select {...field} onValueChange={val => form.setValue('type', val, { shouldValidate: true })}>
                  <SelectTrigger aria-label="Type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      {contractTypes.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
            <div className="col-span-1"></div>
            <div className="col-span-3 col-offset-1">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
            <FormLabel htmlFor="duration" className="text-right">
              Duration (months)
            </FormLabel>
            <FormControl className="col-span-3">
              <Input {...field} id="duration" placeholder="12" />
            </FormControl>
            <div className="col-span-1"></div>
            <div className="col-span-3 col-offset-1">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
            <FormLabel htmlFor="start_date" className="text-right">
              Contract Date
            </FormLabel>
            <FormControl className="col-span-3">
              <DatePicker {...field} value={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} id="start_date" />
            </FormControl>
            <div className="col-span-1"></div>
            <div className="col-span-3 col-offset-1">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
            <FormLabel htmlFor="terms" className="text-right">
              Features & Terms
            </FormLabel>
            <FormControl className="col-span-3">
              <Textarea {...field} id="terms" placeholder="Additional terms and conditions" />
            </FormControl>
            <div className="col-span-1"></div>
            <div className="col-span-3 col-offset-1">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </DialogFooter>
    </form>
  </Form>
  </>
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Add Contract</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        {
          organization.privacy_type === 'anonymous' ? 
            !organization.public_key ? (
              <PublicKeyForm />
          ) : (
            renderForm()
          )
          :
          organization.privacy_type === 'public' ? (
            renderForm()
          )
          :
          <>
          <DialogHeader>
          <DialogTitle>Select a privacy type for {organization.name}</DialogTitle>
          <DialogDescription>
            Select whether you would like to submit your contracts anonymously with a private key or publicly so other members of DataEng.vc can see the contract review came from {organization.name}.
          </DialogDescription>
        </DialogHeader>
          <div>
              <div className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
                  <Label className="text-right">Type</Label>
                  <div className="col-span-3">
                      <Select onValueChange={setOrgPrivacyType}>
                        <SelectTrigger aria-label="Type">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            <SelectItem value="public">
                              Public - Your review will be assigned to you and your organization
                            </SelectItem>
                            <SelectItem value="anonymous">
                              Anonymous - Your review will be submitted anonymously with a private key
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                  </div>
                </div>
          </div> 
          </>
        }
      </DialogContent>
    </Dialog>
  )
}
