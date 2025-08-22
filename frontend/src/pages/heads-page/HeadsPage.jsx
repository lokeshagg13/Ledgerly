import HeadsPageContent from "../../components/heads/HeadsPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import headsImage from "../../images/heads-bg.png";

function HeadsPage() {
  return (
    <PageLayout bgImage={headsImage}>
      <div className="page heads-page">
        <HeadsPageContent />
      </div>
    </PageLayout>
  );
}

export default HeadsPage;
