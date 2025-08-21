import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatAmountForDisplay } from "../../../../../../utils/formatUtils";

function MonthlySpendingChart({ data }) {
  // Calculate max absolute value to scale Y axis properly
  const maxAmount = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(
      ...data.flatMap((d) => [Math.abs(d.debit || 0), Math.abs(d.credit || 0)])
    );
  }, [data]);

  // Determine unit (Thousands, Lacs, Crores)
  const { divisor, unit } = useMemo(() => {
    if (maxAmount >= 1e7) return { divisor: 1e7, unit: "Crores" };
    if (maxAmount >= 1e5) return { divisor: 1e5, unit: "Lacs" };
    if (maxAmount >= 1e3) return { divisor: 1e3, unit: "Thousands" };
    return { divisor: 1, unit: "" };
  }, [maxAmount]);

  const formatYAxis = (value) => (value / divisor).toFixed(0);

  // Custom Y-axis tick (green for credit, red for debit)
  const CustomYAxisTick = ({ x, y, payload }) => {
    const value = payload.value;
    const color = value >= 0 ? "#388e3c" : "#c62828";
    return (
      <text x={x} y={y + 4} textAnchor="end" fill={color} fontSize={12}>
        {formatYAxis(value)}
      </text>
    );
  };

  // Custom tooltip for both debit and credit
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    const { month, year } = payload[0].payload;
    const debit = payload.find((p) => p.dataKey === "debit")?.value || 0;
    const credit = payload.find((p) => p.dataKey === "credit")?.value || 0;

    return (
      <div className="monthly-spending-chart-tooltip">
        <div className="tooltip-month">
          Month: {month} {String(year)}
        </div>
        <div style={{ color: "#c62828" }}>
          Debit: {formatAmountForDisplay(debit)}
        </div>
        <div style={{ color: "#388e3c" }}>
          Credit: {formatAmountForDisplay(credit)}
        </div>
      </div>
    );
  };

  // Custom legend renderer
  const CustomLegend = ({ payload }) => {
    if (!payload) return null;
    return (
      <div className="monthly-spending-chart-legend">
        {payload.map((entry) => (
          <div
            key={entry.value}
            className="monthly-spending-chart-legend-entry"
          >
            <span
              className="monthly-spending-chart-legend-color"
              style={{
                backgroundColor: entry.color,
              }}
            />
            {entry.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} height={250} barGap={0} barCategoryGap={12}>
        <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#444" }}
          axisLine={{ stroke: "#cbd5e0" }}
          tickLine={{ stroke: "#cbd5e0" }}
          tickFormatter={(value, index) => {
            const { year } = data[index];
            return `${value} ${String(year)}`;
          }}
        />
        <YAxis
          tick={<CustomYAxisTick />}
          width={50}
          axisLine={{ stroke: "#cbd5e0" }}
          tickLine={{ stroke: "#cbd5e0" }}
          label={
            unit
              ? {
                  value: `₹ in ${unit}`,
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  style: {
                    textAnchor: "middle",
                    fontSize: 13,
                    fill: "#555",
                    fontWeight: 500,
                  },
                }
              : undefined
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} content={<CustomLegend />} />
        <Bar dataKey="debit" fill="#e57373" name="Debit" />
        <Bar dataKey="credit" fill="#66bb6a" name="Credit" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlySpendingChart;
