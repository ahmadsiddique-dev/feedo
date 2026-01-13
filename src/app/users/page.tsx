"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
    username: string;
    isAcceptingMessage: boolean
}

const page = () => {

    const [data, setData] = useState<User[]>([])

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        try {
            const response = await axios.get('/api/users')
            if (!response.data) {
                toast.error("Unable to fetch users")
            }
            setData(response.data.data)
            // console.log('DAta: ', response.data.data)
        } catch (error) {
            toast.error("Error while fetching users")
        }
    }

  if (!data.length) {
    return (
      <div className="w-full flex justify-center items-center">
        <span>
          <Loader2 className="h-16 mt-32 text-orange-500 w-16 animate-spin" />
        </span>
      </div>
    )
  }


  return (
    <div className="w-full px-4 sm:px-8 py-8">
      <h1 className="text-xl md:text-5xl text-center mt-7 font-bold">
        Find one to send your Feedback
      </h1>
      <div className="md:max-w-[70vw] py-5 max-w-[100vw] grid mx-auto gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
       {data.map((user) => (
        <Card key={user.username} className="p-4 flex flex-row justify-between items-center">
          <CardTitle>@{user.username}</CardTitle>
          <Link href={`/u/${user.username}`}>
            <Button disabled={user.isAcceptingMessage? false: true}>
              Let's Rock <ExternalLink />
            </Button>
          </Link>
        </Card>
       ))}
      </div>
    </div>
  );
};

export default page;
