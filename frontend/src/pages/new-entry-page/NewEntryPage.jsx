import PageLayout from "../../components/ui/page-layout/PageLayout";
import NewEntryPageContent from "../../components/entries/entries-control/new-entry/NewEntryPageContent";
import newEntryImage from "../../images/new-entry-bg.png";

function NewEntryPage() {
  return (
    <PageLayout bgImage={newEntryImage}>
      <div className="page new-entry-page">
        <NewEntryPageContent />
      </div>
    </PageLayout>
  );
}

export default NewEntryPage;
