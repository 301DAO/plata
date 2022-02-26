import * as React from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import clsx from 'clsx';
import { timeFormat } from 'd3-time-format';
import { max, min, extent, bisector } from 'd3-array';

import { Group } from '@visx/group';
import { AxisBottom } from '@visx/axis';
import { localPoint } from '@visx/event';
import { PatternLines } from '@visx/pattern';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath, Line, Bar } from '@visx/shape';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';

import { formatPrice } from '@/utils/price-formatters';
import { getPortfolioValue } from '@/api/blockchain/covalent';
import { shapeData, getBalanceOverTime } from '@/api/blockchain/utils';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params, req, res, query } = context;
  try {
    const response = await getPortfolioValue({
      address: '0x0F4ee9631f4be0a63756515141281A3E2B293Bbe',
    });
    const shapedData = shapeData(response.data.items);
    const data = getBalanceOverTime(shapedData).historical;
    return { props: { data, error: null } };
  } catch (error) {
    return {
      props: {
        data: [],
        error:
          error instanceof Error ? error.message : 'Encountered an error in getServerSideProps',
      },
    };
  }
};

type Datum = { date: string; close: number };

const secondaryColor = '#6086d6';
const tooltipStyles = {
  ...defaultStyles,
  background: '#4c6eb7',
  padding: '0.5rem',
  border: '1px solid white',
  color: 'white',
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d: Datum) => new Date(d.date);
const getPriceValue = (d: Datum) => d.close;
const bisectDate = bisector<Datum, Date>(d => new Date(d.date)).left;

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const Dashboard = ({ data, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // Chart dimensions
  const [w, h] = [1200, 400];

  const label = 'Portfolio Value';

  return (
    <main className="relative flex items-center justify-center w-full h-full overflow-hidden">
      <Chart data={data} label={label} w={w} h={h} />
    </main>
  );
};

export default Dashboard;
type ChartOptions = {
  data: Datum[];
  w: number;
  h: number;
  label: string;
};
export const Chart = ({ data, w, h, label }: ChartOptions) => {
  if (!data.length) return <p>empty data</p>;
  const currentPrice = data[data.length - 1].close;
  const firstPrice = data[0].close;
  const diffPrice = currentPrice - firstPrice;
  const hasIncreased = diffPrice > 0;
  return (
    <div className="flex flex-col rounded-xl bg-[rgba(39,_39,_63,_1)] text-white shadow-md shadow-[rgba(0,_0,_0,_0.7)]">
      <header className="flex flex-row items-center justify-between pt-6 px-7">
        <p className="flex flex-col items-start">
          <label className="text-2xl text-white">{label}</label>
          <label className="text-lg text-[#6086d6]">last 30 days</label>
        </p>
        <div className="flex flex-col items-end pb-0">
          <p className="text-2xl text-white">{formatPrice(currentPrice)}</p>
          <p className={clsx(`flex`, hasIncreased ? 'text-green-500' : 'text-red-500')}>
            <span className="text-2xl">{hasIncreased}</span>
            <span>{(hasIncreased ? '+' : '-') + formatPrice(diffPrice)}</span>
          </p>
        </div>
      </header>
      <section className="flex flex-1 pt-2">
        <GraphWithTooltip data={data} height={h} width={w} />
      </section>
    </div>
  );
};

type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type TooltipProps = {
  data: Datum[];
  width: number;
  height: number;
  showControls?: boolean;
  margin?: Margin;
};

const GraphWithTooltip = ({
  data,
  width,
  height,
  showControls = true,
  margin = { top: 0, right: 0, bottom: 60, left: 0 },
}: TooltipProps) => {
  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];

  const maxPrice = max(data, getPriceValue) as number;
  const minPrice = min(data, getPriceValue) as number;

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<Datum>({
    tooltipOpen: typeof window !== 'undefined',
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: firstPoint,
  });

  // scales
  const xScale = React.useMemo(
    () =>
      scaleTime({
        range: [margin.left, width + margin.left],
        domain: extent(data, getDate) as [Date, Date],
        //  nice: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [innerWidth, margin.top]
  );

  const yScale = React.useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [minPrice, (maxPrice || 0) + innerHeight / 3],
        //    nice: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [margin.top, innerHeight]
  );

  const handlePointerMove = React.useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(getPriceValue(d)),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showTooltip, yScale, xScale]
  );
  const maxData = [
    { date: firstPoint.date, close: maxPrice },
    { date: lastPoint.date, close: maxPrice },
  ];
  const minData = [
    { date: firstPoint.date, close: minPrice },
    { date: lastPoint.date, close: minPrice },
  ];

  if (width < 10) return null;
  return (
    <>
      <svg width={width} height={height} ref={containerRef} onPointerMove={() => handlePointerMove}>
        <LinearGradient
          id="gradient"
          from={secondaryColor}
          to={secondaryColor}
          fromOpacity={0.3}
          toOpacity={0}
        />
        <PatternLines
          id="dLines"
          height={6}
          width={10}
          stroke="#27273f"
          strokeWidth={1}
          orientation={['diagonalRightToLeft', 'diagonal']}
        />
        <Group top={margin.top} left={margin.left}>
          <GridRows
            left={margin.left}
            scale={yScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={'#f7f7f7'}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={xScale}
            height={innerHeight}
            strokeDasharray="1"
            stroke={'#f7f7f75b'}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <EndRangePrice
            id="max-price"
            data={maxData}
            yText={`${yScale(maxPrice)}`}
            label={formatPrice(maxPrice)}
            x={d => xScale(getDate(d)) ?? 0}
            y={d => yScale(getPriceValue(d)) ?? 0}
          />
          <AreaClosed
            data={data}
            yScale={yScale}
            x={d => xScale(getDate(d)) ?? 0}
            y={d => yScale(getPriceValue(d)) ?? 0}
            stroke="url(#gradient)"
            strokeWidth={1}
            curve={curveMonotoneX}
            fill="url(#gradient)"
          />
          <AreaClosed
            data={data}
            yScale={yScale}
            x={d => xScale(getDate(d)) ?? 0}
            y={d => yScale(getPriceValue(d)) ?? 0}
            stroke="transparent"
            strokeWidth={1}
            curve={curveMonotoneX}
            fill="url(#dLines)"
          />
          <LinePath
            data={data}
            x={d => xScale(getDate(d)) ?? 0}
            y={d => yScale(getPriceValue(d)) ?? 0}
            stroke={secondaryColor}
            strokeWidth={2}
            strokeOpacity="10"
            curve={curveMonotoneX}
          />
          <EndRangePrice
            id="min-price"
            data={minData}
            y={d => yScale(getPriceValue(d)) ?? 0}
            x={d => xScale(getDate(d)) ?? 0}
            yText={`${yScale(minPrice)}`}
            label={formatPrice(minPrice)}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={handlePointerMove}
            onTouchMove={handlePointerMove}
            onMouseMove={handlePointerMove}
            onMouseLeave={() => hideTooltip()}
          />
          <AxisBottom
            scale={xScale}
            tickValues={xScale.ticks(4)}
            strokeWidth={1}
            top={innerHeight - margin.top}
            left={margin.left}
            hideTicks
            hideAxisLine
            tickLength={20}
            tickClassName="text-xl font-semibold leading-relaxed tracking-widest fill-white"
            tickLabelProps={d => ({
              textAnchor: 'middle',
              fontSize: 16,
              fontFamily: 'sans-serif',
              fill: '#d5d5d5',
              fontWeight: 'semi-bold',
              fontVariant: 'small-caps',
              width: 100,
            })}
          />
        </Group>
        {tooltipData && (
          <HoverLine
            from={{
              x: tooltipLeft,
              y: yScale(getPriceValue(maxData[0])),
            }}
            to={{
              x: tooltipLeft,
              y: yScale(getPriceValue(minData[0])),
            }}
            tooltipLeft={tooltipLeft}
            tooltipTop={tooltipTop}
            fillColor={'#00f1a1'}
          />
        )}
      </svg>
      {tooltipData && typeof window !== 'undefined' && (
        <>
          <TooltipInPortal
            className="translate-x-[1%]"
            key={Math.random()}
            top={tooltipTop! - 12}
            left={tooltipLeft! + 12}
            style={tooltipStyles}
          >
            {getPriceValue(tooltipData)}
          </TooltipInPortal>

          <TooltipInPortal
            top={yScale(getPriceValue(minData[0])) + 4}
            left={tooltipLeft}
            className="rounded-b-lg bg-[#27273f] text-white"
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: 'center',
            }}
          >
            {formatDate(getDate(tooltipData))}
          </TooltipInPortal>
        </>
      )}
    </>
  );
};

