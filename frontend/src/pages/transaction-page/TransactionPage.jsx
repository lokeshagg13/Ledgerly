import TransactionPageContent from "../../components/transactions/TransactionPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import transactionImage from "../../images/transaction-bg.png";

function ManageTransactionPage() {
  return (
    <PageLayout bgImage={transactionImage}>
      <div className="page transaction-page">
        <TransactionPageContent />
      </div>
    </PageLayout>
  );
}

export default ManageTransactionPage;
