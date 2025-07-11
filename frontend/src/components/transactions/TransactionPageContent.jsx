import { TransactionProvider } from "../../store/context/transactionContext";
import { TransactionFilterProvider } from "../../store/context/transactionFilterContext";
import TransactionControl from "./transaction-control/TransactionControl";
import TransactionFilter from "./transaction-filter/TransactionFilter";
import TransactionTables from "./transaction-tables/TransactionTables";

function TransactionPageContent() {
  return (
    <TransactionProvider>
      <TransactionFilterProvider>
        <div className="transaction-page-header">
          <h2>Transactions</h2>
        </div>

        <div className="transaction-page-body-wrapper">
          <div className="transaction-page-body">
            <TransactionControl />
            <TransactionFilter />
            <TransactionTables />
          </div>
        </div>
      </TransactionFilterProvider>
    </TransactionProvider>
  );
}

export default TransactionPageContent;
