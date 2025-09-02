import { useLocation } from "react-router-dom";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import editEntrySetImage from "../../images/edit-entry-set-bg.png";
import EditEntrySetPageContent from "../../components/entry-sets/entry-sets-main-control/edit-entry-set/EditEntrySetPageContent";

function EditEntrySetPage() {
  const location = useLocation();
  const { entrySetId, formattedEntrySetDate } = location.state || {};
  if (!entrySetId) return;

  return (
    <PageLayout bgImage={editEntrySetImage}>
      <div className="page edit-entry-set-page">
        <EditEntrySetPageContent
          entrySetId={entrySetId}
          formattedEntrySetDate={formattedEntrySetDate}
        />
      </div>
    </PageLayout>
  );
}

export default EditEntrySetPage;
