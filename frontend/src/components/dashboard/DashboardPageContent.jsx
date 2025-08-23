import WelcomeBanner from "./welcome-banner/WelcomeBanner";
import IndividualCTAControl from "./individual-cta-control/IndividualCTAControl";
import IndividualDashboardLayout from "./individual-dashboard-layout/IndividualDashboardLayout";
import OpeningBalanceLine from "./opening-balance-line/OpeningBalanceLine";
import useAuth from "../../store/hooks/useAuth";
import FirmCTAControl from "./firm-cta-control/FirmCTAControl";
import FirmDashboardLayout from "./firm-dashboard-layout/FirmDashboardLayout";

function DashboardPageContent() {
  const { auth } = useAuth();
  return (
    <>
      <WelcomeBanner />
      {auth?.type === "individual" ? (
        <IndividualCTAControl />
      ) : (
        <FirmCTAControl />
      )}
      <OpeningBalanceLine />
      {auth?.type === "individual" ? (
        <IndividualDashboardLayout />
      ) : (
        <FirmDashboardLayout />
      )}
    </>
  );
}

export default DashboardPageContent;
