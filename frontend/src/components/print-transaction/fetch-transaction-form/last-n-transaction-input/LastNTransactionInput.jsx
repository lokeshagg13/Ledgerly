import { useContext } from "react";
import { Form } from "react-bootstrap";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";

function LastNTransactionInput() {
  const {
    lastN,
    fetchMode,
    errorFetchingTransactions,
    setLastN,
    resetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);
  const isInvalid = errorFetchingTransactions.lastN;

  const handleChange = (e) => {
    const raw = e.target.value;
    if (/^\d*$/.test(raw)) {
      resetErrorFetchingTransactions();
      setLastN(raw ? parseInt(raw) : raw);
    }
  };

  const handleKeyDown = (e) => {
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
        disabled={fetchMode !== "recent"}
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
