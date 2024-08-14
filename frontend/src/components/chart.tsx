"use client";

import { formatAsMonthDay } from "@/lib/utils";
import {
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  TooltipProps,
  BarChart,
  Bar,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  label,
  active,
  payload,
  labelFormatter,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border border-border rounded-sm">
        <p className="text-card-foreground">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </p>
        {payload.map((item) => (
          <p
            key={item.name}
            className="text-[hsl(var(--current-period-stroke))]"
          >
            {`${item.name}: ${
              typeof item.value === "number"
                ? item.value.toFixed(1)
                : item.value
            }`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface Props {
  data: any;
}

export default function Chart({ data }: Props) {
  return (
    <div className="flex flex-grow justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid
            stroke="hsl(var(--muted-foreground)/0.2)"
            strokeDasharray="5 5"
          />
          <Tooltip
            content={<CustomTooltip labelFormatter={formatAsMonthDay} />}
            cursor={{
              fill: "transparent",
            }}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={{ stroke: "#ddd" }}
            tickFormatter={formatAsMonthDay}
          />
          <YAxis
            dataKey="hours_worked"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(0)}`}
            width={25}
          />
          <Bar
            dataKey="hours_worked"
            name="Hours Worked"
            fill="#212129"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
