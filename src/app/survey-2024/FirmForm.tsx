"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/src/components/ui/button";
import {
    Form,
} from "@/src/components/ui/form";
import { toast } from "@/src/components/ui/use-toast";
import { FirmSchema } from "./schema";
import { DynamicFormField } from "./DynamicFormField";

export function FirmForm({ submit }: { submit: (data: any) => void }){

    const form = useForm<z.infer<typeof FirmSchema>>({
        resolver: zodResolver(FirmSchema),
        defaultValues: {
            aum: "< $100M",
            firmSize: "<= 10",
            strikeZone: [],
            investmentGeos: [],
            technologyTeamSize: {
                productProfessionals: 0,
                dataProfessionals: 0,
                engineeringProfessionals: 0
            },
                "dataUsage": {
                  "sourcing": "We don’t use data for sourcing",
                  "picking": "We don’t use data for picking",
                  "winning": "We don’t use data for winning",
                  "supportingPortcos": "We don’t use data for supporting Portcos",
                  "lpRelations": "We don’t use data for LP Relations"
                },
                "programmaticInvestment": "yes",
            programmaticDealFlowPercentage: 0,
        }
    });

    function onSubmit(data: z.infer<typeof FirmSchema>) {
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
                <div className="w-2/3 space-y-8">
                {Object.keys(FirmSchema.shape).map((_key) => {
                    return <DynamicFormField _key={_key} form={form} schema={FirmSchema} />;
               })}
                </div>
               <div className="flex flex-row justify-end mt-8">
                <Button type="submit">Next</Button>
               </div>
            </form>
        </Form>
    );
}