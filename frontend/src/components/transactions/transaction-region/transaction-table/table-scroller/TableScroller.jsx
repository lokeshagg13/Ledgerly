import LeftAngleIcon from "../../../../ui/icons/LeftAngleIcon";
import RightAngleIcon from "../../../../ui/icons/RightAngleIcon";

const SCROLL_BY_AMOUNT = 100;

function TableScroller({ scrollContainerRef }) {
  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -SCROLL_BY_AMOUNT,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: SCROLL_BY_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <div className="transaction-table-scroller-row">
      <button className="transaction-table-scroll-btn" onClick={scrollLeft}>
        <LeftAngleIcon fill="white" />
      </button>
      <button className="transaction-table-scroll-btn" onClick={scrollRight}>
        <RightAngleIcon fill="white" />
      </button>
    </div>
  );
}

export default TableScroller;
