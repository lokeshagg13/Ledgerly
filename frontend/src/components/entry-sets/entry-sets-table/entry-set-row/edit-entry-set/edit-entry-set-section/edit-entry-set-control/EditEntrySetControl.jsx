import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import NewEntrySetClearConfirmModal from "./edit-entry-set-clear-confirm-modal/EditEntrySetClearConfirmModal";
import EditEntrySetContext from "../../../../../../../store/context/editEntrySetContext";

function EditEntrySetControl() {
  const {
    isUpdatingEntrySetDetails,
    handleClearEntryRows,
    handleUpdateEntrySetDetails,
    handleResetAllEntryRows,
  } = useContext(EditEntrySetContext);
  const [isClearConfirmModalVisible, setIsClearConfirmModalVisible] =
    useState(false);

  const handleOpenClearConfirmModal = () => {
    setIsClearConfirmModalVisible(true);
  };

  const handleCloseClearConfirmModal = () => {
    setIsClearConfirmModalVisible(false);
  };

  const handleConfirmClear = () => {
    handleClearEntryRows();
    handleCloseClearConfirmModal();
  };

  return (
    <div className="edit-entry-set-control">
      <Button
        type="button"
        className="edit-entry-set-control-btn btn-clear"
        title="Clear all"
        disabled={isUpdatingEntrySetDetails}
        onClick={() => handleOpenClearConfirmModal()}
      >
        Clear All
      </Button>
      <Button
        type="button"
        className="edit-entry-set-control-btn btn-reset"
        title="Reset all"
        disabled={isUpdatingEntrySetDetails}
        onClick={handleResetAllEntryRows}
      >
        Reset All
      </Button>
      <Button
        type="button"
        className="edit-entry-set-control-btn btn-save"
        title="Update this entry set"
        disabled={isUpdatingEntrySetDetails}
        onClick={handleUpdateEntrySetDetails}
      >
        {isUpdatingEntrySetDetails ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Updating...
          </>
        ) : (
          "Update Entry Set"
        )}
      </Button>
      {isClearConfirmModalVisible && (
        <NewEntrySetClearConfirmModal
          show={isClearConfirmModalVisible}
          onClose={handleCloseClearConfirmModal}
          onConfirm={handleConfirmClear}
        />
      )}
    </div>
  );
}

export default EditEntrySetControl;
