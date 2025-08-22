import { useContext } from "react";
import { Button } from "react-bootstrap";
import HeadsContext from "../../../store/context/headsContext";
import AddHeadModal from "../heads-modals/AddHeadModal";
import DeleteSelectedHeadsModal from "../heads-modals/DeleteSelectedHeadsModal";

function HeadsControl() {
  const {
    isLoadingHeads,
    isAddHeadModalVisible,
    isDeleteSelectedHeadsModalVisible,
    selectedHeads,
    handleOpenAddHeadModal,
    handleOpenDeleteSelectedHeadsModal,
    fetchHeadsFromDB,
  } = useContext(HeadsContext);

  return (
    <div className="heads-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Add a new head"
        onClick={handleOpenAddHeadModal}
        disabled={isLoadingHeads}
      >
        Add New Head
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Upload bulk heads"
        onClick={() => {}}
        disabled={isLoadingHeads}
      >
        Upload Heads
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Delete selected heads"
        onClick={handleOpenDeleteSelectedHeadsModal}
        disabled={selectedHeads.length === 0}
      >
        Delete Selected <br />
        Heads
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Reload heads"
        onClick={() => fetchHeadsFromDB(true)}
        disabled={isLoadingHeads}
        title="Click to reload heads"
      >
        {isLoadingHeads ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Refreshing...
          </>
        ) : (
          "Refresh Heads"
        )}
      </Button>
      {isAddHeadModalVisible && <AddHeadModal />}
      {isDeleteSelectedHeadsModalVisible && <DeleteSelectedHeadsModal />}
    </div>
  );
}

export default HeadsControl;
