import { Button } from "react-bootstrap";
import TransactionControl from "./transaction-control/TransactionControl";
import TransactionFilter from "./transaction-filter/TransactionFilter";
import TransactionTables from "./transaction-tables/TransactionTables";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import { CategoryProvider } from "../../store/context/categoryContext";
import { TransactionProvider } from "../../store/context/transactionContext";
import { TransactionFilterContextProvider } from "../../store/context/transactionFilterContext";
import useAppNavigate from "../../store/hooks/useAppNavigate";

function TransactionPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <CategoryProvider>
      <TransactionProvider>
        <TransactionFilterContextProvider>
          <div className="transaction-page-header">
            <Button
              variant="outline-light"
              className="page-back-button"
              onClick={handleNavigateBack}
            >
              <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
            </Button>
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
