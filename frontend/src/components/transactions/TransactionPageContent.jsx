import { TransactionProvider } from "../../store/context/transactionContext";
import TransactionControl from "./transaction-control/TransactionControl";
import TransactionFilterSection from "./transaction-filter-section/TransactionFilterSection";
import TransactionTables from "./transaction-tables/TransactionTables";

function TransactionPageContent() {
  return (
    <TransactionProvider>
      <div className="transaction-page-header">
        <h2>Transactions</h2>
      </div>

      <div className="transaction-page-body-wrapper">
        <div className="transaction-page-body">
          <TransactionControl />
          <TransactionFilterSection />
          <TransactionTables />
        </div>
      </div>
    </TransactionProvider>
  );
}

export default TransactionPageContent;
