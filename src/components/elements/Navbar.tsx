"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <div className="isolate-me">
    <nav className="w-full flex mx-auto">
      <div className="w-[92vw] md:w-[60vw] gap-9 justify-between px-5 py-4 mx-auto flex flex-row">
        <span className="text-2xl font-extrabold">
          <Link href={"/"}>Feedo</Link>
        </span>
        <span>
          {session ? (
            <>
              <span className="mr-4">Welcome, {user.email}</span>
              <Button className="w-full md:w-full" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Link href={"/signin"}>
              <Button className="">Login</Button>
            </Link>
          )}
        </span>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
