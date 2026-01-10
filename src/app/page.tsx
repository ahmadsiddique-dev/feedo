"use client";
import MessageCard from "@/components/elements/MessageCard";
import messages from "@/data/messages.json";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24">
        <section className="text-center mt-12 mb-8 md:mb-12">
          <h1 className="text-xl md:text-5xl font-bold">
            {" "}
            Dive into the World of Anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Gain anonymous feedbacks - Where your identity remains a secret
          </p>
        </section>
        <section className="my-4 mb-10">
          <Link href={'/users'}>
            <Button variant={"default"} size={"lg"}>Find User</Button>
          </Link>
        </section>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xs"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col gap-4 items-start justify-center p-6">
                      <CardDescription>{message.title}</CardDescription>
                      <CardTitle>{message.content}</CardTitle>
                    </CardContent>
                    <CardFooter>{message.received}</CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious /> */}
          {/* <CarouselNext /> */}
        </Carousel>
        <footer className="w-full py-6 text-center border-t mt-14">
          <p>
            © 2025 Feedo Messages. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
};

export default page;
