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

function DailyBalanceChart({ data, zoomIndex }) {
  const formatYAxis = (value) => (value / divisor).toFixed(0);
  const CustomYAxisTick = ({ x, y, payload }) => {
    const value = payload.value;
    const color = value > 0 ? "#2e7d32" : "#d32f2f";
    return (
      <text
        x={x}
        y={y + 4} // adjust vertical alignment
        textAnchor="end"
        fill={color}
        fontSize={12}
      >
        {formatYAxis(value)}
      </text>
    );
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const balance = payload[0].value;
    const isPositive = balance >= 0;
    const color = isPositive ? "#2e7d32" : "#d32f2f";
    const crdr = isPositive ? "CR" : "DR";
    const fullDate = new Date(
      payload[0].payload.originalDate
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return (
      <div className="daily-balance-chart-tooltip">
        <div className="daily-balance-chart-tooltip-date">Date: {fullDate}</div>
        <div style={{ color }}>
          Balance: {formatAmountForDisplay(Math.abs(balance))} {crdr}
        </div>
      </div>
    );
  };

  const maxBalance = useMemo(() => {
    return Math.max(...data.map((d) => d.balance));
  }, [data]);

  const { divisor, unit } = useMemo(() => {
    if (maxBalance >= 1e7) return { divisor: 1e7, unit: "Crores" };
    if (maxBalance >= 1e5) return { divisor: 1e5, unit: "Lacs" };
    if (maxBalance >= 1e3) return { divisor: 1e3, unit: "Thousands" };
    return { divisor: 1, unit: "" };
  }, [maxBalance]);

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
          dataKey="date"
          angle={-30}
          textAnchor="end"
          height={30}
          tick={{ fontSize: 12, fill: "#444" }}
          axisLine={{ stroke: "#cbd5e0" }}
          tickLine={{ stroke: "#cbd5e0" }}
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
          dot={
            zoomIndex >= 3
              ? false
              : { r: 3, stroke: "#fff", strokeWidth: 1, fill: "#1976d2" }
          }
          activeDot={
            zoomIndex >= 3
              ? false
              : { r: 5, stroke: "#42a5f5", strokeWidth: 2, fill: "#fff" }
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DailyBalanceChart;
