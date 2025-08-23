import { useContext } from "react";
import { Form } from "react-bootstrap";

import SearchInput from "../../../../ui/elements/SearchInput";
import NewEntryContext from "../../../../../store/context/newEntryContext";
import ContextMenuContext from "../../../../../store/context/contextMenuContext";
import HeadsContext from "../../../../../store/context/headsContext";
import { formatAmountWithCommas } from "../../../../../utils/formatUtils";

function NewEntryTableRow({ idx, data }) {
  const { sno, type, head, debit, credit } = data;
  const { inputRefs, handleModifyFieldValue, handleContextMenuSetup } =
    useContext(NewEntryContext);
  const { handleContextMenuToggle } = useContext(ContextMenuContext);
  const { heads } = useContext(HeadsContext);

  const headNames = heads.map((head) => head.name);

  const isDebitActive = type === "D";
  const isCreditActive = type === "C";
  const isCashRow = head?.trim()?.toLowerCase() === "cash";

  return (
    <tr
      key={idx}
      onContextMenu={(e) => {
        handleContextMenuSetup(e, idx);
        handleContextMenuToggle("entry-row", idx.toString());
      }}
    >
      <td>{sno}</td>
      <td>
        <Form.Control
          ref={inputRefs.current[idx]?.[0]}
          id={`entryType${idx}`}
          value={type}
          onChange={(e) => handleModifyFieldValue(idx, "type", e.target.value)}
          autoComplete="off"
          className="form-control form-control-sm"
          disabled={isCashRow}
        />
      </td>
      <td>
        <SearchInput
          id={`entryHead${idx}`}
          ref={inputRefs.current[idx]?.[1]}
          options={headNames}
          value={head}
          onChange={(_, newValue) =>
            handleModifyFieldValue(idx, "head", newValue || "")
          }
          className="form-control form-control-sm"
        />
      </td>
      <td>
        <Form.Control
          ref={inputRefs.current[idx]?.[2]}
          type="text"
          id={`entryCreditAmount${idx}`}
          value={credit !== "" ? formatAmountWithCommas(credit) : ""}
          onChange={(e) =>
            handleModifyFieldValue(idx, "credit", e.target.value)
          }
          autoComplete="off"
          className="form-control form-control-sm"
          disabled={!isCreditActive || isCashRow}
        />
      </td>
      <td>
        <Form.Control
          ref={inputRefs.current[idx]?.[3]}
          type="text"
          id={`entryDebitAmount${idx}`}
          value={debit !== "" ? formatAmountWithCommas(debit) : ""}
          onChange={(e) => handleModifyFieldValue(idx, "debit", e.target.value)}
          autoComplete="off"
          className="form-control form-control-sm"
          disabled={!isDebitActive || isCashRow}
        />
      </td>
    </tr>
  );
}

export default NewEntryTableRow;
