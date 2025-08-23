import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

import ContextMenuContext from "../../../../store/context/contextMenuContext";
import NewEntryRowContextMenu from "./new-entry-row-context-menu/NewEntryRowContextMenu";
import NewEntryContext from "../../../../store/context/newEntryContext";
import NewEntryTableRow from "./new-entry-table-row/NewEntryTableRow";
import NewEntryTableFooter from "./new-entry-table-footer/NewEntryTableFooter";
import FirmDashboardContext from "../../../../store/context/firmDashboardContext";
import ErrorImage from "../../../../images/chart-error.png";

function NewEntryTable() {
  const { entryDataRows, menuPos, clickedRow, handleKeyPress } =
    useContext(NewEntryContext);
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
      className="new-entry-table-wrapper"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <table className="table table-bordered new-entry-table">
        <thead className="table-warning">
          <tr>
            <th className="col-sno"></th>
            <th className="col-type">Type (C/D)</th>
            <th className="col-head">Head</th>
            <th className="col-debit">Debit</th>
            <th className="col-credit">Credit</th>
          </tr>
        </thead>
        <tbody>
          {entryDataRows.map((rowData, idx) => (
            <NewEntryTableRow key={idx} idx={idx} data={rowData} />
          ))}
        </tbody>
        <NewEntryTableFooter />
      </table>
      {checkIfContextMenuVisible("entry-row", clickedRow?.toString()) &&
        menuPos && <NewEntryRowContextMenu />}
    </div>
  );
}

export default NewEntryTable;
