import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type SafeAction } from 'next-safe-action/.'
import { useAction } from 'next-safe-action/hook'
import { type FieldValues, useForm, type DefaultValues } from 'react-hook-form'
import { useDeepCompareEffect } from 'react-use'
import { type ZodSchema, type ZodTypeAny } from 'zod'

type UseFormOptions<TFormValues extends FieldValues, IV extends ZodTypeAny, Data> = {
    schema: ZodSchema<TFormValues>,
    defaultValues?: DefaultValues<TFormValues>,
    action: SafeAction<IV, Data>,
    onSuccess?: (data: Data, reset: () => void) => void,
    onError?: (error: string, validationError: unknown, reset: () => void) => void,
}

export const useActionForm = <TFormValues extends FieldValues, IV extends ZodTypeAny, Data>({ 
    schema, 
    defaultValues, 
    action, 
    onSuccess,
    onError,
}: UseFormOptions<TFormValues, IV, Data>) => {
    const router = useRouter()

    const form = useForm<TFormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues
    })

    useDeepCompareEffect(() => {
        form.reset(defaultValues)
    }, [defaultValues])

    const actionHook = useAction(
        action,
        {
            onSuccess: (data, reset) => {
                onSuccess?.(data, reset)
                router.refresh()
            },
            onError: (error, reset) => {
                onError?.(
                    (error?.serverError ??  'Something went wrong. Please try again.'),
                    error?.validationError,
                    reset
                )
            }
        }
    )

    return {
        form, 
        mutate: actionHook.execute,
        isLoading: actionHook.status === 'executing', 
    }
}
