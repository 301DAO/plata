import queryClient from "@/lib/react-query";
import * as React from "react";
import { Hydrate, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={window.__NEXT_DATA__.props.pageProps.dehydrateState}>
        {children}
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default ReactQueryProvider;
