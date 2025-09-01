import { useContext } from "react";

import ViewEntrySetContext from "../../../../store/context/viewEntrySetContext";
import ViewEntrySetTableRow from "./view-entry-set-table-row/ViewEntrySetTableRow";
import ViewEntrySetTableFooter from "./view-entry-set-table-footer/ViewEntrySetTableFooter";

function ViewEntrySetTable() {
  const { entrySetDataRows } = useContext(ViewEntrySetContext);
  
  return (
    <div className="view-entry-set-table-wrapper" tabIndex={0}>
      <table className="table table-bordered view-entry-set-table">
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
            <ViewEntrySetTableRow key={idx} data={rowData} />
          ))}
        </tbody>
        <ViewEntrySetTableFooter />
      </table>
    </div>
  );
}

export default ViewEntrySetTable;
