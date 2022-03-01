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
      <div
        className={clsx(
          'm-auto max-w-screen-2xl self-center text-center',
          'dark:bg-[#14141b]'
        )}
      >
        <NavBar />
        <div className={clsx(`pb-10 flex h-full flex-col items-center rounded-t-[1rem] bg-[#1d1e2a] pt-8`)}>
          {children}
        </div>
      </div>
    </>
  );
}

export const getLayout = (page: any) => <BaseLayout>{page}</BaseLayout>;
