import { useContext } from "react";
import { Spinner, Table } from "react-bootstrap";
import EntryContext from "../../../store/context/entryContext";

function EntriesTable() {
  const { isLoadingDaywiseEntries, daywiseEntries } = useContext(EntryContext);

  if (isLoadingDaywiseEntries) {
    return (
      <div className="entries-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (daywiseEntries.length === 0) {
    return (
      <div className="entries-table-empty text-muted">
        No entries added yet.
      </div>
    );
  }

  return (
    <div className="entries-table-wrapper">
      <Table
        className="entries-table"
        borderless
        aria-label="Daywise entries list"
      >
        <thead>
          <tr>
            <th></th>
            <th scope="col">Entries</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {daywiseEntries.map((head) => (
            <></>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EntriesTable;
