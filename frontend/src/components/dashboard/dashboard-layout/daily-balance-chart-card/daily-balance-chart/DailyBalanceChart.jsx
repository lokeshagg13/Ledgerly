import { useContext, useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Button } from "react-bootstrap";

import DashboardContext from "../../../../../store/context/dashboardContext";

function DailyBalanceChart() {
  const {
    isLoadingDailyBalanceChart,
    dailyBalanceChartError,
    fetchDailyBalanceChartData,
  } = useContext(DashboardContext);

  const [chartData, setChartData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  async function handleFetchChartData() {
    const data = await fetchDailyBalanceChartData();
    const formatted = data.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    }));
    setChartData(formatted);
    setStartIndex(Math.max(0, formatted.length - 15));
  }

  useEffect(() => {
    handleFetchChartData();
    // eslint-disable-next-line
  }, []);

  // Get current window of data (15 items max)
  const endIndex = startIndex + 15;
  const currentData = chartData.slice(startIndex, endIndex);

  const maxBalance = useMemo(() => {
    return Math.max(...currentData.map((d) => d.balance));
  }, [currentData]);

  const { divisor, unit } = useMemo(() => {
    if (maxBalance >= 1e7) return { divisor: 1e7, unit: "Crores" };
    if (maxBalance >= 1e5) return { divisor: 1e5, unit: "Lacs" };
    if (maxBalance >= 1e3) return { divisor: 1e3, unit: "Thousands" };
    return { divisor: 1, unit: "" };
  }, [maxBalance]);

  if (isLoadingDailyBalanceChart) {
    return <div>Loading...</div>;
  }

  if (dailyBalanceChartError) {
    return <div>{dailyBalanceChartError}</div>;
  }

  if (chartData.length === 0) {
    return <div>Nothing found</div>;
  }

  const formatYAxis = (value) => (value / divisor).toFixed(0);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(chartData.length - 15, prev + 1));
  };

  return (
    <div className="daily-balance-chart-main">
      <div className="daily-balance-chart-nav-controls">
        <Button
          variant="outlined"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          ← Previous
        </Button>
        <Button
          variant="outlined"
          onClick={handleNext}
          disabled={startIndex >= chartData.length - 15}
        >
          Next →
        </Button>
      </div>
      <div className="daily-balance-chart-container">
        <div className="daily-balance-chart-wrapper">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={currentData} height={200}>
              <defs>
                <linearGradient id="balanceLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1976d2" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#42a5f5" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-30}
                textAnchor="end"
                height={30}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickMargin={4}
                width={40}
                tick={{ fontSize: 12 }}
                label={
                  unit
                    ? {
                        value: `₹ in ${unit}`,
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        style: {
                          textAnchor: "middle",
                          fontSize: 14,
                          fill: "#444",
                        },
                      }
                    : undefined
                }
              />
              <Tooltip
                formatter={(value) =>
                  `₹${(value / divisor).toFixed(2)} ${unit}`
                }
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#1976d2"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DailyBalanceChart;
