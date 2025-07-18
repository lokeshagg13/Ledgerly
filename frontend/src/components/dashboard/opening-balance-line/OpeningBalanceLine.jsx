import useAuth from "../../../store/hooks/useAuth";
import { formatAmountForDisplay } from "../../../utils/formatUtils";

function OpeningBalanceLine() {
  const { auth } = useAuth();

  let openingBalance = auth?.openingBalance?.amount;
  if (openingBalance == null) return null;
  if (!["number", "string"].includes(typeof openingBalance)) return null;
  if (typeof openingBalance === "string") {
    openingBalance = parseFloat(openingBalance);
    if (Number.isNaN(openingBalance)) return null;
  }

  const balanceClass =
    openingBalance > 0
      ? "credit-balance"
      : openingBalance < 0
      ? "debit-balance"
      : "neutral-balance";

  openingBalance = formatAmountForDisplay(openingBalance);

  return (
    <div className="opening-balance-line">
      Your opening balance is{" "}
      <span className={`opening-balance-value ${balanceClass}`}>
        {openingBalance}.
      </span>
      Manage your opening balance from here.
    </div>
  );
}

export default OpeningBalanceLine;
