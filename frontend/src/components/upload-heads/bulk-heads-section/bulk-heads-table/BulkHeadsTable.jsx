import { useContext } from "react";
import { Form } from "react-bootstrap";

import HeadsUploadContext from "../../../../store/context/headsUploadContext";
import BulkHeadsRow from "./bulk-heads-row/BulkHeadsRow";

function BulkHeadsTable() {
  const {
    editableHeads,
    checkIfAllHeadsSelected,
    handleToggleAllHeadSelections,
  } = useContext(HeadsUploadContext);

  return (
    <div className="bulk-heads-table-wrapper">
      <table className="bulk-heads-table" role="table">
        <thead>
          <tr role="row">
            <th scope="col">
              <Form.Check
                type="checkbox"
                className="bulk-heads-all-checkbox"
                id={`editBulkHeadsAllCheckbox`}
                checked={checkIfAllHeadsSelected()}
                onChange={() => handleToggleAllHeadSelections()}
                aria-label={`${
                  checkIfAllHeadsSelected() ? "Unselect" : "Select"
                } all heads`}
              />
            </th>
            <th scope="col">S.No.</th>
            <th scope="col">Head Name</th>
            <th scope="col">Opening Balance</th>
            <th scope="col">Active</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {editableHeads.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-table-message">
                No heads to edit.
              </td>
            </tr>
          ) : (
            editableHeads.map((data, index) => (
              <BulkHeadsRow key={data._id} index={index} data={data} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BulkHeadsTable;
