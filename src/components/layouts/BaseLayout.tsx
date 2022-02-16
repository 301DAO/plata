import clsx from 'clsx';
import { NavBar, AppHead } from '@/components';
interface BaseLayoutProps {
  children: React.ReactNode;
}
/**
 * @param children nested components
 */
export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      <AppHead />
      <div className="m-auto mt-4 h-auto max-w-screen-2xl self-center text-center">
        <NavBar />
        <div
          className={clsx(`mb-8 flex h-screen flex-col items-center rounded-xl bg-[#191a24] pt-10`)}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export const getLayout = (page: any) => <BaseLayout>{page}</BaseLayout>;
