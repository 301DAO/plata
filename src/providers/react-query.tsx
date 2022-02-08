import queryClient from "@/lib/react-query";
import * as React from "react";
import { Hydrate, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

 export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* To prevent 'ReferenceError: window is not defined' */}
      {typeof window !== "undefined" && (
        <Hydrate state={window.__NEXT_DATA__.props.pageProps.dehydratedState}>
          {children}
        </Hydrate>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};