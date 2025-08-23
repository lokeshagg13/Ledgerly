import { useContext } from "react";
import ContextMenuContext from "../../../../store/context/contextMenuContext";
import NewEntryRowContextMenu from "./new-entry-row-context-menu/NewEntryRowContextMenu";
import NewEntryContext from "../../../../store/context/newEntryContext";
import NewEntryTableRow from "./new-entry-table-row/NewEntryTableRow";
import NewEntryTableFooter from "./new-entry-table-footer/NewEntryTableFooter";

function NewEntryTable() {
  const { entryDataRows, menuPos, clickedRow, handleKeyPress } =
    useContext(NewEntryContext);
  const { checkIfContextMenuVisible } = useContext(ContextMenuContext);

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