const EndRangePrice = ({
  id,
  data,
  label,
  yText,
  x,
  y,
}: {
  id: string;
  data: Datum[];
  label: string;
  yText: string;
  x: {
    (d: Datum): number;
  };
  y: {
    (d: Datum): number;
  };
}) => {
  return (
    <g id={id}>
      <LinePath
        data={data}
        y={y}
        x={x}
        stroke={secondaryColor}
        strokeWidth={1}
        strokeDasharray="4,4"
        strokeOpacity=".3"
      />
      <text fill="#8fa4d1" y={yText} dy="1.3em" dx="1.75rem" fontSize="16">
        {label}
      </text>
    </g>
  );
};

const HoverLine = ({
  from,
  to,
  tooltipLeft,
  tooltipTop,
  fillColor,
}: {
  margin?: Margin;
  h?: number;
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
  tooltipLeft: number;
  tooltipTop: number;
  fillColor: string;
}) => {
  return (
    <g>
      <Line
        from={from}
        to={to}
        stroke="white"
        strokeWidth={1}
        strokeDasharray="2,2"
        pointerEvents="none"
      />
      <circle
        cx={tooltipLeft}
        cy={tooltipTop + 1}
        r={12}
        fill={fillColor}
        fillOpacity={0.3}
        strokeWidth={2}
        pointerEvents="none"
      />
      <circle
        cx={tooltipLeft}
        cy={tooltipTop}
        r={6}
        fill={fillColor}
        fillOpacity={0.8}
        strokeWidth={2}
        pointerEvents="none"
      />
    </g>
  );
};
