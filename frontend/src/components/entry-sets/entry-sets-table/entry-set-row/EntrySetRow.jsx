import { useMemo } from "react";
import { Button, Form } from "react-bootstrap";

function EntrySetRow({ entrySetId, entrySetDate }) {
  // Format date nicely (e.g., "26 Aug 2025")
  const formattedDate = useMemo(() => {
    const date = new Date(entrySetDate);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }, [entrySetDate]);

  return (
    <tr className="entry-set-row">
      <td className="checkbox-cell">
        <Form.Check
          type="checkbox"
          className="entry-set-checkbox"
          id={`entrySetCheckbox${entrySetId}`}
          aria-label={`Select entry set for ${formattedDate}`}
        />
      </td>
      <td className="date-cell">{formattedDate}</td>
      <td className="action-cell">
        <Button variant="outline-primary" size="sm" className="view-button">
          View
        </Button>
        <Button variant="outline-primary" size="sm" className="view-button">
          Edit
        </Button>
        <Button variant="outline-primary" size="sm" className="view-button">
          Download
        </Button>
      </td>
    </tr>
  );
}

export default EntrySetRow;
