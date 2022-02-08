import { User } from "@prisma/client";
import { fetcher } from "@/utils";

type AuthResponse = {
  authenticated: boolean;
  message: string;
  user: User | null;
};

export const fetchUser = async () => {
  return await fetcher<Promise<AuthResponse>>({
    url: `/api/auth`,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  });
};
