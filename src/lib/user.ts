import { fetcher } from "@/utils";

export const fetchUser = async () => {
  return await fetcher({
    url: `/api/auth/session`,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  });
};
