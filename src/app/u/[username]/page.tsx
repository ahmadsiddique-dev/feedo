"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import z from "zod";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import Link from "next/link";

const promptSchema = z.object({
  username: z
    .string("Username must ba a string")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not be any special character"),
  content: z
    .string()
    .min(3, { message: "Feedback must be of 3 character" })
    .max(250, { message: "Feedback must be less than 250 characters" }),
});

const page = () => {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const prompts = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente dignissimos fuga natus et necessitatibus autem. .",
    "Lorem ipsum dolor sit amet consectetur adipisiit.cing el Sapiente dignissimos fuga n",
    "Lorem ipsum dolor sit amet consecte. Sapiente dignissimos fuga natus et necessitatibus autem. .",
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    const username = window.location.pathname.split("/")[2];
    const validated = promptSchema.safeParse({
      content: feedback,
      username: username,
    });

    if (!validated.success) {
      toast.error(validated.error.issues[0].message || "Something went wrong");
    }

    try {
      const response = await axios.post<ApiResponse>(
        "/api/sendmessage",
        validated
      );
      if (!response.data.success) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.currentTarget.value);
  };
  const handlePrompt = (e: React.MouseEvent<HTMLInputElement>) => {
    setFeedback(e.currentTarget.value);
  };
  return (
    <div className="grow flex flex-col mt-9 items-center justify-center px-4 md:px-8">
      <div>
        <h1 className="text-xl md:text-5xl font-bold">Public Profile Link</h1>
      </div>
      <div className="md:w-[60vw] my-7 justify-center items-center gap-7 flex flex-col  w-[90vw]">
        <Textarea
          value={feedback}
          onChange={(e) => handleFeedback(e)}
          className="md:w-2/3 mx-auto"
          placeholder="Type your message here."
        />
        <div>
          <Button onClick={handleSubmit}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
      <div className="md:max-w-[60vw] mb-5 w-full sm:max-w-[75vw]">
        <Separator />
      </div>
      <section className="w-full flex justify-start flex-col md:max-w-[60vw] sm:max-w-[75vw]">
        <div className="">
          <Button>Suggest Messages</Button>
          <p className="mt-3 font-semibold">
            Click on any message below to select it.
          </p>
        </div>
        <div className="px-4 py-6 rounded-lg h-8 ">
          <h2 className="font-bold text-xl mb-5">Messages</h2>
          <div className="flex flex-col justify-center items-center gap-5 mx-auto">
            {prompts.map((value) => (
              <Input
                onClick={(e) => handlePrompt(e)}
                key={value}
                readOnly
                className="font-semibold cursor-pointer w-full text-center"
                value={value}
              />
            ))}
          </div>
          <div className="w-full mt-7 flex flex-col gap-2 justify-center items-center">
            <p className="font-semibold">Get Your Message Board</p>
            <Link href={"/signup"}>
              <Button>Create your account</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
