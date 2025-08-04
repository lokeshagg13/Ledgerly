import { useContext } from "react";
import { Spinner } from "react-bootstrap";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";
import TransactionErrorModal from "./FetchErrorModal";

function FetchTransactionStatus() {
  const {
    isLoadingTransactions,
    isPrintSectionVisible,
    errorFetchingTransactions,
    transactions,
    handleResetAll,
  } = useContext(TransactionPrintContext);

  if (
    errorFetchingTransactions?.message &&
    errorFetchingTransactions?.type === "api"
  ) {
    return (
      <>
        <TransactionErrorModal
          message={errorFetchingTransactions.message}
          onClose={handleResetAll}
        />
      </>
    );
  }

  if (isLoadingTransactions) {
    return (
      <div className="transaction-fetching">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (!isPrintSectionVisible) return <></>;

  if (transactions?.length === 0)
    return (
      <div className="transaction-empty warning-message">
        No transactions found
      </div>
    );

  return (
    <div className="transaction-fetch-message">
      {transactions.length} transactions fetched successfully.
    </div>
  );
}

export default FetchTransactionStatus;
