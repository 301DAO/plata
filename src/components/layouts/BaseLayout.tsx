import { AppHead, NavBar } from '@/components';
import Notification from '@/components/base/Notification';
import clsx from 'clsx';
import React from 'react';

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
          'dark', // defaults app to dark mode
          'max-w-screen-[1600px] xl:px-22 px-1.5 text-center lg:px-12',
          'dark:bg-[#14141b]'
        )}
      >
        <NavBar />
        <div className="py-0">
          <div className="flex min-h-screen rounded-t-[1rem] bg-[#1d1e2a] pb-10 sm:pt-0">
            <main className="mx-auto mt-12 max-w-xl px-4">{children}</main>
          </div>
        </div>
        <Notification />
      </div>
    </>
  );
}

export const getLayout = (page: any) => <BaseLayout>{page}</BaseLayout>;
