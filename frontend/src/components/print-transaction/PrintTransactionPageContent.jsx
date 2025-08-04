import { Button } from "react-bootstrap";
import FetchTransactionForm from "./fetch-transaction-form/FetchTransactionForm";
import PrintTransactionForm from "./print-transaction-form/PrintTransactionForm";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import { CategoryProvider } from "../../store/context/categoryContext";
import { TransactionPrintContextProvider } from "../../store/context/transactionPrintContext";
import useAppNavigate from "../../store/hooks/useAppNavigate";

function PrintTransactionPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <CategoryProvider>
      <TransactionPrintContextProvider>
        <div className="print-transaction-page-header">
          <Button
            variant="outline-light"
            className="page-back-button"
            onClick={handleNavigateBack}
          >
            <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
          </Button>
          <h2>Print Transactions</h2>
        </div>

        <div className="print-transaction-page-body-wrapper">
          <div className="print-transaction-page-body">
            <FetchTransactionForm />
            <PrintTransactionForm />
          </div>
        </div>
      </TransactionPrintContextProvider>
    </CategoryProvider>
  );
}

export default PrintTransactionPageContent;
