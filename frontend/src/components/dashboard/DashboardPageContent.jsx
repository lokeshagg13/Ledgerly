import WelcomeBanner from "./welcome-banner/WelcomeBanner";
import CTAControl from "./cta-control/CTAControl";
import DashLayout from "./dash-layout/DashLayout";
// import SummaryCards from "./components/SummaryCards";
// import ChartsSection from "./components/ChartsSection";

function DashboardPageContent() {
  return (
    <>
      <WelcomeBanner />
      <CTAControl />
      <DashLayout />
      {/*   <SummaryCards />
        <ChartsSection /> */}
    </>
  );
}

export default DashboardPageContent;
