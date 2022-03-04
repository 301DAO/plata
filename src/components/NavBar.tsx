import clsx from 'clsx'
import Link from 'next/link'
import { useUser } from '@/hooks'
import { LogoutIcon } from '@/components/icons'
import { Disclosure, Menu } from '@headlessui/react'

type NavItem = {
  label: string
  href: string
  requiresAuth: boolean
}

const navigation: NavItem[] = [
  {
    label: 'HOME',
    href: '/',
    requiresAuth: false,
  },
  {
    label: 'DASHBOARD',
    href: '/dashboard',
    requiresAuth: true,
  },
]

export const NavBar = () => {
  const { authenticated, error, user } = useUser()

  return (
    <Disclosure
      as="nav"
      className={clsx(
        `w-full border-opacity-25 bg-gray-800 py-1 pt-2 md:border-none`,
        `border-gray-600 dark:bg-[#14141b]`
      )}
    >
      {({ open }) => (
        <>
          <div className="max-w-8xl mx-auto sm:px-2 md:px-0">
            <div className="relative flex items-center px-4 sm:h-14 md:border-opacity-25 md:px-6 md:pr-7">
              <div className="flex w-full items-center font-bold md:px-0 md:text-xl">
                {authenticated ? (
                  <>
                    <Link shallow={true} href="/">
                      <a className="mr-auto flex-shrink-0 text-2xl sm:block">PLATA</a>
                    </Link>
                    <div className="sm:ml-auto md:block lg:ml-2">
                      <div className="flex space-x-3 sm:space-x-4 md:w-full">
                        {navigation.map(item => (
                          <Link shallow={true} key={item.label} href={item.href}>
                            <a className="rounded-md px-2 py-2 text-lg font-medium text-gray-200 sm:px-3">
                              {item.label}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="mr-auto flex-shrink-0 text-2xl sm:block">PLATA</p>
                )}
              </div>
              <div className="ml-auto pr-4 md:block">
                <div className="flex items-center">
                  <Menu
                    as="div"
                    className="relative flex flex-shrink-0 items-center gap-x-3 sm:gap-x-6"
                  >
                    {authenticated && (
                      <>
                        <div>
                          <Link href="/profile" passHref>
                            <button className="flex rounded-sm text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600">
                              <span className="sr-only">Open user menu</span>
                            </button>
                          </Link>
                        </div>
                        <Link href="/api/auth/logout" passHref>
                          <button className="flex rounded-sm text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600">
                            <span className="sr-only">Open user menu</span>
                            <LogoutIcon />
                          </button>
                        </Link>
                      </>
                    )}
                    <div className="flex items-center">
                      <span
                        className={clsx(
                          'h-3 w-3 rounded-full',
                          authenticated ? 'bg-green-300' : !!error ? 'bg-red-400' : 'bg-orange-200'
                        )}
                      ></span>
                    </div>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
