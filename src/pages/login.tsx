import * as React from "react";
import { NextPage } from "next";
import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import { useUser } from "@/lib/user";
import LoginForm from "@/components/LoginForm";

const Login: NextPage = () => {
  useUser({ redirectTo: "/", redirectIfFound: true });
  const { push } = useRouter();

  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (errorMsg) setErrorMsg("");

    const body = {
      email: event.currentTarget.email.value,
    };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 200) {
        push("/");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      error instanceof Error
        ? setErrorMsg(error.message)
        : setErrorMsg("An unexpected error happened occurred");
    }
  }

  return <LoginForm onSubmit={handleSubmit} />;
};

export default Login;
