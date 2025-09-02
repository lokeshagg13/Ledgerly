import { useContext } from "react";
import HeadsContext from "../../../store/context/headsContext";
import DeleteSelectedHeadsModal from "../heads-modals/DeleteSelectedHeadsModal";
import { Button } from "react-bootstrap";

function HeadsSelectionControl() {
  const {
    selectedHeads,
    isDeleteSelectedHeadsModalVisible,
    handleOpenDeleteSelectedHeadsModal,
    handleExportSelectedHeadsAsExcel,
    handleExportSelectedHeadsAsPDF,
  } = useContext(HeadsContext);

  if (selectedHeads.length === 0) return <></>;

  return (
    <div className="heads-selection-control">
      <div className="heads-selection-text">
        {selectedHeads.length} head{selectedHeads.length > 1 ? "s" : ""}{" "}
        selected
      </div>
      <div className="heads-selection-buttons">
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Delete selected heads"
          onClick={handleOpenDeleteSelectedHeadsModal}
          disabled={selectedHeads.length === 0}
        >
          Delete
        </Button>
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Delete selected heads"
          onClick={handleExportSelectedHeadsAsExcel}
          disabled={selectedHeads.length === 0}
        >
          Export as XLSX
        </Button>
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Delete selected heads"
          onClick={handleExportSelectedHeadsAsPDF}
          disabled={selectedHeads.length === 0}
        >
          Export as PDF
        </Button>
      </div>
      {isDeleteSelectedHeadsModalVisible && <DeleteSelectedHeadsModal />}
    </div>
  );
}

export default HeadsSelectionControl;
