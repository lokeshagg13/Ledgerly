import React from "react";
import { useContext, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import TransactionUploadContext from "../../../../../store/context/transactionUploadContext";
import FormDatePicker from "../../../../ui/elements/FormDatePicker";
import { formatAmountWithCommas } from "../../../../../utils/formatUtils";
import EditBulkTransactionRowControl from "./edit-bulk-transaction-row-control/EditBulkTransactionRowControl";

function EditBulkTransactionRow({ index, data }) {
  const { _id, type, amount, categoryId, subcategoryId, remarks, date } = data;

  const {
    isLoadingCategories,
    categories,
    isLoadingSubcategoryMapping,
    subcategoryMapping,
    handleModifyTransaction,
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
        <Form.Select
          name="type"
          id="editBulkTransactionType"
          value={type}
          onChange={(ev) => handleChange(ev, _id)}
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </Form.Select>
      </td>

      {/* Amount */}
      <td className="amount">
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
          />
        </InputGroup>
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
          <Form.Select
            name="category"
            aria-label="Select category"
            id="editBulkTransactionCategory"
            value={categoryId}
            onChange={(ev) => handleChange(ev, _id)}
            disabled={isLoadingCategories}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
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
        )}
      </td>

      {/* Remarks */}
      <td className="remarks">
        <Form.Control
          type="text"
          name="remarks"
          id="editBulkTransactionRemarks"
          value={remarks}
          onChange={(ev) => handleChange(ev, _id)}
          placeholder="Remarks"
          maxLength={50}
          required
        />
      </td>

      {/* Date */}
      <td className="date">
        <div className={`date-input`}>
          <FormDatePicker
            name="date"
            id="editBulkTransactionRemarks"
            value={date}
            onChange={(ev) => handleChange(ev, _id)}
            maxDate={new Date()}
            required
          />
        </div>
      </td>

      {/* Controls */}
      <td className="controls">
        <EditBulkTransactionRowControl _id={_id} />
      </td>
    </tr>
  );
}

export default React.memo(EditBulkTransactionRow);
