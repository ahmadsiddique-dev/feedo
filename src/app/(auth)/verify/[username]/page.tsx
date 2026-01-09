"use client"
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const page = () => {

    const router = useRouter();
    const param =  useParams();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            console.log("Code: ", data.code)
            setIsSubmitting(true)
            const response = await axios.post('/api/verifycode', {
                username: param.username,
                code: data.code
            })

            toast.success("Success", {
                description: response.data.message,
                action: 'Undo'
            })
        } catch (error: any) {
            toast.error("Failed", {
                description: error.message || 'An unexpected error occured', 
                action: 'Undo'
            })
        }finally {
            setIsSubmitting(false)
        }
    }
  return (
    <div className="min-h-screen justify-center items-center flex bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-mg">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
            <p className="mb-4">Enter the verification code send to your email</p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Verification Code</FieldLabel>
                <InputOTP {...field} maxLength={6}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
            />
          </FieldGroup>
          <br />
          <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>: ('Signup')}
              </Button>
          </form>
        </div>
      </div>
  )
}

export default page
