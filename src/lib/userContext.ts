import * as React from "react";
import type { MagicUserMetadata } from "magic-sdk";

export interface UserState {
  user?: MagicUserMetadata;
  loading: boolean;
}
export interface UserStateObject {
  userState: UserState;
  setUserState?: (userState: UserState) => void;
}
export const UserContext = React.createContext<UserStateObject | undefined>(
  undefined
);
