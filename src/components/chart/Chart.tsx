import { GraphWithTooltip } from '@/components/chart';
import { useIsMounted, useWindowSize } from '@/hooks';
import { currency } from '@/utils';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import clsx from 'clsx';

const MAX_HEIGHT = 450;

export const Chart = ({
  data,
  label,
  totalBalance,
}: {
  data: any;
  label: string;
  totalBalance: number;
}) => {
  const isMounted = useIsMounted();
  const { height } = useWindowSize();

  if (!isMounted || !data || data.length === 0) return <></>;

  const { close: currentPrice } = data[data.length - 1];
  const { close: firstPrice } = data[0];
  const diffPrice = currentPrice - firstPrice;
  const diffPercentage = ((diffPrice / firstPrice) * 100).toFixed(2);
  const hasIncreased = diffPrice > 0;

  const chartHeight = (height || 0) * (60 / 100);

  const header = document.getElementById('chart-header');
  const headerHeight = (header ? header.clientHeight : 0) + 24;

  return (
    <div
      style={{ maxHeight: MAX_HEIGHT }}
      className={clsx(
        `flex min-w-full flex-col rounded-xl text-white shadow-md shadow-[rgba(0,_0,_0,_0.7)] dark:bg-[#14141b]`
      )}
    >
      <header className="flex flex-row items-center justify-between px-4 pt-3 pb-3 sm:px-7 sm:pt-4 sm:pb-2">
        <p className="flex flex-col items-start" id="chart-header">
          <label className="text-xl font-extrabold tracking-normal dark:text-gray-100 sm:text-3xl">
            {label}
          </label>
          <label className="text-sm text-[#6086d6] sm:text-xl">last 30 days</label>
        </p>
        <div className="flex flex-col items-end pb-0">
          <p className="text-xl font-extrabold tracking-normal dark:text-white sm:text-3xl sm:tracking-wide">
            {currency(totalBalance)}
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
      <ParentSize
        debounceTime={10}
        id="chart"
        aria-label="Chart"
        // TODO: put spinner component here
        placeholder=""
        className={clsx(`dark:text-white`)}
        parentSizeStyles={{
          height: chartHeight - headerHeight,
          width: '100%',
        }}
      >
        {({ width, height }) => {
          const h = Math.min(MAX_HEIGHT, height);
          return (
            <div style={{ maxHeight: h }}>
              <GraphWithTooltip width={width} height={h} data={data} />
            </div>
          );
        }}
      </ParentSize>
    </div>
  );
};
