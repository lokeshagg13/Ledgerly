import { useContext, useEffect, useRef } from "react";
import { Form, InputGroup } from "react-bootstrap";
import TransactionContext from "../../../../../store/context/transactionContext";
import { formatAmountWithCommas } from "../../../../../utils/formatUtils";
import CategorySelector from "./selectors/CategorySelector";
import SubcategorySelector from "./selectors/SubcategorySelector";
import FormDatePicker from "../../../../ui/elements/FormDatePicker";

function AddTransactionForm() {
  const amountInputRef = useRef();
  const {
    addTransactionFormData: formData,
    inputFieldErrors,
    fetchCategoriesFromDB,
    fetchSubcategoriesFromDB,
    modifyAddTransactionFormData,
    checkIfInputFieldInvalid,
    updateInputFieldErrors,
  } = useContext(TransactionContext);

  useEffect(() => {
    amountInputRef.current.focus();
    fetchCategoriesFromDB();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchSubcategoriesFromDB();
    // eslint-disable-next-line
  }, [formData.categoryId]);

  // For hiding input field error messages after 6 seconds
  useEffect(() => {
    if (Object.keys(inputFieldErrors).length > 0) {
      const timeout = setTimeout(() => updateInputFieldErrors({}), 6000);
      return () => clearTimeout(timeout);
    }
  }, [inputFieldErrors, updateInputFieldErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateInputFieldErrors({});
    switch (name) {
      case "amount":
        const rawValue = value.replace(/,/g, "");
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
        const numericValue = parseFloat(rawValue);
        if (
          (isValid || rawValue === "") &&
          (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
        ) {
          modifyAddTransactionFormData(name, rawValue);
        }
        break;
      case "category":
        modifyAddTransactionFormData("categoryId", value || null);
        break;
      case "subcategory":
        modifyAddTransactionFormData("subcategoryId", value || null);
        break;
      default:
        modifyAddTransactionFormData(name, value);
    }
  };

  return (
    <Form className="add-transaction-form">
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
      <CategorySelector value={formData.categoryId} onChange={handleChange} />

      {/* Subcategory */}
      <SubcategorySelector
        value={formData.subcategoryId}
        onChange={handleChange}
      />
    </Form>
  );
}

export default AddTransactionForm;
