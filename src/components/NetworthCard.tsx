import * as React from 'react'
import clsx from 'clsx'
import type { NetworthCardProps } from '@/types/dashboard.types'

export const NetworthCard = ({ item }: { item: NetworthCardProps }) => {
  const negative = item.monthlyChange < 0
  return (
    <div
      className={clsx(
        `text-md group relative mb-2 inline-flex w-full transform items-center justify-center overflow-hidden rounded-t-lg border-t-transparent bg-gradient-to-br pb-0.5 text-center font-medium text-gray-900 hover:z-10 hover:rounded-lg hover:bg-gradient-to-tl hover:p-0.5 hover:text-white focus:ring-4`,
        `dark:text-white dark:shadow-md`,
        negative &&
          `from-pink-400 via-pink-600 to-pink-600 shadow-pink-500/25 focus:ring-pink-300 dark:shadow-pink-800/25 dark:focus:ring-pink-800`,
        !negative &&
          `from-emerald-400 via-green-600 to-emerald-600 shadow-emerald-500/25 focus:ring-emerald-300 dark:shadow-emerald-800/25 dark:focus:ring-emerald-800`
      )}
    >
      <a
        className={clsx(
          `relative grid h-full w-full cursor-pointer grid-flow-row-dense grid-cols-2 place-content-between items-center gap-y-8 align-middle`,
          `group-hover:bg-opacity-1 rounded-t-lg bg-white p-4 transition-all duration-75 ease-in hover:rounded-md dark:bg-gray-900`
        )}
      >
        <div className="col-span-2 flex h-full w-full justify-between">
          <p className={clsx(`place-self-start text-left text-2xl font-extrabold tracking-tight`)}>
            {item.title}
          </p>
          <p
            className={clsx(
              `flex justify-start justify-self-end text-right text-2xl font-bold`,
              item?.monthlyChange > 0 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {negative ? '' : '+'}
            {item.monthlyChange}%
          </p>
        </div>

        <div className="col-span-2 flex h-full w-full justify-between">
          <p className="mt-auto text-left text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
            ${item.balance}
          </p>

          {item.topPerformer && (
            <p
              className={clsx(
                `align-items-end flex flex-col items-end justify-end place-self-end  text-xs sm:text-xs`
              )}
            >
              <span className="text-right text-emerald-300">
                ▲ {item.topPerformer?.name}&nbsp;{item.topPerformer?.change}%
              </span>
              <span className="text-right text-red-400">
                ▼ {item.worstPerformer?.name}&nbsp;{item.worstPerformer?.change}%
              </span>
            </p>
          )}
        </div>
      </a>
    </div>
  )
}
