import PageLayout from "../../components/ui/page-layout/PageLayout";
import editEntrySetImage from "../../images/edit-entry-set-bg.png";
import EditEntrySetPageContent from "../../components/entry-sets/entry-sets-control/edit-entry/EditEntrySetPageContent";

function EditEntrySetPage() {
  return (
    <PageLayout bgImage={editEntrySetImage}>
      <div className="page edit-entry-set-page">
        <EditEntrySetPageContent />
      </div>
    </PageLayout>
  );
}

export default EditEntrySetPage;
