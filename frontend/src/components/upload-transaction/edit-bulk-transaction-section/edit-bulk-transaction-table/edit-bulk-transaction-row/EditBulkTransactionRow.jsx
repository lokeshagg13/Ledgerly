import { useContext, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import TransactionUploadContext from "../../../../../store/context/transactionUploadContext";
import FormDatePicker from "../../../../ui/elements/FormDatePicker";
import { formatAmountWithCommas } from "../../../../../utils/formatUtils";

function EditBulkTransactionRow({ index, data }) {
  const { type, amount, categoryId, subcategoryId, remarks, date } = data;

  const {
    isLoadingCategories,
    categories,
    isLoadingSubcategoryMapping,
    subcategoryMapping,
    handleModifyTransaction,
    handleRemoveTransaction,
  } = useContext(TransactionUploadContext);

  const [subcategories, setSubcategories] = useState([]);

  const getSubcategoriesBasedOnSelectedCategory = (categoryId) => {
    if (!categoryId || isLoadingSubcategoryMapping) return [];
    const categoryName = categories.filter((cat) => cat._id === categoryId)?.[0]
      ?.name;
    if (!categoryName) return [];
    return subcategoryMapping?.[categoryName] || [];
  };

  const handleChange = (ev, index) => {
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
          handleModifyTransaction(index, name, rawValue);
        }
        break;
      case "category":
        const categoryId = value || null;
        const subcategoryList =
          getSubcategoriesBasedOnSelectedCategory(categoryId);
        handleModifyTransaction(index, "categoryId", categoryId);
        setSubcategories(subcategoryList);
        handleModifyTransaction(index, "subcategoryId", null);
        break;
      case "subcategory":
        handleModifyTransaction(index, "subcategoryId", value || null);
        break;
      default:
        handleModifyTransaction(index, name, value);
    }
  };

  return (
    <tr>
      {/* Controls */}
      <td className="controls">
        <Button
          type="button"
          className="delete-btn"
          onClick={() => handleRemoveTransaction(index)}
          style={{
            background: "none",
            border: "none",
            color: "red",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          🗑️
        </Button>
      </td>

      {/* S.No. */}
      <td className="sno">{index + 1}</td>

      {/* Type */}
      <td className="type">
        <Form.Select
          name="type"
          id="editBulkTransactionType"
          value={type}
          onChange={(ev) => handleChange(ev, index)}
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
            onChange={(ev) => handleChange(ev, index)}
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
            onChange={(ev) => handleChange(ev, index)}
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
            onChange={(ev) => handleChange(ev, index)}
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
          onChange={(ev) => handleChange(ev, index)}
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
            onChange={(ev) => handleChange(ev, index)}
            maxDate={new Date()}
            required
          />
        </div>
      </td>
    </tr>
  );
}

export default EditBulkTransactionRow;
