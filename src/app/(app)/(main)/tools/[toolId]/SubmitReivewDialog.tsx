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
import { useAction } from "@/src/services/useAction";
import { signMessage } from "@/src/lib/browser-crypto";
import { submitReviewPayloadSchema } from "@/src/services/db/validation";
import { DatePicker } from "@/src/components/ui/date-picker";
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from "@/src/components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/use-toast";

export function SubmitReviewDialog({ toolId, toolName, orgId }: { toolId: string, toolName: string, orgId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { mutate: submitReviewKey } = useAction({
    action: submitReviewAction,
    onSuccess: ({ result }) => {
      setIsLoading(false)
      toast({
        title: 'Review added successfully'
      })
      router.refresh()
    },
    onError: () => {
      alert('Failed to submit review')
      setIsLoading(false)
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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof submitReviewPayloadSchema>) {
    setIsLoading(true)
    try {
      const privateKey = localStorage.getItem('private_key')
      if (!privateKey) {
        alert('Please enter your private key')
        setIsLoading(false)
        return
      }
      const orgHash = await signMessage(privateKey, orgId)

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
    } catch (error) {
      alert(error)
      setIsLoading(false)
    } finally {
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Add Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add review for {toolName}</DialogTitle>
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
                    <Input {...field} id="price" type="number" placeholder="49" />
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
                    Terms
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
      </DialogContent>
    </Dialog>
  )
}
