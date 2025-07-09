import { TransactionProvider } from "../../store/context/transactionContext";
import TransactionControl from "./transaction-control/TransactionControl";
import TransactionRegion from "./transaction-region/TransactionRegion";

function TransactionPageContent() {
  return (
    <TransactionProvider>
      <div className="transaction-page-header">
        <h2>Transactions</h2>
      </div>

      <div className="transaction-page-body-wrapper">
        <div className="transaction-page-body">
          <TransactionControl />
          {/* <TransactionFilter /> */}
          <TransactionRegion />
        </div>
      </div>
    </TransactionProvider>
  );
}

export default TransactionPageContent;
