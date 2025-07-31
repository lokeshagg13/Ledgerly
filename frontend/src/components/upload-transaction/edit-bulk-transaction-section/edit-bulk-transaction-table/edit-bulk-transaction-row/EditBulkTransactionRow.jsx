import React from "react";
import { useContext, useState } from "react";
import { Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import TransactionUploadContext from "../../../../../store/context/transactionUploadContext";
import FormDatePicker from "../../../../ui/elements/FormDatePicker";
import { formatAmountWithCommas } from "../../../../../utils/formatUtils";
import EditBulkTransactionRowControl from "./edit-bulk-transaction-row-control/EditBulkTransactionRowControl";

function WithErrorTooltip({ children, error }) {
  if (!error) return children;

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 300, hide: 100 }}
      overlay={
        <Tooltip className="bulk-transaction-table-error error-tooltip">
          {error}
        </Tooltip>
      }
    >
      <div className="d-inline-block w-100">{children}</div>
    </OverlayTrigger>
  );
}

function EditBulkTransactionRow({ index, data }) {
  const { _id, type, amount, categoryId, subcategoryId, remarks, date } = data;

  const {
    isLoadingCategories,
    categories,
    isLoadingSubcategoryMapping,
    subcategoryMapping,
    handleModifyTransaction,
    getEditTransactionFieldError,
  } = useContext(TransactionUploadContext);

  const [subcategories, setSubcategories] = useState([]);

  const getSubcategoriesBasedOnSelectedCategory = (categoryId) => {
    if (!categoryId || isLoadingSubcategoryMapping) return [];
    const categoryName = categories.filter((cat) => cat._id === categoryId)?.[0]
      ?.name;
    if (!categoryName) return [];
    return subcategoryMapping?.[categoryName] || [];
  };

  const handleChange = (ev, id) => {
    const { name, value } = ev.target;
    switch (name) {
      case "amount":
        const rawValue = value.replace(/,/g, "");
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
        const numericValue = parseFloat(rawValue);
        if (
          (isValid || rawValue === "") &&
          (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
        ) {
          handleModifyTransaction(id, name, rawValue);
        }
        break;
      case "category":
        const categoryId = value || null;
        const subcategoryList =
          getSubcategoriesBasedOnSelectedCategory(categoryId);
        handleModifyTransaction(id, "categoryId", categoryId);
        setSubcategories(subcategoryList);
        handleModifyTransaction(id, "subcategoryId", null);
        break;
      case "subcategory":
        handleModifyTransaction(id, "subcategoryId", value || null);
        break;
      default:
        handleModifyTransaction(id, name, value);
    }
  };

  return (
    <tr>
      {/* Multi select checkbox */}
      <td className="checkbox">
        <Form.Check
          type="checkbox"
          className="edit-bulk-transaction-checkbox"
          id={`editBulkTransaction${_id}`}
          // checked={selectedCategories.includes(categoryId)}
          // onChange={() => toggleCategorySelection(categoryId)}
          aria-label={`Select transaction ${index}`}
        />
      </td>

      {/* S.No. */}
      <td className="sno">{index + 1}</td>

      {/* Type */}
      <td className="type">
        <WithErrorTooltip error={getEditTransactionFieldError(_id, "type")}>
          <Form.Select
            name="type"
            id="editBulkTransactionType"
            value={type}
            onChange={(ev) => handleChange(ev, _id)}
            isInvalid={!!getEditTransactionFieldError(_id, "type")}
            className={getEditTransactionFieldError(_id, "type") ? "shake" : ""}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </Form.Select>
        </WithErrorTooltip>
      </td>

      {/* Amount */}
      <td className="amount">
        <WithErrorTooltip error={getEditTransactionFieldError(_id, "amount")}>
          <InputGroup>
            <InputGroup.Text>₹</InputGroup.Text>
            <Form.Control
              type="text"
              name="amount"
              id="editBulkTransactionAmount"
              value={amount !== "" ? formatAmountWithCommas(amount) : ""}
              autoComplete="on"
              onChange={(ev) => handleChange(ev, _id)}
              placeholder="Enter amount"
              required
              isInvalid={!!getEditTransactionFieldError(_id, "amount")}
              className={
                getEditTransactionFieldError(_id, "amount") ? "shake" : ""
              }
            />
          </InputGroup>
        </WithErrorTooltip>
      </td>

      {/* Category */}
      <td className="category">
        {isLoadingCategories ? (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <WithErrorTooltip
            error={getEditTransactionFieldError(_id, "categoryId")}
          >
            <Form.Select
              name="category"
              aria-label="Select category"
              id="editBulkTransactionCategory"
              value={categoryId}
              onChange={(ev) => handleChange(ev, _id)}
              disabled={isLoadingCategories}
              isInvalid={!!getEditTransactionFieldError(_id, "categoryId")}
              className={
                getEditTransactionFieldError(_id, "categoryId") ? "shake" : ""
              }
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </WithErrorTooltip>
        )}
      </td>

      {/* Subcategory */}
      <td className="subcategory">
        {isLoadingSubcategoryMapping ? (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <WithErrorTooltip
            error={getEditTransactionFieldError(_id, "subcategoryId")}
          >
            <Form.Select
              name="subcategory"
              aria-label="Select subcategory"
              id="editBulkTransactionSubcategory"
              value={subcategoryId ?? ""}
              onChange={(ev) => handleChange(ev, _id)}
              disabled={!categoryId || isLoadingSubcategoryMapping}
            >
              <option value="">None</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </Form.Select>
          </WithErrorTooltip>
        )}
      </td>

      {/* Remarks */}
      <td className="remarks">
        <WithErrorTooltip error={getEditTransactionFieldError(_id, "remarks")}>
          <Form.Control
            type="text"
            name="remarks"
            id="editBulkTransactionRemarks"
            value={remarks}
            onChange={(ev) => handleChange(ev, _id)}
            placeholder="Remarks"
            maxLength={50}
            required
            isInvalid={!!getEditTransactionFieldError(_id, "remarks")}
            className={
              getEditTransactionFieldError(_id, "remarks") ? "shake" : ""
            }
          />
        </WithErrorTooltip>
      </td>

      {/* Date */}
      <td className="date">
        <WithErrorTooltip error={getEditTransactionFieldError(_id, "date")}>
          <div
            className={`date-input ${
              getEditTransactionFieldError(_id, "date") ? "shake" : ""
            }`}
          >
            <FormDatePicker
              name="date"
              id="editBulkTransactionRemarks"
              value={date}
              onChange={(ev) => handleChange(ev, _id)}
              maxDate={new Date()}
              required
              isInvalid={!!getEditTransactionFieldError(_id, "date")}
            />
          </div>{" "}
        </WithErrorTooltip>
      </td>

      {/* Controls */}
      <td className="controls">
        <EditBulkTransactionRowControl _id={_id} />
      </td>
    </tr>
  );
}

export default React.memo(EditBulkTransactionRow);
