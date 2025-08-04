import { useContext, useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import TransactionContext from "../../../../../../../store/context/transactionContext";
import { formatAmountWithCommas } from "../../../../../../../utils/formatUtils";
import FormDatePicker from "../../../../../../ui/elements/FormDatePicker";
import CategoryContext from "../../../../../../../store/context/categoryContext";

function EditTransactionForm() {
  const amountInputRef = useRef();
  const {
    isLoadingCategories,
    categories,
    isLoadingSubcategoryMapping,
    getSubcategoriesForCategory,
  } = useContext(CategoryContext);
  const {
    editTransactionFormData: formData,
    inputFieldErrors,
    handleModifyEditTransactionFormData,
    checkIfInputFieldInvalid,
    handleUpdateInputFieldErrors,
  } = useContext(TransactionContext);
  const [subcategories, setSubcategories] = useState(() =>
    getSubcategoriesForCategory(formData.categoryId)
  );

  useEffect(() => {
    amountInputRef.current.focus();
    // eslint-disable-next-line
  }, []);

  // For hiding input field error messages after 6 seconds
  useEffect(() => {
    if (Object.keys(inputFieldErrors).length > 0) {
      const timeout = setTimeout(() => handleUpdateInputFieldErrors({}), 6000);
      return () => clearTimeout(timeout);
    }
  }, [inputFieldErrors, handleUpdateInputFieldErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleUpdateInputFieldErrors({});
    switch (name) {
      case "amount":
        const rawValue = value.replace(/,/g, "");
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
        const numericValue = parseFloat(rawValue);
        if (
          (isValid || rawValue === "") &&
          (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
        ) {
          handleModifyEditTransactionFormData(name, rawValue);
        }
        break;
      case "category":
        const categoryId = value || null;
        const subcategoryList = getSubcategoriesForCategory(categoryId);
        handleModifyEditTransactionFormData("categoryId", categoryId);
        setSubcategories(subcategoryList);
        handleModifyEditTransactionFormData("subcategoryId", null);
        break;
      case "subcategory":
        handleModifyEditTransactionFormData("subcategoryId", value || null);
        break;
      default:
        handleModifyEditTransactionFormData(name, value);
    }
  };

  return (
    <Form className="update-transaction-form">
      {/* Type */}
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          name="type"
          id="transactionType"
          value={formData.type}
          onChange={handleChange}
          isInvalid={checkIfInputFieldInvalid("type")}
          className={checkIfInputFieldInvalid("type") ? "shake" : ""}
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </Form.Select>
        {checkIfInputFieldInvalid("type") && (
          <div className="text-danger">{inputFieldErrors.type}</div>
        )}
      </Form.Group>

      {/* Amount */}
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <InputGroup>
          <InputGroup.Text>₹</InputGroup.Text>
          <Form.Control
            type="text"
            name="amount"
            id="transactionAmount"
            value={
              formData.amount !== ""
                ? formatAmountWithCommas(formData.amount)
                : ""
            }
            autoComplete="off"
            onChange={handleChange}
            placeholder="Enter amount"
            isInvalid={checkIfInputFieldInvalid("amount")}
            className={checkIfInputFieldInvalid("amount") ? "shake" : ""}
            ref={amountInputRef}
            required
          />
        </InputGroup>
        {checkIfInputFieldInvalid("amount") && (
          <div className="text-danger">{inputFieldErrors.amount}</div>
        )}
      </Form.Group>

      {/* Date */}
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <div
          className={`date-input ${
            checkIfInputFieldInvalid("date") ? "shake" : ""
          }`}
        >
          <FormDatePicker
            name="date"
            id="transactionDate"
            value={formData.date}
            onChange={handleChange}
            maxDate={new Date()}
            isInvalid={checkIfInputFieldInvalid("date")}
            required
          />
        </div>
        {checkIfInputFieldInvalid("date") && (
          <div className="text-danger">{inputFieldErrors.date}</div>
        )}
      </Form.Group>

      {/* Remarks */}
      <Form.Group className="mb-3">
        <Form.Label>Remarks</Form.Label>
        <Form.Control
          type="text"
          name="remarks"
          id="transactionRemarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Remarks"
          isInvalid={checkIfInputFieldInvalid("remarks")}
          className={checkIfInputFieldInvalid("remarks") ? "shake" : ""}
          maxLength={50}
          required
        />
        {checkIfInputFieldInvalid("remarks") && (
          <div className="text-danger">{inputFieldErrors.remarks}</div>
        )}
      </Form.Group>

      {/* Category */}
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          name="category"
          aria-label="Select category"
          value={formData.categoryId}
          onChange={handleChange}
          disabled={isLoadingCategories}
          isInvalid={checkIfInputFieldInvalid("category")}
          className={checkIfInputFieldInvalid("category") ? "shake" : ""}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Subcategory */}
      <Form.Group className="mb-3">
        <Form.Label>Subcategory</Form.Label>
        <Form.Select
          name="subcategory"
          aria-label="Select subcategory"
          value={formData.subcategoryId ?? ""}
          onChange={handleChange}
          disabled={!formData.categoryId || isLoadingSubcategoryMapping}
        >
          <option value="">None</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
}

export default EditTransactionForm;
