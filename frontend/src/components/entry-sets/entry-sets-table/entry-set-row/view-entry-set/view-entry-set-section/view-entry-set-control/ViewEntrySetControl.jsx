import { Button } from "react-bootstrap";
import useAppNavigate from "../../../../../../../store/hooks/useAppNavigate";
import { useContext } from "react";
import ViewEntrySetContext from "../../../../../../../store/context/viewEntrySetContext";

function ViewEntrySetControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const { entrySetId, formattedEntrySetDate } = useContext(ViewEntrySetContext);

  const handleEditEntrySet = () => {
    handleNavigateToPath("/entry-sets/edit", {
      state: { entrySetId, formattedEntrySetDate },
    });
  };

  return (
    <div className="view-entry-set-control">
      <Button
        type="button"
        className="view-entry-set-control-btn btn-edit"
        title="Edit this entry set"
        onClick={handleEditEntrySet}
      >
        Edit
      </Button>
      <Button
        type="button"
        className="view-entry-set-control-btn btn-entry-sets"
        title="View all entry sets"
        onClick={() => handleNavigateToPath("/entry-sets")}
      >
        View all entry sets
      </Button>
    </div>
  );
}

export default ViewEntrySetControl;
