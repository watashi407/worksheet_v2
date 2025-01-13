import LoginForm from "@/app/component/auth/LoginForm";
import LoginGithub from "@/app/component/auth/LoginGithub";

import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px]">
          <h1 className="text-3xl w-full text-center font-bold mb-6">
            Sign in
          </h1>
          <LoginForm />
          <LoginGithub />
          <div className="mt-2 flex items-center">
            <h1>{`Don't have an account?`}</h1>
            <Link className="font-bold ml-2" href="/register">
              Sign Up
            </Link>
          </div>
          <div className="mt-2 flex items-center">
            <h1>{`Forgot your password?`}</h1>
            <Link className="font-bold ml-2" href="/forget-password">
              Reset Password
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
