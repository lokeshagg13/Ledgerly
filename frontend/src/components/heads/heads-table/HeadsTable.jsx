import { useContext } from "react";
import { Spinner, Table } from "react-bootstrap";
import HeadsContext from "../../../store/context/headsContext";
import HeadRow from "./head-row/HeadRow";
import ErrorImage from "../../../images/chart-error.png";

function HeadsTable() {
  const { isLoadingHeads, heads, errorFetchingHeads } =
    useContext(HeadsContext);

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

  return (
    <div className="heads-table-wrapper">
      <Table className="heads-table" borderless aria-label="Firm heads list">
        <thead>
          <tr>
            <th></th>
            <th scope="col">Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {heads.map((head) => (
            <HeadRow key={head._id} headId={head._id} headName={head.name} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default HeadsTable;
