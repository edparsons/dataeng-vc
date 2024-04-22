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
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea";
import { Spinner } from "@phosphor-icons/react"
import { useState } from "react"
import { action as submitReviewAction } from '@/src/services/db/submitReview';
import { useAction } from "@/src/services/useAction";
import { signMessage } from "@/src/lib/browser-crypto";
import { submitReviewPayloadSchema } from "@/src/services/db/validation";
import { DatePicker } from "@/src/components/ui/date-picker";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function SubmitReviewDialog({ toolId, toolName, orgId }: { toolId: string, toolName: string, orgId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [price, setPrice ] = useState<string>()
  const [duration, setDuration] = useState<string>()
  const [terms, setTerms] = useState<string>()
  const [start_date, setStartDate] = useState<Date>()
  const router = useRouter()

  const { mutate: submitReviewKey } = useAction({
    action: submitReviewAction,
    onSuccess: ({ result }) => {
      setIsLoading(false)
      toast.success('Tool added successfully')
      router.refresh()
    },
    onError: () => {
      alert('Failed to submit review')
      setIsLoading(false)
    }
  })


  const handleSubmit = async () => {
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
      tool_id: toolId,
      price: price && parseInt(price),
      duration: duration && parseInt(duration),
      terms,
      start_date: start_date?.toISOString(),
      organization_hash: orgHash
    }
    const result = submitReviewPayloadSchema.safeParse(payload)
    if (!result.success) {
      console.log(result.error)
      alert('Invalid payload')
      setIsLoading(false)
      return
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add review for {toolName}</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Price (USD)
            </Label>
            <Input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="price"
              type="number"
              placeholder="49"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Duration (months)
            </Label>
            <Input
              onChange={(e) => setDuration(e.target.value)}
              value={duration}
              id="duration"
              placeholder="12"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Start Date
            </Label>
            <DatePicker
              onSelect={(e) => setStartDate(e)}
              value={start_date}
              id="date"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="terms" className="text-right">
              Terms
            </Label>
            <Textarea
              onChange={(e) => setTerms(e.target.value)}
              value={terms}
              id="terms"
              placeholder="Addtional terms and conditions"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            { isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
