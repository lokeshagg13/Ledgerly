import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import HeadsUploadContext from "../../../../../../store/context/headsUploadContext";
import TrashIcon from "../../../../../ui/icons/TrashIcon";
import RotateIcon from "../../../../../ui/icons/RotateIcon";
import BulkHeadsRowRemoveModal from "./bulk-heads-row-remove-modal/BulkHeadsRowRemoveModal";

function BulkHeadRowControl({ index, _id }) {
  const { handleRemoveHead, handleResetHead } = useContext(HeadsUploadContext);
  const [isRemoveHeadModalVisible, setIsRemoveHeadModalVisible] =
    useState(false);

  const handleOpenRemoveHeadModal = () => {
    setIsRemoveHeadModalVisible(true);
  };

  const handleCloseRemoveHeadModal = () => {
    setIsRemoveHeadModalVisible(false);
  };

  const handleConfirmRemoveHeadModal = () => {
    handleRemoveHead(_id);
    handleCloseRemoveHeadModal();
  };

  const handleCancelRemoveHeadModal = () => {
    handleCloseRemoveHeadModal();
  };

  return (
    <div className="bulk-heads-row-control">
      <Button
        type="button"
        className="reset-btn"
        onClick={() => handleResetHead(_id)}
        title="Reset back to original extracted content"
      >
        <RotateIcon width="0.9rem" height="0.9rem" />
      </Button>

      <Button
        type="button"
        className="delete-btn"
        onClick={handleOpenRemoveHeadModal}
        title="Remove this head"
      >
        <TrashIcon fill="red" width="0.9rem" height="0.9rem" />
      </Button>

      {isRemoveHeadModalVisible && (
        <BulkHeadsRowRemoveModal
          headIdx={index}
          show={isRemoveHeadModalVisible}
          onClose={handleCancelRemoveHeadModal}
          onConfirm={handleConfirmRemoveHeadModal}
        />
      )}
    </div>
  );
}

export default BulkHeadRowControl;
