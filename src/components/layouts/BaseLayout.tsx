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
          'max-w-screen-[1600px] xl:px-22 m-auto h-screen self-center px-1.5 text-center lg:px-12',
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
