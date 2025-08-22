import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import HeadsUploadContext from "../../../../store/context/headsUploadContext";
import BulkHeadsRemoveModal from "./bulk-heads-remove-modal/BulkHeadsRemoveModal";

function BulkHeadsTopControl() {
  const {
    isUploadingBulkHeads,
    checkIfAnyHeadSelected,
    handleResetSelectedHeads,
    handleRemoveSelectedHeads,
  } = useContext(HeadsUploadContext);
  const [
    isRemoveSelectedHeadsModalVisible,
    setIsRemoveSelectedHeadsModalVisible,
  ] = useState(false);

  const handleOpenRemoveSelectedHeadsModal = () => {
    setIsRemoveSelectedHeadsModalVisible(true);
  };

  const handleCloseRemoveSelectedHeadsModal = () => {
    setIsRemoveSelectedHeadsModalVisible(false);
  };

  const handleConfirmRemoveSelectedHeadsModal = () => {
    handleRemoveSelectedHeads();
    handleCloseRemoveSelectedHeadsModal();
  };

  const handleCancelRemoveSelectedHeadsModal = () => {
    handleCloseRemoveSelectedHeadsModal();
  };

  const isAnyHeadSelected = checkIfAnyHeadSelected();

  return (
    <div className="bulk-heads-top-control-wrapper">
      <div className="bulk-heads-top-control">
        <Button
          className="btn-outline"
          onClick={handleResetSelectedHeads}
          disabled={isUploadingBulkHeads || !isAnyHeadSelected}
        >
          Reset Selected
        </Button>
        <Button
          className="btn-outline"
          onClick={handleOpenRemoveSelectedHeadsModal}
          disabled={isUploadingBulkHeads || !isAnyHeadSelected}
        >
          Remove Selected
        </Button>
        {isRemoveSelectedHeadsModalVisible && (
          <BulkHeadsRemoveModal
            show={isRemoveSelectedHeadsModalVisible}
            onConfirm={handleConfirmRemoveSelectedHeadsModal}
            onClose={handleCancelRemoveSelectedHeadsModal}
          />
        )}
      </div>
    </div>
  );
}

export default BulkHeadsTopControl;
