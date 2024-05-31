"use client";

import { ZodObject, ZodRawShape, ZodType, z } from "zod";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Slider } from "@/src/components/ui/slider";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { Combobox } from "@/src/components/ui/combobox";

const includes = <T extends string>(array: T[] | undefined, value: T) => {
    return array?.includes(value);
}

type Describable = {
    description?: string
};

const getDescriptionAndLabel = (fieldType: z.ZodType<any, any>) => {
    const describableFieldType = fieldType._def as Describable;
    return JSON.parse(describableFieldType.description ?? '{}') || {};
}
  
const getMaxMin = (fieldType: z.ZodNumber) => {
    const maxField = fieldType._def.checks.find((c) => c.kind === 'max');
    const max = maxField?.kind === 'max' ? maxField.value : 100;
    const minField = fieldType._def.checks.find((c) => c.kind === 'min');
    const min = minField?.kind === 'min' ? minField.value : 100;
    return { max, min };
}

interface DynamicFormFieldProps<TFieldValues extends FieldValues> {
    _key: string;
    form: UseFormReturn<TFieldValues>;
    schema: ZodObject<ZodRawShape>;
}

type FilterKeysByType<T, U> = {
    [K in keyof T]: K extends Path<T> ? (T[K] extends U ? K : never) : never;
  }[keyof T];

  
  export type FormSchemaType<TFieldValues extends FieldValues> = TFieldValues;
  
  export type NumberKeys<TFieldValues extends FieldValues> = FilterKeysByType<FormSchemaType<TFieldValues>, z.ZodNumber>;
  export type EnumKeys<TFieldValues extends FieldValues> = FilterKeysByType<FormSchemaType<TFieldValues>, z.ZodEnum<any>>;
  export type ArrayKeys<TFieldValues extends FieldValues> = FilterKeysByType<FormSchemaType<TFieldValues>, z.ZodArray<any>>;
  export type StringKeys<TFieldValues extends FieldValues> = FilterKeysByType<FormSchemaType<TFieldValues>, z.ZodString>;
  

export function DynamicFormField<TFieldValues extends FieldValues>({ _key, form, schema }: DynamicFormFieldProps<TFieldValues>) {
    const key = _key as keyof typeof schema.shape;
    const shape = schema.shape;
    let fieldType = shape[key];
    if (typeof key !== 'string') return null;
    if (key.includes('.')) {
        const [firstKey, ...restKeys] = key.split('.');
        const subshape = shape[firstKey as keyof typeof schema.shape] as z.AnyZodObject;
        fieldType = subshape.shape[restKeys.join('.')];
    }
    if (fieldType instanceof z.ZodOptional) {
        // @ts-ignore
        fieldType = fieldType._def.innerType;
    }
    if (fieldType instanceof z.ZodNumber) {
        const fieldKey = key as NumberKeys<TFieldValues>;
        const { max, min } = getMaxMin(fieldType);
        const { label = '', description = '' } = getDescriptionAndLabel(fieldType)
            return (
            <FormField
                key={fieldKey}
                control={form.control}
                name={fieldKey}
                render={({ field }) => (
                    <FormItem className="space-y-0">
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <div className='flex gap-4'>
                            <Slider
                                defaultValue={[field.value ?? 0]}
                                max={max ?? 100}
                                min={min ?? 0}
                                step={1}
                                onValueChange={(values) => field.onChange(values[0])}
                                className="w-[60%]"
                            />
                            <Input value={field.value} className="w-[20%]" disabled />
                            </div>
                        </FormControl>
                        <FormDescription>{ description} </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }
    if (fieldType instanceof z.ZodString) {
        const fieldKey = key as StringKeys<TFieldValues>;
        const { label = '', description = '', suggestions } = getDescriptionAndLabel(fieldType)
        return (
            <FormField
                key={fieldKey}
                control={form.control}
                name={fieldKey}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            { suggestions ? 
                            <div>
                            <Combobox
                                items={suggestions}
                                placeholder="Select an option"
                                value={field.value}
                                setValue={(val) => {
                                    field.onChange(val)
                                }}
                            />
                            </div>
                            : 
                            <Input {...field} /> }
                        </FormControl>
                        <FormDescription>
                            { description }
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }
    if (fieldType instanceof z.ZodEnum) {
        const fieldKey = key as EnumKeys<TFieldValues>;
        let options = fieldType.options;
        const { label = '', description = '' } = getDescriptionAndLabel(fieldType)
        return (
            <FormField
                key={fieldKey}
                control={form.control}
                name={fieldKey}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {options.map((option: any) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            { description }
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }

    if (fieldType instanceof z.ZodArray && fieldType._def.type instanceof z.ZodEnum) {
        const fieldKey = key as ArrayKeys<TFieldValues>;
        const options = fieldType._def.type.options;
        const { label = '', description = '' } = getDescriptionAndLabel(fieldType)
        return (
            <FormField
                key={fieldKey}
                control={form.control}
                name={fieldKey}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <div className="flex flex-col space-y-4">
                            {options.map((option: any) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`checkbox-${option}`}
                                        checked={includes(field.value, option)}
                                        onCheckedChange={() => {
                                            debugger;
                                            const newValue = includes(field.value, option)
                                                ? field.value.filter((v: any) => v !== option)
                                                : [...(field?.value ?? []), option];
                                            field.onChange(newValue);
                                        }}
                                    />
                                    <label
                                        htmlFor={`checkbox-${option}`}
                                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <FormDescription>
                            { description }
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }

    if (fieldType instanceof z.ZodObject) {
        const { label = '', description = '' } = getDescriptionAndLabel(fieldType)
        return <div className="flex flex-col">
        <label className="form-label">{label}</label>
        <div className="form-description text-[0.8rem] text-muted-foreground">{description}</div>
        <div className="flex flex-col ml-6 mt-2 space-y-4">
          {Object.keys(fieldType.shape).map((nestedKey) => {
            const fullKey = `${_key}.${nestedKey}` as Path<TFieldValues>;
            return <DynamicFormField key={fullKey} _key={fullKey} form={form} schema={schema as unknown as ZodObject<ZodRawShape>} />;
          })}
        </div>
      </div>
    }

    return <div>Error unknown type {JSON.stringify(fieldType)}</div>;
}

