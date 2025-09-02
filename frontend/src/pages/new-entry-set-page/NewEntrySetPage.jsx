import PageLayout from "../../components/ui/page-layout/PageLayout";
import NewEntrySetPageContent from "../../components/entry-sets/entry-sets-main-control/new-entry-set/NewEntrySetPageContent";
import newEntrySetImage from "../../images/new-entry-set-bg.png";

function NewEntrySetPage() {
  return (
    <PageLayout bgImage={newEntrySetImage}>
      <div className="page new-entry-set-page">
        <NewEntrySetPageContent />
      </div>
    </PageLayout>
  );
}

export default NewEntrySetPage;
