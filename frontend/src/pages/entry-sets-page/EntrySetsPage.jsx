import PageLayout from "../../components/ui/page-layout/PageLayout";
import EntrySetsPageContent from "../../components/entry-sets/EntrySetsPageContent";
import entrySetsImage from "../../images/entry-sets-bg.png";

function EntrySetsPage() {
  return (
    <PageLayout bgImage={entrySetsImage}>
      <div className="page entry-sets-page">
        <EntrySetsPageContent />
      </div>
    </PageLayout>
  );
}

export default EntrySetsPage;
