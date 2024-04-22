import { type SafeAction} from 'next-safe-action/.'
import { useAction as useSafeAction } from 'next-safe-action/hook'
import { type ZodTypeAny } from 'zod'

type UseActionProps<IV extends ZodTypeAny, Data> = {
    action: SafeAction<IV, Data>,
    onSuccess?: (data: Data, reset: () => void) => void,
    onError?: (error: unknown, reset: () => void) => void,
}

export const useAction = <IV extends ZodTypeAny, Data>({ 
    action, 
    onSuccess,
    onError,
}: UseActionProps<IV, Data>) => {
    const actionHook = useSafeAction(
        action,
        {
            onSuccess: (data, reset) => {
                onSuccess?.(data, reset)
            },
            onError: (error, reset) => {
                console.warn('UseAction Error:', error)

                onError?.(
                    (error?.serverError ?? 'Something went wrong. Please try again.'),
                    reset
                )
            }
        }
    )

    return {
        mutate: actionHook.execute,
        res: actionHook.result,
        isLoading: actionHook.status === 'executing',
        hasFinished: actionHook.status === 'hasSucceeded',
        hasErrored: actionHook.status === 'hasSucceeded',
        reset: actionHook.reset,
    }
}
