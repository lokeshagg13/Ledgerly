import { Button } from "react-bootstrap";
import useAppNavigate from "../../../../store/hooks/useAppNavigate";

function ViewEntrySetControl() {
  const { handleNavigateToPath } = useAppNavigate();
  return (
    <div className="view-entry-set-control">
      <Button
        type="button"
        className="view-entry-set-control-btn btn-edit"
        title="Edit this entry set"
        // onClick={handleSaveNewEntrySet}
      >
        Edit
      </Button>
      <Button
        type="button"
        className="view-entry-set-control-btn btn-entry-sets"
        title="View all entry sets"
        onClick={() => handleNavigateToPath('/entry-sets')}
      >
        View all entry sets
      </Button>
    </div>
  );
}

export default ViewEntrySetControl;
