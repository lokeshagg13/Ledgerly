import { useContext, useEffect, useState } from "react";
import IndividualDashboardContext from "../../../../../store/context/individualDashboardContext";
import ChartErrorImage from "../../../../../images/chart-error.png";
import LineChartSkeleton from "../../../../ui/skeletons/LineChartSkeleton";
import MonthlyBalanceChartControl from "./monthly-balance-chart-control/MonthlyBalanceChartControl";
import MonthlyBalanceChart from "./monthly-balance-chart/MonthlyBalanceChart";

function MonthlyBalanceChartSection() {
  const {
    financialYears,
    isLoadingMonthlyBalanceChart,
    monthlyBalanceChartError,
    financialYearsFetchError,
    fetchMonthlyBalanceChartData,
  } = useContext(IndividualDashboardContext);

  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  async function handleFetchChartData() {
    if (!selectedYear) return;
    const data = await fetchMonthlyBalanceChartData(selectedYear);
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

  if (isLoadingMonthlyBalanceChart) {
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

  if (monthlyBalanceChartError) {
    return (
      <div className="line-chart-error">
        <img src={ChartErrorImage} alt="" width={150} height="auto" />
        <p>{monthlyBalanceChartError}</p>
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

  const handleRefresh = () => {
    handleFetchChartData();
  };

  return (
    <div className="monthly-balance-chart-main">
      <MonthlyBalanceChartControl
        financialYears={financialYears}
        selectedYear={selectedYear}
        onYearSelect={setSelectedYear}
        onRefresh={handleRefresh}
      />
      <div className="monthly-balance-chart-container">
        <div className="monthly-balance-chart-wrapper">
          <MonthlyBalanceChart data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default MonthlyBalanceChartSection;
