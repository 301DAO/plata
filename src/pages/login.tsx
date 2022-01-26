import * as React from "react";
import { NextPage } from "next";
import { UserContext } from "@/lib/userContext";
import LoginForm from "@/components/loginForm";

const Login: NextPage = () => {
  const userContext = React.useContext(UserContext);

  const [errorMsg, setErrorMsg] = React.useState("");

  if (userContext?.userState.user) {
    return <div>You are logged in</div>;
  }

  return (
    <LoginForm
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log(event.currentTarget.email.value);
      }}
    />
  );
};

export default Login;
