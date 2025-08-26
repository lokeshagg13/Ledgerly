import { useContext } from "react";
import { Spinner, Table } from "react-bootstrap";
import EntrySetContext from "../../../store/context/entrySetContext";

function EntrySetsTable() {
  const { isLoadingEntrySets, entrySets } = useContext(EntrySetContext);

  if (isLoadingEntrySets) {
    return (
      <div className="entry-sets-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (entrySets.length === 0) {
    return (
      <div className="entry-sets-table-empty text-muted">
        No entry set added yet.
      </div>
    );
  }

  return (
    <div className="entry-sets-table-wrapper">
      <Table
        className="entry-sets-table"
        borderless
        aria-label="Daywise entry sets list"
      >
        <thead>
          <tr>
            <th></th>
            <th scope="col">Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entrySets.map((head) => (
            <></>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EntrySetsTable;
