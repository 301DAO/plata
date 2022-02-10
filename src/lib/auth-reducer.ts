type AuthState = {
  connecting: boolean;
  connected: boolean;
  error: boolean;
  errorMessage: string;
};

type AuthAction =
  | { type: "CONNECTING" }
  | { type: "CONNECTED" }
  | { type: "ERROR"; payload: string };

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "CONNECTING":
      return {
        ...state,
        connecting: true,
        connected: false,
        error: false,
        errorMessage: "",
      };
    case "CONNECTED":
      return {
        ...state,
        connecting: false,
        connected: true,
        error: false,
        errorMessage: "",
      };
    case "ERROR":
      return {
        ...state,
        connecting: false,
        connected: false,
        error: true,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export const initialAuthState: AuthState = {
  connecting: false,
  connected: false,
  error: false,
  errorMessage: "",
};
