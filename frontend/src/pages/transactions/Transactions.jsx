import { useContext } from "react";
import AddTransactionModal from "../../components/transactions/AddTransactionModal";
import TransactionContext from "../../store/context/transactionContext";

const FilterSection = () => (
  <aside className="filter-section">
    <h2>Filters</h2>
    <div className="filter-controls">
      <div>[Date Range Picker]</div>
      <div>[Type Dropdown]</div>
      <div>[Category/Subcategory Dropdown]</div>
      <div>[Search by Remarks]</div>
      <button>Apply Filters</button>
    </div>
  </aside>
);

const TransactionList = () => (
  <section className="transaction-list">
    <h2>Transactions</h2>
    <ul>
      <li>[Sample Transaction Item]</li>
      <li>[Sample Transaction Item]</li>
      <li>[Sample Transaction Item]</li>
    </ul>
  </section>
);

const Transactions = () => {
  const transactionContext = useContext(TransactionContext);

  return (
    <div className="page transactions-page">
      <div className="transaction-header">
        <h1>Your Transactions</h1>
        <p>Track, filter and manage your activity.</p>
      </div>

      <div className="transactions-grid">
        <div className="left-column">
          <FilterSection />
        </div>
        <div className="right-column">
          <TransactionList />
        </div>
      </div>

      <div className="add-button-container">
        <button
          className="add-button"
          onClick={transactionContext.openAddTransactionModal}
        >
          + Add New Transaction
        </button>
      </div>

      <AddTransactionModal />
    </div>
  );
};

export default Transactions;
