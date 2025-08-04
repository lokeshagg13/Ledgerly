import WelcomeBanner from "./welcome-banner/WelcomeBanner";
import CTAControl from "./cta-control/CTAControl";
import DashboardLayout from "./dashboard-layout/DashboardLayout";
import OpeningBalanceLine from "./opening-balance-line/OpeningBalanceLine";

function DashboardPageContent() {
  return (
    <>
      <WelcomeBanner />
      <CTAControl />
      <OpeningBalanceLine />
      <DashboardLayout />
    </>
  );
}

export default DashboardPageContent;
