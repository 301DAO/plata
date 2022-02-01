import { useEffect } from "react";
import Router from "next/router";
import { useQuery } from "react-query";

const userFetcher = async () => {
  const response = await fetch("/api/user");

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  console.log(response);

  return response.json();
};

interface userHookRedirects {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useUser({ redirectTo, redirectIfFound }: userHookRedirects) {
  const { data, error } = useQuery("user", userFetcher, {
    retry: 0,
  });

  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return error ? null : user;
}
