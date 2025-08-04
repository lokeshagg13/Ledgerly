import { useContext, useEffect } from "react";

import TransactionPrintContext from "../../../store/context/transactionPrintContext";
import FetchTransactionStatus from "./fetch-transaction-status/FetchTransactionStatus";
import FetchTransactionInputs from "./fetch-transaction-inputs/FetchTransactionInputs";
import FetchTransactionOptions from "./fetch-transaction-options/FetchTransactionOptions";
import FetchTransactionControl from "./fetch-transaction-control/FetchTransactionControl";

function FetchTransactionForm() {
  const {
    errorFetchingTransactions,
    handleResetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);

  useEffect(() => {
    if (errorFetchingTransactions.mesesage) {
      const timeout = setTimeout(() => handleResetErrorFetchingTransactions(), 8000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [errorFetchingTransactions]);

  return (
    <div className="fetch-transaction-section">
      <div className="fetch-transaction-header">
        <h5>Data Settings</h5>
      </div>
      <div className="fetch-transaction-body-wrapper">
        <div className="fetch-transaction-body">
          <div className="fetch-transaction-form">
            <FetchTransactionInputs />
            <FetchTransactionOptions />
            {errorFetchingTransactions?.message &&
              errorFetchingTransactions?.type === "input" && (
                <div className="fetch-transaction-error-message">
                  {errorFetchingTransactions.message}
                </div>
              )}
            <FetchTransactionControl />
          </div>
          <div className="fetch-transaction-status">
            <FetchTransactionStatus />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FetchTransactionForm;
