import MonthlySpendingChartSection from "./monthly-spending-chart-section/MonthlySpendingChartSection";

function MonthlySpendingChartCard() {
  return (
    <div className="dashboard-card bar-chart-card monthly-spending-chart-card">
      <h6 className="bar-chart-title">Monthly Credit vs Debit</h6>
      <MonthlySpendingChartSection />
    </div>
  );
}

export default MonthlySpendingChartCard;
