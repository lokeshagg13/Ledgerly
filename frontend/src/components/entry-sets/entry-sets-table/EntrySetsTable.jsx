import { useContext } from "react";
import { Spinner, Table } from "react-bootstrap";
import EntrySetContext from "../../../store/context/entrySetContext";
import EntrySetRow from "./entry-set-row/EntrySetRow";
import ErrorImage from "../../../images/chart-error.png";

function EntrySetsTable() {
  const {
    isLoadingEntrySets,
    entrySets,
    filteredEntrySets,
    errorFetchingEntrySets,
  } = useContext(EntrySetContext);

  if (isLoadingEntrySets) {
    return (
      <div className="entry-sets-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (errorFetchingEntrySets) {
    return (
      <div className="error-section entry-sets-table-error">
        <img src={ErrorImage} alt="" width={150} height="auto" />
        <p className="error-message">{errorFetchingEntrySets}</p>
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

  if (filteredEntrySets.length === 0) {
    return (
      <div className="entry-sets-table-empty text-muted">
        No matching entry sets found.
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
          {filteredEntrySets.map((entrySet) => (
            <EntrySetRow
              key={entrySet._id}
              entrySetId={entrySet._id}
              entrySetDate={entrySet.date}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EntrySetsTable;
