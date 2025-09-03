import { useContext } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import ErrorImage from "../../../images/chart-error.png";
import SummaryContext from "../../../store/context/summaryContext";
import SummaryRow from "./summary-row/SummaryRow";

function SummaryTable() {
  const {
    isLoadingBalanceSummary,
    balanceSummaryRows,
    filteredSummaryRows,
    errorFetchingBalanceSummary,
    checkIfAllSummaryRowsSelected,
    handleToggleAllSummaryRowSelections,
  } = useContext(SummaryContext);

  if (isLoadingBalanceSummary) {
    return (
      <div className="summary-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (errorFetchingBalanceSummary) {
    return (
      <div className="error-section summary-table-error">
        <img src={ErrorImage} alt="" width={150} height="auto" />
        <p className="error-message">{errorFetchingBalanceSummary}</p>
      </div>
    );
  }

  if (balanceSummaryRows.length === 0) {
    return (
      <div className="summary-table-empty text-muted">No heads added yet.</div>
    );
  }

  if (filteredSummaryRows.length === 0) {
    return (
      <div className="summary-table-empty text-muted">
        No matching heads found.
      </div>
    );
  }

  return (
    <div className="summary-table-wrapper">
      <Table
        className="summary-table"
        borderless
        aria-label="Firm balance summary"
      >
        <thead>
          <tr>
            <th scope="col">
              <Form.Check
                type="checkbox"
                className="summary-rows-all-checkbox"
                id="summaryRowsAllCheckbox"
                checked={checkIfAllSummaryRowsSelected()}
                onChange={() => handleToggleAllSummaryRowSelections()}
                aria-label={`${
                  checkIfAllSummaryRowsSelected() ? "Unselect" : "Select"
                } all rows`}
              />
            </th>
            <th scope="col">Heads</th>
            <th scope="col">Debit Balance</th>
            <th scope="col">Credit Balance</th>
          </tr>
        </thead>
        <tbody>
          {[...filteredSummaryRows]
            .sort((a, b) => a.headName.localeCompare(b.headName))
            .map((rowData) => (
              <SummaryRow
                key={rowData.headId}
                rowId={rowData.headId}
                rowData={rowData}
              />
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default SummaryTable;
