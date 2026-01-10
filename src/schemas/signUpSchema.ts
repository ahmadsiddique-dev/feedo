import { z } from "zod"

export const UsernameValidation = z
    .string()
    .min(2, "Username must be Greater than 2 character")
    .max(25, "Username is too Long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain Special Character")

export const EmailValidation = z
    .string()
    .email({message: "Invalid Email Address"})

export const PasswordValidation = z
    .string()
    .min(4, {message: "Password must be greater than 6 Character"})

export const signUpSchema = z.object({
    username: UsernameValidation,
    email: EmailValidation,
    password: PasswordValidation,
})

