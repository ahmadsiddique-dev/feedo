"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Form, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast, useSonner } from "sonner";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Component() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [usernamemessage, setUsernamemessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const sonner = useSonner();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function checkUsernameUnique() {
      if (username) {
        setIsCheckingUsername(true);
        setUsernamemessage("");
        try {
          const res = await axios.get(
            `/api/check-unique?username=${username}`
          );
          setUsernamemessage(res.data.message);
        } catch (error) {
          setUsernamemessage("Invalid username");
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer< typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/signup', data)

      if(response.data.success) {
        toast.success("Signed up successfully", {
          description: `${username}! Please check your Email to verify`,
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo')
          }
        })
        router.replace(`/verify/${data.username}`)
      }
      if(!response.data.success) {
        toast.error("Signing user failed", {
          description: `${response.data?.message || "Something went wrong"}`,
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo')
          }
        })
      }
    } catch (error: any) {
      toast.error("Signing user failed", {
          description: `${error?.message || "Something went wrong"}`,
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo')
          }
        })
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen justify-center items-center flex bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-mg">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Feedo Today</h1>
            <p className="mb-4">Sign up to start your anonymus adventure</p>
          </div>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="katappa-mama"
                        autoComplete="off"
                      />
                      <div className="">
                        {isCheckingUsername && <Loader2 className="text-end! animate-spin"/>}
                      </div>
                      <FieldDescription className={`${usernamemessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                        {usernamemessage}
                      </FieldDescription>
                      {/* <p className={`text-7xl ${usernamemessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>{usernamemessage}</p> */}
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="example@gmail.com"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Password"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>: ('Signup')}
              </Button>
            </form>
            <div className="text-center mt-4">
                <p>
                  Already a member? {' '}
                  <Link href={'/signin'} className="text-blue-600 hover:text-blue-800">
                   Sign in
                  </Link>
                </p>
            </div>
        </div>
      </div>
    </>
  );
}
