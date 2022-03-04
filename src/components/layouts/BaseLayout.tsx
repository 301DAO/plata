import clsx from 'clsx'
import { NavBar, AppHead } from '@/components'

interface BaseLayoutProps {
  children: React.ReactNode
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
          'm-auto h-screen max-w-screen-2xl self-center text-center lg:px-0',
          'dark:bg-[#14141b]'
        )}
      >
        <NavBar />
        <div className="flex min-h-screen flex-col items-center rounded-t-[1rem] bg-[#1d1e2a] pb-10 pt-4 sm:pt-0">
          {children}
        </div>
      </div>
    </>
  )
}

export const getLayout = (page: any) => <BaseLayout>{page}</BaseLayout>
