import * as React from 'react';
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
import { AreaClosed, LinePath, Bar } from '@visx/shape';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';

import { currency } from '@/utils';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { Datum, Margin } from '@/components/chart';
import { EndRangePrice, HoverLine, secondaryColor } from '@/components/chart';

type TooltipProps = {
  data: Datum[];
  width: number;
  height: number;
  showControls?: boolean;
  margin?: Margin;
};

// util
const formatDate = timeFormat("%b %d, '%y");

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

export const GraphWithTooltip = ({
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
    </div>
  );
};
