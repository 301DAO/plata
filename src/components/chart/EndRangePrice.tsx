import * as React from 'react';
import { LinePath } from '@visx/shape';
import clsx from 'clsx';

import type { Datum } from '@/components/chart';
import { secondaryColor } from '@/components/chart/style';

type EndRangePriceProps = {
  id: string;
  data: Datum[];
  label: string;
  yText: string;
  x: (d: Datum) => number;
  y: (d: Datum) => number;
};

export const EndRangePrice = ({ id, data, label, yText, x, y }: EndRangePriceProps) => {
  return (
    <g id={id} className="">
      <LinePath
        data={data}
        y={y}
        x={x}
        stroke={secondaryColor}
        strokeWidth={1}
        strokeDasharray="4,4"
        strokeOpacity=".3"
      />
      <text
        fill="#a1b2d6"
        y={yText}
        dy={id === 'max' ? '1em' : '-.3em'}
        dx="1.7rem"
        className={clsx(`pl-12 text-sm font-semibold sm:text-lg`, id === 'max' ? 'py-2' : '')}
      >
        {label}
      </text>
    </g>
  );
};
