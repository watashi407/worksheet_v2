import { createClient } from "@/supabase/server";
import Link from "next/link";
import React from "react";
import Logout from "@/app/component/auth/Logout";
const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b bg-background w-full flex items-center">
      <div className="flex w-full items-center justify-between my-4">
        {!user ? (
          <>
            <Link className="font-bold" href="/">
              Home
            </Link>

            <div className="flex items-center gap-x-5">
              <Link href="/login">
                <div className="bg-blue-600 text-white text-sm px-4 py-2 rounded-sm">
                  Login
                </div>
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link className="font-bold" href="/">
              <h1 className="">
                {" "}
                {user?.user_metadata?.username
                  ? user?.user_metadata?.username
                  : user?.user_metadata?.user_name}
              </h1>
            </Link>

            <Logout />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
