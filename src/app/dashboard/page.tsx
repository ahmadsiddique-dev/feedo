"use client";

import MessageCard from "@/components/elements/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Copy, Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  const { data: session, status } = useSession();

  // console.log("Session: ", session, "and STATUS: ", status);
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/acceptmessages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? true);
      toast.success("Mode switched successfully");
    } catch (error) {
      toast.error("Unexpected error while switching mode");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get("/api/getmessages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Refreshed Messages");
        }
      } catch (error) {
        toast.error("Failed to fetch messages");
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  // handle switch

  const handleSwitchChange = async () => {
    try {
      await axios.post("/api/acceptmessages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Changed successfully");
    } catch (error) {
      toast.error("Error while changing status");
    }
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <div>Please Login First.</div>;
  }
  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Url Copied to clipboard successfully");
  };

  return (
    <div className="isolateme  bg-white rounded mx-auto w-[80vw]">
      <div className="md:px-8 px-4 py-8 ">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Copy your unique link</h2>{" "}
          <div className="flex items-center">
            <input
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
              type="text"
            />
            <Button onClick={copyToClipboard}>
              <Copy />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
        </div>
        <Separator />
        <Button
          className="mt-4"
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                userId={session.user._id}
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
