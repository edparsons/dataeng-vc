import 'server-only'

import { type z } from 'zod'

import { authAction } from './safeAction'

export const createService = <Input, Output>(
    schema: z.ZodSchema<Input>,
    handler: (input: Input) => Promise<Output>
) => {
    const action = authAction(
        schema,
        async (input) => {
            const result = await handler(input)
            return {
                success: true,
                result
            }
        }
    )

    return {
        handler,
        action
    }
}
