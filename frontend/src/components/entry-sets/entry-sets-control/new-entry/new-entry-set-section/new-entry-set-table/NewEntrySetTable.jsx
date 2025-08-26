import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

import ContextMenuContext from "../../../../../../store/context/contextMenuContext";
import NewEntrySetContext from "../../../../../../store/context/newEntrySetContext";
import FirmDashboardContext from "../../../../../../store/context/firmDashboardContext";
import NewEntrySetRowContextMenu from "./new-entry-set-row-context-menu/NewEntrySetRowContextMenu";
import NewEntrySetTableRow from "./new-entry-set-table-row/NewEntrySetTableRow";
import NewEntrySetTableFooter from "./new-entry-set-table-footer/NewEntrySetTableFooter";
import ErrorImage from "../../../../../../images/chart-error.png";

function NewEntrySetTable() {
  const { entrySetDataRows, menuPosition, clickedEntryRow, handleKeyPress } =
    useContext(NewEntrySetContext);
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
      className="new-entry-set-table-wrapper"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <table className="table table-bordered new-entry-set-table">
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
            <NewEntrySetTableRow key={idx} idx={idx} data={rowData} />
          ))}
        </tbody>
        <NewEntrySetTableFooter />
      </table>
      {checkIfContextMenuVisible("entry-row", clickedEntryRow?.toString()) &&
        menuPosition && <NewEntrySetRowContextMenu />}
    </div>
  );
}

export default NewEntrySetTable;
