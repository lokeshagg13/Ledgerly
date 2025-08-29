import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

import ContextMenuContext from "../../../../../../store/context/contextMenuContext";
import EditEntrySetContext from "../../../../../../store/context/editEntrySetContext";
import FirmDashboardContext from "../../../../../../store/context/firmDashboardContext";
import EditEntrySetTableRow from "./edit-entry-set-table-row/EditEntrySetTableRow";
import EditEntrySetTableFooter from "./edit-entry-set-table-footer/EditEntrySetTableFooter";
import EditEntrySetRowContextMenu from "./edit-entry-set-row-context-menu/EditEntrySetRowContextMenu";
import ErrorImage from "../../../../../../images/chart-error.png";

function EditEntrySetTable() {
  const { entrySetDataRows, menuPosition, clickedEntryRow, handleKeyPress } =
    useContext(EditEntrySetContext);
  const { overallBalanceError } = useContext(FirmDashboardContext);
  const { checkIfContextMenuVisible } = useContext(ContextMenuContext);

  useEffect(() => {
    if (overallBalanceError) {
      toast.error(overallBalanceError, {
        position: "top-center",
        autoClose: 10000,
      });
      return;
    }
  }, [overallBalanceError]);

  if (overallBalanceError) {
    return (
      <div className="balance-error">
        <img src={ErrorImage} alt="" width={150} height="auto" />
        <p>{overallBalanceError}</p>
      </div>
    );
  }

  return (
    <div
      className="edit-entry-set-table-wrapper"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <table className="table table-bordered edit-entry-set-table">
        <thead className="table-warning">
          <tr>
            <th className="col-sno"></th>
            <th className="col-type">Type (C/D)</th>
            <th className="col-head">Head</th>
            <th className="col-credit">Credit</th>
            <th className="col-debit">Debit</th>
          </tr>
        </thead>
        <tbody>
          {entrySetDataRows.map((rowData, idx) => (
            <EditEntrySetTableRow key={idx} idx={idx} data={rowData} />
          ))}
        </tbody>
        <EditEntrySetTableFooter />
      </table>
      {checkIfContextMenuVisible("entry-row", clickedEntryRow?.toString()) &&
        menuPosition && <EditEntrySetRowContextMenu />}
    </div>
  );
}

export default EditEntrySetTable;
