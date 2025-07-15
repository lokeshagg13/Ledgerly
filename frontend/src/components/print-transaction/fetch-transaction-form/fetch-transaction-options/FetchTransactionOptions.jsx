import { useContext } from "react";
import { Form } from "react-bootstrap";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";

function FetchTransactionOptions() {
  const {
    keepCreditDebitTxnSeparate,
    isPrintSectionVisible,
    transactionSortOrder,
    setKeepCreditDebitTxnSeparate,
    setTransactionSortOrder,
  } = useContext(TransactionPrintContext);

  const handleToggleCreditDebitSeparate = () => {
    if (isPrintSectionVisible) return;
    setKeepCreditDebitTxnSeparate((prev) => !prev);
  };

  return (
    <div className="fetch-transaction-options">
      <Form.Check
        type="checkbox"
        label="Show debit and credit transactions in separate sections"
        checked={keepCreditDebitTxnSeparate}
        onChange={handleToggleCreditDebitSeparate}
        className="separate-type-checkbox"
        disabled={isPrintSectionVisible}
      />

      <div className="sort-select-wrapper">
        <Form.Label className="sort-select-label">Sort By:</Form.Label>
        <Form.Select
          value={transactionSortOrder}
          onChange={(e) => setTransactionSortOrder(e.target.value)}
          className="sort-select-dropdown"
          disabled={isPrintSectionVisible}
        >
          <option value="dateAsc">Date (Earliest to Latest)</option>
          <option value="dateDesc">Date (Latest to Earliest)</option>
          <option value="amountAsc">Amount (Lowest to Highest)</option>
          <option value="amountDesc">Amount (Highest to Lowest)</option>
        </Form.Select>
      </div>
    </div>
  );
}

export default FetchTransactionOptions;
