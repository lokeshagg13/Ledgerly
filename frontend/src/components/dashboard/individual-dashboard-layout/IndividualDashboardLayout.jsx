import { CategoryProvider } from "../../../store/context/categoryContext";
import { IndividualDashboardContextProvider } from "../../../store/context/individualDashboardContext";
import OverallBalanceCard from "./balance-cards/overall-balance-card/OverallBalanceCard";
import FilteredBalanceCard from "./balance-cards/filtered-balance-card/FilteredBalanceCard";
import SpendingPieChartCard from "./spending-pie-chart-card/SpendingPieChartCard";
import DailyBalanceChartCard from "./daily-balance-chart-card/DailyBalanceChartCard";
import MonthlySpendingChartCard from "./monthly-spending-chart-card/MonthlySpendingChartCard";
import MonthlyBalanceChartCard from "./monthly-balance-chart-card/MonthlyBalanceChartCard";

function IndividualDashboardLayout() {
  return (
    <div className="dashboard-wrapper">
      <CategoryProvider>
        <IndividualDashboardContextProvider>
          <div className="dashboard-layout row g-3">
            {/* Section 1 - contains balance card, pie chart and bar chart */}
            <div className="dashboard-section col-lg-7">
              <div className="subsection">
                <div className="card-and-chart-wrapper">
                  <div className="balance-cards-section">
                    <OverallBalanceCard />
                    <FilteredBalanceCard />
                  </div>
                  <SpendingPieChartCard />
                </div>
              </div>
              <div className="subsection">
                <MonthlySpendingChartCard />
              </div>
            </div>

            {/* Section 2 - contains line charts*/}
            <div className="dashboard-section col-lg-5">
              <DailyBalanceChartCard />
              <MonthlyBalanceChartCard />
            </div>
          </div>
        </IndividualDashboardContextProvider>
      </CategoryProvider>
    </div>
  );
}

export default IndividualDashboardLayout;
