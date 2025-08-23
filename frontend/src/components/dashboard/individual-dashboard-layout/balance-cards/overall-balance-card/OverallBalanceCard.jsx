import { useContext, useEffect } from "react";

import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../../utils/formatUtils";
import IndividualDashboardContext from "../../../../../store/context/individualDashboardContext";
import BalanceCardSkeleton from "../../../../ui/skeletons/BalanceCardSkeleton";

function OverallBalanceCard() {
  const {
    isLoadingOverallBalance,
    overallBalance,
    overallBalanceError,
    fetchOverallBalance,
  } = useContext(IndividualDashboardContext);

  useEffect(() => {
    fetchOverallBalance();
    // eslint-disable-next-line
  }, []);

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
          {overallBalance?.latestTxnDate && (
            <h6 className="balance-date">
              Latest transaction:{" "}
              {formatDateForDisplay(overallBalance.latestTxnDate, "-", true)}
            </h6>
          )}
        </>
      )}
    </div>
  );
}

export default OverallBalanceCard;
