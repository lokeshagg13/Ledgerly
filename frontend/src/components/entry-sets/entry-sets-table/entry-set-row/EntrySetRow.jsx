import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";

function EntrySetsRow({ entrySetId, entrySetDate }) {
  return (
    <tr>
      <td>
        <Form.Check
          type="checkbox"
          className="entry-set-checkbox"
          id={`entrySetCheckbox${headId}`}
          // checked={selectedHeads.includes(headId)}
          // onChange={() => handleToggleHeadSelection(headId)}
          aria-label={`Select entry set for ${entrySetDate}`}
        />
      </td>
      <td>{entrySetDate}</td>
      <td>
        <Button>View</Button>
      </td>
    </tr>
  );
}

export default EntrySetsRow;
