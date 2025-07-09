import Pagination from "react-bootstrap/Pagination";

function PaginationControl({ totalPages, currentPage, onPageChange }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const createPageItem = (number) => (
    <Pagination.Item
      key={number}
      active={number === currentPage}
      onClick={() => handlePageChange(number)}
      className="pagination-item"
    >
      {number}
    </Pagination.Item>
  );

  const generatePageItems = () => {
    let items = [];

    if (totalPages <= 5) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(createPageItem(number));
      }
    } else {
      items.push(createPageItem(1));
      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let number = start; number <= end; number++) {
        items.push(createPageItem(number));
      }
      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(createPageItem(totalPages));
    }

    return items;
  };

  return (
    <div className="pagination-wrapper">
      <Pagination>
        {totalPages > 5 && (
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-nav"
          />
        )}
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-nav"
        />
        {generatePageItems()}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-nav"
        />
        {totalPages > 5 && (
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-nav"
          />
        )}
      </Pagination>
    </div>
  );
}

export default PaginationControl;
