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
        <div className={clsx(`flex h-screen flex-col items-center rounded-[1.5rem] bg-[#191a24]`)}>
          {children}
        </div>
      </div>
    </>
  );
}

export const getLayout = (page: any) => <BaseLayout>{page}</BaseLayout>;
