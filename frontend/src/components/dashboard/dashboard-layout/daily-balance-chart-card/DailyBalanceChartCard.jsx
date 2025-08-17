import DailyBalanceChartSection from "./daily-balance-chart-section/DailyBalanceChartSection";

function DailyBalanceChartCard() {
  return (
    <div className="dashboard-card line-chart-card daily-balance-chart-card">
      <h6 className="line-chart-title">Daily Balance Tracker</h6>
      <DailyBalanceChartSection />
    </div>
  );
}

export default DailyBalanceChartCard;
