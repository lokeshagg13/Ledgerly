import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";

import TransactionContext from "../../../../store/context/transactionContext";
import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../logic/utils";
import EditIcon from "../../../ui/icons/EditIcon";
import TrashIcon from "../../../ui/icons/TrashIcon";
import PaginationControl from "./pagination-control/PaginationControl";
import TableScroller from "./table-scroller/TableScroller";

const TRANSACTIONS_PER_PAGE = 10;

function TransactionTable({ type }) {
  const { transactions } = useContext(TransactionContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollContainerRef = useRef();

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setShowScrollButtons(true);
    } else {
      setShowScrollButtons(false);
    }
  }, [transactions]);

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
      {showScrollButtons && (
        <TableScroller scrollContainerRef={scrollContainerRef} />
      )}
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
              <tr key={txn._id}>
                <td>{formatDateForDisplay(txn.date)}</td>
                <td>{formatAmountForDisplay(txn.amount)}</td>
                <td>{txn.remarks}</td>
                <td>{txn.category}</td>
                <td>{txn.subcategory || "-"}</td>
                <td>
                  <Button
                    variant="link"
                    //   onClick={() => onEdit(txn)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="link"
                    //   onClick={() => onDelete(txn._id)}
                  >
                    <TrashIcon />
                  </Button>
                </td>
              </tr>
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
