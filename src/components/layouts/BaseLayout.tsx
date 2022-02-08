import clsx from "clsx";
import { NavBar, AppHead } from "@/components";
interface BaseLayoutProps {
  children: React.ReactNode;
}
/**
 * @param children nested components
 */
function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      <AppHead />
      <div className="max-w-screen-2xl h-auto self-center text-center m-auto mt-4">
        <NavBar />
        <div
          className={clsx(
            `flex flex-col items-center mb-8 h-screen rounded-xl bg-[#191a24] pt-10`
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export const getLayout = (page: any) => <BaseLayout>{page}</BaseLayout>;

export default BaseLayout;
