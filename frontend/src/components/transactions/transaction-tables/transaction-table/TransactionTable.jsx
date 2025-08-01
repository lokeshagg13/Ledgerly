import { useContext, useMemo, useRef, useState } from "react";
import TransactionContext from "../../../../store/context/transactionContext";
import TableScroller from "./table-scroller/TableScroller";
import TransactionRow from "./transaction-row/TransactionRow";
import PaginationControl from "./pagination-control/PaginationControl";
import EditTransactionModal from "./transaction-modals/edit-transaction-modal/EditTransactionModal";
import TransactionFilterContext from "../../../../store/context/transactionFilterContext";
import AscendingIcon from "../../../ui/icons/AscendingIcon";
import DescendingIcon from "../../../ui/icons/DescendingIcon";

const TRANSACTIONS_PER_PAGE = 10;

function TransactionTable({ type }) {
  const { transactions, isEditTransactionModalVisible } =
    useContext(TransactionContext);
  const { appliedFilters } = useContext(TransactionFilterContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date"); // "date" | "amount" | null
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc" | null
  const scrollContainerRef = useRef();

  const filteredTransactions = useMemo(
    () => transactions.filter((txn) => txn.type === type),
    [transactions, type]
  );

  const sortedTransactions = useMemo(() => {
    if (!sortBy) return filteredTransactions;
    return [...filteredTransactions].sort((a, b) => {
      const fieldA =
        sortBy === "date" ? new Date(a.date) : parseFloat(a.amount);
      const fieldB =
        sortBy === "date" ? new Date(b.date) : parseFloat(b.amount);
      if (sortOrder === "asc") return fieldA - fieldB;
      if (sortOrder === "desc") return fieldB - fieldA;
      return 0;
    });
  }, [filteredTransactions, sortBy, sortOrder]);

  const totalPages = Math.ceil(
    sortedTransactions.length / TRANSACTIONS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const currentTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE
  );

  const handleSortClick = (column) => {
    if (sortBy !== column) {
      setSortBy(column);
      setSortOrder(column === "date" ? "desc" : "asc");
    } else {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    }
    setCurrentPage(1);
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="transaction-table-empty text-muted">
        No Transactions {appliedFilters ? "found." : "added yet."}
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
              <th
                className="sortable-th"
                onClick={() => handleSortClick("date")}
              >
                <div className="sortable">
                  <div className="column-label">Date</div>
                  {sortBy === "date" && (
                    <div className="sort-indicator">
                      {sortOrder === "asc" ? (
                        <AscendingIcon
                          fill="white"
                          width="1.2em"
                          height="1.2em"
                        />
                      ) : (
                        <DescendingIcon
                          fill="white"
                          width="1.1em"
                          height="1.1em"
                        />
                      )}
                    </div>
                  )}
                </div>
              </th>
              <th
                className="sortable-th"
                onClick={() => handleSortClick("amount")}
              >
                <div className="sortable">
                  <div className="column-label">Amount</div>
                  {sortBy === "amount" && (
                    <div className="sort-indicator">
                      {sortOrder === "asc" ? (
                        <AscendingIcon
                          fill="white"
                          width="1.2em"
                          height="1.2em"
                        />
                      ) : (
                        <DescendingIcon
                          fill="white"
                          width="1.2em"
                          height="1.2em"
                        />
                      )}
                    </div>
                  )}
                </div>
              </th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Remarks</th>
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

        {isEditTransactionModalVisible && <EditTransactionModal />}
      </div>
    </div>
  );
}

export default TransactionTable;
