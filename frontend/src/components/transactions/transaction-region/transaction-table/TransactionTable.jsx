import { useContext, useRef, useState } from "react";
import TransactionContext from "../../../../store/context/transactionContext";
import TableScroller from "./table-scroller/TableScroller";
import TransactionRow from "./transaction-row/TransactionRow";
import PaginationControl from "./pagination-control/PaginationControl";

const TRANSACTIONS_PER_PAGE = 10;

function TransactionTable({ type }) {
  const { transactions } = useContext(TransactionContext);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef();

  const filteredTransactions = transactions.filter((txn) => txn.type === type);
  const totalPages = Math.ceil(
    filteredTransactions.length / TRANSACTIONS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE
  );

  if (filteredTransactions.length === 0) {
    return (
      <div className="transaction-table-empty text-muted">
        No {type} Transactions added yet.
      </div>
    );
  }

  return (
    <div className="transaction-table-container">
      <TableScroller scrollContainerRef={scrollContainerRef} />
      <div className="transaction-table-wrapper" ref={scrollContainerRef}>
        <table className="transaction-table" id={`${type}TransactionTable`}>
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Remarks</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((txn) => (
              <TransactionRow key={txn._id} transactionData={txn} />
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <PaginationControl
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}

export default TransactionTable;
