import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { formatAmountForDisplay } from "../../../../../../utils/formatUtils";

function MonthlyBalanceChart({ data }) {
  // Calculate max absolute value to scale Y axis properly
  const maxAmount = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((d) => d.balance));
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
    const color = value > 0 ? "#2e7d32" : "#d32f2f";
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
    const balance = payload[0].value;
    const isPositive = balance >= 0;
    const color = isPositive ? "#2e7d32" : "#d32f2f";
    const crdr = isPositive ? "CR" : "DR";
    return (
      <div className="monthly-balance-chart-tooltip">
        <div className="tooltip-month">
          Month: {month} {String(year)}
        </div>
        <div style={{ color }}>
          Balance: {formatAmountForDisplay(Math.abs(balance))} {crdr}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} height={200}>
        <defs>
          <linearGradient id="balanceLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1976d2" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#42a5f5" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          textAnchor="middle"
          height={30}
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
          width={40}
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
        <Line
          type="monotone"
          dataKey="balance"
          stroke="url(#balanceLine)"
          strokeWidth={3}
          dot={{ r: 3, stroke: "#fff", strokeWidth: 1, fill: "#1976d2" }}
          activeDot={{ r: 5, stroke: "#42a5f5", strokeWidth: 2, fill: "#fff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MonthlyBalanceChart;
