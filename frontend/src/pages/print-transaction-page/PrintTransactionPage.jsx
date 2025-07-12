import PrintTransactionPageContent from "../../components/print-transaction/PrintTransactionPageContent";
import PageLayout from "../../components/ui/PageLayout";
import printImage from "../../images/print-bg.png";

function PrintTransactionPage() {
  return (
    <PageLayout bgImage={printImage}>
      <div className="page print-transaction-page">
        <PrintTransactionPageContent />
      </div>
    </PageLayout>
  );
}

export default PrintTransactionPage;
