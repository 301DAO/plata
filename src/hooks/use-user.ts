import { useEffect } from "react";
import Router from "next/router";
import { useQuery } from "react-query";

const fetchUser = async () =>
  await fetch("/api/auth/session", { method: "POST" }).then((res) =>
    res.json()
  );

interface userHookRedirects {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useUser({ redirectTo, redirectIfFound }: userHookRedirects) {
  const { data, error, refetch } = useQuery(["user"], fetchUser, {
    retry: 0,
  });

  const { authenticated, user } = data || {};
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

  return { authenticated, user, error, refetch };
}
