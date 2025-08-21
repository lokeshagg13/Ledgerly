import MonthlyBalanceChartSection from "./monthly-balance-chart-section/MonthlyBalanceChartSection";

function MonthlyBalanceChartCard() {
  return (
    <div className="dashboard-card line-chart-card monthly-balance-chart-card">
      <h6 className="line-chart-title">Monthly Balance Tracker</h6>
      <MonthlyBalanceChartSection />
    </div>
  );
}

export default MonthlyBalanceChartCard;
