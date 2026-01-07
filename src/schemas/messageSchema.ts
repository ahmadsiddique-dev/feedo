import { z } from "zod"

export const messageSchema = z.object({
    acceptMessages: z
    .string()
    .min(10, "Message must be atleast 10 character long")
    .max(300, "Message must be less than 300 characters")
})