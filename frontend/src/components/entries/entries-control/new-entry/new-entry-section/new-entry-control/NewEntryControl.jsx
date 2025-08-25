import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import NewEntryClearConfirmModal from "./new-entry-clear-confirm-modal/NewEntryClearConfirmModal";
import NewEntryContext from "../../../../../../store/context/newEntryContext";

function NewEntryControl() {
  const { isSavingNewEntry, handleClearRows, handleSaveNewEntry } =
    useContext(NewEntryContext);
  const [isClearConfirmModalVisible, setIsClearConfirmModalVisible] =
    useState(false);

  const handleOpenClearConfirmModal = () => {
    setIsClearConfirmModalVisible(true);
  };

  const handleCloseClearConfirmModal = () => {
    setIsClearConfirmModalVisible(false);
  };

  const handleConfirmClear = () => {
    handleClearRows();
    handleCloseClearConfirmModal();
  };

  return (
    <div className="new-entry-control">
      <Button
        type="button"
        className="new-entry-control-btn btn-clear"
        title="Clear all"
        disabled={isSavingNewEntry}
        onClick={() => handleOpenClearConfirmModal()}
      >
        Clear
      </Button>
      <Button
        type="button"
        className="new-entry-control-btn btn-save"
        title="Save this entry"
        disabled={isSavingNewEntry}
        onClick={handleSaveNewEntry}
      >
        {isSavingNewEntry ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Saving...
          </>
        ) : (
          "Save Entry"
        )}
      </Button>
      {isClearConfirmModalVisible && (
        <NewEntryClearConfirmModal
          show={isClearConfirmModalVisible}
          onClose={handleCloseClearConfirmModal}
          onConfirm={handleConfirmClear}
        />
      )}
    </div>
  );
}

export default NewEntryControl;
