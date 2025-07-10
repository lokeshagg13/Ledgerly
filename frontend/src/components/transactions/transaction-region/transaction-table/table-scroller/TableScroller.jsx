import { useEffect, useState } from "react";
import CaretDownIcon from "../../../../ui/icons/CaretDownIcon";

const SCROLL_BY_AMOUNT = 100;

function TableScroller({ scrollContainerRef }) {
  const [leftScrollerDisabled, setLeftScrollerDisabled] = useState(false);
  const [rightScrollerDisabled, setRightScrollerDisabled] = useState(false);

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

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScrollerDisability = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      if (el.scrollWidth <= el.clientWidth) {
        setLeftScrollerDisabled(true);
        setRightScrollerDisabled(true);
      }
      setLeftScrollerDisabled(el.scrollLeft === 0);
      setRightScrollerDisabled(
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
      );
    };

    handleScrollerDisability();
    el.addEventListener("scroll", handleScrollerDisability);
    window.addEventListener("resize", handleScrollerDisability);
    return () => {
      el.removeEventListener("scroll", handleScrollerDisability);
      window.removeEventListener("resize", handleScrollerDisability);
    };
  }, [scrollContainerRef]);

  return (
    <div className="transaction-table-scroller-row">
      <button
        className="transaction-table-scroll-btn left"
        onClick={scrollLeft}
        disabled={leftScrollerDisabled}
      >
        <CaretDownIcon fill="white" />
      </button>
      <button
        className="transaction-table-scroll-btn right"
        onClick={scrollRight}
        disabled={rightScrollerDisabled}
      >
        <CaretDownIcon fill="white" />
      </button>
    </div>
  );
}

export default TableScroller;
