"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/src/components/ui/button";
import {
    Form,
} from "@/src/components/ui/form";
import { toast } from "@/src/components/ui/use-toast";
import { getToolsAndVendorsSchema } from "./schema";
import { DynamicFormField } from "./DynamicFormField";
import { Database } from "@/src/types_db";

export function ToolsForm({ submit, index, data, back, tools }: { submit: (data: any) => void, index: number, data: any, back: () => void, tools: Database['public']['Tables']['tools']['Row'][]}){

    const ToolsAndVendorsSchema = getToolsAndVendorsSchema(tools);

    const form = useForm<z.infer<typeof ToolsAndVendorsSchema>>({
        resolver: zodResolver(ToolsAndVendorsSchema),
        defaultValues: {
        }
    });

    function onSubmit(data: z.infer<typeof ToolsAndVendorsSchema>) {
        console.log(data);
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
        submit(data);
    }

    function onInvalid(args: any) {
        console.log("invalid", args);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                <div className="md:w-2/3 space-y-8">
                {Object.keys(ToolsAndVendorsSchema.shape).map((_key) => {
                    return <DynamicFormField _key={_key} form={form} schema={ToolsAndVendorsSchema} />;
               })}
               </div>
                <div className="flex flex-row justify-between mt-8">
                <Button type="button" variant={'secondary'} onClick={back}>Back</Button>
                <Button type="submit">Submit</Button>
               </div>

            </form>
        </Form>
    );
}