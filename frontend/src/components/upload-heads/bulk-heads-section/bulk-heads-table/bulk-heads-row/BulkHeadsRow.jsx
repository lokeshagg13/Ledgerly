import React, { useContext } from "react";
import { Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import BulkHeadsRowControl from "./bulk-heads-row-control/BulkHeadsRowControl";
import HeadsUploadContext from "../../../../../store/context/headsUploadContext";
import { formatAmountWithCommas } from "../../../../../utils/formatUtils";

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

function BulkHeadsRow({ index, data }) {
  const { _id, name, openingBalance, openingBalanceType, active } = data;

  const {
    handleModifyHead,
    getEditHeadFieldError,
    checkIfHeadSelected,
    handleToggleHeadSelection,
  } = useContext(HeadsUploadContext);

  const handleChange = (ev, id) => {
    const { name, value } = ev.target;
    switch (name) {
      case "active":
        handleModifyHead(id, name, value === "true");
        return;
      case "openingBalance":
        const rawValue = value.replace(/,/g, "");
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
        const numericValue = parseFloat(rawValue);
        if (
          (isValid || rawValue === "") &&
          (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
        ) {
          handleModifyHead(id, name, rawValue);
        }
        return;
      default:
        handleModifyHead(id, name, value);
        return;
    }
  };

  return (
    <tr>
      {/* Multi select checkbox */}
      <td className="checkbox">
        <Form.Check
          type="checkbox"
          className="bulk-heads-checkbox"
          id={`editBulkHeadCheckbox${_id}`}
          checked={checkIfHeadSelected(_id)}
          onChange={() => handleToggleHeadSelection(_id)}
          aria-label={`${
            checkIfHeadSelected(_id) ? "Unselect" : "Select"
          } head ${index}`}
        />
      </td>

      {/* S.No. */}
      <td className="sno">{index + 1}</td>

      {/* Head Name */}
      <td className="name">
        <WithErrorTooltip error={getEditHeadFieldError(_id, "name")}>
          <Form.Control
            type="text"
            name="name"
            id={`editBulkHeadName${_id}`}
            value={name}
            onChange={(ev) => handleChange(ev, _id)}
            placeholder="Head name"
            required
            isInvalid={!!getEditHeadFieldError(_id, "name")}
            className={getEditHeadFieldError(_id, "name") ? "shake" : ""}
          />
        </WithErrorTooltip>
      </td>

      {/* Head Opening Balance */}
      <td className="opening-balance">
        <WithErrorTooltip
          error={
            getEditHeadFieldError(_id, "openingBalance") ||
            getEditHeadFieldError(_id, "openingBalanceType")
          }
        >
          <div
            className={
              getEditHeadFieldError(_id, "openingBalance") ||
              getEditHeadFieldError(_id, "openingBalanceType")
                ? "shake is-invalid"
                : ""
            }
          >
            <InputGroup>
              <InputGroup.Text>₹</InputGroup.Text>
              <Form.Control
                type="text"
                name="openingBalance"
                id={`editBulkHeadOpeningBalance${_id}`}
                value={
                  openingBalance !== ""
                    ? formatAmountWithCommas(openingBalance)
                    : ""
                }
                autoComplete="off"
                onChange={(ev) => handleChange(ev, _id)}
                placeholder="Opening Balance"
              />
              <Form.Select
                className="edit-bulk-opening-balance-type"
                name="openingBalanceType"
                id={`editBulkHeadOpeningBalanceType${_id}`}
                value={openingBalanceType}
                onChange={(ev) => handleChange(ev, _id)}
              >
                <option value="credit">CR</option>
                <option value="debit">DR</option>
              </Form.Select>
            </InputGroup>
          </div>
        </WithErrorTooltip>
      </td>

      {/* Active */}
      <td className="active">
        <WithErrorTooltip error={getEditHeadFieldError(_id, "active")}>
          <Form.Select
            name="active"
            id={`editBulkHeadActive${_id}`}
            value={
              active !== undefined && active !== null
                ? active.toString()
                : "true"
            }
            onChange={(ev) => handleChange(ev, _id)}
            isInvalid={!!getEditHeadFieldError(_id, "active")}
            className={getEditHeadFieldError(_id, "active") ? "shake" : ""}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Form.Select>
        </WithErrorTooltip>
      </td>

      {/* Controls */}
      <td className="controls">
        <BulkHeadsRowControl index={index} _id={_id} />
      </td>
    </tr>
  );
}

export default React.memo(BulkHeadsRow);
