import { useContext } from "react";

import ContextMenuContext from "../../../../../../store/context/contextMenuContext";
import EditEntrySetContext from "../../../../../../store/context/editEntrySetContext";
import EditEntrySetTableRow from "./edit-entry-set-table-row/EditEntrySetTableRow";
import EditEntrySetTableFooter from "./edit-entry-set-table-footer/EditEntrySetTableFooter";
import EditEntrySetRowContextMenu from "./edit-entry-set-row-context-menu/EditEntrySetRowContextMenu";

function EditEntrySetTable() {
  const {
    editableEntrySetDataRows,
    menuPosition,
    clickedEntryRow,
    handleKeyPress,
  } = useContext(EditEntrySetContext);
  const { checkIfContextMenuVisible } = useContext(ContextMenuContext);

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
          {editableEntrySetDataRows.map((rowData, idx) => (
            <EditEntrySetTableRow key={idx} idx={idx} data={rowData} />
          ))}
        </tbody>
        <EditEntrySetTableFooter />
      </table>
      {checkIfContextMenuVisible(
        "entry-row",
        clickedEntryRow?.idx?.toString()
      ) &&
        menuPosition && <EditEntrySetRowContextMenu />}
    </div>
  );
}

export default EditEntrySetTable;
