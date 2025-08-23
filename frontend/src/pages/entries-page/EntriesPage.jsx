import PageLayout from "../../components/ui/page-layout/PageLayout";
import EntryPageContent from "../../components/entries/EntryPageContent";
import entryImage from "../../images/entry-bg.png";

function EntryPage() {
  return (
    <PageLayout bgImage={entryImage}>
      <div className="page entry-page">
        <EntryPageContent />
      </div>
    </PageLayout>
  );
}

export default EntryPage;
