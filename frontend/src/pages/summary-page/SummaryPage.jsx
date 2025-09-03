import SummaryPageContent from "../../components/summary/SummaryPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import summaryImage from "../../images/summary-bg.png";

function SummaryPage() {
  return (
    <PageLayout bgImage={summaryImage}>
      <div className="page summary-page">
        <SummaryPageContent />
      </div>
    </PageLayout>
  );
}

export default SummaryPage;
