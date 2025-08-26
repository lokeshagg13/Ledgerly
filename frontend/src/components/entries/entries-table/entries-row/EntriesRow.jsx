import { useContext, useState } from "react";
import { Form } from "react-bootstrap";

import HeadsContext from "../../../../store/context/headsContext";
import HeadName from "./head-name/HeadName";
import HeadRowControl from "./head-row-control/HeadRowControl";

function EntriesRow({ entryId, entryDate }) {
  const { selectedHeads, handleToggleHeadSelection } = useContext(HeadsContext);
  const [isNameEditorOn, setIsNameEditorOn] = useState(false);

  const handleOpenNameEditor = () => {
    setIsNameEditorOn(true);
  };

  const handleCloseNameEditor = () => {
    setIsNameEditorOn(false);
  };

  return (
    <tr>
      <td>
        <Form.Check
          type="checkbox"
          className="head-checkbox"
          id={`head-checkbox-${headId}`}
          checked={selectedHeads.includes(headId)}
          onChange={() => handleToggleHeadSelection(headId)}
          aria-label={`Select head ${headName}`}
        />
      </td>
      <td>
        <HeadName
          headId={headId}
          headName={headName}
          isEditorOn={isNameEditorOn}
          onCloseEditor={handleCloseNameEditor}
        />
      </td>
      <td>
        <HeadRowControl
          headId={headId}
          headName={headName}
          onOpenEditor={handleOpenNameEditor}
        />
      </td>
    </tr>
  );
}

export default HeadRow;
