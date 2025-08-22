import { useContext } from "react";
import { Spinner, Table } from "react-bootstrap";
import HeadsContext from "../../../store/context/headsContext";
import HeadRow from "./head-row/HeadRow";

function HeadsTable() {
  const { isLoadingHeads, heads } = useContext(HeadsContext);

  if (isLoadingHeads) {
    return (
      <div className="heads-table-loading">
        <Spinner animation="border" size="lg" />
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
