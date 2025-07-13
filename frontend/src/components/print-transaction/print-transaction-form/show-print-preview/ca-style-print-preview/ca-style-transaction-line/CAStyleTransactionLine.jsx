import { useEffect, useRef, useState } from "react";
import {
  formatAmountForPreview,
  formatDateForDisplay,
  formatStringForCenterPadding,
} from "../../../../../../utils/formatUtils";

function CAStyleTransactionLine({ txnData }) {
  const lineRef = useRef(null);
  const [fontSize, setFontSize] = useState("1rem");
  const { amount, maxDigits, categoryName, subcategoryName, date } = txnData;

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    const containerWidth = el.offsetWidth;
    const charWidth = containerWidth / 56;
    console.log(charWidth);
    const approxFontSize = charWidth * 0.8; // tuning factor
    setFontSize(`${approxFontSize}px`);
  }, []);

  return (
    <div ref={lineRef} className="ca-txn-line" style={{ fontSize }}>
      <div className="ca-txn-line-amount">
        {formatAmountForPreview(amount, maxDigits)} -{" "}
      </div>
      <div
        className="ca-txn-line-amount"
        style={{
          display: "inline-block",
          maxWidth: "20ch",
          overflowWrap: "break-word",
          whiteSpace: "none"
        }}
      >
        {formatStringForCenterPadding(
          `${categoryName}${
            subcategoryName ? " (" + subcategoryName + ")" : ""
          }`
        )}
      </div>
      <div className="ca-txn-line-amount"> - {formatDateForDisplay(date)}</div>
    </div>
  );
}

export default CAStyleTransactionLine;
