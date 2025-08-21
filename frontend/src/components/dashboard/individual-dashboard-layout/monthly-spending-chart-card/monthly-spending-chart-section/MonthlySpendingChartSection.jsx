import { useContext, useEffect, useState } from "react";
import DashboardContext from "../../../../../store/context/dashboardContext";
import MonthlySpendingChart from "./monthly-spending-chart/MonthlySpendingChart";
import MonthlySpendingChartControl from "./monthly-spending-chart-control/MonthlySpendingChartControl";
import ChartErrorImage from "../../../../../images/chart-error.png";
import BarChartSkeleton from "../../../../ui/skeletons/BarChartSkeleton";

function MonthlySpendingChartSection() {
  const {
    financialYears,
    isLoadingMonthlySpendingChart,
    monthlySpendingChartError,
    financialYearsFetchError,
    fetchMonthlySpendingChartData,
  } = useContext(DashboardContext);

  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  async function handleFetchChartData() {
    if (!selectedYear) return;
    const data = await fetchMonthlySpendingChartData(selectedYear);
    setChartData(data);
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

  if (isLoadingMonthlySpendingChart) {
    return <BarChartSkeleton />;
  }

  if (financialYearsFetchError) {
    return (
      <div className="bar-chart-error">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>{financialYearsFetchError}</p>
      </div>
    );
  }

  if (monthlySpendingChartError) {
    return (
      <div className="bar-chart-error">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>{monthlySpendingChartError}</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bar-chart-empty">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>No transactions found.</p>
      </div>
    );
  }

  const handleRefresh = () => {
    handleFetchChartData();
  };

  return (
    <div className="monthly-spending-chart-main">
      <MonthlySpendingChartControl
        financialYears={financialYears}
        selectedYear={selectedYear}
        onYearSelect={setSelectedYear}
        onRefresh={handleRefresh}
      />
      <div className="monthly-spending-chart-container">
        <div className="monthly-spending-chart-wrapper">
          <MonthlySpendingChart data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default MonthlySpendingChartSection;
