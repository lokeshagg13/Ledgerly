import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { TransactionPrintContextProvider } from "../../store/context/transactionPrintContext";
import FetchTransactionForm from "./fetch-transaction-form/FetchTransactionForm";
import PrintTransactionForm from "./print-transaction-form/PrintTransactionForm";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";

function PrintTransactionPageContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    const previousPage = location.state?.from || "/dashboard";
    navigate(previousPage);
  };

  return (
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
  );
}

export default PrintTransactionPageContent;
