"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { formatRating } from "@/lib/format";

export type DimensionScore = { label: string; value: number };

/**
 * Ratings by dimension.
 *
 * Horizontal bars because the labels are long, and the numeric value is
 * printed beside each bar so colour and length are never the only signal.
 */
export function SoftwareRatingsChart({
  scores,
  colour,
}: {
  scores: DimensionScore[];
  colour: string;
}) {
  return (
    <div>
      <div className="h-56 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={scores}
            layout="vertical"
            margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
            barCategoryGap={12}
          >
            <XAxis type="number" domain={[0, 5]} hide />
            <YAxis
              type="category"
              dataKey="label"
              width={130}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 6, 6]} isAnimationActive={false}>
              {scores.map((score) => (
                <Cell key={score.label} fill={colour} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* The accessible version of the same data. */}
      <dl className="sr-only">
        {scores.map((score) => (
          <div key={score.label}>
            <dt>{score.label}</dt>
            <dd>{formatRating(score.value)} out of 5</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
