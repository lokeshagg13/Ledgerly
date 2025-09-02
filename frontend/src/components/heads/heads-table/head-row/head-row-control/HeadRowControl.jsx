import { useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import DeleteHeadModal from "../../../heads-modals/DeleteHeadModal";
import EditIcon from "../../../../ui/icons/EditIcon";
import TrashIcon from "../../../../ui/icons/TrashIcon";

function HeadRowControl({ headId, headName, onEdit }) {
  const [isDeleteHeadModalVisible, setIsDeleteHeadModalVisible] =
    useState(false);

  const handleOpenDeleteHeadModal = () => {
    setIsDeleteHeadModalVisible(true);
  };

  const handleCloseDeleteHeadModal = () => {
    setIsDeleteHeadModalVisible(false);
  };

  return (
    <div className="head-row-controls">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-edit-${headId}`}>
            Edit head <br />
            <b>{headName}</b>
          </Tooltip>
        }
      >
        <Button
          className="control-btn btn-outline-light"
          onClick={onEdit}
          aria-label={`Edit head ${headName}`}
        >
          <EditIcon />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-delete-${headId}`}>
            Delete head <br />
            <b>{headName}</b>
          </Tooltip>
        }
      >
        <Button
          className="control-btn btn-outline-light"
          onClick={handleOpenDeleteHeadModal}
          aria-label={`Delete head ${headName}`}
        >
          <TrashIcon />
        </Button>
      </OverlayTrigger>
      {isDeleteHeadModalVisible && (
        <DeleteHeadModal
          headId={headId}
          headName={headName}
          onClose={handleCloseDeleteHeadModal}
        />
      )}
    </div>
  );
}

export default HeadRowControl;
