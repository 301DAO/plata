import type { Datum, Margin } from '@/components/chart';
import { EndRangePrice, HoverLine } from '@/components/chart';
import { currency } from '@/utils';
import { AxisBottom } from '@visx/axis';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { PatternLines } from '@visx/pattern';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, LinePath } from '@visx/shape';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { bisector, max, min } from 'd3-array';
import dayjs from 'dayjs';
import * as React from 'react';

type TooltipProps = {
  data: Datum[];
  width: number;
  height: number;
  showControls?: boolean;
  margin?: Margin;
};

// util - Mar 08, '22
const formatDate = (date: Date) => dayjs(date).format("MMM DD, 'YY");

// accessors
const getDate = (d: Datum) => new Date(d.date);
const getPriceValue = (d: Datum) => d.close;
const bisectDate = bisector<Datum, Date>(d => new Date(d.date)).left;

const tooltipStyles = {
  ...defaultStyles,
  background: '#5171b6',
  padding: '0.5rem',
  border: '0.5px solid white',
  color: 'white',
};

const secondaryColor = '#6086d6';

export const GraphWithTooltip = ({
  data,
  width,
  height,
  margin = { top: 0, right: 0, bottom: 50, left: 0 },
}: TooltipProps) => {
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];

  const maxPrice = max(data, getPriceValue) as number;
  const minPrice = min(data, getPriceValue) as number;

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
        // nice: true,
      }),
    [firstPoint, lastPoint, width]
  );

  const yScale = React.useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [minPrice, maxPrice],
      }),
    [innerHeight, maxPrice, minPrice]
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
      <svg
        width={'100%'}
        height={height}
        ref={containerRef}
        onPointerMove={() => handlePointerMove}
      >
        <rect width={'100%'} height={height} fill="transparent" />
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
        <Group top={margin.top}>
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            left={margin.left}
            numTicks={4}
            tickComponent={({ formattedValue, ...tickProps }) => (
              <text
                {...tickProps}
                dy=".33em"
                style={{
                  fill: '#f7f7f7',
                  fontSize: '13px',
                  fillOpacity: 0.85,
                  textAnchor: 'start',
                }}
              >
                {formattedValue}
              </text>
            )}
          />
          <GridRows
            left={margin.left}
            scale={yScale}
            width={innerWidth}
            y1={0}
            y2={innerHeight}
            strokeDasharray="1,3"
            stroke={'#f7f7f7'}
            strokeOpacity={0}
          />
          <GridColumns
            left={margin.left}
            top={margin.top}
            scale={xScale}
            height={innerHeight}
            width={innerWidth}
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
            //curve={curveMonotoneX}
            fill="url(#gradient)"
          />
          <AreaClosed
            data={data}
            yScale={yScale}
            x={d => xScale(getDate(d)) ?? 0}
            y={d => yScale(getPriceValue(d)) ?? 0}
            stroke="transparent"
            strokeWidth={1}
            //curve={curveMonotoneX}
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
            // curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={handlePointerMove}
            onTouchMove={handlePointerMove}
            onMouseMove={handlePointerMove}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>
        {maxPrice && (
          <>
            <EndRangePrice
              id="max"
              data={maxData}
              yText={`${yScale(maxPrice)}`}
              label={currency(maxPrice)}
              x={d => xScale(getDate(d)) ?? 0}
              y={d => yScale(getPriceValue(d)) ?? 0}
            />
            <EndRangePrice
              id="min"
              data={minData}
              y={d => yScale(getPriceValue(d)) ?? 0}
              x={d => xScale(getDate(d)) ?? 0}
              yText={`${yScale(minPrice)}`}
              label={currency(minPrice)}
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
      {tooltipData && (
        <>
          <TooltipInPortal
            className="translate-x-[1%] rounded-3xl"
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {currency(getPriceValue(tooltipData))}
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
    </>
  );
};
