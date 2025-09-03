import { useContext } from "react";
import { Button } from "react-bootstrap";
import EntrySetsContext from "../../../store/context/entrySetsContext";
import DeleteSelectedEntrySetsModal from "../entry-sets-modals/DeleteSelectedEntrySetsModal";

function EntrySetsSelectionControl() {
  const {
    selectedEntrySets,
    isDeleteSelectedEntrySetsModalVisible,
    handleOpenDeleteSelectedEntrySetsModal,
  } = useContext(EntrySetsContext);

  if (selectedEntrySets.length === 0) return <></>;

  return (
    <div className="entry-sets-selection-control">
      <div className="entry-sets-selection-text">
        {selectedEntrySets.length} entry set
        {selectedEntrySets.length > 1 ? "s" : ""} selected
      </div>
      <div className="entry-sets-selection-buttons">
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Delete selected entry sets"
          onClick={handleOpenDeleteSelectedEntrySetsModal}
          disabled={selectedEntrySets.length === 0}
        >
          Delete
        </Button>
      </div>
      {isDeleteSelectedEntrySetsModalVisible && (
        <DeleteSelectedEntrySetsModal />
      )}
    </div>
  );
}

export default EntrySetsSelectionControl;
