"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Message } from "@/models/User";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true)
    try {
      const response = await axios.delete(`/api/deletemessage/${message._id}`);
  
      if (!response.data.success) {
        toast.error("Unable to delete message");
      }
      if (response.data.success) {
        toast.error("Message deleted successfully");
      }
    } catch (error) {
      toast.error("Unexpected Error occured");
    }finally {
      setIsSubmitting(false)
    }
  };
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={handleDeleteConfirm} type="submit">{isSubmitting ? <span><Loader2 className="animate-spin w-4 h-4"/></span>: "Confirm"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCard;
