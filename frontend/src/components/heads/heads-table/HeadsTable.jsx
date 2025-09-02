import { useContext } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import HeadsContext from "../../../store/context/headsContext";
import HeadRow from "./head-row/HeadRow";
import ErrorImage from "../../../images/chart-error.png";

function HeadsTable() {
  const {
    isLoadingHeads,
    heads,
    filteredHeads,
    errorFetchingHeads,
    checkIfAllHeadsSelected,
    handleToggleAllHeadSelections,
  } = useContext(HeadsContext);

  if (isLoadingHeads) {
    return (
      <div className="heads-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (errorFetchingHeads) {
    return (
      <div className="error-section heads-table-error">
        <img src={ErrorImage} alt="" width={150} height="auto" />
        <p className="error-message">{errorFetchingHeads}</p>
      </div>
    );
  }

  if (heads.length === 0) {
    return (
      <div className="heads-table-empty text-muted">No heads added yet.</div>
    );
  }

  if (filteredHeads.length === 0) {
    return (
      <div className="heads-table-empty text-muted">
        No matching heads found.
      </div>
    );
  }

  return (
    <div className="heads-table-wrapper">
      <Table className="heads-table" borderless aria-label="Firm heads list">
        <thead>
          <tr>
            <th scope="col">
              <Form.Check
                type="checkbox"
                className="heads-all-checkbox"
                id="headsAllCheckbox"
                checked={checkIfAllHeadsSelected()}
                onChange={() => handleToggleAllHeadSelections()}
                aria-label={`${
                  checkIfAllHeadsSelected() ? "Unselect" : "Select"
                } all heads`}
              />
            </th>
            <th scope="col">Category</th>
            <th scope="col">Opening Balance</th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...filteredHeads]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((head) => (
              <HeadRow key={head._id} headId={head._id} headData={head} />
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default HeadsTable;
