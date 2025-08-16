import DailyBalanceChart from "./daily-balance-chart/DailyBalanceChart";

function DailyBalanceChartCard() {
  return (
    <div className="dashboard-card line-chart-card">
      <h6 className="line-chart-title">Daily Balance Tracker</h6>
      <DailyBalanceChart />
    </div>
  );
}

export default DailyBalanceChartCard;
