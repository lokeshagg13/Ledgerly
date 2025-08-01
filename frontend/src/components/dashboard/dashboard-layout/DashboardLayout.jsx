import OverallBalanceCard from "./balance-cards/overall-balance-card/OverallBalanceCard";
import FilteredBalanceCard from "./balance-cards/filtered-balance-card/FilteredBalanceCard";
import { DashboardContextProvider } from "../../../store/context/dashboardContext";

function DashboardLayout() {
  return (
    <div className="dashboard-wrapper">
      <DashboardContextProvider>
        <div className="dashboard-layout row g-3">
          {/* Section 1 - contains balance card, pie chart and bar chart */}
          <div className="dashboard-section col-lg-7">
            <div className="subsection">
              <div className="card-and-chart-wrapper">
                <div className="balance-cards-section">
                  <OverallBalanceCard />
                  <FilteredBalanceCard />
                </div>
                <div className="dashboard-card pie-chart-card">Pie Chart</div>
              </div>
            </div>
            <div className="subsection">
              <div className="dashboard-card bar-chart-card">
                Grouped Bar Chart
              </div>
            </div>
          </div>

          {/* Section 2 - contains line charts*/}
          <div className="dashboard-section col-lg-5">
            <div className="dashboard-card line-chart-card">Line Chart 1</div>
            <div className="dashboard-card line-chart-card">Line Chart 2</div>
          </div>
        </div>
      </DashboardContextProvider>
    </div>
  );
}

export default DashboardLayout;
