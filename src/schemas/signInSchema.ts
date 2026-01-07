import { z } from "zod"
import { PasswordValidation } from "./signUpSchema"

export const signInSchema = z.object({
    identifier: z.string(),
    password: PasswordValidation
})