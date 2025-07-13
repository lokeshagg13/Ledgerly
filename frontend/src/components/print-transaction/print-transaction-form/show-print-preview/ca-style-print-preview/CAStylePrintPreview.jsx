import { useContext } from "react";
import TransactionPrintContext from "../../../../../store/context/transactionPrintContext";
import {
  formatAmountForPreview,
  formatDateForDisplay,
} from "../../../../../utils/formatUtils";
import CAStyleTransactionLine from "./ca-style-transaction-line/CAStyleTransactionLine";

function CAStylePrintPreview() {
  const { transactions } = useContext(TransactionPrintContext);

  const debitTransactions = transactions.filter((txn) => txn.type === "debit");
  const creditTransactions = transactions.filter(
    (txn) => txn.type === "credit"
  );

  debitTransactions.push({
    _id: 1,
    amount: 100000000000,
    categoryName: "RandomCategoryOf20Ch",
    subcategoryName: "RandomSubcategoryOf2",
    date: "2022-02-01",
  });

  const getMaxIntDigits = (list) => {
    return Math.max(
      ...list.map((txn) => {
        const intPart = Math.floor(txn.amount).toLocaleString("en-IN");
        return intPart.length;
      }),
      0
    );
  };

  const debitMaxDigits = getMaxIntDigits(debitTransactions);
  const creditMaxDigits = getMaxIntDigits(creditTransactions);

  const renderTransactions = (list, maxDigits) =>
    list.map((txn, idx) => (
      <CAStyleTransactionLine
        key={txn._id || idx}
        txnData={{
          ...txn,
          maxDigits,
        }}
      ></CAStyleTransactionLine>
    ));

  return (
    <div className="ca-style-preview">
      <div className="ca-style-section ca-debit">
        <h6>Debit Transactions</h6>
        {debitTransactions.length ? (
          renderTransactions(debitTransactions, debitMaxDigits)
        ) : (
          <div className="text-muted">No debit transactions</div>
        )}
      </div>
      <div className="ca-style-section ca-credit">
        <h6>Credit Transactions</h6>
        {creditTransactions.length ? (
          renderTransactions(creditTransactions, creditMaxDigits)
        ) : (
          <div className="text-muted">No credit transactions</div>
        )}
      </div>
    </div>
  );
}

export default CAStylePrintPreview;
