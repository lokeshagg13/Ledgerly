import { useContext } from "react";
import { Form } from "react-bootstrap";
import TransactionPrintContext from "../../../../../store/context/transactionPrintContext";

function LastNTransactionInput() {
  const {
    lastN,
    fetchMode,
    errorFetchingTransactions,
    isPrintSectionVisible,
    setLastN,
    resetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);
  const isInvalid = errorFetchingTransactions.lastN;

  const handleChange = (e) => {
    if (isPrintSectionVisible) return;
    const raw = e.target.value;
    if (/^\d*$/.test(raw)) {
      resetErrorFetchingTransactions();
      setLastN(raw ? parseInt(raw) : raw);
    }
  };

  const handleKeyDown = (e) => {
    if (isPrintSectionVisible) return;
    const invalidChars = ["e", "E", "+", "-", ".", ","];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="last-n-transaction-section">
      Last{" "}
      <Form.Control
        type="number"
        min={1}
        step={1}
        inputMode="numeric"
        pattern="[0-9]*"
        value={lastN}
        disabled={fetchMode !== "recent" || isPrintSectionVisible}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        isInvalid={isInvalid}
        className={`last-n-transaction-input ${isInvalid ? "shake" : ""}`}
      />{" "}
      transactions
    </div>
  );
}

export default LastNTransactionInput;
