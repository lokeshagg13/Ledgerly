import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import NewEntrySetClearConfirmModal from "./new-entry-set-clear-confirm-modal/NewEntrySetClearConfirmModal";
import NewEntrySetContext from "../../../../../../store/context/newEntrySetContext";

function NewEntrySetControl() {
  const { isSavingNewEntrySet, handleClearEntryRows, handleSaveNewEntrySet } =
    useContext(NewEntrySetContext);
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
    <div className="new-entry-set-control">
      <Button
        type="button"
        className="new-entry-set-control-btn btn-clear"
        title="Clear all"
        disabled={isSavingNewEntrySet}
        onClick={() => handleOpenClearConfirmModal()}
      >
        Clear All
      </Button>
      <Button
        type="button"
        className="new-entry-set-control-btn btn-save"
        title="Save this entry set"
        disabled={isSavingNewEntrySet}
        onClick={handleSaveNewEntrySet}
      >
        {isSavingNewEntrySet ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Saving...
          </>
        ) : (
          "Save Entry Set"
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

export default NewEntrySetControl;
