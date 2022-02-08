import fetch from "isomorphic-unfetch";

export const fetcher = async <T>({
  url,
  options,
}: {
  url: RequestInfo;
  options?: RequestInit;
}): Promise<T> => {
  const response = await fetch(url, options);
  return await response.json();
};
