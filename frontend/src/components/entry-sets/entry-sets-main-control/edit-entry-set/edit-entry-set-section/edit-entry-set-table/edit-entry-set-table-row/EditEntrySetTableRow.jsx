import { useContext } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";

import SearchInput from "../../../../../../ui/elements/SearchInput";
import ContextMenuContext from "../../../../../../../store/context/contextMenuContext";
import HeadsContext from "../../../../../../../store/context/headsContext";
import { formatAmountWithCommas } from "../../../../../../../utils/formatUtils";
import EditEntrySetContext from "../../../../../../../store/context/editEntrySetContext";

function WithErrorTooltip({ children, error }) {
  if (!error) return children;

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 300, hide: 100 }}
      overlay={
        <Tooltip className="edit-entry-set-table-error error-tooltip">
          {error}
        </Tooltip>
      }
    >
      <div className="d-inline-block w-100">{children}</div>
    </OverlayTrigger>
  );
}

function EditEntrySetTableRow({ idx, data }) {
  const { id, sno, type, headName, debit, credit } = data;
  const {
    entryInputFieldRefs,
    handleModifyFieldValue,
    handleContextMenuSetup,
    getEntryRowFieldError,
  } = useContext(EditEntrySetContext);
  const { handleContextMenuToggle } = useContext(ContextMenuContext);
  const { heads } = useContext(HeadsContext);

  const headNames = heads.map((head) => head.name);

  const isDebitActive = type === "D";
  const isCreditActive = type === "C";
  const isCashRow = headName?.trim()?.toLowerCase() === "cash";

  return (
    <tr
      key={id}
      onContextMenu={(e) => {
        handleContextMenuSetup(e, idx, id);
        handleContextMenuToggle("entry-row", idx.toString());
      }}
    >
      <td>{sno}</td>
      <td className={getEntryRowFieldError(id, "type") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryRowFieldError(id, "type")}>
          <Form.Control
            ref={entryInputFieldRefs.current[idx]?.[0]}
            id={`entryType${idx}`}
            value={type}
            onChange={(e) =>
              handleModifyFieldValue(idx, "type", e.target.value)
            }
            autoComplete="off"
            disabled={isCashRow}
            isInvalid={!!getEntryRowFieldError(id, "type")}
            className={`form-control form-control-sm ${
              getEntryRowFieldError(id, "type") ? "shake" : ""
            }`}
          />
        </WithErrorTooltip>
      </td>
      <td className={getEntryRowFieldError(id, "headName") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryRowFieldError(id, "headName")}>
          <div className={getEntryRowFieldError(id, "headName") ? "shake" : ""}>
            <SearchInput
              ref={entryInputFieldRefs.current[idx]?.[1]}
              id={`entryHead${idx}`}
              options={headNames}
              value={headName}
              onChange={(_, newValue) =>
                handleModifyFieldValue(idx, "headName", newValue || "")
              }
              isInvalid={!!getEntryRowFieldError(id, "headName")}
            />
          </div>
        </WithErrorTooltip>
      </td>
      <td className={getEntryRowFieldError(id, "credit") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryRowFieldError(id, "credit")}>
          <Form.Control
            ref={entryInputFieldRefs.current[idx]?.[2]}
            type="text"
            id={`entryCreditAmount${idx}`}
            value={credit !== "" ? formatAmountWithCommas(credit) : ""}
            onChange={(e) =>
              handleModifyFieldValue(idx, "credit", e.target.value)
            }
            autoComplete="off"
            disabled={!isCreditActive || isCashRow}
            isInvalid={!!getEntryRowFieldError(id, "credit")}
            className={`form-control form-control-sm ${
              getEntryRowFieldError(id, "credit") ? "shake" : ""
            }`}
          />
        </WithErrorTooltip>
      </td>
      <td className={getEntryRowFieldError(id, "debit") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryRowFieldError(id, "debit")}>
          <Form.Control
            ref={entryInputFieldRefs.current[idx]?.[3]}
            type="text"
            id={`entryDebitAmount${idx}`}
            value={debit !== "" ? formatAmountWithCommas(debit) : ""}
            onChange={(e) =>
              handleModifyFieldValue(idx, "debit", e.target.value)
            }
            autoComplete="off"
            disabled={!isDebitActive || isCashRow}
            isInvalid={!!getEntryRowFieldError(id, "debit")}
            className={`form-control form-control-sm ${
              getEntryRowFieldError(id, "debit") ? "shake" : ""
            }`}
          />
        </WithErrorTooltip>
      </td>
    </tr>
  );
}

export default EditEntrySetTableRow;
