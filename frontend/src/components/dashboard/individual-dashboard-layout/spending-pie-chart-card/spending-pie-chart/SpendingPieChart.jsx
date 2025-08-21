import { useContext, useEffect, useRef, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

import DashboardContext from "../../../../../store/context/dashboardContext";
import { formatAmountForDisplay } from "../../../../../utils/formatUtils";
import ChartErrorImage from "../../../../../images/chart-error.png";
import PieChartSkeleton from "../../../../ui/skeletons/PieChartSkeleton";

function SpendingPieChart() {
  const {
    isLoadingSpendingPieChart,
    spendingPieChartError,
    fetchSpendingPieChartData,
  } = useContext(DashboardContext);
  const [chartData, setChartData] = useState([]);
  const [touchedPieInfo, setTouchedPieInfo] = useState(null);
  const tooltipTimeoutRef = useRef(null);

  async function handleFetchChartData() {
    const data = await fetchSpendingPieChartData();
    setChartData(data);
  }

  useEffect(() => {
    handleFetchChartData();
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, []);

  if (isLoadingSpendingPieChart) {
    return <PieChartSkeleton />;
  }

  if (spendingPieChartError) {
    return (
      <div className="pie-chart-error">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>{spendingPieChartError}</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="pie-chart-empty">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>No debit transactions found.</p>
      </div>
    );
  }

  const handlePieTouch = (event, item) => {
    if (event.nativeEvent.pointerType !== "touch") return;
    const data = chartData[item?.dataIndex];
    setTouchedPieInfo({
      label: data.label,
      value: data.value,
      color: data.color,
    });
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      setTouchedPieInfo(null);
      tooltipTimeoutRef.current = null;
    }, 40000);
  };

  return (
    <div className="pie-chart">
      <PieChart
        width={250}
        height={250}
        colors={[chartData.map((item) => item.color)]}
        series={[
          {
            data: chartData,
            innerRadius: 50,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360,
          },
        ]}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
        onItemClick={handlePieTouch}
      />

      {touchedPieInfo && (
        <div className="pie-info-container">
          <table>
            <tbody>
              <tr>
                <td>
                  <div
                    className="pie-info-color"
                    style={{
                      backgroundColor: touchedPieInfo.color || "#999",
                    }}
                  />
                </td>
                <td>{touchedPieInfo.label}</td>
                <td>{formatAmountForDisplay(touchedPieInfo.value)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SpendingPieChart;
