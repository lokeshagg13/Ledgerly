import SpendingPieChart from "./spending-pie-chart/SpendingPieChart";

function SpendingPieChartCard() {
  return (
    <div className="dashboard-card pie-chart-card">
      <h6 className="pie-chart-title">Category-wise spending (debits)</h6>
      <SpendingPieChart />
    </div>
  );
}

export default SpendingPieChartCard;
