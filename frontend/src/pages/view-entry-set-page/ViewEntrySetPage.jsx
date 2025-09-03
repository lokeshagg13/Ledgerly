import { useLocation } from "react-router-dom";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import ViewEntrySetPageContent from "../../components/entry-sets/entry-sets-table/entry-set-row/view-entry-set/ViewEntrySetPageContent";
import viewEntrySetImage from "../../images/view-entry-set-bg.png";

function ViewEntrySetPage() {
  const location = useLocation();
  const { entrySetId, formattedEntrySetDate } = location.state || {};
  if (!entrySetId) return;

  return (
    <PageLayout bgImage={viewEntrySetImage}>
      <div className="page view-entry-set-page">
        <ViewEntrySetPageContent
          entrySetId={entrySetId}
          formattedEntrySetDate={formattedEntrySetDate}
        />
      </div>
    </PageLayout>
  );
}

export default ViewEntrySetPage;
