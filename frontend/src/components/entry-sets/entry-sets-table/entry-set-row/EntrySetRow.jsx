import { useContext, useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import useAppNavigate from "../../../../store/hooks/useAppNavigate";
import EntrySetsContext from "../../../../store/context/entrySetsContext";
import EntrySetDownloader from "./download-entry-set/EntrySetDownloader";

function EntrySetRow({ entrySetId, entrySetDate }) {
  const { handleNavigateToPath } = useAppNavigate();
  const { selectedEntrySets, handleToggleEntrySetSelected } =
    useContext(EntrySetsContext);
  const formattedDate = useMemo(() => {
    const date = new Date(entrySetDate);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [entrySetDate]);

  const handleViewEntrySet = () => {
    handleNavigateToPath("/entry-sets/view", {
      state: { entrySetId, formattedEntrySetDate: formattedDate },
    });
  };

  const handleEditEntrySet = () => {
    handleNavigateToPath("/entry-sets/edit", {
      state: { entrySetId, formattedEntrySetDate: formattedDate },
    });
  };

  return (
    <tr className="entry-set-row">
      <td className="checkbox-cell">
        <Form.Check
          type="checkbox"
          className="entry-set-checkbox"
          id={`entrySetCheckbox${entrySetId}`}
          checked={selectedEntrySets.includes(entrySetId)}
          onChange={() => handleToggleEntrySetSelected(entrySetId)}
          aria-label={`Select entry set for ${formattedDate}`}
        />
      </td>
      <td className="date-cell">{formattedDate}</td>
      <td className="action-cell">
        <Button
          variant="outline-primary"
          size="sm"
          className="view-button"
          onClick={handleViewEntrySet}
        >
          View
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          className="edit-button"
          onClick={handleEditEntrySet}
        >
          Edit
        </Button>
        <EntrySetDownloader
          entrySetId={entrySetId}
          formattedEntrySetDate={formattedDate}
        />
      </td>
    </tr>
  );
}

export default EntrySetRow;
