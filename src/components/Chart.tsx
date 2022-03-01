import * as React from 'react';
import clsx from 'clsx';
import { timeFormat } from 'd3-time-format';
import { max, min, bisector } from 'd3-array';

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

import { formatPrice } from '@/utils';
import { useIsMounted } from '@/hooks/use-is-mounted';

type Datum = { date: string; close: number };

const secondaryColor = '#6086d6';
const tooltipStyles = {
  ...defaultStyles,
  background: '#4c6eb7',
  padding: '0.5rem',
  border: '0.5px solid white',
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
    <div
      className={clsx(
        'flex flex-col rounded-xl bg-[rgba(39,_39,_63,_1)] text-white shadow-md shadow-[rgba(0,_0,_0,_0.7)]'
      )}
    >
      <header className="flex flex-row items-center justify-between pt-6 px-7">
        <p className="flex flex-col items-start">
          <label className="text-2xl text-white">{label}</label>
          <label className="text-lg text-[#6086d6]">last 30 days</label>
        </p>
        <div className="flex flex-col items-end pb-0">
          <p className="text-2xl text-white">{formatPrice(currentPrice)}</p>
          <p className={clsx(`flex font-bold`, hasIncreased ? 'text-green-500' : 'text-red-500')}>
            <span className="text-2xl">{hasIncreased}</span>
            <span>{(hasIncreased ? '+' : '') + formatPrice(diffPrice)}</span>
          </p>
        </div>
      </header>
      <div className={clsx(`flex w-full max-w-full flex-1 pt-2`)}>
        <GraphWithTooltip data={data} height={h} width={w} />
      </div>
    </div>
  );
};

type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type TooltipProps = {
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
  margin = { top: 0, right: 0, bottom: 60, left: 0 },
}: TooltipProps) => {
  const isMounted = useIsMounted();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];

  const maxPrice = max(data, getPriceValue) as number;
  const minPrice = min(data, getPriceValue) as number;

  height = maxPrice < 500 ? height - 100 : height;

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<Datum>({
    tooltipOpen: typeof window !== 'undefined',
    tooltipLeft: 0,
    tooltipTop: 0,
  });

  // scales
  const xScale = React.useMemo(
    () =>
      scaleTime({
        range: [0, width],
        domain: [getDate(firstPoint), getDate(lastPoint)],
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
        tooltipLeft: x, //x,
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
    <div
      style={{
        width,
        height,
      }}
    >
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
          height={8}
          width={8}
          stroke="#27273f"
          strokeWidth={1}
          orientation={['diagonalRightToLeft']}
        />
        <Group top={margin.top} left={margin.left}>
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            left={margin.left + 5}
            numTicks={5}
            hideTicks
            hideAxisLine
            tickLabelProps={() => ({
              textAnchor: 'start',
              fontSize: 16,
              fontFamily: 'sans-serif',
              fill: '#d5d5d5',
              fontWeight: 'semi-bold',
              fontVariant: 'small-caps',
            })}
            tickComponent={({ formattedValue, ...tickProps }) => (
              <text
                {...tickProps}
                style={{}}
                fill="#ffffff"
                dy=".33em"
                fillOpacity={0.85}
                textAnchor="start"
              >
                {formattedValue}
              </text>
            )}
          />
          <GridRows
            left={margin.left}
            scale={yScale}
            width={width}
            y1={0}
            y2={innerHeight}
            strokeDasharray="1,3"
            stroke={'#f7f7f7'}
            strokeOpacity={0}
          />
          <GridColumns
            top={margin.top}
            scale={xScale}
            height={height - margin.bottom}
            width={width}
            strokeDasharray="1,3"
            stroke={'#fffffff6'}
            strokeOpacity={0}
            pointerEvents={'none'}
            orientation={'diagonal'}
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
            x={d => {
              return xScale(getDate(d)) ?? 0;
            }}
            y={d => yScale(getPriceValue(d)) ?? 0}
            stroke={secondaryColor}
            strokeWidth={2}
            strokeOpacity="10"
            curve={curveMonotoneX}
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
        </Group>
        {maxPrice - minPrice > 100 && (
          <>
            <EndRangePrice
              id="max"
              data={maxData}
              yText={`${yScale(maxPrice)}`}
              label={formatPrice(maxPrice)}
              x={d => xScale(getDate(d)) ?? 0}
              y={d => yScale(getPriceValue(d)) ?? 0}
            />
            <EndRangePrice
              id="min"
              data={minData}
              y={d => yScale(getPriceValue(d)) ?? 0}
              x={d => xScale(getDate(d)) ?? 0}
              yText={`${yScale(minPrice)}`}
              label={formatPrice(minPrice)}
            />
          </>
        )}
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
      {tooltipData && isMounted && (
        <>
          <TooltipInPortal
            className="translate-x-[1%] rounded-3xl"
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {getPriceValue(tooltipData)}
          </TooltipInPortal>

          <TooltipInPortal
            key={Math.random()}
            top={yScale(getPriceValue(minData[0])) + 12}
            left={tooltipLeft - 24}
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
    </div>
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
      <text fill="#8fa4d1" y={yText} dy={id === 'max' ? '1em' : '-.3em'} dx="1.75rem" fontSize="16">
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
