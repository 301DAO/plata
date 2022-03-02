import * as React from 'react';
import clsx from 'clsx';

import type { Datum } from '@/components/chart';
import { GraphWithTooltip } from '@/components/chart';
import { currency } from '@/utils';

type ChartOptions = {
  data: Datum[];
  w: number;
  h: number;
  label: string;
};

export const Chart = ({ data, w, h, label }: ChartOptions) => {
  if (!data.length) return <p>empty data</p>;
  const { close: currentPrice } = data[data.length - 1];
  const { close: firstPrice } = data[0];
  const diffPrice = currentPrice - firstPrice;
  const diffPercentage = ((diffPrice / firstPrice) * 100).toFixed(2);
  const hasIncreased = diffPrice > 0;

  return (
    <div
      className={clsx(
        'flex flex-col rounded-xl text-white shadow-md shadow-[rgba(0,_0,_0,_0.7)] dark:bg-[#14141b]'
      )}
    >
      <header className="flex flex-row items-center justify-between px-4 pt-3 sm:px-7 sm:pt-6">
        <p className="flex flex-col items-start">
          <label className="text-xl font-extrabold tracking-normal dark:text-gray-100 sm:text-3xl">
            {label}
          </label>
          <label className="text-sm text-[#6086d6] sm:text-xl">last 30 days</label>
        </p>
        <div className="flex flex-col items-end pb-0">
          <p className="text-xl font-extrabold tracking-normal dark:text-white sm:text-3xl sm:tracking-wide">
            {currency(currentPrice)}
          </p>
          <p
            className={clsx(
              `flex text-sm font-semibold sm:text-lg`,
              hasIncreased ? 'text-green-500' : 'text-red-500'
            )}
          >
            <span>{(hasIncreased ? '+' : '') + currency(diffPrice)}</span>
            <span className=" sm:block">&nbsp;({diffPercentage}%)</span>
          </p>
        </div>
      </header>
      <div className={clsx(`flex w-full max-w-full flex-1 pt-2`)}>
        <GraphWithTooltip data={data} height={h} width={w} />
      </div>
    </div>
  );
};
