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
        stroke="#f8f8f8a0"
        strokeWidth={0.8}
        strokeDasharray={0}
        pointerEvents="none"
      />
      <circle
        cx={tooltipLeft}
        cy={tooltipTop + 1}
        r={9}
        fill={fillColor}
        fillOpacity={0.6}
        strokeWidth={2}
        pointerEvents="none"
      />
      <circle
        cx={tooltipLeft}
        cy={tooltipTop + 1}
        r={3}
        fill={fillColor}
        fillOpacity={1}
        strokeWidth={2}
        pointerEvents="none"
      />
    </g>
  );
};
