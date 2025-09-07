import { useContext } from "react";

import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../../utils/formatUtils";
import FirmDashboardContext from "../../../../../store/context/firmDashboardContext";
import BalanceCardSkeleton from "../../../../ui/skeletons/BalanceCardSkeleton";

function OverallBalanceCard() {
  const { isLoadingOverallBalance, overallBalance, overallBalanceError } =
    useContext(FirmDashboardContext);

  const balanceAmt = overallBalance.amount;

  return (
    <div className="dashboard-card balance-card overall">
      <h6 className="balance-title">Net Balance</h6>

      {isLoadingOverallBalance ? (
        <BalanceCardSkeleton />
      ) : overallBalanceError ? (
        <div className="text-danger">{overallBalanceError}</div>
      ) : (
        <>
          <h4
            className={`balance-amount ${
              balanceAmt > 0 ? "positive" : "negative"
            }`}
          >
            {formatAmountForDisplay(Math.abs(balanceAmt))}{" "}
            <span className="balance-type">
              ({balanceAmt >= 0 ? "CR" : "DR"})
            </span>
          </h4>
          {overallBalance?.latestEntryDate && (
            <h6 className="balance-date">
              Latest entry set date:{" "}
              {formatDateForDisplay(overallBalance.latestEntryDate, "-", true)}
            </h6>
          )}
        </>
      )}
    </div>
  );
}

export default OverallBalanceCard;
