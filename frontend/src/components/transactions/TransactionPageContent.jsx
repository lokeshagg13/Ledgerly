import { CategoryProvider } from "../../store/context/categoryContext";
import { TransactionProvider } from "../../store/context/transactionContext";
import { TransactionFilterContextProvider } from "../../store/context/transactionFilterContext";
import TransactionControl from "./transaction-control/TransactionControl";
import TransactionFilter from "./transaction-filter/TransactionFilter";
import TransactionTables from "./transaction-tables/TransactionTables";

function TransactionPageContent() {
  return (
    <CategoryProvider>
      <TransactionProvider>
        <TransactionFilterContextProvider>
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
        </TransactionFilterContextProvider>
      </TransactionProvider>
    </CategoryProvider>
  );
}

export default TransactionPageContent;
