import { useContext, useEffect, useState } from "react";
import IndividualDashboardContext from "../../../../../store/context/individualDashboardContext";
import DailyBalanceChartControl from "./daily-balance-chart-control/DailyBalanceChartControl";
import DailyBalanceChart from "./daily-balance-chart/DailyBalanceChart";
import ChartErrorImage from "../../../../../images/chart-error.png";
import LineChartSkeleton from "../../../../ui/skeletons/LineChartSkeleton";

const zoomLevels = [
  { label: "7-day", length: 7 },
  { label: "15-day", length: 15 },
  { label: "monthly", length: 30 },
  { label: "quarterly", length: 90 },
];

function DailyBalanceChartSection() {
  const {
    financialYears,
    isLoadingDailyBalanceChart,
    dailyBalanceChartError,
    financialYearsFetchError,
    fetchDailyBalanceChartData,
  } = useContext(IndividualDashboardContext);

  const [chartData, setChartData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [selectedYear, setSelectedYear] = useState(null);

  const windowLength = zoomLevels[zoomIndex].length;

  async function handleFetchChartData() {
    if (!selectedYear) return;
    const data = await fetchDailyBalanceChartData(selectedYear);
    const formatted = data.map((item) => ({
      ...item,
      originalDate: item.date,
      date: new Date(item.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    }));
    setChartData(formatted);
    setStartIndex(Math.max(0, formatted.length - windowLength));
  }

  useEffect(() => {
    if (financialYears?.length > 0) {
      const latestYear = financialYears[financialYears.length - 1];
      setSelectedYear(latestYear);
    }
  }, [financialYears]);

  useEffect(() => {
    handleFetchChartData();
    // eslint-disable-next-line
  }, [selectedYear]);

  const endIndex = startIndex + windowLength;
  const currentData = chartData.slice(startIndex, endIndex);

  if (isLoadingDailyBalanceChart) {
    return <LineChartSkeleton />;
  }

  if (financialYearsFetchError) {
    return (
      <div className="line-chart-error">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>{financialYearsFetchError}</p>
      </div>
    );
  }

  if (dailyBalanceChartError) {
    return (
      <div className="line-chart-error">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>{dailyBalanceChartError}</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="line-chart-empty">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>No transactions found.</p>
      </div>
    );
  }

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(chartData.length - windowLength, prev + 1)
    );
  };

  const handleZoomIn = () => {
    if (zoomIndex > 0) {
      setZoomIndex((prev) => prev - 1);
      setStartIndex(Math.max(0, endIndex - zoomLevels[zoomIndex - 1].length));
    }
  };

  const handleZoomOut = () => {
    if (zoomIndex < zoomLevels.length - 1) {
      setZoomIndex((prev) => prev + 1);
      setStartIndex(Math.max(0, endIndex - zoomLevels[zoomIndex + 1].length));
    }
  };

  const handleRefresh = () => {
    handleFetchChartData();
  };

  return (
    <div className="daily-balance-chart-main">
      <DailyBalanceChartControl
        financialYears={financialYears}
        selectedYear={selectedYear}
        onYearSelect={setSelectedYear}
        onPrev={handlePrev}
        onNext={handleNext}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRefresh={handleRefresh}
        canPrev={startIndex > 0}
        canNext={startIndex < chartData.length - windowLength}
        canZoomIn={zoomIndex > 0}
        canZoomOut={zoomIndex < zoomLevels.length - 1}
      />
      <div className="daily-balance-chart-container">
        <div className="daily-balance-chart-wrapper">
          <DailyBalanceChart data={currentData} zoomIndex={zoomIndex} />
        </div>
      </div>
    </div>
  );
}

export default DailyBalanceChartSection;
