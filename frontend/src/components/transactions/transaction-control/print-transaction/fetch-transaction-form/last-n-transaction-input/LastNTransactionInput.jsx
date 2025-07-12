import { useContext } from "react";
import { Form } from "react-bootstrap";
import TransactionPrintContext from "../../../../../../store/context/transactionPrintContext";

function LastNTransactionInput() {
  const { lastN, fetchMode, errorFetchingTransactions, setLastN } = useContext(
    TransactionPrintContext
  );
  const isInvalid = errorFetchingTransactions.lastN;

  return (
    <div className="last-n-transaction-section">
      Last{" "}
      <Form.Control
        type="number"
        min={1}
        value={lastN}
        disabled={fetchMode !== "recent"}
        onChange={(e) => setLastN(e.target.value)}
        isInvalid={isInvalid}
        className={`last-n-transaction-input ${isInvalid ? "shake" : ""}`}
      />{" "}
      transactions
    </div>
  );
}

export default LastNTransactionInput;
