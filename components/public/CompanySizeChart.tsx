"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { formatNumber } from "@/lib/format";

const SLICE_COLOURS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

/**
 * Who is actually reviewing this product.
 *
 * Worth showing because a five star average from businesses of ten people
 * tells a two hundred person company very little, and vice versa.
 */
export function CompanySizeChart({
  breakdown,
}: {
  breakdown: Record<string, number>;
}) {
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Not enough reviews yet to break this down.
      </p>
    );
  }

  const data = entries.map(([name, value]) => ({ name, value }));

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="size-40 shrink-0" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={SLICE_COLOURS[index % SLICE_COLOURS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <dl className="flex min-w-0 flex-1 flex-col gap-2.5 text-sm">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: SLICE_COLOURS[index % SLICE_COLOURS.length],
              }}
            />
            <dt className="min-w-0 flex-1 truncate text-muted-foreground">
              {entry.name}
            </dt>
            <dd className="shrink-0 font-medium tabular-nums">
              {formatNumber(entry.value)}
              <span className="ml-1.5 text-muted-foreground">
                ({Math.round((entry.value / total) * 100)}%)
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
