"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
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
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type MessageCardProp = {
  userId: string | undefined;
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete, userId }: MessageCardProp) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log('Messsages ddata: ', message);
  const handleDeleteConfirm = async () => {
    // setIsSubmitting(true);
    try {
      const response = await axios.delete(`/api/deletemessage?userId=${userId}&messageId=${message._id}`);
  
      // console.log("RESPONSE: ", response)
      if (!response.data.success) {
        toast.error("Failed to delete message");
      }
      if (response.data.success) {
        toast.success("Message deleted successfully");
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
          <CardTitle>{message.content}</CardTitle>
        </CardHeader>
        <Dialog>
            <DialogTrigger><X className="bg-[#f54a00] text-white rounded-sm px-0.5 py-0.5 hover:bg-orange-400 ml-3.5"/></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  It will be permanently deleted and this action cannot be undone
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={handleDeleteConfirm} type="submit">{isSubmitting ? <span><Loader2 className="animate-spin w-4 h-4"/></span>: "Confirm"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </Card>
    </div>
  );
};

export default MessageCard;
