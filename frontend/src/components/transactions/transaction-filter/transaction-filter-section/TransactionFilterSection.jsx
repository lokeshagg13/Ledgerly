import TransactionFilterControl from "./transaction-filter-control/TransactionFilterControl";
import TransactionFilterInputs from "./transaction-filter-inputs/TransactionFilterInputs";

function TransactionFilterSection() {
  return (
    <div className="transaction-filter-section">
      <TransactionFilterInputs />
      <TransactionFilterControl />
    </div>
  );
}

export default TransactionFilterSection;
