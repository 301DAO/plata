import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["hello", { text: "paul" }]);

  if (isLoading) return <div>Loading...</div>;

  return <div className="font-bold"> {data && JSON.stringify(data)} </div>;
};

export default Home;
