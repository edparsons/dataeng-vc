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
import { action as addToolAction } from '@/src/services/db/upsertTool';
import { useAction } from "@/src/services/useAction";
import { toolTypes, upsertToolSchema } from "@/src/services/db/validation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from "@/src/components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/use-toast";

export function AddToolDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { mutate: addTool } = useAction({
    action: addToolAction,
    onSuccess: ({ result }) => {
      setIsLoading(false)
      toast({
        title: 'Tool added successfully'
      })
      setIsOpen(false)
      router.refresh()
    },
    onError: () => {
      alert('Failed to add tool')
      setIsLoading(false)
    }
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof upsertToolSchema>>({
    resolver: zodResolver(upsertToolSchema),
    defaultValues: {
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof upsertToolSchema>) {
    setIsLoading(true)
    try {
      await addTool(values)
    } catch (error) {
      alert(error)
      setIsLoading(false)
    } finally {
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Add Tool</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add a new tool</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
                  <FormLabel className="text-right">Name</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="Tool Name" {...field} />
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
              name="website"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
                  <FormLabel className="text-right">Website</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
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
                            {toolTypes.map((option) => (
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
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
                  <FormLabel className="text-right">Description</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Textarea placeholder="Tool description" {...field} />
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
              name="published_pricing"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
                  <FormLabel className="text-right">Published Pricing</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="Free" {...field} />
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
              name="api"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-baseline gap-x-4 space-y-0">
                  <FormLabel className="text-right">API</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Select {...field} value={field.value ? 'true' : 'false'} onValueChange={val => {
                        form.setValue('api', val === 'true' ? true : false, { shouldValidate: true })
                      }} defaultValue="">
                        <SelectTrigger aria-label="API">
                          <SelectValue placeholder="Select Yes or No" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem key="yes" value="true">
                              Yes
                            </SelectItem>
                            <SelectItem key="no" value="false">
                              No
                            </SelectItem>
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
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
