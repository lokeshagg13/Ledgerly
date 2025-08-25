import { useContext } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";

import SearchInput from "../../../../../../ui/elements/SearchInput";
import NewEntryContext from "../../../../../../../store/context/newEntryContext";
import ContextMenuContext from "../../../../../../../store/context/contextMenuContext";
import HeadsContext from "../../../../../../../store/context/headsContext";
import { formatAmountWithCommas } from "../../../../../../../utils/formatUtils";

function WithErrorTooltip({ children, error }) {
  if (!error) return children;

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 300, hide: 100 }}
      overlay={
        <Tooltip className="bulk-heads-table-error error-tooltip">
          {error}
        </Tooltip>
      }
    >
      <div className="d-inline-block w-100">{children}</div>
    </OverlayTrigger>
  );
}

function NewEntryTableRow({ idx, data }) {
  const { id, sno, type, head, debit, credit } = data;
  const {
    inputRefs,
    handleModifyFieldValue,
    handleContextMenuSetup,
    getEntryFieldError,
  } = useContext(NewEntryContext);
  const { handleContextMenuToggle } = useContext(ContextMenuContext);
  const { heads } = useContext(HeadsContext);

  const headNames = heads.map((head) => head.name);

  const isDebitActive = type === "D";
  const isCreditActive = type === "C";
  const isCashRow = head?.trim()?.toLowerCase() === "cash";

  return (
    <tr
      key={id}
      onContextMenu={(e) => {
        handleContextMenuSetup(e, idx);
        handleContextMenuToggle("entry-row", idx.toString());
      }}
    >
      <td>{sno}</td>
      <td className={getEntryFieldError(id, "type") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryFieldError(id, "type")}>
          <Form.Control
            ref={inputRefs.current[idx]?.[0]}
            id={`entryType${idx}`}
            value={type}
            onChange={(e) =>
              handleModifyFieldValue(idx, "type", e.target.value)
            }
            autoComplete="off"
            disabled={isCashRow}
            isInvalid={!!getEntryFieldError(id, "type")}
            className={`form-control form-control-sm ${
              getEntryFieldError(id, "type") ? "shake" : ""
            }`}
          />
        </WithErrorTooltip>
      </td>
      <td className={getEntryFieldError(id, "head") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryFieldError(id, "head")}>
          <div className={getEntryFieldError(id, "head") ? "shake" : ""}>
            <SearchInput
              ref={inputRefs.current[idx]?.[1]}
              id={`entryHead${idx}`}
              options={headNames}
              value={head}
              onChange={(_, newValue) =>
                handleModifyFieldValue(idx, "head", newValue || "")
              }
              isInvalid={!!getEntryFieldError(id, "head")}
            />
          </div>
        </WithErrorTooltip>
      </td>
      <td className={getEntryFieldError(id, "credit") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryFieldError(id, "credit")}>
          <Form.Control
            ref={inputRefs.current[idx]?.[2]}
            type="text"
            id={`entryCreditAmount${idx}`}
            value={credit !== "" ? formatAmountWithCommas(credit) : ""}
            onChange={(e) =>
              handleModifyFieldValue(idx, "credit", e.target.value)
            }
            autoComplete="off"
            disabled={!isCreditActive || isCashRow}
            isInvalid={!!getEntryFieldError(id, "credit")}
            className={`form-control form-control-sm ${
              getEntryFieldError(id, "credit") ? "shake" : ""
            }`}
          />
        </WithErrorTooltip>
      </td>
      <td className={getEntryFieldError(id, "debit") ? "erroneous" : ""}>
        <WithErrorTooltip error={getEntryFieldError(id, "debit")}>
          <Form.Control
            ref={inputRefs.current[idx]?.[3]}
            type="text"
            id={`entryDebitAmount${idx}`}
            value={debit !== "" ? formatAmountWithCommas(debit) : ""}
            onChange={(e) =>
              handleModifyFieldValue(idx, "debit", e.target.value)
            }
            autoComplete="off"
            disabled={!isDebitActive || isCashRow}
            isInvalid={!!getEntryFieldError(id, "debit")}
            className={`form-control form-control-sm ${
              getEntryFieldError(id, "debit") ? "shake" : ""
            }`}
          />
        </WithErrorTooltip>
      </td>
    </tr>
  );
}

export default NewEntryTableRow;
