import * as React from 'react';
import { Line } from '@visx/shape';
import type { Margin } from '@/components/chart';

type HoverLineProps = {
  margin?: Margin;
  h?: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  tooltipLeft: number;
  tooltipTop: number;
  fillColor: string;
};

export const HoverLine = ({ from, to, tooltipLeft, tooltipTop, fillColor }: HoverLineProps) => {
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
