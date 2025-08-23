import { FirmDashboardContextProvider } from "../../../store/context/firmDashboardContext";
import OverallBalanceCard from "./balance-cards/overall-balance-card/OverallBalanceCard";

function FirmDashboardLayout() {
  return (
    <div className="dashboard-wrapper">
      <FirmDashboardContextProvider>
        <div className="dashboard-layout firm row g-3">
          <div className="balance-cards-section">
            <OverallBalanceCard />
          </div>
        </div>
      </FirmDashboardContextProvider>
    </div>
  );
}

export default FirmDashboardLayout;
