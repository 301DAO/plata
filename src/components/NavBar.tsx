// import clsx from 'clsx';
// import Link from 'next/link';
// import { useUser } from '@/hooks';
// import { LogoutIcon } from '@/components/icons';

// export const NavBar = () => {
//   const { authenticated, error } = useUser({});

//   return (
//     <nav className="rounded border-gray-200 bg-white bg-transparent px-4 pb-2.5 md:pt-2.5">
//       <div className="flex items-center justify-between mx-auto">
//         <a className="flex" href="/">
//           <span className="self-center hidden text-lg font-semibold whitespace-nowrap dark:text-white sm:flex">
//             PLATA
//           </span>
//         </a>
//         <ul className="flex flex-row mt-0 space-x-8 font-medium md:text-sm">
//           <li className="flex items-center py-2 pl-3 pr-4 text-white rounded dark:text-white md:bg-transparent md:p-0">
//             <Link href={'/'}>HOME</Link>
//           </li>
//           {authenticated && (
//             <li className="flex items-center py-2 pl-3 pr-4 text-white rounded dark:text-white md:bg-transparent md:p-0">
//               <Link href={'/dashboard'}>DASHBOARD</Link>
//             </li>
//           )}
//           <li>
//             <div className="flex items-center w-full h-full pl-4">
//               <span
//                 className={clsx(
//                   'h-3 w-3 rounded-full',
//                   authenticated ? 'bg-green-300' : !!error ? 'bg-red-400' : 'bg-orange-200'
//                 )}
//               ></span>
//             </div>
//           </li>
//           {authenticated && (
//             <li className="flex items-center w-full min-h-full pl-4">
//               <a href="/api/auth/logout">
//                 <LogoutIcon />
//               </a>
//             </li>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// };

import * as React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Disclosure, Menu } from '@headlessui/react';
import { useEnsLookup, useEnsAvatar, useAccount } from 'wagmi';

import { useUser } from '@/hooks';

import { LogoutIcon } from '@/components/icons';

const navigation = [
  {
    name: 'HOME',
    href: '/',
    requiresAuth: false,
  },
  {
    name: 'DASHBOARD',
    href: '/dashboard',
    requiresAuth: true,
  },
];

export const NavBar = () => {
  const { authenticated, error, user } = useUser();

  return (
    <Disclosure
      as="nav"
      className={clsx(
        `border-opacity-25 bg-gray-800 md:border-none`,
        `border-gray-600 dark:bg-[#14141b]`
      )}
    >
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-8xl md:px-0">
            <div className="relative flex items-center px-4 h-14 md:border-opacity-25 md:px-6">
              <div className="flex items-center md:px-0">
                <Link shallow={true} href="/">
                  <a className="flex-shrink-0">PLATA</a>
                </Link>
                {authenticated && (
                  <div className="ml-auto ml:0 md:block lg:ml-2">
                    <div className="flex sm:space-x-4 md:w-full">
                      {navigation.map(item => (
                        <Link shallow={true} key={item.name} href={item.href}>
                          <a className="px-3 py-2 text-lg font-medium text-gray-200 rounded-md">
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* {authenticated && (
                <div className="flex ml-auto md:hidden">

                  <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-200 bg-gray-700 rounded-md hover:bg-gray-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="block w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="block w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    )}
                  </Disclosure.Button>
                </div>
              )} */}
              <div className="ml-auto md:block">
                <div className="flex items-center">
                  <Menu
                    as="div"
                    className="relative flex items-center flex-shrink-0 ml-3 gap-x-3 sm:gap-x-6"
                  >
                    {authenticated && (
                      <>
                        <div>
                          <Link href="/profile" passHref>
                            <button className="flex text-sm text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600">
                              <span className="sr-only">Open user menu</span>
                            </button>
                          </Link>
                        </div>
                        <Link href="/api/auth/logout" passHref>
                          <button className="flex text-sm text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600">
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

          {/* {authenticated && (
            <Disclosure.Panel className="md:hidden">
              <div className="flex items-center justify-between px-2 pb-3">
                {navigation.map(item => (
                  <Link shallow={true} key={item.name} href={item.href} passHref>
                    <Disclosure.Button
                      as="a"
                      className="px-3 py-1 text-base font-medium rounded-md"
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                ))}
              </div>

              <div className="pt-4 pb-3 border-t">
                <div className="flex items-center px-5">
                  <div className="ml-auto">
                    <div className="w-[200px] truncate text-sm font-medium text-gray-300">
                      {user?.publicAddress}
                    </div>
                  </div>
                  <p className="pl-8 ml-auto"></p>

                  <Link href="/api/auth/logout" passHref>
                    <button

                      className="text-sm text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                    >
                      <span className="sr-only">Open user menu</span>
                      <LogoutIcon />
                    </button>
                  </Link>
                </div>
              </div>
            </Disclosure.Panel>
          )} */}
        </>
      )}
    </Disclosure>
  );
};
